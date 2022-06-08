const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');
const fakeAlbumData = require('../src/helpers/fakeAlbums');

describe('read albums', () => {
  let db;
  let albums;

  beforeEach(async () => {
    db = await getDb();
    const albumData = fakeAlbumData();
    await Promise.all([
      db.query('INSERT INTO Albums (name, year) VALUES(?, ?)', [
        albumData.name,
        albumData.year
      ]),
      db.query('INSERT INTO Albums (name, year) VALUES(?, ?)', [
        albumData.name,
        albumData.year
      ]),
      db.query('INSERT INTO Albums (name, year) VALUES(?, ?)', [
        albumData.name,
        albumData.year
      ]),
    ]);

    [albums] = await db.query('SELECT * FROM Albums');
  });

  afterEach(async () => {
    await db.query('DELETE FROM Albums');
    await db.close();
  });

  describe('/artists/:artistId/albums', () => {
    describe('GET', () => {
      it('returns all album records in the database', async () => {
        const {status, body} = await request(app).get('/artists/:artistId/albums').send();

        expect(status).to.equal(200);
        expect(body.length).to.equal(3);

        body.forEach((albumRecord) => {
          const expected = albums.find((a) => a.id === albumRecord.id);

          expect(albumRecord).to.deep.equal(expected);
        });
      });
    });
  });

  describe('/artists/:artistId/albums/:albumId', () => {
    describe('GET', () => {
      it('returns a single album with the correct id', async () => {
        const expected = albums[0];
        const {status, body} = await request(app).get(`/artists/:artistId/albums/${expected.id}`).send();
        
        expect(status).to.equal(200);
        expect(body).to.deep.equal(expected);
      });

      it('returns a 404 if the album is not in the database', async () => {
        const {status} = await request(app).get('/artists/:artistId/albums/999999').send();

        expect(status).to.equal(404);
      });
    });
  });
});