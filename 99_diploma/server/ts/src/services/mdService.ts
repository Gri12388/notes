import markdownIt from "markdown-it";

export const getHtml = (value: string) => markdownIt().render(value);
