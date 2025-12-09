"use client";

import { XCircle, XIcon } from "lucide-react";
import React from "react";
import type {
  ControllerRenderProps,
  FieldError as RHFError,
} from "react-hook-form";
import type { z } from "zod";
import type { planCreateFormSchema } from "@/app/admin/plans/components/plan-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type TagsFieldProps = {
  field: ControllerRenderProps<
    z.infer<typeof planCreateFormSchema>,
    "features"
  >;
  label?: string;
  placeholder?: string;
  description?: string;
  error?: RHFError | undefined;
  id: string;
};

const TagsField: React.FC<TagsFieldProps> = ({
  id,
  field,
  label,
  description,
  placeholder,
  error,
}) => {
  const [inputValue, setInputValue] = React.useState("");

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (!field.value.includes(trimmed)) {
      field.onChange([...field.value, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    field.onChange(field.value.filter((t: string) => t !== tag));
  };

  const clearAll = () => {
    field.onChange([]);
    setInputValue("");
  };

  return (
    <Field data-invalid={!!error}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      {description && <FieldDescription>{description}</FieldDescription>}

      <InputGroup>
        <InputGroupInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={addTag}
          placeholder={placeholder}
          id={id}
          aria-invalid={!!error}
        />

        {field.value.length > 0 && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={clearAll} type="button">
              <XCircle />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      <div className="mt-2 flex flex-wrap gap-2">
        {field.value.map((tag: string, index: number) => (
          <Button
            key={index}
            type="button"
            size="sm"
            variant="outline"
            onClick={() => removeTag(tag)}
          >
            {tag}
            <XIcon />
          </Button>
        ))}
      </div>

      {error && <FieldError errors={[error]} />}
    </Field>
  );
};

export default TagsField;
