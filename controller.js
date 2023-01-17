const { fetchTopics, fetchArticles } = require('./model')

exports.getWelcomeMessage = (request, response, next) => {
    response.status(200).send({message: "Welcome!"})
}

exports.getTopics = (request, response, next) => {
    fetchTopics().then((topicsArray) => {
        response.status(200).send({topics: topicsArray})
})
}
exports.getArticles = (request, response, next) => {
    fetchArticles().then ((articlesArray) => {
        response.status(200).send({articles: articlesArray})
    })
}




