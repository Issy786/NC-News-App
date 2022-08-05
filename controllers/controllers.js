const comments = require("../db/data/test-data/comments");
const {
  selectTopics,
  updateArticleById,
  selectUsers,
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  insertNewCommentToGivenArticleID,
  checkIfArticleExists,
  removeCommentById,
} = require("../models/models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order_by, filter_topic_by } = req.query;

  selectArticles(sort_by, order_by, filter_topic_by)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getcommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    selectCommentsByArticleId(article_id),
    checkIfArticleExists(article_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentToArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  Promise.all([
    insertNewCommentToGivenArticleID(article_id, newComment),
    checkIfArticleExists(article_id),
  ])
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
