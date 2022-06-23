const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');
const fakeAlbumData = require('../src/helpers/fakeAlbums');

describe('create albums', () => {
  let db;
  let albums;
  beforeEach(async () => {
    db = await getDb();
    [albums] = await db.query('SELECT * FROM Albums');        
  });

  afterEach(async () => {
    await db.query('DELETE FROM Albums');
    await db.close();
  })

  describe('/artists/:artistId/albums', () => {
    describe('POST', () => {
      it('creates a new album in the database', async () => {
        const albumData = fakeAlbumData();
        if(albums[0]) {
          const {status} = await request(app).post('/artists/:artistId/albums').send(albumData);
  
          expect(status).to.equal(201);

          const [[albumsEntries]] = await db.query(
            `SELECT * FROM Albums WHERE name = 'The White Album'`
          );
          
          expect(albumsEntries.name).to.equal(albumData.name);
          expect(albumsEntries.year).to.equal(albumData.year);
        }
      });
    });
  });
});