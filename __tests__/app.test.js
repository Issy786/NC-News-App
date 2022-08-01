const app = require("../app");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

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
  test("status: 200 responds with an array of topic objects containing description an slug properties", () => {
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
