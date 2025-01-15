// filepath: /C:/Users/Project A/Desktop/next/components/signup-form.tsx
"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import React, { useEffect, useState, useActionState } from "react";
import Link from "next/link";
import { signUpFormSchema } from "@/lib/validation";
import { z } from "zod";
import { createUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { error } from "console";
export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  useEffect(() => {
    const storedValues = localStorage.getItem("signupFormValues");
    if (storedValues) {
      setFormValues(JSON.parse(storedValues));
    }
  }, []);

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const values = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };
      await signUpFormSchema.parseAsync(values);

      const result = await createUser(prevState, formData);

      if (result.status === "SUCCESS") {
        localStorage.removeItem("signupFormValues");
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        return {
          ...prevState,
          errors: "validation failed",
          status: "ERROR",
          data: formData,
        };
      }
    }
    return {
      ...prevState,
      error: "Something went wrong",
      status: "ERROR",
      data: formData,
    };
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
    data: formValues,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormValues = { ...formValues, [name]: value };
    setFormValues(newFormValues);
    localStorage.setItem("signupFormValues", JSON.stringify(newFormValues));
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Create a new account by filling in the details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              {/* First Name and Last Name (50% width each) */}
              <div className="grid gap-2 grid-cols-2 max-sm:grid-cols-1 gap-x-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formValues.firstName}
                    onChange={handleChange}
                    required
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-[13px]">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formValues.lastName}
                    onChange={handleChange}
                    required
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-[13px]">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email and Password */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-[13px]">{errors.email}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formValues.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-[13px]">{errors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                {!isPending ? "Sign Up" : "Signing Up..."}
              </Button>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
