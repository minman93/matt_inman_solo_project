const db = require("./db/connection");
const format = require("pg-format");
const testData = require("./db/data/test-data/index");
const { query } = require("./db/connection");

exports.fetchTopics = () => {
  const queryString = `SELECT * FROM topics;`;
  return db.query(queryString).then((topics) => {
    return topics.rows;
  });
};
exports.fetchArticles = (topic, sortBy = 'created_at', order = 'desc') => {
  const acceptedSorts = ['created_at', 'votes', 'author', 'title', 'article_img_url', 'comment_count']
  const acceptedOrder = ['asc', 'desc']
  const queryParams = []
  if (!acceptedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" })
  }
  if(!acceptedSorts.includes(sortBy)) {
    return Promise.reject({ status: 400, msg: "Bad Request" })
  }

  let queryString = `SELECT 
    A.author, 
    A.title,
    A.article_id,
    A.topic,
    A.created_at,
    A.votes,
    A.article_img_url,
    COUNT (B.article_id) AS comment_count
    FROM articles A
    LEFT JOIN comments B
    ON A.article_id = B.article_id`;

  
  if(topic) {
    queryString += ` WHERE topic = $1`
    queryParams.push(topic)
  }
  queryString += ` GROUP BY A.article_id ORDER BY ${sortBy} ${order.toUpperCase()};`

  return db.query(queryString, queryParams).then((articles) => {
    return articles.rows;
  });
};
exports.fetchArticleById = (inputId) => {
  const queryString = `SELECT 
    A.author, 
    A.title, 
    A.article_id,
    A.body, 
    A.topic, 
    A.created_at,
    A.votes,
    A.article_img_url 
    FROM articles A
    WHERE article_id = $1`;


  return db.query(queryString, [inputId]).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Path not found" });
    }
    return article.rows[0];
  });
};

exports.fetchComments = (inputId) => {
  const queryString = `SELECT
    A.comment_id,
    A.votes,
    A.created_at,
    A.author,
    A.body,
    A.article_id
    FROM comments A
    WHERE article_id=$1 ORDER BY created_at DESC`;

return this.fetchArticleById(inputId)
.then((article)=> {

return db.query(queryString, [inputId])
  .then((resolvedPromises) => {
    const comments = resolvedPromises.rows
  
    return comments;
  })
})
}

exports.addComment = (articleId, username, body) => {
  if (username === undefined || body === undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request"})
  }
  const queryString = `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`;
  return db
    .query(queryString, [articleId, username, body])
    .then((commentData) => {
    
      if (commentData.rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Bad Request"})
      }
      return commentData.rows[0];
    });
};

