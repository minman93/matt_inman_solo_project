const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const sorted = require('jest-sorted');


beforeEach(()=> seed(testData));

afterAll(() => db.end())

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
            test('gives a 404 error when a valid but non-existant path is passed in', () => {
                    return request(app)
                    .get('/api/articles/13')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toBe('Path not found')
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
                test('gives a 404 error when a valid but non-existent path is passed in', () => {
                    return request(app)
                    .get('/api/articles/13/comments')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toBe('Path not found')
                    })
                
                })
             })
             describe('patches an article with an updated vote count and returns an object containing the new vote count', () => {
            test('should respond with a 201 status', () => { const newVotes = {inc_votes: 1}
                return request(app)
                .patch('/api/articles/4')
                .expect(201).send(newVotes)
            })
            test('should update the article with a new vote count and return the new vote count', () => {
                const newVotes = {inc_votes: 30}
                return request(app)
                .patch('/api/articles/5')
                .expect(201).send(newVotes)
                .then(({body}) => {
                    expect(body).toEqual({
                        article_id: 5,
                        title: 'UNCOVERED: catspiracy to bring down democracy',
                        topic: 'cats',
                        author: 'rogersop',
                        body: 'Bastet walks amongst us, and the cats are taking arms!',
                        created_at: "2020-08-03T13:14:00.000Z",
                        article_img_url:
                          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                          votes:30
                      })
                })
                
            })
            test('vote count patch works with a negative number', () => {
                const newVotes = {inc_votes: -5}
                return request(app)
                .patch('/api/articles/1')
                .expect(201).send(newVotes)
                .then(({body}) => {
                    expect(body).toEqual({
                        article_id: 1,  
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: "2020-07-09T20:11:00.000Z",
                        votes: 95,
                        article_img_url:
      'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'})
                
                })
            })



             })
    

        })
        describe('posts comments relating to an article (depending on the ARTICLE_ID that is passed in', () => {
            test('should respond with a 201 status', () => {
                const comment = {
                    'author' :'rogersop',
                    'body':'This is the single best article ever written in human history!'
                 }
                return request(app)
                .post('/api/articles/3/comments').send(comment)
                .expect(201)
            })
            test('adds a comment with the correct username and body and returns an object with the correct information', ()=> {
                const comment = {
                    'author' :'rogersop',
                    'body':'This article SUCKS!'
            }
                return request(app)
                .post('/api/articles/4/comments').send(comment)
                .then((response) => {
                   
                    const addedComment = response.body.commentData
                    expect(addedComment.comment_id).toEqual(19)
                    expect(addedComment.author).toEqual('rogersop')
                    expect(addedComment.body).toEqual('This article SUCKS!')
                })

            })
            test('if an attempt is made to post comments to an article that does not exist, respond with an error', () => {
                const comment = {'author': 'rogersop', 'body': 'This article SUCKS!'};

                return request(app)
                .post('/api/articles/54/comments').send(comment)
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toEqual('Not found')

                })
            })
            test('returns an error when an object with invalid keys is passed in', () => {
                const comment = {'writer': 'rogersop', 'comment': 'This article SUCKS!'};

                return request(app)
                .post('/api/articles/5/comments').send(comment)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toEqual('Bad Request')
                
            })

            })
            test('returns an error when an object with invalid values is passed in', () => {
                const comment = {'author': 'invalidUser', 'comment': ['invalid comment']};

                return request(app)
                .post('/api/articles/5/comments').send(comment)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toEqual('Bad Request')
                
            })
        })
    })
    describe('returns all users with a GET users request', ()=> {
        test('returns an array of user objects, each containing the following properties: USERNAME, NAME, AVATAR_URL ',() => {
            return request(app)
            .get('/api/users')
            .then(({body}) => {
                expect(body.users[0]).toHaveProperty('username')
                expect(body.users[1]).toHaveProperty('name')
                expect(body.users[2]).toHaveProperty('avatar_url')
                expect(Array.isArray(body.users))
            })
        })
    })


    describe('GET articles should be able to get articles with a specified TOPIC, be able to SORT_BY any column, and be able to be in ascending or descending ORDER', () => {
        test('should filter the articles by the topic value specified in the query', ()=> {
            return request(app)
            .get('/api/articles?topic=mitch')
            .then(({body}) => {
                for (let i = 0; i < body.articles.length; i++){
                    expect(body.articles[i].topic).toEqual('mitch')
                }
            })
        })
        test('should allow a user to sort by any valid column', () => {
            return request(app)
            .get('/api/articles?sortBy=votes')
            .then(({body}) => {
                expect([body.articles[0], body.articles[1], body.articles[2], body.articles[3], body.articles[4], body.articles[5], body.articles[6], body.articles[7], body.articles[8], body.articles[9], body.articles[10], body.articles[11]]).toBeSorted({descending: true})
             })
        })
        test('should allow a user to order articles by date(the default value) in ascending or descending order', () => {
            return request(app)
            .get('/api/articles?order=asc')
            .then(({body}) => {
                expect([body.articles[0], body.articles[1], body.articles[2], body.articles[3], body.articles[4], body.articles[5], body.articles[6], body.articles[7], body.articles[8], body.articles[9], body.articles[10], body.articles[11]]).toBeSorted()

            })
        })
        test('should return an error when an invalid sortBy query is passed in', () => {
            return request(app)
            .get('/api/articles?sortBy=articlewords')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual('Bad Request')
        })
        
    })
    test('should return an error when an invalid order query is passed in', () => {
        return request(app)
        .get('/api/articles?order=uptodown')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual('Bad Request')
        })
    })
 })

