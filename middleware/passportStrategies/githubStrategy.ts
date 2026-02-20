import { Request } from 'express';
import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { database, User } from '../../models/userModel';

const githubStrategy: GitHubStrategy = new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        callbackURL: "http://localhost:8000/auth/github/callback",
        passReqToCallback: true,
    },
    
    async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void) => {
        // Logic to find or create a user in local fake database
        let user: User | undefined = database.find(u => u.id === parseInt(profile.id));
        
        if (!user) {
            const newUser: User = {
                id: parseInt(profile.id),
                name: profile.displayName || profile.username || "Unknown",
                email: profile.emails ? profile.emails[0].value : "",
            };
            database.push(newUser); // Add the new GitHub user to your database
        }
        return done(null, user);
    },
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;