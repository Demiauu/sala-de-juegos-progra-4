export interface GitHubUser {
    login: string;
    avatar_url: string;
    name: string | null;
    bio: string | null;
    html_url: string;
}

export interface Usuario {
    uid: string;
    email: string | null;
    displayName?: string | null;
}