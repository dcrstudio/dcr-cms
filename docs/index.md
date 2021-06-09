# Safis CMS


[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/safistech/safis-cms/blob/master/LICENSE)


### A headless, git-based and GraphQL native CMS.

<br/>

Safis CMS connects to a Git repository and manages its content through GraphQL or an intuitive and minimal UI (coming soon...).

<br/>

## Features

### [Content Modeling](./content-modeling.md)
Create custom content types for your application by defining their structure and adding validations for each individual field.

- #### [Content types](./content-modeling.md#content-types)

- #### [Content entries](./content-modeling.md#content-entries)

- #### [File structure](./content-modeling.md#file-structure)

### [Authentication](./authentication/md)
Safis CMS uses GitHub OAuth Apps as default authenticatication and authorization method to use your repositories and manage your content.

### [GraphQL API](./graphql.md)
Safis CMS includes a GraphQL API that will help you read, manage and deliver your content through a flexible schema that will be dynamically updated based on the existing content types.

### User friendly UI (coming soon...)
A web application designed for both content and development teams.

### Database free
All of your content will be saved directly into your destination git repository.

<br/>

## Getting Started

### Requirements

1. The **owner** of the repository needs to create a GitHub **[personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)** and select the `repo` scope.

2. Create a **[GitHub OAuth App](https://docs.github.com/en/developers/apps/creating-an-oauth-app)**.
  Then set your "*Authorization callback URL*", this should be a combination of your domain and the value set for `OAUTH_CALLBACK_URL` env variable. e.g. `http://localhost:3000/oauth/callback`. We will use this app and will need to use its `Client ID` and `Client secret` to authenticate to GitHub.

### Configuration (environment variables)

#### Required
- `COOKIE_SECRET`=my-cookie-secret
- `GIT_OWNER`=username-here
- `GIT_OWNER_SECRET`=secret-value # GitHub personal access token
- `GIT_REPO`=repo-name
- `GIT_OAUTH_CLIENT_ID`=oauth-app-client-id
- `GIT_OAUTH_CLIENT_SECRET`=oauth-app-client-secret

#### Optional
- `GIT_DEFAULT_BRANCH` # default: *main*
- `GIT_OAUTH_SCOPE` (comma separated, e.g. `scope1,scope2`) # default: *repo*, the scope for your OAuth App
- `GIT_REPO_VISIBILITY` # default: *public*
- `GIT_ROOT_FOLDER`=*custom-root-folder*
- `GIT_CONTENT_TYPES_FOLDER` # default: *contentTypes*
- `GIT_CONTENT_FOLDER` # default: *content*
- `OAUTH_LOGIN_URL` # default: */oauth/login*
- `OAUTH_CALLBACK_URL` # default: */oauth/callback*
- `ENABLE_GRAPHQL_PLAYGROUND` # default: *true*


## Contributing (coming soon...)
New contributors are always welcome! Check out [CONTRIBUTING.md](./CONTRIBUTING.md) to get involved.

<!-- ## Change Log
This project adheres to Semantic Versioning. Every release is documented on the Github Releases page. -->

## License
Safis CMS is released under the [MIT License](https://github.com/safis-io/safis-cms/blob/main/LICENSE).
<!--  Please make sure you understand its implications and guarantees. -->