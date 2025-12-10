"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { AnimatedButton, AnimatedField } from "@/components/animations";
import type { LocaleOption } from "@/types";
import { getLinkHref, request } from "@/utils";
import type { Form as FormType } from "@/payload-types";

type FormClientProps = {
  form: FormType;
  formId: number;
  dark?: boolean | null;
  fullScreen?: boolean;
  globals?: {
    home: unknown;
    blog: unknown;
    privacyPolicy: unknown;
    cookiePolicy: unknown;
    termsAndConditions: unknown;
  };
};

export const FormClient: React.FC<FormClientProps> = ({
  form,
  formId,
  dark = false,
  fullScreen = false,
  globals,
}) => {
  const locale = useLocale();
  const formT = useTranslations("form");
  const [formData, setFormData] = useState<Record<string, string | string[]>>(
    {},
  );
  const [fileData, setFileData] = useState<Record<string, File[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if form has file fields
  const hasFileFields =
    form.fields?.some((field) => field.type === "file") || false;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleMultiSelectChange = (fieldName: string, optionValue: string) => {
    setFormData((prev) => {
      const currentValue = prev[fieldName];
      const currentArray = Array.isArray(currentValue) ? currentValue : [];

      if (currentArray.includes(optionValue)) {
        // Remove if already selected
        return {
          ...prev,
          [fieldName]: currentArray.filter((val) => val !== optionValue),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          [fieldName]: [...currentArray, optionValue],
        };
      }
    });
    setError(null);
  };

  const handleSingleSelectChange = (fieldName: string, optionValue: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: optionValue }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);

      // Find the field configuration to get maxNumFiles and maxMBs
      const fieldConfig = form.fields?.find((f) => f.name === name);
      const fileField = fieldConfig as
        | {
            maxNumFiles?: number | null;
            maxMBs?: number | null;
          }
        | undefined;

      const maxNumFiles = fileField?.maxNumFiles || 5;
      const maxMBs = fileField?.maxMBs || 25;

      // Validate maximum number of files
      if (fileArray.length > maxNumFiles) {
        setError(
          formT("errors.maxFiles", {
            maxNumFiles,
            fileCount: fileArray.length,
          }),
        );
        e.target.value = ""; // Clear the input
        return;
      }

      // Validate total file size
      const maxTotalSize = maxMBs * 1024 * 1024; // Convert MB to bytes
      const totalSize = fileArray.reduce((sum, file) => sum + file.size, 0);

      if (totalSize > maxTotalSize) {
        setError(formT("errors.totalSizeTooLarge", { maxMBs }));
        e.target.value = ""; // Clear the input
        return;
      }

      // Validate individual file size (same as total max)
      const maxFileSize = maxMBs * 1024 * 1024; // Convert MB to bytes
      const oversizedFile = fileArray.find((file) => file.size > maxFileSize);
      if (oversizedFile) {
        setError(
          formT("errors.fileTooLarge", {
            fileName: oversizedFile.name,
            maxMBs,
          }),
        );
        e.target.value = ""; // Clear the input
        return;
      }

      setFileData((prev) => ({ ...prev, [name]: fileArray }));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (hasFileFields && Object.keys(fileData).length > 0) {
        // Use FormData when files are present
        const formDataToSend = new FormData();
        formDataToSend.append("form", formId.toString());

        // Add text fields
        Object.entries(formData).forEach(([field, value]) => {
          if (!fileData[field]) {
            // Only add non-file fields
            const stringValue = Array.isArray(value)
              ? value.join(",")
              : String(value);
            formDataToSend.append(field, stringValue);
          }
        });

        // Add files
        Object.entries(fileData).forEach(([field, files]) => {
          files.forEach((file) => {
            formDataToSend.append(field, file);
          });
        });

        await request(
          "POST",
          "/api/forms/submissions",
          locale as LocaleOption,
          {
            body: formDataToSend,
            bodyType: "formData",
            defaultErrorMessage: formT("errors.submitError"),
            setIsLoading,
            callback: () => {
              setIsSubmitted(true);
              setFormData({});
              setFileData({});
            },
          },
        );
      } else {
        // Use JSON when no files
        const submissionData = Object.entries(formData).map(
          ([field, value]) => ({
            field,
            value: Array.isArray(value) ? value.join(",") : String(value),
          }),
        );

        await request(
          "POST",
          "/api/forms/submissions",
          locale as LocaleOption,
          {
            body: {
              form: formId,
              submissionData,
            },
            bodyType: "json",
            defaultErrorMessage: formT("errors.submitError"),
            setIsLoading,
            callback: () => {
              setIsSubmitted(true);
              setFormData({});
            },
          },
        );
      }
    } catch (err) {
      setError(formT("errors.submitError"));
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        className={twMerge(
          "text-center",
          "p-8 md:p-12",
          "rounded-[50px]",
          "border border-primary-purple/20",
          dark ? "bg-dark" : "bg-white",
          "shadow-sm",
        )}
      >
        <div
          className={twMerge(
            "inline-flex items-center justify-center",
            "w-14 h-14 mb-4",
            "rounded-full",
            "bg-primary-lightpurple/20",
          )}
        >
          <svg
            className="w-7 h-7 text-primary-purple"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p
          className={twMerge(
            "text-[18px] md:text-[20px] font-semibold",
            dark ? "text-white/90" : "text-dark",
          )}
        >
          {formT("success.message")}
        </p>
      </div>
    );
  }

  if (!form.fields || form.fields.length === 0) {
    return (
      <div
        className={twMerge(
          "p-8 md:p-12",
          "rounded-[50px]",
          "border border-primary-purple/20",
          dark ? "bg-dark" : "bg-white",
          "shadow-sm",
        )}
      >
        <p className={dark ? "text-white/80" : "text-dark/80"}>
          {formT("errors.noFields")}
        </p>
      </div>
    );
  }

  // Determine which fields should be full width
  const getFieldWidth = (fieldType: string) => {
    if (fieldType === "textarea" || fieldType === "file") {
      return "col-span-full";
    }
    return "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={twMerge(
        "p-6 rounded-[50px] border-2 border-primary-purple/20",
        dark ? "bg-dark" : "bg-white",
        "shadow-md",
        "md:p-8",
        "lg:p-10",
      )}
    >
      {form.title && (
        <div className="mb-4 p-6">
          <h3
            className={twMerge(
              "text-[20px] font-semibold mb-2",
              "md:text-[24px]",
              dark ? "text-white/90" : "text-dark",
            )}
          >
            {form.title}
          </h3>
          {form.description && (
            <p
              className={twMerge(
                "text-[16px] leading-relaxed",
                dark ? "text-white/80" : "text-dark/80",
              )}
            >
              {form.description}
            </p>
          )}
        </div>
      )}

      {error && (
        <div
          className={twMerge(
            "mb-6 p-4 rounded-[30px]",
            dark
              ? "bg-primary-purple/20 border border-primary-purple/40"
              : "bg-primary-purple/10 border border-primary-purple/30",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={twMerge(
                "flex items-center justify-center",
                "shrink-0 w-5 h-5 bg-primary-purple rounded-full",
              )}
            >
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d={
                    "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 " +
                    "00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 " +
                    "1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 " +
                    "10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  }
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-[14px] font-medium text-primary-purple">
              {error}
            </p>
          </div>
        </div>
      )}

      <div
        className={twMerge(
          "space-y-4 md:space-y-3",
          fullScreen ? "de:grid de:grid-cols-2 de:gap-4" : "",
        )}
      >
        {form.fields.map((field, index) => {
          if (!field.type || (field.type as string) === "" || !field.name) {
            return null;
          }

          const fieldName = field.name;
          const selectField = field as {
            multiSelect?: boolean | null;
            options?: Array<{ value?: string }>;
          };
          const isMultiSelect = selectField.multiSelect === true;
          const fieldValue = formData[fieldName] || (isMultiSelect ? [] : "");
          const isRequired = field.required || false;

          // Get example placeholder based on field type
          const getPlaceholder = (
            fieldType: string,
            fieldName: string,
          ): string => {
            switch (fieldType) {
              case "email":
                return formT("placeholders.email");
              case "tel":
                return formT("placeholders.tel");
              case "number":
                return formT("placeholders.number");
              case "url":
                return formT("placeholders.url");
              case "date":
                return formT("placeholders.date");
              case "time":
                return formT("placeholders.time");
              case "datetime-local":
                return formT("placeholders.datetimeLocal");
              case "password":
                return formT("placeholders.password");
              case "search":
                return formT("placeholders.search");
              case "textarea":
                return formT("placeholders.textarea");
              case "text":
              default:
                return formT("placeholders.text");
            }
          };

          const baseInputClasses = twMerge(
            "w-full px-5 py-3.5 rounded-[30px] text-[16px] leading-relaxed",
            "transition-all duration-300 focus:outline-none",
            "focus:ring-2 focus:ring-primary-purple/50 focus:ring-offset-2",
            dark
              ? "bg-primary-lightpurple/10 border-2 border-primary-purple/30"
              : "bg-primary-lightpurple/5 border-2 border-primary-purple/20",
            dark
              ? "text-white/90 placeholder-white/50"
              : "text-dark placeholder-dark/50",
            "focus:border-primary-purple hover:border-primary-purple/40",
          );

          return (
            <AnimatedField
              key={index}
              delay={index * 0.05}
              className={twMerge(
                "space-y-1 md:space-y-2",
                getFieldWidth(field.type as string),
              )}
            >
              {field.type !== "checkbox" && (
                <label
                  className={twMerge(
                    "block text-[14px] font-semibold tracking-wide mb-2",
                    dark ? "text-white/90" : "text-dark",
                  )}
                >
                  {fieldName}
                  {isRequired && (
                    <span className="ml-1.5 text-primary-purple">*</span>
                  )}
                </label>
              )}

              {field.type === "textarea" ? (
                <textarea
                  name={fieldName}
                  value={fieldValue}
                  onChange={handleChange}
                  rows={4}
                  className={twMerge(
                    baseInputClasses,
                    "resize-y min-h-[120px]",
                  )}
                  placeholder={getPlaceholder("textarea", fieldName)}
                  required={isRequired}
                />
              ) : field.type === "select" ? (
                (() => {
                  const fieldWithOptions = field as {
                    options?: Array<{ value?: string }>;
                  };
                  const options = fieldWithOptions.options || [];

                  if (isMultiSelect) {
                    // Multi-select with checkboxes
                    const selectedValues = Array.isArray(fieldValue)
                      ? fieldValue
                      : [];
                    return (
                      <div className="space-y-2">
                        {options.length === 0 ? (
                          <p
                            className={twMerge(
                              "text-[14px]",
                              dark ? "text-white/60" : "text-dark/60",
                            )}
                          >
                            {formT("labels.noOptions")}
                          </p>
                        ) : (
                          options.map((option, optionIndex) => {
                            const optionValue =
                              typeof option === "object" &&
                              option !== null &&
                              "value" in option
                                ? option.value
                                : typeof option === "string"
                                  ? option
                                  : "";
                            if (!optionValue) return null;

                            const isSelected =
                              selectedValues.includes(optionValue);

                            return (
                              <motion.label
                                key={optionIndex}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className={twMerge(
                                  "flex items-center gap-3 p-4 rounded-[30px]",
                                  "cursor-pointer transition-all duration-200",
                                  isSelected
                                    ? twMerge(
                                        dark
                                          ? "bg-primary-purple/20"
                                          : "bg-primary-purple/10",
                                        "border border-primary-purple",
                                      )
                                    : dark
                                      ? "bg-primary-lightpurple/10"
                                      : "bg-primary-lightpurple/5",
                                  !isSelected &&
                                    (dark
                                      ? "border border-primary-purple/30"
                                      : "border border-primary-purple/20"),
                                  !isSelected &&
                                    "hover:border-primary-purple/40",
                                )}
                              >
                                <div
                                  className={twMerge(
                                    "flex items-center justify-center",
                                    "shrink-0",
                                  )}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                      handleMultiSelectChange(
                                        fieldName,
                                        optionValue,
                                      )
                                    }
                                    className="sr-only"
                                    required={
                                      isRequired && selectedValues.length === 0
                                    }
                                  />
                                  <div
                                    className={twMerge(
                                      "w-5 h-5 rounded border-2",
                                      "flex items-center justify-center",
                                      "transition-all duration-200",
                                      isSelected
                                        ? twMerge(
                                            "bg-primary-purple",
                                            "border-primary-purple",
                                          )
                                        : "border-primary-purple/30",
                                      !isSelected &&
                                        (dark
                                          ? "bg-primary-lightpurple/10"
                                          : "bg-primary-lightpurple/5"),
                                    )}
                                  >
                                    {isSelected && (
                                      <motion.svg
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-3 h-3 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={3}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </motion.svg>
                                    )}
                                  </div>
                                </div>
                                <span
                                  className={twMerge(
                                    "flex-1 text-[16px]",
                                    isSelected
                                      ? "text-primary-purple font-medium"
                                      : dark
                                        ? "text-white/90"
                                        : "text-dark",
                                  )}
                                >
                                  {optionValue}
                                </span>
                              </motion.label>
                            );
                          })
                        )}
                      </div>
                    );
                  } else {
                    const selectedValue =
                      typeof fieldValue === "string" ? fieldValue : "";
                    return (
                      <div className="space-y-2">
                        {options.length === 0 ? (
                          <p
                            className={twMerge(
                              "text-[14px]",
                              dark ? "text-white/60" : "text-dark/60",
                            )}
                          >
                            {formT("labels.noOptions")}
                          </p>
                        ) : (
                          options.map((option, optionIndex) => {
                            const optionValue =
                              typeof option === "object" &&
                              option !== null &&
                              "value" in option
                                ? option.value
                                : typeof option === "string"
                                  ? option
                                  : "";
                            if (!optionValue) return null;

                            const isSelected = selectedValue === optionValue;

                            return (
                              <motion.label
                                key={optionIndex}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className={twMerge(
                                  "flex items-center gap-3 p-4 rounded-[30px]",
                                  "cursor-pointer transition-all duration-200",
                                  isSelected
                                    ? twMerge(
                                        dark
                                          ? "bg-primary-purple/20"
                                          : "bg-primary-purple/10",
                                        "border border-primary-purple",
                                      )
                                    : dark
                                      ? "bg-primary-lightpurple/10"
                                      : "bg-primary-lightpurple/5",
                                  !isSelected &&
                                    (dark
                                      ? "border border-primary-purple/30"
                                      : "border border-primary-purple/20"),
                                  !isSelected &&
                                    "hover:border-primary-purple/40",
                                )}
                              >
                                <div
                                  className={twMerge(
                                    "flex items-center justify-center",
                                    "shrink-0",
                                  )}
                                >
                                  <input
                                    type="radio"
                                    name={fieldName}
                                    value={optionValue}
                                    checked={isSelected}
                                    onChange={() =>
                                      handleSingleSelectChange(
                                        fieldName,
                                        optionValue,
                                      )
                                    }
                                    className="sr-only"
                                    required={isRequired}
                                  />
                                  <div
                                    className={twMerge(
                                      "flex items-center justify-center",
                                      "w-5 h-5 rounded-full border-2",
                                      "transition-all duration-200",
                                      isSelected
                                        ? twMerge(
                                            "bg-primary-purple",
                                            "border-primary-purple",
                                          )
                                        : "border-primary-purple/30",
                                      !isSelected &&
                                        (dark
                                          ? "bg-primary-lightpurple/10"
                                          : "bg-primary-lightpurple/5"),
                                    )}
                                  >
                                    {isSelected && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className={twMerge(
                                          "w-2.5 h-2.5 bg-white rounded-full",
                                        )}
                                      />
                                    )}
                                  </div>
                                </div>
                                <span
                                  className={twMerge(
                                    "flex-1 text-[16px]",
                                    isSelected
                                      ? "text-primary-purple font-medium"
                                      : "text-dark",
                                  )}
                                >
                                  {optionValue}
                                </span>
                              </motion.label>
                            );
                          })
                        )}
                      </div>
                    );
                  }
                })()
              ) : field.type === "checkbox" ? (
                <motion.label
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={twMerge(
                    "flex items-center gap-3 p-4 rounded-[30px]",
                    "cursor-pointer transition-all duration-200",
                    fieldValue === "true" || fieldValue === "on"
                      ? dark
                        ? "bg-primary-purple/20 border border-primary-purple"
                        : "bg-primary-purple/10 border border-primary-purple"
                      : dark
                        ? "bg-primary-lightpurple/10"
                        : "bg-primary-lightpurple/5",
                    fieldValue !== "true" &&
                      fieldValue !== "on" &&
                      (dark
                        ? "border border-primary-purple/30"
                        : "border border-primary-purple/20"),
                    fieldValue !== "true" &&
                      fieldValue !== "on" &&
                      "hover:border-primary-purple/40",
                  )}
                >
                  <div className="flex items-center justify-center shrink-0">
                    <input
                      type="checkbox"
                      name={fieldName}
                      checked={fieldValue === "true" || fieldValue === "on"}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          [fieldName]: e.target.checked ? "true" : "false",
                        }));
                      }}
                      className="sr-only"
                      required={isRequired}
                    />
                    <div
                      className={twMerge(
                        "flex items-center justify-center",
                        "w-5 h-5 rounded border-2",
                        "transition-all duration-200",
                        fieldValue === "true" || fieldValue === "on"
                          ? "bg-primary-purple border-primary-purple"
                          : dark
                            ? twMerge(
                                "border-primary-purple/30",
                                "bg-primary-lightpurple/10",
                              )
                            : "border-primary-purple/30 bg-white",
                      )}
                    >
                      {(fieldValue === "true" || fieldValue === "on") && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                      )}
                    </div>
                  </div>
                  <span
                    className={twMerge(
                      "text-[14px] flex-1",
                      fieldValue === "true" || fieldValue === "on"
                        ? "text-primary-purple font-medium"
                        : dark
                          ? "text-white/90"
                          : "text-dark",
                    )}
                  >
                    {(() => {
                      const checkboxField = field as {
                        includeCheckboxLink?: boolean | null;
                        checkboxLink?: {
                          textWithLink?: string | null;
                          customHref?: boolean | null;
                          href?: string | null;
                          linkType?: string | null;
                          page?: {
                            value: number | { url?: string | null } | null;
                          } | null;
                          blogPost?: {
                            value: number | { url?: string | null } | null;
                          } | null;
                          newTab?: boolean | null;
                        } | null;
                      };

                      if (
                        checkboxField.includeCheckboxLink &&
                        checkboxField.checkboxLink &&
                        checkboxField.checkboxLink.textWithLink &&
                        globals
                      ) {
                        const textWithLink =
                          checkboxField.checkboxLink.textWithLink;
                        const linkHref = getLinkHref(
                          {
                            customHref: checkboxField.checkboxLink.customHref,
                            href: checkboxField.checkboxLink.href,
                            linkType: checkboxField.checkboxLink.linkType as
                              | "home"
                              | "blog"
                              | "privacy-policy"
                              | "cookie-policy"
                              | "terms-and-conditions"
                              | null
                              | undefined,
                            page: checkboxField.checkboxLink.page
                              ? {
                                  relationTo: "pages" as const,
                                  value: checkboxField.checkboxLink.page.value,
                                }
                              : null,
                            blogPost: checkboxField.checkboxLink.blogPost
                              ? {
                                  relationTo: "blog-posts" as const,
                                  value:
                                    checkboxField.checkboxLink.blogPost.value,
                                }
                              : null,
                          },
                          globals,
                        );

                        // Replace textWithLink in fieldName with a link
                        const parts = fieldName.split(textWithLink);
                        if (parts.length === 2) {
                          return (
                            <>
                              {parts[0]}
                              <Link
                                href={linkHref}
                                target={
                                  checkboxField.checkboxLink.newTab
                                    ? "_blank"
                                    : "_self"
                                }
                                rel={
                                  checkboxField.checkboxLink.newTab
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                                prefetch={true}
                                className={twMerge(
                                  "underline hover:opacity-80",
                                  "text-primary-purple",
                                )}
                              >
                                {textWithLink}
                              </Link>
                              {parts[1]}
                              {isRequired && (
                                <span className="ml-1.5 text-primary-purple">
                                  *
                                </span>
                              )}
                            </>
                          );
                        }
                      }
                      return (
                        <>
                          {fieldName}
                          {isRequired && (
                            <span className="ml-1.5 text-primary-purple">
                              *
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </span>
                </motion.label>
              ) : field.type === "radio" ? (
                <div className="space-y-2">
                  {(() => {
                    const radioField = field as {
                      options?: Array<{ value?: string }>;
                    };
                    const radioOptions = radioField.options || [];

                    return radioOptions.map((option, optionIndex) => {
                      const optionValue =
                        typeof option === "object" &&
                        option !== null &&
                        "value" in option
                          ? option.value
                          : typeof option === "string"
                            ? option
                            : "";
                      if (!optionValue) return null;

                      const isSelected = fieldValue === optionValue;

                      return (
                        <motion.label
                          key={optionIndex}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={twMerge(
                            "flex items-center gap-3 p-4 rounded-[30px]",
                            "cursor-pointer transition-all duration-200",
                            isSelected
                              ? twMerge(
                                  dark
                                    ? "bg-primary-purple/20"
                                    : "bg-primary-purple/10",
                                  "border border-primary-purple",
                                )
                              : dark
                                ? "bg-primary-lightpurple/10"
                                : "bg-primary-lightpurple/5",
                            !isSelected &&
                              (dark
                                ? "border border-primary-purple/30"
                                : "border border-primary-purple/20"),
                            !isSelected && "hover:border-primary-purple/40",
                          )}
                        >
                          <div
                            className={twMerge(
                              "flex items-center justify-center",
                              "shrink-0",
                            )}
                          >
                            <input
                              type="radio"
                              name={fieldName}
                              value={optionValue}
                              checked={isSelected}
                              onChange={handleChange}
                              className="sr-only"
                              required={isRequired}
                            />
                            <div
                              className={twMerge(
                                "w-5 h-5 rounded-full border-2",
                                "flex items-center justify-center",
                                "transition-all duration-200",
                                isSelected
                                  ? "bg-primary-purple border-primary-purple"
                                  : dark
                                    ? twMerge(
                                        "border-primary-purple/30",
                                        "bg-primary-lightpurple/10",
                                      )
                                    : "border-primary-purple/30 bg-white",
                              )}
                            >
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2.5 h-2.5 bg-white rounded-full"
                                />
                              )}
                            </div>
                          </div>
                          <span
                            className={twMerge(
                              "flex-1 text-[16px]",
                              isSelected
                                ? "text-primary-purple font-medium"
                                : dark
                                  ? "text-white/90"
                                  : "text-dark",
                            )}
                          >
                            {optionValue}
                          </span>
                        </motion.label>
                      );
                    });
                  })()}
                </div>
              ) : field.type === "file" ? (
                <div className="space-y-2">
                  <input
                    type="file"
                    name={fieldName}
                    onChange={handleFileChange}
                    multiple
                    className={twMerge(
                      "w-full px-4 py-3 rounded-[30px] text-[16px]",
                      "transition-all duration-300",
                      "file:mr-4 file:py-2 file:px-4 file:rounded-[20px]",
                      "file:border-0 file:text-[14px] file:font-semibold",
                      "file:bg-primary-purple file:text-white",
                      "hover:file:bg-primary-purple/90 file:cursor-pointer",
                      "focus:outline-none focus:ring-2",
                      "focus:ring-primary-purple/50",
                      "focus:border-primary-purple",
                      "hover:border-primary-purple/40",
                      dark
                        ? "bg-primary-lightpurple/10 border-2 border-primary-purple/30"
                        : "bg-primary-lightpurple/5 border-2 border-primary-purple/20",
                      dark ? "text-white/90" : "text-dark",
                    )}
                    required={isRequired}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  {fileData[fieldName] && fileData[fieldName].length > 0 && (
                    <div
                      className={twMerge(
                        "space-y-1.5",
                        dark ? "text-white/80" : "text-dark/80",
                      )}
                    >
                      <p className="text-[14px] font-medium">
                        {formT("labels.selectedFiles", {
                          count: fileData[fieldName].length,
                        })}
                      </p>
                      {fileData[fieldName].map((file, fileIndex) => {
                        const totalSize = fileData[fieldName].reduce(
                          (sum, f) => sum + f.size,
                          0,
                        );
                        return (
                          <p key={fileIndex} className="text-[14px]">
                            • {file.name} (
                            {(file.size / 1024 / 1024).toFixed(2)} MB)
                            {fileIndex === fileData[fieldName].length - 1 && (
                              <span className="ml-2">
                                - {formT("labels.total")}{" "}
                                {(totalSize / 1024 / 1024).toFixed(2)} MB
                              </span>
                            )}
                          </p>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type={field.type}
                  name={fieldName}
                  value={fieldValue}
                  onChange={handleChange}
                  className={baseInputClasses}
                  placeholder={getPlaceholder(field.type as string, fieldName)}
                  required={isRequired}
                />
              )}
            </AnimatedField>
          );
        })}

        {/* Submit button */}
        <AnimatedButton delay={form.fields.length * 0.05}>
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.01 }}
            whileTap={{ scale: isLoading ? 1 : 0.99 }}
            className={twMerge(
              "w-full mt-6 px-8 py-4 rounded-[30px] font-semibold",
              "text-[16px] text-white bg-primary-purple",
              "hover:bg-primary-purple/90 transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2",
            )}
          >
            {isLoading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className={twMerge(
                    "w-5 h-5 border-2 border-white",
                    "border-t-transparent rounded-full",
                  )}
                />
                {formT("labels.submitting")}
              </>
            ) : (
              formT("labels.submit")
            )}
          </motion.button>
        </AnimatedButton>
      </div>
    </form>
  );
};
