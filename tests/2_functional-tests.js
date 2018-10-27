/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
    test('#example Test GET /api/books', function(done) {
        chai.request(server)
            .post('/api/books')
            .send({ title: 'The Brothers Karamazov' })
            .end((err, parRes) => {
                chai.request(server)
                    .get('/api/books')
                    .end(function(err, res) {
                        assert.equal(res.status, 200);
                        assert.isArray(res.body, 'response should be an array');
                        assert.property(
                            res.body[0],
                            'commentcount',
                            'Books in array should contain commentcount'
                        );
                        assert.property(
                            res.body[0],
                            'title',
                            'Books in array should contain title'
                        );
                        assert.property(res.body[0], '_id', 'Books in array should contain _id');
                        chai.request(server)
                            .delete(`/api/books/${parRes.body._id}`)
                            .end((err, childRes) => console.log(`Record deleted`));
                        done();
                    });
            });
    });
    /*
  * ----[END of EXAMPLE TEST]----
  */

    suite('Routing tests', function() {
        suite('POST /api/books with title => create book object/expect book object', function() {
            test('Test POST /api/books with title', function(done) {
                chai.request(server)
                    .post('/api/books')
                    .send({ title: 'The Stand' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.title, 'The Stand');
                        assert.isArray(res.body.comments, 'Comments should be an Array');
                        assert.property(res.body, 'comments', 'Book should contain comments array');
                        assert.property(
                            res.body,
                            'commentcount',
                            'Book should contain commentcount'
                        );
                        assert.property(res.body, 'title');
                        assert.property(res.body, '_id');
                        chai.request(server)
                            .delete(`/api/books/${res.body._id}`)
                            .end((err, childRes) => console.log(`Record deleted`));
                        done();
                    });
            });

            test('Test POST /api/books with no title given', function(done) {
                chai.request(server)
                    .post('/api/books')
                    .send()
                    .end((err, res) => {
                        assert.equal(res.status, 400);
                        assert.equal(res.text, 'You must enter a title');
                        done();
                    });
            });
        });

        suite('GET /api/books => array of books', function() {
            test('Test GET /api/books', function(done) {
                chai.request(server)
                    .post('/api/books')
                    .send({ title: 'The Brothers Karamazov' })
                    .end((err, parRes) => {
                        chai.request(server)
                            .get('/api/books')
                            .end(function(err, res) {
                                assert.equal(res.status, 200);
                                assert.isArray(res.body, 'response should be an array');
                                assert.property(
                                    res.body[0],
                                    'comments',
                                    'Books in array should contain comments property'
                                );
                                assert.property(
                                    res.body[0],
                                    'commentcount',
                                    'Books in array should contain commentcount'
                                );
                                assert.property(
                                    res.body[0],
                                    'title',
                                    'Books in array should contain title'
                                );
                                assert.property(
                                    res.body[0],
                                    '_id',
                                    'Books in array should contain _id'
                                );
                                chai.request(server)
                                    .delete(`/api/books/${parRes.body._id}`)
                                    .end((err, childRes) => console.log(`Record deleted`));
                                done();
                            });
                    });
            });
        });

        suite('GET /api/books/[id] => book object with [id]', function() {
            test('Test GET /api/books/[id] with id not in db', function(done) {
                chai.request(server)
                    .get('/api/books/anivalidid')
                    .end(function(err, res) {
                        assert.equal(res.text, 'no book exists');
                        done();
                    });
            });

            test('Test GET /api/books/[id] with valid id in db', function(done) {
                chai.request(server)
                    .post('/api/books')
                    .send({ title: 'The Brothers Karamazov' })
                    .end((err, parRes) => {
                        chai.request(server)
                            .get(`/api/books/${parRes.body._id}`)
                            .end(function(err, res) {
                                assert.equal(res.status, 200);
                                assert.property(
                                    res.body,
                                    'commentcount',
                                    'Books in array should contain commentcount'
                                );
                                assert.property(
                                    res.body,
                                    'title',
                                    'Books in array should contain title'
                                );
                                assert.property(
                                    res.body,
                                    '_id',
                                    'Books in array should contain _id'
                                );
                                assert.equal(res.body.title, 'The Brothers Karamazov');
                                assert.equal(res.body._id, parRes.body._id);
                                assert.isArray(res.body.comments, 'Comments should be an Array');
                                chai.request(server)
                                    .delete(`/api/books/${parRes.body._id}`)
                                    .end((err, childRes) => console.log(`Record deleted`));
                                done();
                            });
                    });
            });
        });

        suite('POST /api/books/[id] => add comment/expect book object with id', function() {
            let ipsum = `Seven hundred twelve counts of extortion. Eight hundred and forty-nine counts of racketeering. Two hundred and forty-six counts of fraud. 
                  Eighty-seven counts of conspiracy murder.Five hundred and twenty-seven counts of obstruction of justice. How do the defendants plead?`;

            test('Test POST /api/books/[id] with comment', function(done) {
                chai.request(server)
                    .post('/api/books')
                    .send({ title: 'The Stand' })
                    .end((err, parRes) => {
                        chai.request(server)
                            .post(`/api/books/${parRes.body._id}`)
                            .send({ comment: ipsum })
                            .end((err, res) => {
                                assert.equal(res.status, 200);
                                assert.equal(res.body.title, 'The Stand');
                                assert.property(
                                    res.body,
                                    'comments',
                                    'Book should contain comments array'
                                );
                                assert.property(
                                    res.body,
                                    'commentcount',
                                    'Book should contain commentcount'
                                );
                                assert.property(res.body, 'title');
                                assert.property(res.body, '_id');
                                assert.equal(res.body.comments[0], ipsum);
                                assert.equal(res.body.commentcount, 1);
                                assert.equal(res.body.title, 'The Stand');
                                assert.isArray(res.body.comments, 'Comments should be an Array');
                                chai.request(server)
                                    .delete(`/api/books/${parRes.body._id}`)
                                    .end((err, childRes) => console.log(`Record deleted`));
                                done();
                            });
                    });
            });
        });
    });
});
