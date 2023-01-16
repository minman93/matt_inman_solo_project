const express = require('express');
const app = express()
const { getWelcomeMessage, getTopics, getArticles } = require('./controller')


app.get('/api', getWelcomeMessage)


app.get('/api/topics', getTopics)

//app.get('/api/articles', getArticles)




module.exports = app