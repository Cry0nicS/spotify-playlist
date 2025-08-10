# spotify-playlist

## Docker
You can run this project using Docker for easier setup and deployment.

### Prerequisites
- Docker installed on your machine.
- Run `cp .env.example .env`, and update the `.env` file as necessary.

### Build the Docker image
```bash
docker-compose build
```

### Run the Docker container
```bash
docker-compose up -d
```

### Access the application
Open your browser and navigate to `http://localhost:3000/` to see the application running.

### Stopp the Docker container
```bash
docker-compose down
```

## Installation

To install npm packages run the following commands

-   Run `npm install` to install the project dependencies.
-   Run `cp .env.example .env`, and update the `.env` file as necessary.

### Run the development server:

-   Run `npm run dev` or `nuxt dev` to start the development server.
    -   Open http://localhost:3000/

## Linting

-   `npm run format-check` - checks for formatting errors.
-   `npm run format` - auto-formats all files.
-   `npm run lint` - checks for Typescript errors.
-   `npm run type-check` - checks for Typescript types.

### Committing

There is a "linter" check running before each commit. All the above standards must be respected, to commit.
Each commit message must also follow the custom [Conventional Commits](https://confluence.meine-krankenkasse.de/x/lpGHB#Conventions(WIP)-Commitmessages) standards.
```text
<subject>

[optional body]

[optional footer(s)]
```
- Headers are concise and capitalized in sentence case, with no trailing periods.
- Body and footer must start with a blank line, use sentence case, end with a full stop, and respect line length of 72.

## Troubleshooting

On rare occasions, you might encounter an error related to `.nuxt` folder. <br />
Such an example is missing a specific property in `nuxt.config.ts` after installing a new nuxt module.

To fix this, manually run:

```bash
nuxt prepare
```

Although this should not be necessary because `nuxt prepare` is run automatically after `npm install` (see `postinstall` script)

## How to update dependencies

### Minor version updates

Update packages to the latest safe version as follows:

1. Run `npm outdated` to check for outdated packages.
2. Run `npm update` to update _all_ the outdated packages.
    - If you want to update _only_ a specific package, run `npm update <package-name>`.
3. Run `npm outdated` again to check if there are still outdated packages.

### Major version updates

Major version updates should be done with caution, as they may introduce breaking changes.

You can do so by using the `@latest`. e.g. `npm install <packagename>@latest`

### Alternative

As an alternative, you can also use [npm-check-updates](https://github.com/raineorshine/npm-check-updates).
