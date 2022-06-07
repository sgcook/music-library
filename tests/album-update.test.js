const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('update album', () => {
  let db;
  let artists;

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
  })

  describe('/artist/:artistId/album/:albumId', () => {
    describe('PATCH', () => {
      it('updates a single album with the correct id', async () => {
        const album = albums[0];
        const {status} = await request(app)
          .patch(`/artist/:artistId/album/${album.id}`)
          .send({name: 'new name', year: 2022 });

        expect(status).to.equal(200);

        const [[newAlbumRecord],] = await db.query('SELECT * FROM Album WHERE id = ?', [
          album.id]);

        expect(newAlbumRecord.name).to.equal('new name');
        expect(newAlbumRecord.year).to.equal(2022);
      });

      it('returns a 404 if the album is not in the database', async () => {
        const {status} = await request(app)
          .patch('/artist/:artistId/album/999999')
          .send({name: 'new name'});

        expect(status).to.equal(404);
      })
    })
  })
})