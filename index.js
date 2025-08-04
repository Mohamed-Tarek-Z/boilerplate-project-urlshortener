require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const validUrl = require('valid-url');

// Basic Configuration
const port = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});




let urlDatabase = {};
let idCounter = 1;


app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  if (!validUrl.isWebUri(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const shortId = idCounter++;
  urlDatabase[shortId] = originalUrl;

  res.json({
    original_url: originalUrl,
    short_url: shortId
  });
});


app.get('/api/shorturl/:short_url', (req, res) => {
  const shortId = req.params.short_url;
  const originalUrl = urlDatabase[shortId];

  if (originalUrl) {
    return res.redirect(originalUrl);
  } else {
    return res.json({ error: 'No short URL found for given input' });
  }
});



app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
