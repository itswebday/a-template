import { blockConfigs } from "@/blocks/config";
import type { Field } from "payload";

type BlocksFieldProps = {
  name?: string;
  label?: string;
};

export const BlocksField = ({
  name = "blocks",
  label = "Blocks",
}: BlocksFieldProps = {}): Field => ({
  name: name,
  label: label,
  type: "blocks",
  blocks: blockConfigs,
  defaultValue: [],
});
