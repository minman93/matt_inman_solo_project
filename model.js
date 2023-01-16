const db = require('./db/connection')
const format = require('pg-format')

exports.fetchTopics = () => {
    const queryString = `SELECT * FROM topics;`
    return db.query(queryString)
    .then((topics) => {
        return topics.rows
    })
}
// exports.fetchArticles = () => {
//     const queryString = 
//     return db.query(queryString)
//     .then((articles) => {
//         return 
//     })
