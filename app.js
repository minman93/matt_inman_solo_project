const express = require('express');
const app = express()
const { getWelcomeMessage, getTopics, getArticles } = require('./controller')


app.get('/api', getWelcomeMessage)


app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.use((req, res, next) => {
    res.status(404).send({msg: 'Path not found' });
})




module.exports = app