

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
function formatResponse(response: ) {
  
}