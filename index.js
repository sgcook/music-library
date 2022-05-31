const app = require('./src/app.js');

const APP_PORT = 4000;

app.listen(APP_PORT, () => {
  console.log(`App is listening on port ${APP_PORT}`);
});

app.get('/', (req, res) => {
  res.status(200).json('Hello World');
})