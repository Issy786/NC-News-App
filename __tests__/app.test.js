const app = require("../app");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const { convertTimestampToDate } = require("../db/seeds/utils");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("ALL /*", () => {
  test("status: 404 for unfound endpoint", () => {
    return request(app)
      .get("/non_existing_endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Endpoint not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("Status: 200 responds with an array of topic objects containing description an slug properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toEqual(expect.any(Array));
        expect(Object.keys(response.body.topics[0])).toEqual(
          expect.arrayContaining(["description", "slug"])
        );
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("Status:200 responds with article object containing author, title, article_id, body, created_at and votes properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = {
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(String),
        };
        expect(body.article).toMatchObject(article);
      });
  });
  test("Status:404 sends an appropriate and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/777")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article id");
      });
  });
  test("Status:400 sends an appropriate and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Invalid ID request. Please enter a valid ID Number"
        );
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Status:200 request body accepts an object with a key/value pair which holds the number to increment the votes property and returns the updated object", () => {
    const requestObj = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(requestObj)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 101,
        });
      });
  });
  test("status:404 sends an appropriate and error message when given a valid but non-existent id", () => {
    const requestObj = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/200")
      .send(requestObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article Id");
      });
  });
  test("Status:400 sends an appropriate and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Invalid ID request. Please enter a valid ID Number"
        );
      });
  });
});

describe("GET /api/users", () => {
  test("Status: 200 responds with an array of user objects containing username, name and avatar_url properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toEqual(expect.any(Array));
        expect(Object.keys(body.users[0])).toEqual(
          expect.arrayContaining(["username", "name", "avatar_url"])
        );
      });
  });
});
