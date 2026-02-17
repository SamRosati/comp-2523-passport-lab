import { Strategy as GitHubStrategy } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { database } from '../../models/userModel';

const githubStrategy: GitHubStrategy = new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        callbackURL: "http://localhost:8000/auth/github/callback",
        passReqToCallback: true,
    },
    
    /* FIX ME 😭 */
async (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
        // Logic to find or create a user in your local fake database
        let user = database.find(u => u.id === parseInt(profile.id));
        
        if (!user) {
            user = {
                id: parseInt(profile.id),
                name: profile.displayName || profile.username,
                email: profile.emails ? profile.emails[0].value : "",
            };
            database.push(user); // Add the new GitHub user to your database
        }
        return done(null, user);
    },
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
