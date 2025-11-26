import type { LocaleOption } from "@/types";

export const request = async <ResultData>(
  method: "GET" | "POST",
  url: string,
  locale: LocaleOption,
  config: {
    headers?: Record<string, string>;
    body?: object | FormData;
    bodyType?: "json" | "formData";
    searchParams?: Record<string, string | number | boolean>;
    defaultErrorMessage: string;
    setIsLoading?: (isLoading: boolean) => void;
    setResult?: (result: ResultData | null) => void;
    setData?: (data: ResultData | null) => void;
    callback?: () => void;
  },
  debug = false,
) => {
  config.setIsLoading?.(true);

  try {
    // Prepare the request options
    const requestOptions: RequestInit = {
      method,
      credentials: "include",
    };

    // POST requests
    if (method === "POST") {
      if (config.body) {
        if (config.bodyType === "formData" || config.body instanceof FormData) {
          requestOptions.body = config.body as FormData;
        } else {
          requestOptions.headers = config.headers ?? {
            "Content-Type": "application/json",
          };
          requestOptions.body = JSON.stringify(config.body);
        }
      }
    }

    // Build URL with search parameters
    const urlParams = new URLSearchParams();

    urlParams.append("locale", locale);

    if (config.searchParams) {
      Object.entries(config.searchParams).forEach(([key, value]) => {
        urlParams.append(key, String(value));
      });
    }

    const fullUrl = `${url}?${urlParams.toString()}`;

    // Response
    const response = await fetch(fullUrl, requestOptions);

    // Debug
    if (debug) {
      console.log(`\n\n${method} request:`, fullUrl);
      console.log("Response:", response);
    }

    // Result
    const result = await response.json();

    // Debug
    if (debug) {
      console.log("Result:", result, "\n\n\n");
    }

    // Default response error
    if (!response.ok) {
      if (result.data?.errors) {
        throw result.data.errors;
      } else {
        throw [{ message: config.defaultErrorMessage }];
      }
    }

    // Error in the result
    if (result.status >= 400) {
      config.setData?.(null);

      if (result.data?.errors) {
        throw result.data.errors;
      } else {
        throw [{ message: config.defaultErrorMessage }];
      }
    }

    // Set the result
    config.setResult?.(result);

    // Set the data
    config.setData?.(result.data);

    // Function to call after a successful request
    config.callback?.();
  } catch {
    console.error(config.defaultErrorMessage);
  } finally {
    config.setIsLoading?.(false);
  }
};
