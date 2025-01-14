import { z } from "zod";

export const signUpFormSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
