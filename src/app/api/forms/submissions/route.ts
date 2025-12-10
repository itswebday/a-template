import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE } from "@/constants";
import type { Form, FormSubmission } from "@/payload-types";
import type { LocaleOption } from "@/types";
import {
  getCachedPayload,
  getCollection,
  handleApiError,
} from "@/utils/server";

// Submission validation constants
const MAX_SUBMISSION_SIZE = 100000;
const MAX_FIELDS = 50;
const MAX_FIELD_VALUE_LENGTH = 10000;

// Rate limiting constants
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

// Sanitize string input
const sanitizeString = (input: string): string => {
  if (typeof input !== "string") return "";
  return input.replace(/\0/g, "").trim().slice(0, MAX_FIELD_VALUE_LENGTH);
};

// Validate submission data against form fields
const validateSubmissionData = (
  submissionData: Array<{ field: string; value: string }>,
  formFields: Array<{
    name?: string | null;
    type?: string | null;
    required?: boolean | null;
  }>,
): { valid: boolean; error?: string } => {
  if (!Array.isArray(submissionData)) {
    return { valid: false, error: "Submission data must be an array" };
  }

  if (submissionData.length > MAX_FIELDS) {
    return {
      valid: false,
      error: `Maximum ${MAX_FIELDS} fields allowed`,
    };
  }

  const totalSize = JSON.stringify(submissionData).length;

  if (totalSize > MAX_SUBMISSION_SIZE) {
    return {
      valid: false,
      error: `Submission data exceeds maximum size of ${
        MAX_SUBMISSION_SIZE
      } bytes`,
    };
  }

  // Create map of form fields for quick lookup
  const formFieldsMap = new Map<
    string,
    { type?: string | null; required?: boolean | null }
  >();

  formFields.forEach((field) => {
    if (field.name && field.type && field.type !== "") {
      formFieldsMap.set(field.name, {
        type: field.type,
        required: field.required || false,
      });
    }
  });

  // Validate each submission item
  for (const item of submissionData) {
    if (!item.field || typeof item.field !== "string") {
      return {
        valid: false,
        error: "Each submission item must have a valid field name",
      };
    }

    if (typeof item.value !== "string") {
      return {
        valid: false,
        error: "Each submission item must have a string value",
      };
    }

    const formField = formFieldsMap.get(item.field);

    if (!formField) {
      return {
        valid: false,
        error: `Field "${item.field}" is not part of this form`,
      };
    }

    if (formField.required && (!item.value || item.value.trim() === "")) {
      return {
        valid: false,
        error: `Required field "${item.field}" is missing or empty`,
      };
    }

    if (item.value.length > MAX_FIELD_VALUE_LENGTH) {
      return {
        valid: false,
        error: `Field "${item.field}" value exceeds maximum length`,
      };
    }
  }

  // Check all required fields are present
  for (const [fieldName, fieldConfig] of formFieldsMap.entries()) {
    if (fieldConfig.required) {
      const submittedField = submissionData.find(
        (item) => item.field === fieldName,
      );

      if (
        !submittedField ||
        !submittedField.value ||
        submittedField.value.trim() === ""
      ) {
        return {
          valid: false,
          error: `Required field "${fieldName}" is missing or empty`,
        };
      }
    }
  }

  return { valid: true };
};

// Check rate limit for IP address
const checkRateLimit = (ip: string): { allowed: boolean; error?: string } => {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });

    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      error: "Too many requests. Please try again later.",
    };
  }

  record.count++;

  return { allowed: true };
};

