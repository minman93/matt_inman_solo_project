const db = require('./db/connection')
const format = require('pg-format')
const testData = require ('./db/data/test-data/index')

exports.fetchTopics = () => {
    const queryString = `SELECT * FROM topics;`
    return db.query(queryString)
    .then((topics) => {
        return topics.rows
    })
}
exports.fetchArticles = () => {
    const queryString = `SELECT 
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
    ON A.article_id = B.article_id
    GROUP BY A.article_id
    ORDER BY created_at DESC
    ;`
    return db.query(queryString)
    .then((articles) => {
        return articles.rows
    })
}
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
    WHERE article_id = $1`

    if (inputId > testData.articleData.length) {
        return Promise.reject({status: 400, msg: 'Bad Request'})}

    return db.query(queryString, [inputId])
    .then((article) => {
        return article.rows[0]
    })
}

exports.fetchComments = (inputId) => {
    const queryString = `SELECT
    A.comment_id,
    A.votes,
    A.created_at,
    A.author,
    A.body,
    A.article_id
    FROM comments A
    WHERE article_id=$1 ORDER BY created_at DESC`
    if (inputId > testData.articleData.length) {
        return Promise.reject({status: 400, msg: 'Bad Request'})}
    return db.query(queryString, [inputId])
    .then((comments) => {
        return comments.rows
    })
}

exports.updateArticle = (inputId, voteObj) => {
  queryString = `UPDATE articles SET votes=$1+votes WHERE article_id=$2 RETURNING *`
  return db.query(queryString, [voteObj, inputId])
  .then((votes) => {
    console.log(votes)
    return votes.rows[0]
  })
}
