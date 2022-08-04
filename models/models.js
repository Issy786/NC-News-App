const db = require("../db/connection.js");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.*, (SELECT COUNT(*) :: INT FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles WHERE article_id = $1;",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length < 1) {
        return Promise.reject({ status: 404, msg: "Invalid article id" });
      } else {
        return rows[0];
      }
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*",
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length < 1) {
        return Promise.reject({ status: 404, msg: "Invalid article Id" });
      } else {
        return rows[0];
      }
    });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticles = () => {
  return db
    .query(
      "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, (SELECT COUNT(*) :: INT FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles;"
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE comments.article_id = $1;", [
      article_id,
    ])
    .then(({ rows }) => {
      console.log(rows);
      return rows;
    });
};

exports.selectArticleByIdForComments = async (article_id) => {
  const {
    rows: [article],
  } = await db.query("SELECT * FROM articles WHERE article_id = $1;", [
    article_id,
  ]);

  if (!article) {
    return Promise.reject({ status: 404, msg: "Invalid article id" });
  }
  return article;
};
