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

exports.selectArticles = (
  sortBy = "created_at",
  orderBy = "DESC",
  filterByTopic
) => {
  const valid_sort_by = [
    "article_id",
    "title",
    "topic",
    "author",
    "votes",
    "comment_count",
    "created_at",
  ];

  if (!valid_sort_by.includes(sortBy)) {
    return Promise.reject({
      status: 404,
      msg: "sort by key does not exist. Please enter a valid sort by key",
    });
  }
  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, (SELECT COUNT(*) :: INT FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles`;
  let injectArr = [];

  if (filterByTopic) {
    queryStr += ` WHERE articles.topic = $1`;
    injectArr.push(filterByTopic);
  }

  queryStr += ` ORDER BY ${sortBy} ${orderBy};`;

  return db.query(queryStr, injectArr).then(({ rows }) => {
    return rows;
  });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE comments.article_id = $1;", [
      article_id,
    ])
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkIfArticleExists = async (article_id) => {
  const {
    rows: [article],
  } = await db.query("SELECT * FROM articles WHERE article_id = $1;", [
    article_id,
  ]);

  if (!article) {
    return Promise.reject({ status: 404, msg: "Article id does not exist" });
  }
};

exports.insertNewCommentToGivenArticleID = (article_id, newComment) => {
  if (!newComment.username || !newComment.body) {
    return Promise.reject({
      status: 406,
      msg: "New comment not accepted. Please make sure you enter both username and body of the new comment",
    });
  }
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING*;",
      [article_id, newComment.username, newComment.body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
