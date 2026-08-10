export async function getUser(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
        throw new Error(`Failed to fetch user data for ${username}`);
    }
    return data;
}

export async function getRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
        throw new Error(`Failed to fetch repositories for ${username}`);
    }
    return data;
}