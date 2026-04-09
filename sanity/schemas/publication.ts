import { defineType, defineField } from "sanity";

export default defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "string",
      description: "Comma-separated author names",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (Rule) => Rule.required().min(1900).max(2100),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      description: "Full date for sorting within a year",
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Conference", value: "conference" },
          { title: "Journal", value: "journal" },
          { title: "Preprint", value: "preprint" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "abstract",
      title: "Abstract",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "pdfUrl",
      title: "PDF URL",
      type: "url",
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      description: "Link to publisher or arXiv page",
    }),
    defineField({
      name: "codeUrl",
      title: "Code URL",
      type: "url",
    }),
    defineField({
      name: "slidesUrl",
      title: "Slides URL",
      type: "url",
    }),
    defineField({
      name: "scholarUrl",
      title: "Google Scholar URL",
      type: "url",
    }),
  ],
  orderings: [
    {
      title: "Year (Newest)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }, { field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "venue" },
  },
});
