"use client";

import { useState, useMemo } from "react";
import RepoCard from "./RepoCard";

// this is to sort out the categories of each repos based on starts, lang, forks, etc.
export default function RepoList({ repos }) {
  const [sortBy, setSortBy] = useState("stars");
  const [languageFilter, setLanguageFilter] = useState("all");

  const languages = useMemo(() => {
    const set = new Set(repos.map((r) => r.language).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [repos]);

  const filteredSorted = useMemo(() => {
    let result = repos;
    if (languageFilter !== "all") {
      result = result.filter((r) => r.language === languageFilter);
    }
    return [...result].sort((a, b) => {
      if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
      if (sortBy === "forks") return b.forks_count - a.forks_count;
      if (sortBy === "updated")
        return new Date(b.updated_at) - new Date(a.updated_at);
      return 0;
    });
  }, [repos, sortBy, languageFilter]);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label htmlFor="sort-by" className="text-xs text-zinc-400">
          Sort by
        </label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100"
        >
          <option value="stars">Stars</option>
          <option value="forks">Forks</option>
          <option value="updated">Last updated</option>
        </select>

        <label htmlFor="language-filter" className="text-xs text-zinc-400 ml-2">
          Language
        </label>
        <select
          id="language-filter"
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {filteredSorted.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
        {filteredSorted.length === 0 && (
          <p className="text-sm text-zinc-500">No repos match this filter.</p>
        )}
      </div>
    </div>
  );
}
