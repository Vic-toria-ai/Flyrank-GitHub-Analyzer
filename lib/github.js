// to fetch basic info about a GitHub user.
export async function getUser(username) {
    const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Failed to fetch user data for ${username}`);
    }
    return data;
}

// to fetch the list of repositories for a GitHub user.
export async function getRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Failed to fetch repositories for ${username}`);
    }
    return data;
}