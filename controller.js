const { fetchTopics, fetchArticles, fetchArticleById, fetchComments, updateArticle } = require('./model')


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
    const inputId = request.params.article_id
    fetchArticleById(inputId).then ((article) => {
        response.status(200).send(article)
    }).catch(next)
}
exports.getComments = (request, response, next) => {
    const inputId = request.params.article_id
    fetchComments(inputId).then((commentsArray) => {
        response.status(200).send(commentsArray)
    }).catch(next)
    
}

exports.patchArticle = (request, response, next) => {
    const inputId = request.params.article_id
    const voteObj = request.body.inc_votes
    updateArticle(inputId, voteObj).then((patchedArticle) => {
        
        response.status(201).send(patchedArticle)
    }).catch(next)
}




