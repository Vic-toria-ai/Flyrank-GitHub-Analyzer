import { streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
// this runs on the server, not in the browser.
// it is a POST endpoint that takes a GitHub username and an array of repositories, and returns an analysis of the developer's activity in a structured JSON format.

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});
export async function POST(request) {
  const body = await request.json();

  const trimmedRepos = body.repos.map((repo) => ({
    name: repo.name,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updated_at: repo.updated_at,
    description: repo.description,
  }));

  const result = streamText({
    model: openrouter("inclusionai/ling-3.0-tiny:free"),
    prompt: `Analyze this GitHub developer's activity, including their primary programming
    languages, the number of repos they maintain, key features, any notable aspects, and the frequency of their
    commit history.
    
      GitHub username: ${body.username}
    Repositories: ${JSON.stringify(trimmedRepos)}    
      Return the analysis in a structured format. It should be in this exact JSON format, with no additional text or commentary outside of the JSON object:

    {
        "summary": "a 2-3 sentence developer narrative",
        "strengths": ["observed positive patterns, as an array of short strings"],
        "gaps": ["things missing or inconsistent, as an array of short strings"]}
    `,
  });
  return result.toTextStreamResponse();
}
