"use server";

import { parseServerActionResponse } from "@/lib/utils";
import { writeClient } from "@/sanity/lib/write-client";
import bcrypt from "bcrypt";

export const createUser = async (prevState: any, formData: FormData) => {
  const { firstName, lastName, email, password } = Object.fromEntries(
    Array.from(formData.entries())
  );

  try {
    const hashedPassword = await bcrypt.hash(password as string, 10);
    const userData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    };

    const result = await writeClient.create({ _type: "user", ...userData });

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    return {
      ...prevState,
      error: "Something went wrong",
      status: "ERROR",
      data: formData,
    };
  }
};
