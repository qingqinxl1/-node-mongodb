var Movie = require('../models/movie');
/**
 * index page(route)
 */
exports.index = function(req, res) {

    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: 'index 首页',
            movies: movies
        })
    });
}