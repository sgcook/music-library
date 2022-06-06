const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('create album', () => {
  let db;
  beforeEach(async () => (db = await getDb()));

  afterEach(async () => {
    await db.query('DELETE FROM Album');
    await db.close();
  })

  describe('/album', () => {
    describe('POST', () => {
      it('creates a new album in the database', async () => {
        const res = await request(app).post('/album').send({
          name: 'The White Album',
          year: 1968
        });

        expect(res.status).to.equal(201);

        const [[albumEntries]] = await db.query(
          `SELECT * FROM Album WHERE name = 'The White Album'`
        );

        expect(albumEntries.name).to.equal('The White Album');
        expect(albumEntries.year).to.equal(1968);
      });
    });
  });
});