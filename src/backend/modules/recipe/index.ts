import {
	INGREDIENTS_KEYWORDS,
	INSTRUCTIONS_KEYWORDS,
} from "@/backend/constants/keywords";
import { AnyNode, Cheerio, CheerioAPI, load } from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";
import sanitizeHtml from "sanitize-html";

interface RecipeDto {
	name: string;
	htmlBody: string;
	markdownBody: string;
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

/**
 * finds all the html roots for provided keywords
 */
function findRootsForKeywords(keywords: string[], $: CheerioAPI) {
	const searchElements = $("*")
		.toArray()
		.filter((el) => keywords.includes($(el).text().toLowerCase()));

	if (searchElements.length === 0) {
		throw "this type of recipe is not supported, try different one please";
	}

	const roots = searchElements.map((el) =>
		findCorrectParentElRecursively($(el).parent())
	);

	if (!roots || roots.length === 0)
		throw `keywords: [${keywords.join(", ")}] not found in html :/`;

	return roots;
}

function processResult(roots: Cheerio<AnyNode>[], name: string): RecipeDto {
	const htmlParts = roots.map((r) => r.html());
	if (htmlParts.some((x) => !x))
		throw "html corrupted, this recipe is fu**ed mate";

	const html = htmlParts
		.filter((x): x is string => !!x)
		.filter((x, i, arr) => arr.indexOf(x) === i)
		.reduce((result, part) => result + part, "");

	const markdown = NodeHtmlMarkdown.translate(html);
	return {
		name,
		htmlBody: html,
		markdownBody: markdown,
	};
}

async function processRecipeUrl(url: string): Promise<RecipeDto> {
	const response = await fetch(url);
	const data = await response.text();

	const name = load(data)("head > title").text() || load(data)("title").text();
	const $ = load(sanitizeHtml(data));

	const ingredientsRoots = findRootsForKeywords(INGREDIENTS_KEYWORDS, $);
	const instructionsRoots = findRootsForKeywords(INSTRUCTIONS_KEYWORDS, $);

	return processResult(
		[
			...ingredientsRoots.filter((x): x is Cheerio<AnyNode> => !!x),
			...instructionsRoots.filter((x): x is Cheerio<AnyNode> => !!x),
		],
		name
	);
}

export const recipeModule = { processRecipeUrl };
