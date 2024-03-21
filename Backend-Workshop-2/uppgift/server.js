const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
const port = 8000;

mongoose.connect('mongodb://127.0.0.1:27017/my-movies')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'layout',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

const movieSchema = new mongoose.Schema({
  title: String
});

const Movie = mongoose.model('Movie', movieSchema);

app.post('/my-movies', (req, res) => {
    const newMovie = new Movie({ title: req.body.title });
    newMovie.save()
      .then(() => res.redirect('/my-movies'))
      .catch(err => console.error(err));
  });

app.get('/my-movies', (req, res) => {
    Movie.find()
      .then(movies => res.render('movies', { movies }))
      .catch(err => console.error(err));
  });

app.put('/my-movies/:id', (req, res) => {
  Movie.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true })
    .then(() => res.redirect('/my-movies'))
    .catch(err => console.error(err));
});

app.delete('/my-movies/:id', (req, res) => {
  Movie.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/my-movies'))
    .catch(err => console.error(err));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});