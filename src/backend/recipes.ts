import { load } from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { RECIPE_KEYWORDS } from "./constants/keywords";
import sanitizeHtml from "sanitize-html";

interface RecipeDto {
  name: string;
  htmlBody: string;
  markdownBody: string;
}

export async function processRecipeUrl(url: string): Promise<RecipeDto> {
  const response = await fetch(url);
  const data = await response.text();

  const name = load(data)("head > title").text();
  const $ = load(sanitizeHtml(data));

  const ingredientElements = $("*")
    .toArray()
    .filter((el) => RECIPE_KEYWORDS.includes($(el).text().toLowerCase()));

  if (ingredientElements.length === 0) {
    throw "mfs be lazyloading their shit, fix incoming";
  }

  const html = $(ingredientElements[0]).parent().html();
  if (!html) {
    throw "html corrupted, this recipe is fu**ed mate";
  }
  const markdown = NodeHtmlMarkdown.translate(html);

  return {
    name,
    htmlBody: html,
    markdownBody: markdown,
  };
}
