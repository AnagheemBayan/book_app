'use strict';
const PORT = process.env.PORT || 3000;
const express = require('express');
const superagent = require('superagent');
const app = express();
app.use(handleError);
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.post('/searches', bookData);

app.get('/searches/new', (req, res) => {
  res.render('pages/searches/new');
});

function handleError(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('pages/error', {
    error: err
  });
}


function SearchConstructor(data) {
  this.title = data.volumeInfo.title;
  this.author = data.volumeInfo.authors;
  this.description = data.volumeInfo.description;
  this.image = (data.volumeInfo.imageLinks) ? data.volumeInfo.imageLinks.smallThumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
}

function bookData(req, res) {

  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (req.body['search-by'] === 'title') {
    url += `${req.body['name']}`;
  }
   else if (req.body['search-by'] === 'author') {
    url += `${req.body['name']}`;
  }
  superagent.get(url).then(data => {
      return data.body.items.map(element => new SearchConstructor(element));
    })
    .then(results => res.render('pages/searches/show', {
      searchResults: results
    }));

}

app.get('*', (req, res) => {
  res.status(404).send('Page not found');
  console.log('page not found');
});
app.listen(PORT, () => {
  console.log('Listening on ', PORT);
});