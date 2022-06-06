const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('create album', () => {
  let db;
  let artists;
  beforeEach(async () => {
    db = await getDb();
    [artists] = await db.query('SELECT * FROM Artist');        
  });

  afterEach(async () => {
    await db.query('DELETE FROM Album');
    await db.close();
  })

  describe('/artist/:artistId/album', () => {
    describe('POST', () => {
      it('creates a new album in the database', async () => {
        if(artists[0]) {
          const res = await request(app).post('/artist/:artistId/album').send({
            name: 'The White Album',
            year: 1968,
          });
  
          expect(res.status).to.equal(201);

          const [[albumEntries]] = await db.query(
            `SELECT * FROM Album WHERE name = 'The White Album'`
          );
          expect(albumEntries.name).to.equal('The White Album');
          expect(albumEntries.year).to.equal(1968);
        }
      });
    });
  });
});