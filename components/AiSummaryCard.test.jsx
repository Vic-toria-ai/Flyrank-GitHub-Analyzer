import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useChat } from "@ai-sdk/react";
import AiSummaryCard from "./AiSummaryCard";

// wrap the real useChat in a spy, so it behaves normally by default,
// but individual tests can override its return value when needed
vi.mock("@ai-sdk/react", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useChat: vi.fn(actual.useChat),
  };
});

const mockRepos = [
  {
    name: "test-repo",
    language: "JavaScript",
    stargazers_count: 10,
    forks_count: 2,
    updated_at: "2026-01-01T00:00:00Z",
    description: "A test repo",
  },
];

// helper to fake a streamed response body, matching the shape useChat expects
function mockStreamResponse(chunks) {
  const encoder = new TextEncoder();
  let i = 0;
  return {
    ok: true,
    body: {
      getReader: () => ({
        read: async () => {
          if (i < chunks.length) {
            return { done: false, value: encoder.encode(chunks[i++]) };
          }
          return { done: true, value: undefined };
        },
      }),
    },
  };
}

describe("AiSummaryCard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the first-run empty state before anything is clicked", () => {
    render(<AiSummaryCard username="testuser" repos={mockRepos} />);
    expect(
      screen.getByText(/click "analyze profile" to get an ai-generated summary/i)
    ).toBeInTheDocument();
  });

  it("shows a pending/loading state after clicking Analyze", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn(() => new Promise(() => {}));

    render(<AiSummaryCard username="testuser" repos={mockRepos} />);
    await user.click(screen.getByRole("button", { name: /analyze profile/i }));

    expect(
      screen.getByRole("button", { name: /analyzing/i })
    ).toBeInTheDocument();
  });

  it("shows a designed error state when the request fails", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockRejectedValue(new Error("network error"));

    render(<AiSummaryCard username="testuser" repos={mockRepos} />);
    await user.click(screen.getByRole("button", { name: /analyze profile/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/something went wrong generating this summary/i)
      ).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("renders the tool result as a score card, not raw text", () => {
    // for this test only, override useChat to directly return fake data,
    // bypassing the need to fake the exact SSE stream format
    useChat.mockReturnValue({
      messages: [
        {
          id: "1",
          role: "assistant",
          parts: [
            {
              type: "tool-scoreProfile",
              state: "output-available",
              output: { score: 42, reasoning: "Test reasoning" },
            },
          ],
        },
      ],
      sendMessage: vi.fn(),
      status: "ready",
      stop: vi.fn(),
      setMessages: vi.fn(),
      error: undefined,
      regenerate: vi.fn(),
    });

    render(<AiSummaryCard username="testuser" repos={mockRepos} />);

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText(/test reasoning/i)).toBeInTheDocument();
    expect(screen.getByText(/100 activity score/i)).toBeInTheDocument();
  });
});