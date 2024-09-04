# GitHub Activity Fetcher

## Overview

GitHub Activity Fetcher is a TypeScript application that fetches and displays
recent GitHub activities for a specified user. The application retrieves
information about issues, pull requests, and repositories, and formats the
output in a human-readable format.

## Project URL

Find the project [here](https://roadmap.sh/projects/github-user-activity) on
[roadmap.sh](https://roadmap.sh)

## Features

- Fetches recent issues and pull requests contributions.
- Retrieves commit history for repositories.
- Outputs formatted information to the terminal.

## Prerequisites

- [Deno](https://deno.land/) (Ensure you have Deno installed on your machine)

## Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/github-activity-fetcher.git
   cd github-activity-fetcher
   ```

2. Set up your GitHub Personal Access Token:
   - Create a `.env` file in the root directory.
   - Add your GitHub token to the `.env` file:
     ```sh
     GITHUB_TOKEN=your_github_token
     ```

## Usage

1. Run the application:
   ```sh
   deno run --allow-net --allow-env main.ts <github-username>
   ```

   Replace `<github-username>` with the GitHub username you want to fetch
   activities for.

## Example

To fetch activities for the user `Harshita-mindfire`, run:

```sh
deno run --allow-net --allow-env main.ts Harshita-mindfire
```

## Project Structure

- [`main.ts`](./main.ts): The main entry point of the application. It fetches
  and formats the GitHub activities.
- [`main_tests.ts`](./main_test.ts): Can be used to write tests

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any
improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for
details.
