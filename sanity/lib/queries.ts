import { defineQuery } from "next-sanity";

export const USER_BY_ID_QUERY = defineQuery(
  `*[_type == "user" && _id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    role,
    image,
    bio,
}`
);
