import z from "zod";
export const registerSchema = z.object({
  name: z
    .string("NAME SHOULD BE A STRING")
    .min(1, "Name is required, len of name>=1"),
  email: z.email("VALID EMAIL NEEDED"),
  password: z.string().min(6, "MIN PASSWORD LENGTH IS 6"),
});

export const loginSchema = z.object({
  email: z.email("VALID EMAIL NEEDED"),
  password: z.string().min(6, "MIN PASSWORD LENGTH IS 6"),
});

export type registerInput = z.infer<typeof registerSchema>;
export type loginInput = z.infer<typeof loginSchema>;
