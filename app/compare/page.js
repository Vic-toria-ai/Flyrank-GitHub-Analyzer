import { getUser, getRepos } from "../../lib/github";
import CompareForm from "../../components/CompareForm";
import ProfileHeader from "../../components/ProfileHeader";
import LanguageChart from "../../components/LanguageChart";
import RepoList from "../../components/RepoList";

// reads username from the URL; if both are present,
// fetches both profiles' data in parallel and renders them side by side,
// reusing the exact same components as the single-profile page.
export default async function ComparePage({ searchParams }) {
  const { a, b } = await searchParams;

  let dataA = null;
  let dataB = null;

  if (a && b) {
    const [userAResult, repoAResult, userBResult, repoBResult] =
      await Promise.all([getUser(a), getRepos(a), getUser(b), getRepos(b)]);
    dataA = { user: userAResult, repos: repoAResult };
    dataB = { user: userBResult, repos: repoBResult };
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4">
      <h1 className="text-lg font-semibold text-zinc-100">
        Compare GitHub Accounts
      </h1>
      <p className="text-sm text-zinc-500">
        Enter two usernames to compare their profiles, languages, and repos side by side.
      </p>

      <CompareForm defaultA={a} defaultB={b} />

      {dataA && dataB && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <ProfileHeader user={dataA.user} />
            <LanguageChart repos={dataA.repos} />
            <RepoList repos={dataA.repos} />
          </div>
          <div className="space-y-4">
            <ProfileHeader user={dataB.user} />
            <LanguageChart repos={dataB.repos} />
            <RepoList repos={dataB.repos} />
          </div>
        </div>
      )}
    </div>
  );
}