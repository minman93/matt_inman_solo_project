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
    describe.only('returns all articles with a GET articles request', () => {
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
        

     })
