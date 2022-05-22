interface RecipeDto {
  name: string;
  htmlBody: string;
  markdownBody: string;
}

export async function processRecipeUrl(url: string): Promise<RecipeDto> {
  return {} as RecipeDto;
}

async function fetchRecipe(url: string) {}

async function extractContent(html: string) {}

async function convertToMarkdown(html: string) {}
