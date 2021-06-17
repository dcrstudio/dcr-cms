# Safis CMS

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/safistech/safis-cms/blob/master/LICENSE)

### A headless, git-based and GraphQL native CMS.

Safis CMS connects to a Git repository and manages its content through GraphQL or an intuitive and minimal UI (coming soon...)

## Features

### [Content Modeling](./content-modeling.md)
Create custom content types for your application by defining their structure and adding validations for each individual field.

- #### [Content types](./content-modeling.md#content-types)

- #### [Content entries](./content-modeling.md#content-entries)

- #### [File structure](./content-modeling.md#file-structure)

### [Authentication](./authentication.md)
Safis CMS uses GitHub OAuth Apps as default authenticatication and authorization method to use your repositories and manage your content.

### [GraphQL API](./graphql.md)
Safis CMS includes a GraphQL API that will help you read, manage and deliver your content through a flexible schema that will be dynamically updated based on the existing content types.

### User friendly UI (coming soon...)
A web application designed for both content and development teams.

### Database free
All of your content will be saved directly into your destination git repository.

## Getting Started

### Requirements

1. The **owner** of the repository needs to create a GitHub **[personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)** and select the `repo` scope.

2. Create a **[GitHub OAuth App](https://docs.github.com/en/developers/apps/creating-an-oauth-app)**.
  Then set your "*Authorization callback URL*", this should be a combination of your domain and the value set for `OAUTH_CALLBACK_URL` env variable. e.g. `http://localhost:3000/oauth/callback`. We will use this app and will need to use its `Client ID` and `Client secret` to authenticate to GitHub.

### Configuration
We will use environment variables in this example to configure our `safis-cms-server`. So we will need a `.env` file with the following configuration:

```bash
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

### Installation
```bash
npm install safis-cms-server
```

> For this example, we will also be using the [`dotenv`](https://github.com/motdotla/dotenv) npm package.

### Usage
Create and start a server using the `safis-cms-server` npm package:

```js
import { createServer } from 'safis-cms-server'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3000

const enablePlayground = process.env.ENABLE_GRAPHQL_PLAYGROUND === undefined
  || process.env.ENABLE_GRAPHQL_PLAYGROUND === 'true'

const configs = {
  cookieSecret: process.env.COOKIE_SECRET,
  git: {
    ownerSecret: process.env.GIT_OWNER_SECRET,
    owner: process.env.GIT_OWNER,
    repo: process.env.GIT_REPO,

    visibility: process.env.GIT_REPO_VISIBILITY,
    defaultBranch: process.env.GIT_DEFAULT_BRANCH,
    paths: {
      root: process.env.GIT_ROOT_FOLDER,
      contentTypes: process.env.GIT_CONTENT_TYPES_FOLDER,
      content: process.env.GIT_CONTENT_FOLDER,
    },
  },
  logger: true,
  oatuhCallback: process.env.OAUTH_CALLBACK_URL,
  oauthClientId: process.env.GIT_OAUTH_CLIENT_ID,
  oauthClientSecret: process.env.GIT_OAUTH_CLIENT_SECRET,
  oauthScope: process.env.GIT_OAUTH_SCOPE?.split(','),
  oauthLogin: process.env.OAUTH_LOGIN_URL,
  enablePlayground,
}

const server = createServer(configs) // creates a Fastify server

server.listen(PORT, (err) => {
  if (err) {
    server.log.error(`Failed to start Server: ${JSON.stringify(err)}`)
    process.exit(1)
  }

  server.log.info(`Server running on port ${PORT}`)
})
```

You can additionally add a client to your server so you can manage your content through a more user friendly interface. ***Coming soon...***

## Contributing (coming soon...)
New contributors are always welcome! Check out [CONTRIBUTING.md](./CONTRIBUTING.md) to get involved.

<!-- ## Change Log
This project adheres to Semantic Versioning. Every release is documented on the Github Releases page. -->

## License
Safis CMS is released under the [MIT License](https://github.com/safis-io/safis-cms/blob/main/LICENSE).
<!--  Please make sure you understand its implications and guarantees. -->