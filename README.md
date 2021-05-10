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
- `GIT_OAUTH_SCOPE` (comma separated, e.g. `scope1,scope2`) # default: *repo*, the scope for your OAuth App
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
Zaphy CMS uses GitHub OAuth Apps as default authenticatication and authorization method to use your repositories and manage your content.

First of all, you will need a Github OAuth as detailed in the [requirements](https://github.com/zaphylabs/zaphycms/tree/docs#requirements) section. Once your or your organization's OAuth App is created, you need to set a value for each of the following environment variables (see the [configuration](https://github.com/zaphylabs/zaphycms/tree/docs#configuration-environment-variables) section for more info):
- `GIT_OAUTH_CLIENT_ID`
- `GIT_OAUTH_CLIENT_SECRET`
- `GIT_OAUTH_SCOPE`
- `OAUTH_LOGIN_URL`
- `OAUTH_CALLBACK_URL`

### Login
In order for a user to login, it is required to use the route set in the `OAUTH_LOGIN_URL` env variable so it will promp the GitHub login interface and will ask the user to authenticate and autorize the OAuth App to access and manage your data.

### Callback
Once the user is authenticated, and authorized the OAuth App, GitHub will redirect the user to the *Authorization callback URL* (this **must match** the value set in `OAUTH_CALLBACK_URL`) configured in your OAuth App.

After the user is redirected to the *Authorization callback URL*, the CMS will generate an *access token* using the GitHub API and save it in the cookies so it will later be sent in the response back to the user.

And finally, the user will be redirected to the *return url* set in the url params (or cookies) called `returnUrl` (if no value is set, it will redirect to the homepage `/`).

### Access token
The access token will be used to authorize future requests that will be made to the GitHub API in order to manage the user's content. This can also be used to access the GraphQL API.

## GraphQL API
Zaphy CMS includes a GraphQL API that will help you read, manage and deliver your content through a flexible schema that will be dynamically updated based on the existing content types.

### Default Schema

This is the initial schema that will be available after the CMS was started for the first time:

```graphql
# indicates what kind of value a filed will take
enum ContentTypeFieldTypeEnum {
  String
  Number
  Boolean
  Reference # links to other dynamic types that implement the ContentType type (coming soon)
}

# used to add a new field for a dynamic content type
input ContentTypeFieldInput {
  id: ID!
  name: String!
  description: String
  type: ContentTypeFieldTypeEnum!
}

# used to add a new dynamic content type
input ContentTypeInput {
  id: ID
  name: String!
  description: String
  fields: [ContentTypeFieldInput!]
}

# used to update an existing dynamic content type
input ContentTypeUpdateInput {
  id: ID!
  name: String
  description: String
  fields: [ContentTypeFieldInput!]
}

# represents a field that belongs to a dynamic  content type
type ContentTypeField {
  id: ID!
  name: String!
  description: String
  type: ContentTypeFieldTypeEnum!
}

# represents a content type, dynamic content types will implement this
type ContentType {
  id: ID!
  name: String!
  description: String
  fields: [ContentTypeField!]!
}

type Query {
  contentType(id: ID!): ContentType # given an id, returns a dynamic content type 
  contentTypes: [ContentType] # return all dynamic content types available 
}

type Mutation {
  addContentType(input: ContentTypeInput!): ContentType # adds a new dynamic content type
  updateContentType(input: ContentTypeUpdateInput!): ContentType # updates an existing dynamic content type
  deleteContentType(id: ID!): Boolean! # deletes an existing dynamic content type
}
```

### Dynamic Content Types

As soon as you create, update or delete content type, the GraphQL schema will be dynamically updated to reflect the change made by the user.

<!-- 
Required and dynamic/variable fields.

(Create example content types and use them through the following sections) -->

- ContentTypes
- Content (entries)

#### Queries for Dynamic Content Types
- ContentTypes
- Content based

#### Mutations for Dynamic Content Types(possibly talk about input types)
- ContentTypes
- Content based

### Playground
- Authorization header

### Usage example

## Customization
Ability to extend the GraphQL schema (Coming soon...)