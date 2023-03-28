# API Documentation
This documentation is for an API that provides users with access to articles, topics and comments within my NC News website project.

# Hosted Version
The API is hosted here: https://matt-inman-backend-project.onrender.com/api/articles

# How To Get Started
1. Clone the repository.
2. Install the dependencies you need by running **npm install**.
3. Create two new .env files and call them .env.development and .env.test.
4. In .env.development, input PGDATABASE=nc_news
5. in .env.test, input PGDATABASE=nc_news_test
6. Seed the database by running **npm run seed**

# Minumum Versions
You will need to use Node.js 10.0.0 or higher, and Postgres version 12.0.0 or higher.

# Endpoints
- GET /api
- GET /api/topics
- GET /api/articles
- GET /api/articles/:article_id
- GET /api/articles/:article_id/comments
- GET /api/users

- POST /api/articles/:article_id/comments

- PATCH /api/articles/:article_id

# Link to Front-End Repository
https://github.com/minman93/nc-news-front-end

# Created By
Matt Inman
