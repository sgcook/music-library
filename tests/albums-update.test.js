const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');
const fakeAlbumData = require('../src/helpers/fakeAlbums');

describe('update albums', () => {
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
  })

  describe('/artists/:artistId/albums/:albumId', () => {
    describe('PATCH', () => {
      it('updates a single album with the correct id', async () => {
        const album = albums[0];
        const {status} = await request(app)
          .patch(`/artists/:artistId/albums/${album.id}`)
          .send({name: 'new name', year: 2022 });

        expect(status).to.equal(200);

        const [[newAlbumRecord],] = await db.query('SELECT * FROM Albums WHERE id = ?', [
          album.id]);

        expect(newAlbumRecord.name).to.equal('new name');
        expect(newAlbumRecord.year).to.equal(2022);
      });

      it('returns a 404 if the album is not in the database', async () => {
        const {status} = await request(app)
          .patch('/artists/:artistId/albums/999999')
          .send({name: 'new name'});

        expect(status).to.equal(404);
      })
    })
  })
})