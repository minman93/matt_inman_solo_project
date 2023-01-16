const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')

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
    })
    
})
