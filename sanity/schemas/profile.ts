import { defineType, defineField } from "sanity";

export default defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title / Affiliation",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "blockContent",
    }),
    defineField({
      name: "photo",
      title: "Profile Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  "Email",
                  "Twitter",
                  "Facebook",
                  "LinkedIn",
                  "GitHub",
                  "YouTube",
                  "Google Scholar",
                  "ORCID",
                ],
              },
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) =>
                Rule.uri({ allowRelative: false, scheme: ["http", "https", "mailto"] }),
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "researchInterests",
      title: "Research Interests",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "string" }),
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
    }),
    defineField({
      name: "awards",
      title: "Awards",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "date", title: "Date", type: "string" }),
            defineField({ name: "description", title: "Description", type: "string" }),
          ],
          preview: {
            select: { title: "description", subtitle: "date" },
          },
        },
      ],
    }),
    defineField({
      name: "news",
      title: "News",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "date", title: "Date", type: "date" }),
            defineField({ name: "text", title: "Text", type: "blockContent" }),
          ],
          preview: {
            select: { subtitle: "date" },
          },
        },
      ],
    }),
    defineField({
      name: "cvFile",
      title: "CV (PDF)",
      type: "file",
      options: { accept: ".pdf" },
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});
