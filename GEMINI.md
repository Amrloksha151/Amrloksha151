# Follow the instructions in this file STRICTLY
> Here's a quick guide for you to follow along the project. It maps the code base and provides an overview of the key components and their relationships.
---
## Project Overview
This project is my personal website that is designed to outline my capabilities in web security and web development. The website will have a full stack serverless nature and the frontend will be handled using AstroJS and deployed on Cloudflare Pages + Cloudflare Workers. The website will be hosted on https://amrloksha151.me and the api will be hosted on https://api.amrloksha151.me.

## Codebase Structure
Folder Structure:
```zsh
├── GEMINI.md
├── README.md
├── backend
│   ├── GEMINI.md
│   ├── db
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   ├── test
│   ├── vitest.config.js
│   └── wrangler.jsonc
└── frontend
    ├── GEMINI.md
    ├── astro.config.mjs
    ├── dist
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── public
    ├── src
    └── tsconfig.json
```
### Key notes
- The backend folder will contain the REST api code base and the database schema and migration scripts.
- Any github workflows should go to `/.github/workflows/*` where `/` is the project root directory.
- Any new feature at the backend should have a correspoonding test case in the `/backend/test` folder.
- The HTML email templates will be located in the `backend/src/email/templates` folder and any new email template should be added to this folder.
- In `frontend/src/assets/images/` You'll find an image of me and any useful images for the website codebase

### DOs and DON'Ts
- Don't install any new dependencies without explicit permission
- The db migration script shall use the .env file for the database connection string and not hardcode it in the migration script.
- The database schema must be determined in the `backend/db/schema.sql` file and any changes to the schema must be reflected in the `backend/db/schema.sql` file and reexecuted after dropping the old schema.
- New frontend content should be dynamically generated using content types to be easily editable later on. The two major content types are `md` and `json` files. Use json for less detailed entries that has many entries things like skills and education. Use md for detailed entries that has fewer entries like projects and experiences. The content types will be stored in the `frontend/src/content` folder.
- When creating any new page, feature, or component, make sure to use your ui ux pro max skill to ensure better looking.
- Use custom fonts but make sure they're readable too.
- As I'm a web security researcher and web developer I want the website style and spirit to emphasize so.
- Use mock content and data to test every feature and capability in the website

## Project Key Features
- The website landing page should include an introducing hero to me and my capabilities in web security and web development. The hero should include this descriptor "Security Researcher & Web Developer".
- The website must include a projects page that lists all of my projects and each project can be visited and has its own detailed page which can be accomplished using markdown content type. The landing page should have an overview section of the projects containing a few (2-4) of the projects with a link to the projects page.
- The website landing page must include a skills section that loads the skills dynamically from a json file using the content capabilities in astrojs.
- The website must include an education page that states my education journey which will load the data from a json file. This education page should demonestrate my education journey graphically with animations and interactive high lights at each step of this journey
- The website must include an experience page that is similar to the education page but has links to each work experience in detail which will be dynamically generated from the md files.
- The website must include a services page that lists the services I offer and their costs if any. This page should also include a form for inquiry or booking any listed services with enough detail. This form should have a corresponding endpoint in the api and a corresponding table in the database the website shall make a new entry in the database and send me an email using resend containing the inquiry most useful details these include the inquiry title, service, and contact information and the first 200 characters of the inquiry details and other useful information if any. That email will be sent in an email template with a fine looking and unconfusing one it must also be branded to my website and follow the same style.
- The website must include a contact page that has a form for contacting me with enough details. This form should have a corresponding endpoint in the api and a corresponding table in the database the website shall make a new entry in the database and send me an email using resend containing the contact most useful details these include the contact title, contact email, and the first 200 characters of the contact message and other useful information if any. That email will be sent in an email template with a fine looking and unconfusing one it must also be branded to my website and follow the same style.

## Environment Variables and Secrets
| Variable Name | Description | Example Value |
| ------------- | ----------- | ------------- |
| DATABASE_URL | The connection string for the neon database | postgresql://neondb_owner:password@host/dbname |
| RESEND_API_KEY | The api key for the resend email service | sk_test_1234567890 |
| ALLOWED_ORIGINS | A comma-separated list of allowed origins for CORS | https://amrloksha151.me,https://api.amrloksha151.me |
| ADMIN_EMAIL | The email of me (Amr Loksha) to receive any messages from the website | example@mail.com |