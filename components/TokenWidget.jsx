"use client";

import { useState, useEffect } from "react";

const TOKEN_PATTERN = /^(ghp_|github_pat_)\S+$/;

export function validateToken(value) {
  const trimmed = value.trim();
  // if empty then:
  if (trimmed.length === 0) return "Token is required";
  // if the pattern is incorrect then:
  if (!TOKEN_PATTERN.test(trimmed))
    return "That doesn't look like a valid GitHub token";
  return null;
}

export default function TokenWidget() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // this stores the existing token in local storage.
    const existing = localStorage.getItem("github_pat");
    if (existing) setSaved(true);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // to check the integrity of the token, if it is incorrect, then:
    const validateError = validateToken(token);
    if (validateError) {
      setError(validateError);
      setSaved(false);
      return;
    }
    localStorage.setItem("github_pat", token.trim());
    setError(null);
    setSaved(true);
  }

  function handleClear() {
    // Removes the saved token entirely and resets the form back to its empty starting state.
    localStorage.removeItem("github_pat");
    setToken("");
    setError(null);
    setSaved(false);
  }
return (
  // noValidate disables the browser's built-in HTML validation popups.
  <form onSubmit={handleSubmit} noValidate className="relative flex items-center gap-2">
    <label htmlFor="github-token" className="text-xs text-zinc-400">
      GitHub Token
    </label>

    <input
      id="github-token"
      name="github-token"
      type="password"
      value={token}
      onChange={(e) => setToken(e.target.value)}
      aria-describedby={error ? "github-token-error" : undefined}
      aria-invalid={error ? "true" : "false"}
      placeholder={saved ? "Token saved" : "ghp_..."}
      autoComplete="off"
      className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100 w-40"
    />

    <button
      type="submit"
      className="rounded bg-violet-500 px-2 py-1 text-xs text-white hover:bg-violet-400"
    >
      Save
    </button>
    {saved && (
      <button
        type="button"
        onClick={handleClear}
        className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200"
      >
        Clear
      </button>
    )}
    {error && (
      <span
        id="github-token-error"
        role="alert"
        className="absolute top-full mb-2 left-0 mt-1 whitespace-nowrap text-xs text-red-400"
      >
        {error}
      </span>
    )}
  </form>
);
}