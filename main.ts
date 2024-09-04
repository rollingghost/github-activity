interface Issue {
  title: string;
  url: string;
  createdAt: string;
}

interface PullRequest {
  title: string;
  url: string;
  createdAt: string;
}

interface Commit {
  message: string;
  committedDate: string;
  url: string;
}

interface Repository {
  name: string;
  defaultBranchRef: {
    target: {
      history: {
        edges: { node: Commit }[];
      };
    };
  } | null;
}

interface ContributionsCollection {
  issueContributions: {
    nodes: { issue: Issue }[];
  };
  pullRequestContributions: {
    nodes: { pullRequest: PullRequest }[];
  };
}

interface User {
  login: string;
  contributionsCollection: ContributionsCollection;
  repositories: {
    nodes: Repository[];
  };
}

interface ResponseData {
  data: {
    user: User;
  };
}

if (Deno.args.length !== 1) {
  console.log("Usage: github-activity <github-username>")
  Deno.exit(1);
}

const githubUsername = Deno.args[0];

// Check for the token in environment variables
const token = Deno.env.get("GITHUB_TOKEN");

if (!token) {
  // If the token is not found, prompt the user to enter it via the terminal
  console.log("Enter your GitHub Personal Access Token: ");
  const decoder = new TextDecoderStream();
  const reader = decoder.readable.getReader();
  Deno.stdin.readable.pipeTo(decoder.writable);

  const { value: inputToken } = await reader.read();
  
  if (!inputToken) {
    console.error("No token provided. Exiting...");
    Deno.exit(1);
  }

  fetchRecentActivities(githubUsername, inputToken.trim());

} else {
  fetchRecentActivities(githubUsername, token);
}

// Function to fetch recent activities
async function fetchRecentActivities(username: string, token: string) {
  // Define the GraphQL query
  const query = `
  {
    user(login: "${username}") {
      login
      contributionsCollection {
        issueContributions(last: 5) {
          nodes {
            issue {
              title
              url
              createdAt
            }
          }
        }
        pullRequestContributions(last: 5) {
          nodes {
            pullRequest {
              title
              url
              createdAt
            }
          }
        }
      }
      repositories(first: 5) {
        nodes {
          name
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 5) {
                  edges {
                    node {
                      message
                      committedDate
                      url
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
  `;

  // Make the API request
  const url = "https://api.github.com/graphql";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query })
    });

    // Step 6: Handle the response
    if (response.ok) {
      const data = await response.json();
      formatResponse(data)
    } else {
      throw new Error(`Query failed with status code ${response.status}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Prettfy the response
function formatResponse(response: ResponseData) {
  const user = response.data.user;
  console.log(`### User Information\n- **Username:** ${user.login}\n`);

  console.log(`### Contributions`);
  console.log(`#### Issues`);
  user.contributionsCollection.issueContributions.nodes.forEach((node: { issue: { title: string; url: string; createdAt: string } }) => {
    const issue = node.issue;
    console.log(`- **Title:** ${issue.title}`);
    console.log(`  - **URL:** ${issue.url}`);
    console.log(`  - **Created At:** ${issue.createdAt}\n`);
  });

  console.log(`#### Pull Requests`);
  user.contributionsCollection.pullRequestContributions.nodes.forEach((node: { pullRequest: { title: string; url: string; createdAt: string } }) => {
    const pr = node.pullRequest;
    console.log(`- **Title:** ${pr.title}`);
    console.log(`  - **URL:** ${pr.url}`);
    console.log(`  - **Created At:** ${pr.createdAt}\n`);
  });

  console.log(`### Repositories`);
  user.repositories.nodes.forEach((repo: { name: string; defaultBranchRef: { target: { history: { edges: { node: { message: string; committedDate: string; url: string } }[] } } } | null }) => {
    console.log(`#### ${repo.name}`);
    if (repo.defaultBranchRef && repo.defaultBranchRef.target) {
      console.log(`- **Commits:**`);
      repo.defaultBranchRef.target.history.edges.forEach(edge => {
        const commit = edge.node;
        console.log(`  - **Message:** ${commit.message}`);
        console.log(`    - **Date:** ${commit.committedDate}`);
        console.log(`    - **URL:** ${commit.url}\n`);
      });
    } else {
      console.log(`- **No commits available**\n`);
    }
  });
}