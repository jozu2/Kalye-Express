import { defineField, defineType } from "sanity";
import { UserIcon } from "lucide-react";

export const user = defineType({
  name: "user",
  title: "User",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "firstName",
      type: "string",
    }),
    defineField({
      name: "lastName",
      type: "string",
    }),
    defineField({
      name: "email",
      type: "string",
    }),
    defineField({
      name: "password",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
  },
});
