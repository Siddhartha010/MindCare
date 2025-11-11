Development run notes

Goal: run backend and frontend separately during development.

1) Start backend only (it will not try to initialize DB on startup):

   npm run dev

   - This runs the server (nodemon) and will not attempt DB initialization automatically.
   - If you want to initialize the Postgres database (create DB/tables), run the explicit setup script below.

2) Initialize the database (when Postgres is running locally):

   npm run setup-db

   - This will execute `setup-db.js` which creates the `mental_health_db` database and required tables.
   - You can also run the SQL manually or use Docker to run Postgres.

3) Start frontend separately:

   npm run dev:client

   - This starts the React dev server on port 3000. It will proxy API requests to http://localhost:5000 per `client/package.json`.

4) Quick Docker Postgres (if you don't want to install PostgreSQL locally):

   docker run --name mh-db -e POSTGRES_PASSWORD=password -e POSTGRES_USER=postgres -e POSTGRES_DB=mental_health_db -p 5432:5432 -d postgres:15

   Or use the provided docker-compose shortcut:

   npm run dev:db


5) Environment variables

   Copy `.env.example` to `.env` and set DB_* variables as needed. Example defaults:

   DB_USER=postgres
   DB_PASSWORD=password
   DB_NAME=mental_health_db
   DB_HOST=127.0.0.1
   DB_PORT=5432

6) Notes

   - The server no longer runs DB initialization on module load. This prevents server startup failures when Postgres is temporarily unavailable.
   - Use `npm run setup-db` to create the DB and tables explicitly once Postgres is ready.

   PG_ADMIN mode (optional)

   If you need the script to create the Postgres database itself (the `CREATE DATABASE` step), run the setup script with `PG_ADMIN=true` in an environment where the `pg` package is available and Postgres accepts connections from the admin user:

      PG_ADMIN=true node setup-db.js

   This is only required if you don't want to create the database manually or via Docker environment variables.

   Netlify deployment notes

   - If you deploy the project to Netlify, make sure Netlify builds the React app inside the `client` folder and serves the single-page app correctly.
   - I added a `netlify.toml` at the repository root which tells Netlify to run `npm --prefix client run build` and publish `client/build`.
   - For client-side routing to work (so refreshes or deep links do not return 404), a redirect rule has been added at `client/public/_redirects` and in `netlify.toml`.

   If you still see Netlify's 404 page after redeploying, try the following:

   1. In the Netlify site settings -> Build & deploy -> Continuous Deployment -> Build settings, confirm "Base directory" is empty and the build command is `npm --prefix client run build` and the publish directory is `client/build`.
   2. Redeploy the site from the Netlify UI or push a commit to trigger the build.
   3. If problems persist, open Netlify build logs (they show the exact command and publish directory used) and paste the last 50 lines here and I will inspect them.
