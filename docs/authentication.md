# Authentication

Safis CMS uses GitHub OAuth Apps as default authenticatication and authorization method to use your repositories and manage your content.

First of all, you will need a Github OAuth as detailed in the [requirements](#requirements) section. Once your or your organization's OAuth App is created, you need to set a value for each of the following environment variables (see the [configuration](#configuration-environment-variables) section for more info):
- `GIT_OAUTH_CLIENT_ID`
- `GIT_OAUTH_CLIENT_SECRET`
- `GIT_OAUTH_SCOPE`
- `OAUTH_LOGIN_URL`
- `OAUTH_CALLBACK_URL`

## Login
In order for a user to login, it is required to use the route set in the `OAUTH_LOGIN_URL` env variable so it will promp the GitHub login interface and will ask the user to authenticate and autorize the OAuth App to access and manage your data.

## Callback
Once the user is authenticated, and authorized the OAuth App, GitHub will redirect the user to the *Authorization callback URL* (this **must match** the value set in `OAUTH_CALLBACK_URL`) configured in your OAuth App.

After the user is redirected to the *Authorization callback URL*, the CMS will generate an *access token* using the GitHub API and save it in the cookies so it will later be sent in the response back to the user.

And finally, the user will be redirected to the *return url* set in the url params (or cookies) called `returnUrl` (if no value is set, it will redirect to the homepage `/`).

## Access token
The access token will be used to authorize future requests that will be made to the GitHub API in order to manage the user's content. This can also be used to access the GraphQL API.
