export default function RepoCard({ repo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-md border border-zinc-800 bg-zinc-950 p-3 hover:border-zinc-700"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-zinc-100">{repo.name}</span>
        <span className="text-xs text-zinc-500">★ {repo.stargazers_count}</span>
      </div>
      {repo.description && (
        <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
          {repo.description}
        </p>
      )}
      <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
        {repo.language && <span>{repo.language}</span>}
        <span>{repo.forks_count} forks</span>
      </div>
    </a>
  );
}
