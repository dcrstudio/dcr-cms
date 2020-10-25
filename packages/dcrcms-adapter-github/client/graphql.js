const getViewer = (client) => () => client(
  `
    query viewer {
      viewer {
        login
      }
    }
  `,
)

const getRepository = (client) => ({ owner, name }) => client(
  `
      query getRepository($owner: String!, $name: String!){
        repository(owner: $owner, name: $name) {
          name
        }
      }
    `,
  { owner, name },
)

const getBaseCommitInfo = (client) => ({ owner, repo, branch }) => client(
  `query getBaseCommitInfo($repo: String!, $owner: String!, $ref: String!) { 
    repository(name: $repo, owner: $owner) {
      ref(qualifiedName: $ref) {
        target {
          ... on Commit {
            commitSha: oid
            tree {
              sha: oid
            }
          }
        }
      }
    }
  }`,
  { owner, repo, ref: `refs/heads/${branch}` },
)

const getFileContent = (client) => ({
  owner,
  repo,
  branch,
  path,
}) => client(
  `query getFileContent($repo: String!, $owner: String!, $ref: String!, $path: String!) { 
    repository(name: $repo, owner: $owner) {
      ref(qualifiedName: $ref) {
        target {
          ... on Commit {
            file(path: $path) {
              ... on TreeEntry {
                object {
                  __typename
                  ... on Blob {
                    id
                    text
                    isTruncated
                  }
                }
              }
            }
          }
        }
      }
    }
  }`,
  { owner, repo, ref: `refs/heads/${branch}`, path },
)

const getFolderContent = (client) => ({
  owner,
  repo,
  branch,
  path,
}) => client(
  `query getFolderContent($repo: String!, $owner: String!, $ref: String!, $path: String!) { 
    repository(name: $repo, owner: $owner) {
      ref(qualifiedName: $ref) {
        target {
          ... on Commit {
            files: file(path: $path) {
              __typename
              ... on TreeEntry {
                __typename
                object {
                  ... on Tree {
                    __typename
                    entries {
                      object {
                        __typename
                        ... on Blob {
                            isTruncated
                            text
                          }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`,
  { owner, repo, ref: `refs/heads/${branch}`, path },
)

const githubGraphqlAdapter = (client) => ({
  getRepository: getRepository(client),
  getBaseCommitInfo: getBaseCommitInfo(client),
  getViewer: getViewer(client),
  getFileContent: getFileContent(client),
  getFolderContent: getFolderContent(client),
})

export default githubGraphqlAdapter
