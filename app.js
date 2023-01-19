const express = require('express');
const app = express()

const { getWelcomeMessage, getTopics, getArticles, getArticleById, getComments, patchArticle } = require('./controller')

app.use(express.json())



app.get('/api', getWelcomeMessage)


app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getComments)



app.patch('/api/articles/:article_id', patchArticle)


app.use((req, res, next) => {
     res.status(404).send({msg: 'Path not found' });
})
app.use((err, req, res, next) => {
    
if (err.status && err.msg) {
    res.status(err.status).send({msg: err.msg})
} else next(err)
})
app.use((err, req, res, next) => {
    if (err.code === '22PO2') {
        res.status(400).send({msg: "Bad Request"})
    } else next(err)
})
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: 'server error'})
})




module.exports = app