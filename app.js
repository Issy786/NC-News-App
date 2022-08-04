const express = require("express");
const {
  getTopics,
  patchArticlesById,
  getUsers,
  getArticleById,
  getArticles,
  getcommentsByArticleId,
} = require("./controllers/controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticlesById);
app.get("/api/articles/:article_id/comments", getcommentsByArticleId);

app.get("/api/users", getUsers);

app.all("/*", (req, res) =>
  res.status(404).send({ msg: "Endpoint not found" })
);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res
      .status(400)
      .send({ msg: "Invalid ID request. Please enter a valid ID Number" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
