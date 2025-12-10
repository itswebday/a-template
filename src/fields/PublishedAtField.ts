import {
  populatePublishedAtCollection,
  populatePublishedAtGlobalField,
} from "@/hooks";
import type { Field } from "payload";

type PublishedAtFieldProps = {
  name?: string;
  label?: string;
  sidebar?: boolean;
  isGlobal?: boolean;
};

export const PublishedAtField = ({
  name = "publishedAt",
  label = "Published at",
  sidebar = true,
  isGlobal = false,
}: PublishedAtFieldProps = {}): Field => ({
  name: name,
  label: label,
  type: "date",
  admin: {
    date: {
      pickerAppearance: "dayAndTime",
      displayFormat: "dd-MM-yyyy HH:mm",
    },
    position: sidebar ? "sidebar" : undefined,
  },
  hooks: {
    beforeChange: [
      isGlobal ? populatePublishedAtGlobalField : populatePublishedAtCollection,
    ],
  },
});
