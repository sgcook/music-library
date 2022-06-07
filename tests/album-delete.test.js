const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('delete album', () => {
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

  describe('/artist/:artistId/album/:albumId', () => {
    describe('DELETE', () => {
      it('deletes a single album with the correct id', async () => {
        const album = albums[0];
        const {status} = await request(app).delete(`/artist/:artistId/album/${album.id}`).send();

        expect(status).to.equal(200);

        const [[deletedAlbumRecord],] = await db.query('SELECT * FROM Album WHERE id = ?', [album.id]);

        expect(!!deletedAlbumRecord).to.be.false;
      });

      it('returns a 404 if the album is not in the database', async () => {
        const {status} = await request(app).delete('/artist/:artistId/album/999999').send();

        expect(status).to.equal(404);
      });
    });
  });
});