const { faker } = require ('@faker-js/faker');

const fakeArtistData = (name, genre) => {
  return {
    name:name || faker.name.findName(),
    genre:genre || faker.music.genre()
  }
}

module.exports = fakeArtistData;