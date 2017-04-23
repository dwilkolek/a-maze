const express = require('express');
var path = require('path');

const app = express();
const port = 3000

app.get('/', (request, response) => {
  response.sendFile('assets/client.html', { root: path.join(__dirname, '') })
})
app.get('/app.js', (request, response) => {
  response.sendFile('client/app.js', { root: path.join(__dirname, '') })
})
app.use('/libs', express.static(path.join(__dirname + '/libs')));
app.use('/assets', express.static(path.join(__dirname + '/assets')));

// app.use('assets/map', express.static('./assets/map'));

app.use((err, request, response, next) => {
  // log the error, for now just console.log
  console.log(err)
  response.status(500).send('Something broke!' + err)
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})