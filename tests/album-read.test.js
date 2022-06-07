const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('read album', () => {
  let db;
  let albums;

  beforeEach(async () => {
    db = await getDb();
    await Promise.all([
      db.query('INSERT INTO Album (name, year) VALUES(?, ?)', [
        'The wind in the willows',
        1970,
      ]),
      db.query('INSERT INTO Album (name, year) VALUES(?, ?)', [
        'The Juliet Letters',
        2010,
      ]),
      db.query('INSERT INTO Album (name, year) VALUES(?, ?)', [
        'Time In',
        1966,
      ]),
    ]);

    [albums] = await db.query('SELECT * FROM Album');
  });

  afterEach(async () => {
    await db.query('DELETE FROM Album');
    await db.close();
  });

  describe('/artist/:artistId/album', () => {
    describe('GET', () => {
      it('returns all album records in the database', async () => {
        const res = await request(app).get('/artist/:artistId/album').send();

        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);

        res.body.forEach((albumRecord) => {
          const expected = albums.find((a) => a.id === albumRecord.id);

          expect(albumRecord).to.deep.equal(expected);
        });
      });
    });
  });

  describe('/artist/:artistId/album/:albumId', () => {
    describe('GET', () => {
      it('returns a single album with the correct id', async () => {
        const expected = albums[0];
        const {status, body} = await request(app).get(`/artist/:artistId/album/${expected.id}`).send();
        
        expect(status).to.equal(200);
        expect(body).to.deep.equal(expected);
      });

      it('returns a 404 if the album is not in the database', async () => {
        const {status} = await request(app).get('/artist/:artistId/album/999999').send();

        expect(status).to.equal(404);
      });
    });
  });
});