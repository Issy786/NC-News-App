const express = require("express");
const { getTopics } = require("./controllers/controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.all("/*", (req, res) =>
  res.status(404).send({ msg: "Endpoint not found" })
);

module.exports = app;
