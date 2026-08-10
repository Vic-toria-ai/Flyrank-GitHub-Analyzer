import { streamText } from "ai";
import { google } from "@ai-sdk/google";

// this runs on the server, not in the browser

export async function POST(request) {
  const body = await request.json();

  const result = streamText({
    model: google("gemini-1.5-flash"),
    prompt: `Analyze this GitHub developer's activity, including their primary programming
    languages, the number of repos they maintain, key features, any notable aspects, and the frequency of their
    commit history.
    
    GitHub username: ${body.username}
    Repository: ${JSON.stringify(body.repos)}
    
    Return the analysis in a structured format. It should be in this exact JSON format, with no additional text or commentary outside of the JSON object:

    {
        "summary": "a 2-3 sentence developer narrative",
        "strengths": ["observed positive patterns, as an array of short strings"],
        "gaps": ["things missing or inconsistent, as an array of short strings"]}
    `,
  });
  return result.toTextStreamResponse();
}
