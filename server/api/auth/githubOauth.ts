import { accessTokenCookieOptions, getAccessToken, getGitHubInfo, } from './Utils/GithubUtils'
import express, { NextFunction, Request, Response } from 'express'

import db from '../../database/models/'

const router = express.Router();

const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
const redirectUri = process.env.GITHUB_OAUTH_REDIRECT;
const scope = 'user'
const gitHubAuthorizationLink = 'https://github.com/login/oauth/authorize'

router.get("/", (req: Request, res: Response) => {
  const params = `?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
  res.redirect(gitHubAuthorizationLink+params);
});

router.get("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = `?client_id=${clientId}&client_secret=${clientSecret}&code=${req.query.code}`
    const { access_token } = (await getAccessToken(params)).data
  
    const { login: username } = (await getGitHubInfo(access_token)).data;
  
    let user = await db.User.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      user = await db.User.create({
        username,
      });
    }

    //to refresh the access token: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/refreshing-user-access-tokens
    res.cookie('gitHubAccessToken', access_token, accessTokenCookieOptions)
    
    const redirect = process.env.HOME_WEBSITE || ""
    res.redirect(redirect)
  } catch (e) {
    console.log(`Failed to authenticate user with error: ${e.message}`)
    throw new Error(`The authentication failed with error: ${e.message}`)
  }
});

export default router