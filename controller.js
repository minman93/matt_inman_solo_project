const { fetchTopics, fetchArticles, fetchArticleById, addComment } = require('./model')

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
exports.getArticleById = (request, response, next) => {
    const inputId= request.params.article_id
    fetchArticleById(inputId).then ((article) => {
        response.status(200).send(article)
    }).catch(next)
}





exports.postComment = (request, response, next) => {
    const articleNumber = request.params.article_id
    const username = request.body.author
    const commentBody = request.body.body
    addComment(articleNumber, username, commentBody).then((commentData) => {
        console.log(commentData)
        response.status(201).send(commentData)
    })

}




