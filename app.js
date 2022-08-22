const express = require("express");
const {
  getTopics,
  patchArticlesById,
  getUsers,
  getArticleById,
  getArticles,
  getcommentsByArticleId,
  postCommentToArticleId,
  deleteCommentById,
  getApi,
} = require("./controllers/controllers");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticlesById);
app.get("/api/articles/:article_id/comments", getcommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentToArticleId);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("/*", (req, res) =>
  res.status(404).send({ msg: "Endpoint not found" })
);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res
      .status(400)
      .send({ msg: "Invalid ID request. Please enter a valid ID Number" });
  }
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
