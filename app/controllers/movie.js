var Movie = require('../models/movie');
var Comment = require('../models/comment');
var _ = require('underscore');

/**
 * detail page(route)
 */
exports.detail = function (req, res) {
    var id = req.params.id;
    Movie.findById(id, function (err, movie) {
        Comment.find({movie: id})
            .populate('from', 'name')
            .populate('reply.from reply.to', 'name')
            .exec(function(err, comments){
                console.log(comments);
                if (err) {
                    console.log(err);
                }
                console.log(comments);
                res.render('detail', {
                    title: 'imooc ' + movie.title,
                    movie: movie,
                    comments: comments
                });
            });
    });
}

//admin update
exports.update = function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.render('admin', {
                title: 'imooc 后台更新页',
                movie: movie
            })
        });
    }
}

//admin post movie
exports.save = function (req, res) {
    console.log(req.body);
    var movieObj = req.body.movie,
        id = movieObj._id,
        _movie;
    console.log(id);
    if (id !== 'undefined' && id !== undefined && id !== null) {
        console.log('update movie');
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/detail/' + movie._id);
            })
        })
    } else {
        console.log('save new movie');
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            language: movieObj.language,
            country: movieObj.country,
            summary: movieObj.summary,
            flash: movieObj.flash,
            year: movieObj.year,
            poster: movieObj.poster
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/detail/' + movie._id);
        });
    }
}

/**
 * admin page(route)
 */
exports.create = function (req, res) {
    res.render('admin', {
        title: 'admin 后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            language: '',
            poster: '',
            flash: '',
            year: '',
            summary: ''
        }
    });
}

/**
 * list page(route)
 */
exports.list = function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        })
    });
}

/**
* list delete movie
*/
exports.del = function(req, res){
    var id = req.query.id;
    if(id){
        Movie.remove({_id: id}, function(err){
            if(err){
                console.log(err);
            } else {
                res.json({success: 1});
            } 
        })
    }
}