import type { Field } from "payload";

export const getDarkField = (): Field => {
  return {
    name: "dark",
    label: "Dark background",
    type: "checkbox",
    defaultValue: false,
  };
};

export const getPaddingFields = (): Field[] => {
  return [
    {
      name: "paddingTop",
      label: "Padding top",
      type: "select",
      options: [
        {
          label: "None",
          value: "none",
        },
        {
          label: "Small",
          value: "small",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Large",
          value: "large",
        },
      ],
      defaultValue: "medium",
    },
    {
      name: "paddingBottom",
      label: "Padding bottom",
      type: "select",
      options: [
        {
          label: "None",
          value: "none",
        },
        {
          label: "Small",
          value: "small",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Large",
          value: "large",
        },
      ],
      defaultValue: "medium",
    },
  ];
};

export const getHeadingFields = ({
  optional = false,
}: {
  optional?: boolean;
} = {}): Field[] => {
  const fields: Field[] = [
    {
      name: "icon",
      label: "Small icon (optional)",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "text",
      label: "Text",
      type: "text",
      defaultValue: "",
      localized: true,
    },
    {
      name: "centered",
      label: "Centered",
      type: "checkbox",
      defaultValue: false,
    },
  ];

  if (optional) {
    return [
      {
        name: "showHeading",
        label: "Show heading",
        type: "checkbox",
        defaultValue: true,
      },
      {
        name: "heading",
        label: "Heading",
        type: "group",
        admin: {
          condition: (_data, siblingData) => {
            return siblingData?.showHeading === true;
          },
        },
        fields,
      },
    ];
  }

  return fields;
};

export const getPaddingClasses = (
  paddingTop?: "none" | "small" | "medium" | "large" | null,
  paddingBottom?: "none" | "small" | "medium" | "large" | null,
): string => {
  const topClass =
    paddingTop === "none"
      ? "pt-0"
      : paddingTop === "small"
        ? "pt-6"
        : paddingTop === "medium"
          ? "pt-12"
          : paddingTop === "large"
            ? "pt-16"
            : "pt-12";
  const bottomClass =
    paddingBottom === "none"
      ? "pb-0"
      : paddingBottom === "small"
        ? "pb-6"
        : paddingBottom === "medium"
          ? "pb-12"
          : paddingBottom === "large"
            ? "pb-16"
            : "pb-12";

  return `${topClass} ${bottomClass}`;
};
