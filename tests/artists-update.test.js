const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');
const fakeArtistData = require('../src/helpers/fakeArtists');

describe('update artists', () => {
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

    [artists] = await db.query('SELECT * FROM Artists');
  });

  afterEach(async () => {
    await db.query('DELETE FROM Artists');
    await db.close();
  });

  describe('/artists/:artistId', () => {
    describe('PATCH', () => {
      it('updates a single artist with the correct id', async () => {
        const artist = artists[0];
        const {status} = await request(app)
          .patch(`/artists/${artist.id}`)
          .send({ name: 'new name', genre: 'new genre' });

        expect(status).to.equal(200);

        const [[newArtistRecord],
          ] = await db.query('SELECT * FROM Artists WHERE id = ?', [artist.id]);

        expect(newArtistRecord.name).to.equal('new name');
      });

      it('returns a 404 if the artist is not in the database', async () => {
        const {status} = await request(app)
          .patch('/artists/999999')
          .send({ name: 'new name'});

          expect(status).to.equal(404);
      });
    });
  });
});