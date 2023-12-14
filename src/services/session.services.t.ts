import qs from 'qs';
import 'dotenv/config';

const GOOGLE_OAUTH_CONFIG = {
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
};

const GITHUB_OAUTH_CONFIG = {
    client_id: process.env.GITHUB_OAUTH_CLIENT_ID as string,
    client_secret: process.env.GITHUB_CLIENT_SECRET as string,
    redirect_uri: process.env.GITHUB_REDIRECT_URI as string,
};

interface GoogleOauthToken {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
    id_token: string;
}

interface GithubOauthToken {
    access_token: string;
    scope: string;
    token_type: string;
}

interface GoogleUser {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
}

interface GithubUser {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name?: string;
    company?: string;
    blog?: string;
    location?: string;
    email?: string;
    hireable?: boolean;
    bio?: string;
    twitter_username?: string;
    public_repos?: number;
    public_gists?: number;
    followers?: number;
    following?: number;
    created_at?: string;
    updated_at?: string;
}