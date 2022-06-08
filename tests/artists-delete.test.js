const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');
const fakeArtistData = require('../src/helpers/fakeArtists');

describe('delete artists', () => {
  let db;
  let artists;

  beforeEach(async () => {
    db = await getDb();
    const artistData = fakeArtistData();
    await Promise.all([
      db.query('INSERT INTO Artists (name, genre) VALUES(?, ?)', [
        artistData.name,
        artistData.genre
      ] ),
      db.query('INSERT INTO Artists (name, genre) VALUES(?, ?)', [
        artistData.name,
        artistData.genre
      ]),
      db.query('INSERT INTO Artists (name, genre) VALUES(?, ?)', [
        artistData.name,
        artistData.genre
      ]),
    ]);

    [artists] = await db.query('SELECT * FROM Artists');
  });

  afterEach(async () => {
    await db.query('DELETE FROM Artists');
    await db.close();
  });

  describe('/artists/:artistId', () => {
    describe('DELETE', () => {
      it('deletes a single artist with the correct id', async () => {
        const artist = artists[0];
        const {status} = await request(app).delete(`/artists/${artist.id}`).send();

        expect(status).to.equal(200);

        const [[deletedArtistRecord], ] = await db.query('SELECT * FROM Artists WHERE id = ?', [artist.id]);

        expect(!!deletedArtistRecord).to.be.false;
      });

      it('returns a 404 if the artist is not in the database', async () => {
        const {status} = await request(app).delete('/artists/999999').send();

        expect(status).to.equal(404);
      });
    });
  });
});