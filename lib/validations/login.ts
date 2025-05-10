import * as z from "zod";

export const loginSchema = z.object({
  id: z.string().min(1, { message: "Número de matrícula é obrigatório" }),
  birth_date: z
    .string()
    .min(1, { message: "Data de nascimento é obrigatória" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
