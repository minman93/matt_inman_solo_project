const db = require('./db/connection')
const format = require('pg-format')

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