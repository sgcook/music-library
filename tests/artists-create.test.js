const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');
const fakeArtistData = require('../src/helpers/fakeArtists');

describe('create artists', () => {
  let db;
  beforeEach(async () => (db = await getDb()));

  afterEach(async () => {
    await db.query('DELETE FROM Artists');
    await db.close();
  })

  describe('/artists', () => {
    describe('POST', () => {
      it('creates a new artist in the database', async () => {
        const artistData = fakeArtistData();
        const {status} = await request(app).post('/artists').send(artistData);

        expect(status).to.equal(201);
        
        const [[artistEntries]] = await db.query(
          `SELECT * FROM Artists WHERE name = ?`, [
            artistData.name
          ]
        );

        expect(artistEntries.name).to.equal(artistData.name);
        expect(artistEntries.genre).to.equal(artistData.genre);
      });
    });
  });
});