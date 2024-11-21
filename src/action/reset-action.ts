"use server";
import * as z from "zod";
import { ResetSchema } from "../../schemas";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/token";
import { sendPasswordResetEmail } from "@/lib/mail";

export const reset = async (value: z.infer<typeof ResetSchema>) => {
  const validatedField = ResetSchema.safeParse(value);

  if (!validatedField.success) {
    return { error: "Invalid email" };
  }

  const { email } = validatedField.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "User not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Reset email sent" };
};
