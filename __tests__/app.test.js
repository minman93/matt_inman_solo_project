const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const sorted = require('jest-sorted');


beforeEach(()=> seed(testData));

describe('app', () => {
    describe('get welcome message', () => {
        test('returns a status code of 200', () => {
            return request(app)
            .get('/api')
            .expect(200)
         })
         test('should return a welcome message to the user', ()=> {
            return request(app)
            .get('/api')
            .then(({body}) => {
                expect(body.message).toEqual('Welcome!')

            })
         })

    })
    describe('returns all topics with a GET topics request', ()=> {
        test('returns an array of topic objects, each containing a property of SLUG and a property of DESCRIPTION',() => {
            return request(app)
            .get('/api/topics')
            .then(({body}) => {
                expect(body.topics[0]).toHaveProperty('slug')
                expect(body.topics[1]).toHaveProperty('description')
                expect(Array.isArray(body.topics))
            })

        })
        test('404 invalid path', ()=>{
            return request(app)
            .get('/not-a-path')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Path not found')
            })
        })
    })
    describe('returns all articles with a GET articles request', () => {
        test('returns an array of article objects, each containing the following properties: AUTHOR, TITLE, ARTICLE_ID, TOPIC, CREATED_AT, VOTES, ARTICLE_IMG_URL', () => {
            return request(app)
            .get('/api/articles')
            .then(({body}) => {
                expect(body.articles[0]).toHaveProperty('author')
                expect(body.articles[1]).toHaveProperty('title')
                expect(body.articles[2]).toHaveProperty('article_id')
                expect(body.articles[3]).toHaveProperty('topic')
                expect(body.articles[4]).toHaveProperty('created_at')
                expect(body.articles[5]).toHaveProperty('votes')
                expect(body.articles[6]).toHaveProperty('article_img_url')


            })

            })
            test('each article contains a COMMENT_COUNT, which is the total number of comments with the corresponding ARTICLE_ID', () => {
                return request(app)
                .get('/api/articles')
                .then(({body}) => { 
                    expect(body.articles[0]).toHaveProperty('comment_count')
                })

            })
            test('articles should be sorted by date in descending order', () => {
                return request(app)
                .get('/api/articles')
                .then(({body}) => {
                    expect([body.articles[0], body.articles[1], body.articles[2]]).toBeSorted({descending: true})

                })
            })
           
        })
        describe('returns an article that corresponds to the article id that is passed in', () => {
            test('returns an article object with the following properties: AUTHOR, TITLE, ARTICLE_ID, BODY, TOPIC, CREATED_AT, VOTES, ARTICLE_IMG_URL', ()=>{
                return request(app)
                .get('/api/articles/3')
                .then(({body}) => {
                    expect(body.author).toEqual('icellusedkars')
                    expect(body.title).toEqual('Eight pug gifs that remind me of mitch')
                    expect(body.article_id).toEqual(3)
                    expect(body.body).toEqual('some gifs')
                    expect(body.topic).toEqual('mitch')
                    expect(body.created_at).toEqual('2020-11-03T09:12:00.000Z')
                    expect(body.votes).toEqual(0)
                    expect(body.article_img_url).toEqual('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
                })
            })
            test('returns the correct article depending on the endpoint that the user inputs', () => {
                return request(app)
                .get('/api/articles/5')
                .then(({body}) => {
                    expect(body.article_id).toEqual(5)
                })
            })
            test('gives a 400 error when a valid but non-existant path is passed in', () => {
                    return request(app)
                    .get('/api/articles/13')
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe('Bad Request')
                    })

            })
         })
         describe('returns with the comments of the article that is passed in', () => {
            test('returns an array of comments for the given ARTICLE_ID, with each comment containing the following properties: COMMENT_ID, VOTES, CREATED_AT, AUTHOR, BODY, ARTICLE_ID', () => {
                return request(app)
                .get('/api/articles/1/comments')
                .then(({body}) => {
                    expect(body[0]).toHaveProperty('comment_id')
                    expect(body[1]).toHaveProperty('votes')
                    expect(body[2]).toHaveProperty('created_at')
                    expect(body[3]).toHaveProperty('author')
                    expect(body[4]).toHaveProperty('body')
                    expect(body[5]).toHaveProperty('article_id')
                })

            })
            test('each comment has the correct ARTICLE_ID', () => {
                return request(app)
                .get('/api/articles/9/comments')
                .then(({body}) => {
                    expect(body[0].article_id).toEqual(9)
                    expect(body[1].article_id).toEqual(9)})
    

            })
            test('returns with the most recent comments first', () => {
                return request(app)
                .get('/api/articles/1/comments')
                .then(({body}) => {
    
                    expect([body[0].created_at, body[1].created_at, body[2].created_at, body[3].created_at ]).toBeSorted({descending:true})
                })
            })
            test('gives a 400 error when a valid but non-existant path is passed in', () => {
                return request(app)
                .get('/api/articles/13/comments')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request')
                })
            
            })
         })
        
 })