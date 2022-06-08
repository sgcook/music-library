const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');
const fakeArtistData = require('../src/helpers/fakeArtists');

describe('read artists', () => {
  let db;
  let artists;

  beforeEach(async () => {
    db = await getDb();
    const artistData = fakeArtistData();
    await Promise.all([
      db.query('INSERT INTO Artists (name, genre) VALUES(?, ?)', [
        artistData.name,
        artistData.genre
      ]),
      db.query('INSERT INTO Artists (name, genre) VALUES(?, ?)', [
        artistData.name,
        artistData.genre
      ]),
      db.query('INSERT INTO Artists (name, genre) VALUES(?, ?)', [
        artistData.name,
        artistData.genre
      ]),
    ]);

    [artists] = await db.query('SELECT * from Artists');
  });

  afterEach(async () => {
    await db.query('DELETE FROM Artists');
    await db.close();
  });

  describe('/artists', () => {
    describe('GET', () => {
      it('returns all artist records in the database', async () => {
        const {status, body} = await request(app).get('/artists').send();

        expect(status).to.equal(200);
        expect(body.length).to.equal(3);

        body.forEach((artistRecord) => {
          const expected = artists.find((a) => a.id === artistRecord.id);

          expect(artistRecord).to.deep.equal(expected);
        });
      });
    });
  });
  
  describe('/artists/:artistId', () => {
    describe('GET', () => {
      it('returns a single artist with the correct id', async () => {
        const expected = artists[0];
        const {status, body} = await request(app).get(`/artists/${expected.id}`).send();

        expect(status).to.equal(200);
        expect(body).to.deep.equal(expected);
      });

      it('returns a 404 if the artist is not in the database', async () => {
        const {status} = await request(app).get('/artists/999999').send();

        expect(status).to.equal(404);
      });
    });
  });
});