import { defineType, defineField } from "sanity";

export default defineType({
  name: "talk",
  title: "Talk",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "event",
      title: "Event",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Invited", value: "invited" },
          { title: "Conference", value: "conference" },
          { title: "Workshop", value: "workshop" },
        ],
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "slidesUrl",
      title: "Slides URL",
      type: "url",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
    }),
    defineField({
      name: "eventUrl",
      title: "Event URL",
      type: "url",
    }),
  ],
  orderings: [
    {
      title: "Date (Newest)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "event" },
  },
});
