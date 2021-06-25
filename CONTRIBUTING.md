# Contributing Guide

Thanks for contributing to Safis CMS!

> Please note that this project is released with a [Contributor Code of Conduct](/CODE_OF_CONDUCT.md).
> By participating in this project you agree to abide by its terms.

## Code Structure

This repository is a [monorepo](https://trunkbaseddevelopment.com/monorepos/) managed using [Lerna](https://github.com/lerna/lerna). This means there are [multiple packages](https://github.com/safis-io/safis-cms/tree/main/packages) managed in this codebase, even though we publish them to NPM as separate packages.

## Requirements

1. The **owner** of the repository needs to create a GitHub **[personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)** and select the `repo` scope.

2. Create a **[GitHub OAuth App](https://docs.github.com/en/developers/apps/creating-an-oauth-app)**.
  Then set your "*Authorization callback URL*", this should be a combination of your domain and the value set for `OAUTH_CALLBACK_URL` env variable. e.g. `http://localhost:3000/oauth/callback`. We will use this app and will need to use its `Client ID` and `Client secret` to authenticate to GitHub.

3. Check that Node is [installed](https://nodejs.org/en/download/) with version `>= 14.17`. You can check this with `node -v`.

## Developing

### Setup

[Fork](https://guides.github.com/activities/forking/) the `safis-cms` repository to your GitHub Account.

#### Cloning your `safi-cms` repo
```sh
$ git clone https://github.com/<your-github-username>/safis-cms

$ cd safis-cms
```

#### Dependencies
Install dependencies for the main repo and all packages by running **once**:

```sh
$ npm run lerna-install
```
#### Configuration
We will use environment variables to configure our `safis-cms` local environment. So we will need a `.env` file with the following configuration:

```sh
# Required
COOKIE_SECRET=my-cookie-secret
GIT_OWNER=username-here
GIT_OWNER_SECRET=secret-value # GitHub personal access token
GIT_REPO=repo-name
GIT_OAUTH_CLIENT_ID=oauth-app-client-id
GIT_OAUTH_CLIENT_SECRET=oauth-app-client-secret

# Optional
GIT_DEFAULT_BRANCH # default: main
GIT_OAUTH_SCOPE # comma separated value. e.g. scope1,scope2. Default: repo, the scope for your OAuth App
GIT_REPO_VISIBILITY # default: public
GIT_ROOT_FOLDER=custom-root-folder
GIT_CONTENT_TYPES_FOLDER # default: contentTypes
GIT_CONTENT_FOLDER # default: content
OAUTH_LOGIN_URL # default: /oauth/login
OAUTH_CALLBACK_URL # default: /oauth/callback
ENABLE_GRAPHQL_PLAYGROUND # default: true
```

> You can use to the `.env.example` file at the root level of the repo to create your `.env` file.

#### Getting your local instance of safis-cms up and running

You can either run

```sh
$ npm dev 
```

> Starts safis-cms in development and watch mode.

or

```sh
$ npm start
```
> Starts safis-cms in production mode.

#### Running tests
Coming soon..

<!-- ```sh
$ npm test

# watch for changes
$ npm run test-watch
``` -->
<!-- 
### Run Integration Tests

```sh
$ npm run integration

# test a specific file
$ npm run integration -- lerna-publish

# watch for changes
$ npm run integration -- --watch

# watch a specific file
$ npm run integration -- --watch lerna-publish
``` -->

#### Linting
Coming soon...

<!-- 
```sh
$ npm run lint
```

It's also a good idea to hook up your editor to an eslint plugin.

To fix lint errors from the command line:

```sh
$ npm run lint -- --fix
``` -->

#### Coverage
Coming soon...

<!-- 
If you would like to check test coverage, run the coverage script, then open
`coverage/lcov-report/index.html` in your favorite browser.

```sh
$ npm test -- --coverage

# OS X
$ open coverage/lcov-report/index.html

# Linux
$ xdg-open coverage/lcov-report/index.html
``` -->

### Submitting Pull Requests

This project follows [GitHub's standard forking model](https://guides.github.com/activities/forking/). Please fork the project to submit pull requests. 

### Releasing
Coming soon...

<!-- If you are a member of Safis' [GitHub org](https://github.com/orgs/safis-io/people) and have read-write privileges in Safis' [npm org](https://www.npmjs.com/org/safis) _with 2-factor auth enabled_, congratulations, you can cut a release!

You'll need to set up a local `.env` file in the repo root to provide the required environment variables.
The `.env.example` file is available in the root as a template.
The root `.env` file is _never_ placed under version control.

Once that's done, run the release script and await glory:

```sh
npm run release
``` -->
