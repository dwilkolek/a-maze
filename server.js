const express = require('express');
var path = require('path');

const app = express();
const port = 3000

app.get('/', (request, response) => {
  response.sendFile('dist/index.html', { root: path.join(__dirname, '') })
})
app.use('/js', express.static(path.join(__dirname + '/dist/js')));
app.use('/assets', express.static(path.join(__dirname + '/dist/assets')));

app.use((err, request, response, next) => {
  console.log(err)
  response.status(500).send('Something broke!')
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})