// File upload constants
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_TOTAL_FILE_SIZE = 25 * 1024 * 1024;
const MAX_FILES_PER_FIELD = 5;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export const POST = async (req: NextRequest) => {
  // Get locale from query parameters
  const locale = (req.nextUrl.searchParams.get("locale") ||
    DEFAULT_LOCALE) as LocaleOption;

  try {
    // Rate limiting
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const rateLimitCheck = checkRateLimit(ip);

    if (!rateLimitCheck.allowed) {
      // Error response
      return handleApiError(
        null,
        rateLimitCheck.error || "Rate limit exceeded",
        429,
      );
    }

    // Get Payload instance
    const payload = await getCachedPayload();

    // Check if request contains FormData (file upload) or JSON
    const contentType = req.headers.get("content-type") || "";
    const isFormData = contentType.includes("multipart/form-data");

    // Initialize form variables
    let formId: number | null = null;
    let submissionData: Array<{ field: string; value: string }> = [];
    const uploadedFiles: Record<string, number> = {};
    const uploads: Array<{ field: string; files: number[] }> = [];
    let formConfig: Form | null = null;

    // Check if request contains FormData (file upload) or JSON
    if (isFormData) {
      const formData = await req.formData();
      const formIdValue = formData.get("form");

      // Validate form ID
      if (!formIdValue) {
        return handleApiError(null, "Form ID is required", 400);
      }

      // Find form by ID
      formId =
        typeof formIdValue === "string"
          ? Number(formIdValue)
          : Number(formIdValue);

      try {
        formConfig = await payload.findByID({
          collection: "forms",
          id: formId,
          locale: locale,
        });
      } catch (error) {
        // Error response
        return handleApiError(null, "Form not found", 404);
      }

      // Separate files and text fields
      const filesByField: Record<string, File[]> = {};
      const textFields: Record<string, string> = {};

      // Process form data entries
      for (const [key, value] of formData.entries()) {
        if (key === "form") continue;

        if (value instanceof File) {
          if (!filesByField[key]) {
            filesByField[key] = [];
          }
          filesByField[key].push(value);
        } else {
          textFields[key] = value.toString();
        }
      }

      // Validate and process files
      for (const [fieldName, files] of Object.entries(filesByField)) {
        const fieldConfig = formConfig.fields?.find(
          (f: { name?: string | null }) => f.name === fieldName,
        ) as
          | {
              maxNumFiles?: number | null;
              maxMBs?: number | null;
            }
          | undefined;

        // Get field-specific limits or use defaults
        const maxNumFiles = fieldConfig?.maxNumFiles || MAX_FILES_PER_FIELD;
        const maxMBs = fieldConfig?.maxMBs || MAX_TOTAL_FILE_SIZE / 1024 / 1024;
        const maxTotalSize = maxMBs * 1024 * 1024;
        const maxFileSize = maxMBs * 1024 * 1024;

        // Validate number of files
        if (files.length > maxNumFiles) {
          // Error response
          return handleApiError(null, "Maximum number of files exceeded", 400);
        }

        // Validate total file size for this field
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);

        if (totalSize > maxTotalSize) {
          // Error response
          return handleApiError(
            null,
            "Total file size exceeds maximum limit",
            400,
          );
        }

        // Upload files and collect IDs
        const uploadedFileIds: number[] = [];

        for (const file of files) {
          // Validate individual file size
          if (file.size > maxFileSize) {
            // Error response
            return handleApiError(null, "File size exceeds maximum limit", 400);
          }

          if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            // Error response
            return handleApiError(null, "File type not allowed", 400);
          }

          // Upload file to media collection
          try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const mediaResult = await payload.create({
              collection: "media",
              data: {
                alt: `Form submission: ${fieldName} - ${file.name}`,
              },
              file: {
                data: buffer,
                mimetype: file.type,
                name: file.name,
                size: file.size,
              },
            });

            uploadedFileIds.push(mediaResult.id);
          } catch (error) {
            console.error("Error uploading file:", error);

            // Error response
            return handleApiError(
              null,
              `Failed to upload file "${file.name}"`,
              500,
            );
          }
        }

        // Store file upload information
        uploadedFiles[fieldName] = uploadedFileIds.length;
        submissionData.push({
          field: fieldName,
          value: `files:${uploadedFileIds.join(",")}`,
        });
        uploads.push({
          field: fieldName,
          files: uploadedFileIds,
        });
      }

      // Process text fields
      for (const [key, value] of Object.entries(textFields)) {
        const sanitizedValue = sanitizeString(value);

        submissionData.push({
          field: key,
          value: sanitizedValue,
        });
      }
    } else {
      // Process JSON request
      const body = await req.json();

      formId = body.form;
      submissionData = body.submissionData;
    }

    // Validate form ID and submission data
    if (!formId || !submissionData) {
      // Error response
      return handleApiError(
        null,
        "Form ID and submission data are required",
        400,
      );
    }

    // Convert and validate form ID
    const formIdNumber = typeof formId === "number" ? formId : Number(formId);

    if (isNaN(formIdNumber) || formIdNumber <= 0) {
      // Error response
      return handleApiError(null, "Invalid form ID", 400);
    }

    // Get form configuration
    let form;

    if (!formConfig) {
      const forms = await getCollection("forms", locale, {
        filters: [{ field: "id", operator: "equals", value: formIdNumber }],
      });

      // Check if form exists
      if (forms.length === 0) {
        // Error response
        return handleApiError(null, "Form not found", 404);
      }

      form = forms[0];
      formConfig = form;
    } else {
      form = formConfig;
    }

    // Validate submission data (excluding file references)
    const nonFileSubmissionData = submissionData.filter(
      (item) => !item.value.startsWith("files:"),
    );
    const validation = validateSubmissionData(
      nonFileSubmissionData,
      form.fields || [],
    );

    if (!validation.valid) {
      // Error response
      return handleApiError(null, "Invalid submission data", 400);
    }

    // Sanitize submission data
    const sanitizedSubmissionData = submissionData.map(
      (item: { field: string; value: string }) => {
        if (item.value.startsWith("files:")) {
          return item;
        }

        return {
          field: sanitizeString(item.field),
          value: sanitizeString(item.value),
        };
      },
    );

    // Create form submission
    const submissionResult = await payload.create({
      collection: "form-submissions",
      locale: locale,
      data: {
        form: formIdNumber,
        submissionData:
          sanitizedSubmissionData as FormSubmission["submissionData"],
        uploads: uploads.length > 0 ? uploads : undefined,
        submittedAt: new Date().toISOString(),
      },
    });

    // Success response
    return NextResponse.json({ data: submissionResult }, { status: 201 });
  } catch (errorResponse) {
    // Error response
    return handleApiError(
      errorResponse,
      "Failed to create form submission",
      500,
    );
  }
};
