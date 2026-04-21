import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type FormInputProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  cols: number;
};

export default function TextAreaInput<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  cols,
}: FormInputProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              className="resize-none"
              cols={cols}
            />
          </FormControl>

          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
