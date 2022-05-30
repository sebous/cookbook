import { AnyNode, Cheerio, CheerioAPI, load } from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";
import {
  INGREDIENTS_KEYWORDS,
  INSTRUCTIONS_KEYWORDS,
} from "./constants/keywords";
import sanitizeHtml from "sanitize-html";

interface RecipeDto {
  name: string;
  htmlBody: string;
  markdownBody: string;
}

function checkKeywords(el: Cheerio<AnyNode>, keywords: string[]) {
  const $ = load(el.html()!);
  const searchedElements = $("*")
    .toArray()
    .filter((el) => keywords.includes($(el).text().toLowerCase()));
  return searchedElements.length > 0;
}

function findCorrectParentElRecursively(
  el: Cheerio<AnyNode>
): Cheerio<AnyNode> | null {
  const parent = el.parent();
  if (!parent) {
    return null;
  }
  const $ = load(parent.html()!);
  if ($("li").toArray().length > 1) {
    return parent;
  }

  return findCorrectParentElRecursively(parent);
}

function findRootForKeywords(keywords: string[], $: CheerioAPI) {
  const searchElements = $("*")
    .toArray()
    .filter((el) => INGREDIENTS_KEYWORDS.includes($(el).text().toLowerCase()));

  if (searchElements.length === 0) {
    throw "mfs be lazyloading their shit, fix incoming";
  }

  const root = findCorrectParentElRecursively($(searchElements[0]).parent());
  if (!root) throw `keywords: [${keywords.join(", ")}] not found in html :/`;
  return root;
}

export async function processRecipeUrl(url: string): Promise<RecipeDto> {
  const response = await fetch(url);
  const data = await response.text();

  const name = load(data)("head > title").text();
  let $ = load(sanitizeHtml(data));

  const ingredientsRoot = findRootForKeywords(INGREDIENTS_KEYWORDS, $);

  const includesInstructions = checkKeywords(
    ingredientsRoot,
    INSTRUCTIONS_KEYWORDS
  );

  if (includesInstructions) {
    return processResult([ingredientsRoot], name);
  }

  const instructionsRoot = findRootForKeywords(INSTRUCTIONS_KEYWORDS, $);

  return processResult([ingredientsRoot, instructionsRoot], name);
}

function processResult(roots: Cheerio<AnyNode>[], name: string): RecipeDto {
  const htmlParts = roots.map((r) => r.html());
  if (htmlParts.some((x) => !x))
    throw "html corrupted, this recipe is fu**ed mate";

  const html = htmlParts
    .filter((x): x is string => !!x)
    .reduce((result, part) => result + part, "");

  const markdown = NodeHtmlMarkdown.translate(html);
  return {
    name,
    htmlBody: html,
    markdownBody: markdown,
  };
}
