export default function ProfileHeader({ user }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <img
        src={user.avatar_url}
        alt={`${user.login}'s avatar`}
        className="h-16 w-16 rounded-full border border-zinc-700"
      />
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-zinc-100">
          {user.name || user.login}
        </h1>
        {user.bio && <p className="text-sm text-zinc-400">{user.bio}</p>}
        <div className="mt-1 flex gap-4 text-xs text-zinc-500">
          <span>{user.followers} followers</span>
          <span>{user.public_repos} public repos</span>
        </div>
      </div>
    </div>
  );
}
