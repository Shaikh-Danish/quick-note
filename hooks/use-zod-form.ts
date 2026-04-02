import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormProps, type FieldValues } from "react-hook-form";
import type { z } from "zod";

export function useZodForm<TFieldValues extends FieldValues>(
  schema: z.ZodType<any, any, any>,
  options?: Omit<UseFormProps<TFieldValues>, "resolver">,
) {
  return useForm<TFieldValues>({
    resolver: zodResolver(schema),
    ...options,
  });
}
