const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');
const fakeAlbumData = require('../src/helpers/fakeAlbums');

describe('delete album', () => {
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

  describe('/artists/:artistId/albums/:albumId', () => {
    describe('DELETE', () => {
      it('deletes a single album with the correct id', async () => {
        const album = albums[0];
        const {status} = await request(app).delete(`/artists/:artistId/albums/${album.id}`).send();

        expect(status).to.equal(200);

        const [[deletedAlbumRecord],] = await db.query('SELECT * FROM Albums WHERE id = ?', [album.id]);

        expect(!!deletedAlbumRecord).to.be.false;
      });

      it('returns a 404 if the album is not in the database', async () => {
        const {status} = await request(app).delete('/artists/:artistId/albums/999999').send();

        expect(status).to.equal(404);
      });
    });
  });
});