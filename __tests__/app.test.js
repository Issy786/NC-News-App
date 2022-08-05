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
          comment_count: 11,
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
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("Status: 200 responds with an array of article objects containing author, title, article_id, topic, created_at, votes and comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual(expect.any(Array));
        expect(body.articles).toHaveLength(12);
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("Status:200 default sort_by criteria: created_at and default ORDER BY criteria: DESC descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("Status:200 sort by the passed query", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("Status:200 order by the passed query", () => {
    return request(app)
      .get("/api/articles?order_by=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("Status:200 filter topic by the passed query", () => {
    return request(app)
      .get("/api/articles?filter_topic_by=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        console.log("here");
        expect(articles).toHaveLength(1);
      });
  });
  test("Status:404 sends an appropriate and error message when given an invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=key")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "sort by key does not exist. Please enter a valid sort by key"
        );
      });
  });
  test("Status:404 sends an appropriate and error message when given an invalid topic query", () => {
    return request(app)
      .get("/api/articles?filter_topic_by=key")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "topic does not exist. Please enter a valid topic"
        );
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("Status:200 responds with an array of comments for the given article_id of which each comment should have comment_id, votes, created_at, author and body properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual(expect.any(Array));
        expect(body.comments).toHaveLength(11);
        body.comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("Status:200 responds with an empty array if an existing article with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(0);
      });
  });
  test("Status:404 sends an appropriate and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/888/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article id does not exist");
      });
  });
  test("Status:400 sends an appropriate and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Invalid ID request. Please enter a valid ID Number"
        );
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Status:201 accepts an object with the properties username and body and inserts them as a new coment to the comments table ", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Hello World!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          body: "Hello World!",
          votes: expect.any(Number),
          author: "butter_bridge",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });
  test("Status:404 sends an appropriate and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/888/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article id does not exist");
      });
  });
  test("Status:400 sends an appropriate and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Invalid ID request. Please enter a valid ID Number"
        );
      });
  });
  test("Status:406 sends an appropriate and error message when passed with an request object with either property missing", () => {
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(406)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "New comment not accepted. Please make sure you enter both username and body of the new comment"
        );
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("responds with the status code: 204 - no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("status:404 sends an appropriate and error message when given a valid but non-existent id", () => {
    return request(app)
      .delete("/api/comments/200")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment id does not exist");
      });
  });
});
