process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const chai = require('chai');
const expect = chai.expect;

describe('Books API', function() {
  it('GET /books - should fetch all books', async function() {
    const res = await request(app).get('/books');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /books - should create a new book', async function() {
    const newBook = {
      isbn: "1234567890",
      amazon_url: "http://a.co/example",
      author: "Author Name",
      language: "english",
      pages: 100,
      publisher: "Test Publisher",
      title: "Test Title",
      year: 2021
    };
    const res = await request(app).post('/books').send(newBook);
    expect(res.status).to.equal(201);
    expect(res.body).to.include(newBook);
  });

  it('GET /books/:isbn - should fetch a book by ISBN', async function() {
    const res = await request(app).get('/books/1234567890');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.isbn).to.equal('1234567890');
  });

  it('PUT /books/:isbn - should update a book', async function() {
    const update = { title: "Updated Title" };
    const res = await request(app).put('/books/1234567890').send(update);
    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal("Updated Title");
  });

  it('DELETE /books/:isbn - should delete a book', async function() {
    const res = await request(app).delete('/books/1234567890');
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Book deleted");
  });

  it('POST /books - should fail validation for invalid data', async function() {
    const invalidBook = {
      isbn: "invalid",
      amazon_url: "not-a-url",
      author: "Author",
      language: "english",
      pages: -100,
      publisher: "Publisher",
      title: "Title",
      year: 2021
    };
    const res = await request(app).post('/books').send(invalidBook);
    expect(res.status).to.equal(400);
    expect(res.body.errors).to.be.an('array');
  });
});
