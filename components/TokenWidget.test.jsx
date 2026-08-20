import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TokenWidget, { validateToken } from "./TokenWidget";


describe("validateToken", () => {
  it("returns an error for an empty token", () => {
    expect(validateToken("")).toBe("Token is required");
  });

  it("returns an error for a malformed token", () => {
    expect(validateToken("abc123")).toBe(
      "That doesn't look like a valid GitHub token"
    );
  });

  it("returns null for a valid classic token", () => {
    expect(validateToken("ghp_abcdEFGH12345")).toBeNull();
  });
});

describe("TokenWidget", () => {
  it("shows an error when submitted empty", async () => {
    const user = userEvent.setup();
    render(<TokenWidget />);
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByRole("alert")).toHaveTextContent("Token is required");
  });

  it("saves a valid token and shows the Clear button", async () => {
    const user = userEvent.setup();
    render(<TokenWidget />);
    await user.type(
      screen.getByLabelText(/github token/i),
      "ghp_abcdEFGH12345"
    );
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(
      screen.getByRole("button", { name: /clear/i })
    ).toBeInTheDocument();
  });
});