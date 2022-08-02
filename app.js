const express = require("express");
const {
  getTopics,
  getArticlesById,
  patchArticlesById,
} = require("./controllers/controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);
app.patch("/api/articles/:article_id", patchArticlesById);

app.all("/*", (req, res) =>
  res.status(404).send({ msg: "Endpoint not found" })
);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
