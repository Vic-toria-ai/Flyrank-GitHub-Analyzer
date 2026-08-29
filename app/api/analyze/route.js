import { streamText, convertToModelMessages } from "ai";
import { checkRateLimit } from "../../../lib/rateLimit";
import { z } from "zod";
import { tool } from "ai";
import { stepCountIs } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
// this runs on the server, not in the browser.
// it is a POST endpoint that takes a GitHub username and an array of repositories, and returns an analysis of the developer's activity in a structured JSON format.

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// scoreProfile calculates a score for a GitHub developer based on their repository data. It takes an array of repositories as input and returns a score from 0 to 100, along with reasoning for the score. The score is calculated based on the average number of stars per repository and the total number of repositories.
const scoreProfile = tool({
  description:
    "Calculates an activity/consistency score for a GitHub developer based on their repository data.",
  inputSchema: z.object({
    // The input schema defines the expected structure of the input data for the scoreProfile tool. It expects an object with a single property, "repos", which is an array of repository objects.
    repos: z.array(
      z.object({
        name: z.string(),
        language: z.string().nullable(),
        stars: z.number(),
        forks: z.number(),
        updated_at: z.string(),
        description: z.string().nullable(),
      }),
    ),
  }),

  outputSchema: z.object({
    // The output schema defines the expected structure of the output data from the scoreProfile tool. It returns an object with two properties: "score" and "reasoning".
    score: z
      .number()
      .describe(
        "A score from 0 to 100 rating the developer's overall activity and consistency",
      ),
    reasoning: z
      .string()
      .describe(
        "A short explanation of why this score was given, based on the repo data",
      ),
  }),

  execute: async ({ repos }) => {
    // This is the core logic of the scoreProfile tool. It calculates the total number of stars across all repositories, computes the average stars per repos, and then derives a score based on these metrics. The reasoning for the score is also generated based on the number of repositories and their average star count.
    const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
    const avgStars = repos.length ? totalStars / repos.length : 0;
    const score = Math.min(100, Math.round(avgStars / 10 + repos.length * 2));

    return {
      score,
      reasoning: `Based on ${repos.length} repos with an average of ${Math.round(avgStars)} stars each.`,
    };
  },
});

// this route also caps how long it's allowed to run — protects against a
// hung/stuck streaming request eating server resources indefinitely.
export const maxDuration = 30;

// the POST function handles incoming requests to analyze a GitHub developer's activity. It expects a JSON payload containing the chat messages (which include the developer's username and repo data as text). The function passes the tools and messages to streamText, which lets the AI decide when to call scoreProfile, and streams back a response that includes both text and tool-call events.
export async function POST(request) {
  // identify the caller by IP address, since we don't have user accounts,
  // and reject the request early (before ever calling the paid AI provider)
  // if they've made too many requests recently.
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { allowed, retryAfter } = checkRateLimit(ip);

  if (!allowed) {
    return new Response(
      JSON.stringify({ error: `Too many requests. Try again in ${retryAfter}s.` }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await request.json();
  const messages = body.messages;

  const result = streamText({
    model: openrouter("nvidia/nemotron-3.5-lightning:free"),
    tools: { scoreProfile },
    stopWhen: stepCountIs(5),
    system: `You analyze GitHub developer profiles. Always call the scoreProfile tool 
    with the repo data provided, then write a 2-3 sentence narrative summary plus 
    strengths and gaps as short bullet points, based on both the repo data and the 
    tool's score.`,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}