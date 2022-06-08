const { faker } = require ('@faker-js/faker');

const fakeAlbumData = (name, year) => {
  return {
    name:name || faker.lorem.words(2),
    year:year || faker.datatype.number({min: 1950, max: 2022})

  }
}

console.log(fakeAlbumData());

module.exports = fakeAlbumData;