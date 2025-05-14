# EdgeScan Assignment

## Tech Stack

- MongoDB as database
- Hono as backend framework
- Typegoose for interacting with database in a type safe manner
- Better Auth for authentication

## Running application locally:

### Pre-requisit

- Docker (or any other alternative like podman)

### Procedure

- Create a file named `.env` and copy the content from `.env.sample` in it. Change the values if needed.

- Start the container with docker using `docker-compose.yaml` file. Browse to the root folder and execute the following command. Run ``docker compose up -d``. This command will setup the database and will start the application.

- Application will be available on port 3000 and can be accessed with `http://localhost:3000` as base URL.

- Swagger UI will be available on `http://localhost:3000/ui`

- OpenAPI docs will be available on `http://localhost:3000/doc`
