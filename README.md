# Northcoders News API

https://nc-news-app-issy.herokuapp.com/api

## Description

The purpose of this project was to build an API to provide, add, update and remove application data programmatically to the frontend client. The data that is accessed are news articles, comments made about the articles, the topics of the articles, the users of the application, dates and votes of the articles and related comments.

## How to use

### Clone this repo

in the terminal run the following command:

`git clone https://github.com/northcoders/precourse-javascript.git`

### Installation

To run the API please install following packages:

#### **Express:**

`npm install express`

#### **PostGres:**

`npm install pg`

#### **DotEnv:**

`npm install dotenv`

#### **PgFormat**

`npm install pg-format`

#### **Jest:**

`npm install -D jest`

#### **Jest-Sorted**

`npm install --save-dev jest-sorted`

#### **SuperTest:**

`npm install -D supertest`

#### **CORS:**

`npm install cors`

### seting up and seeding the local database

To set up and seed the local database, please run the following commands in the terminal:

`npm run setup-dbs`

`npm run seed`

### Testing the App

to test the App please run the following command in the terminal:

`npm test app.test.js`

## Set-up enviroment variables

To connect to the two databases in this repo, please create two new files: .env.test and .env.development. Add PGDATABASE=nc_news_test; into the .env.test file and add PGDATABASE=nc_news; into the .env.development file.

## Node and PostGres version

The minimum required versions of Node and PostGres to run the project are:

- Node: v18.3.0
- PostGres: 14.5
