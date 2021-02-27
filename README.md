# Safis CMS


[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/zaphytech/zaphycms/blob/master/LICENSE)


<br/>

### A headless and git-based CMS with GraphQL built in.

<br/>

Zaphy CMS connects to a Git repository and manages its content through GraphQL or an intuitive and minimal UI (coming soon).

<br/>

## Features

- Minimal web-based Admin UI (coming soon)
- Content Modeling
- GraphQL API built in
- Database free
- Authentication using GitHub

<br/>

(## Getting Started?)

## Requirements

1. The **owner** of the repository needs to create a GitHub **[personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)** and select the `repo` scope.

2. Create a **[GitHub OAuth App](https://docs.github.com/en/developers/apps/creating-an-oauth-app)**.
  Then set your "*Authorization callback URL*", this should be a combination of your domain and the value set for `OAUTH_CALLBACK_URL` env variable. e.g. `http://localhost:3000/oauth/callback`. We will use this app and will need to use its `Client ID` and `Client secret` to authenticate to GitHub.

## Configuration (environment variables)

### Required
- `COOKIE_SECRET`=my-cookie-secret
- `GIT_OWNER`=username-here
- `GIT_OWNER_SECRET`=secret-value # GitHub personal access token
- `GIT_REPO`=repo-name
- `GIT_OAUTH_CLIENT_ID`=oauth-app-client-id
- `GIT_OAUTH_CLIENT_SECRET`=oauth-app-client-secret

### Optional
- `GIT_DEFAULT_BRANCH` # default: *main*
- `GIT_OAUTH_SCOPE` (comma separated, e.g. `scope1,scope2`) # default: *repo*
- `GIT_REPO_VISIBILITY` # default: *public*
- `GIT_ROOT_FOLDER`=*custom-root-folder*
- `GIT_CONTENT_TYPES_FOLDER` # default: *contentTypes*
- `GIT_CONTENT_FOLDER` # default: *content*
- `OAUTH_LOGIN_URL` # default: */oauth/login*
- `OAUTH_CALLBACK_URL` # default: */oauth/callback*
- `ENABLE_GRAPHQL_PLAYGROUND` # default: *true*

<br/>

## Content Modeling
### Content types
Create custom content types for your application. Define your content types structure and add validations for each individual field.

| Field       | Description | Default | Required|
| ----------- | ----------- | -----   | ----    |
| `id` | Identifier of the content type. If a value is provided, it will always be formatted to camel case format. | It will take the value provided for the `name` but camel case format. e.g. Page = `page`. | false
| `name`   | What the Admin will display as the Name of the content type | | true
| `description`   | The description for the content type | empty | false
| `fields`   | Array of objects that will define each field available in the content type. e.g. <br/> `{ id: "age", name: "Age", description: "This is the user's age", type: "Number" }` </br> Please see the **Field Definition** table below for more information. | | true

<br/>
<br/>

**Field definition**
| Field      | Description | Default | Required|
| ----------- | ----------- | ----- | ---- |
| `id` | Identifier of the field contained in the content type. It will be formatted to camel case. | | true
| `name`   | The label to be displayed in the Admin for the field | | true
| `description`   | Optional description for the field content type | empty | false
| `type`   | This will define the data-type for the field. It can be one of: `String` &#124; `Number` &#124; `Boolean` &#124; `Reference` (Link to another content type [coming soon]) | | true
| `isRequired` (coming soon)   | It will make the filed required if true | false | false

<br/>

### Content entries
Once you defined your application content types, **add as many content entries as you need**.

<br/>

## File structure in the destination git Repository
    . # default root folder
    ├── content # default main content folder
        ├── contentTypeA # folder for all entries of type contentTypeA identified by an uuid
            ├── uuid-1.json
            ├── uuid-2.json
            ├── ...
            └── uuid-n.json.json

        └──  contentTypeB.json # folder for all entries of type contentTypeB identified by an uuid
            ├── uuid-1.json
            ├── uuid-2.json
            ├── ...
            └── uuid-n.json.json

    ├── contentTypes # default content types folder
        ├── contentTypeA.json # content type A information
        └── contentTypeB.json # content type B information

    └── README.md # will be added only if the repo was just created automatically

## Authentication
### Login
### Callback
### Access token

## GraphQL API
Initial base/basic types, queries and mutations.
Types, queries and mutations are dinamically created based on content types.
Required and dynamic/variable fields.

(Create example content types and use them through the following sections)

### Types
- ContentTypes
- Content (entries)

### Queries
- ContentTypes
- Content based

### Mutations (possibly talk about input types)
- ContentTypes
- Content based

### Playground
- Authorization header

### Usage example

## Customization
Ability to extend the GraphQL schema (Coming soon...)