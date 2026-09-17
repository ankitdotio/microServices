import z from "zod";

export const createTaskInputSchema = z.object({
  title: z.string().min(3, "MINIMUM TITLE LENGTH IS 3"),
});

export type createTaskInput = z.infer<typeof createTaskInputSchema>;
