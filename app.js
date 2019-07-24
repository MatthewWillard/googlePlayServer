const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(morgan('common')); // let's see what 'common' format looks like

const googleplay = require('./playstore-data.js');

app.get('/googleplay', (req, res) => {
    const { search = "", sort, genres } = req.query;
    const options = {
        sort: ['Ratings', 'App'],
        genres: ['Action', 'Puzzle', 'Strategy', 'Casuel', 'Arcade', 'Card']
    };
    
    if (sort)
    if (!options.sort.includes(sort))
        res.status(400).send(`Sort must be one of ${options.sort.join(' or ')}`);
if (genres)
    if (!options.genres.includes(genres))
        res
            .status(400)
            .send(`Genres must be one of ${options.genres.join(', ')}`);

let results = googleplay.filter(app =>
    app.App.toLowerCase().includes(search.toLowerCase())
);

if (sort === 'App') {
    results.sort((a, b) => {
        return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
}

if (sort === 'Rating') {
    results.sort((a, b) => {
        return a[sort] < b[sort] ? 1 : a[sort] > b[sort] ? -1 : 0;
    });
}

if (genres) {
    results = results.filter(app => app.Genres.includes(genres));
}

res.json(results);
});

module.exports = app;