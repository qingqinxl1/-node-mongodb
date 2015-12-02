var express = require('express');
var port = process.env.PORT || 3000;
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var User = require('./models/user');
var bodyParser = require('body-parser');
var app = express();

mongoose.connect('mongodb://127.0.0.1/imooc');

app.set('views', './views/pages');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); //配置静态文件目录.

app.locals.moment = require('moment');

app.listen(port);
console.log('imooc started on ' + port);

/**
 * index page(route)
 */
app.get('/', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: 'index 首页',
            movies: movies
        })
    });
});


/**
 * detail page(route)
 */
app.get('/detail/:id', function (req, res) {
    var id = req.params.id;
    Movie.findById(id, function (err, movie) {
        if (err) {
            console.log(err);
        }
        res.render('detail', {
            title: 'imooc ' + movie.title,
            movie: movie
        });
    });
});

//admin update
app.get('/admin/update/:id', function (req, res) {
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
});

//admin post movie
app.post('/admin/movie/new', function (req, res) {
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
                res.redirect('/detail/' + movie._id);
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
            res.redirect('/detail/' + movie._id);
        });
    }
});

/**
 * admin page(route)
 */
app.get('/admin/movie', function (req, res) {
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
});

/**
 * list page(route)
 */
app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        })
    });
});

/**
* list delete movie
*/
app.delete('/admin/list', function(req, res){
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
});

//signup
app.post('/user/signup', function(req, res){
    var _user = req.body.user;

    //用户名要求唯一，先根据用户输入的用户名去数据库里查找若存在该用户，则不再添加.
    User.find({name: _user.name}, function(err, user){
        if(err) console.log(err);
        
        if(user && user.length){
            return res.redirect('/');
        }else{
            var user = new User(_user);
            user.save(function(err, user){
                if(err) console.log(err);
                return res.redirect('/admin/userlist');
            });
        }
    });  
});

//userlist
app.get('/admin/userlist', function(req, res){
    User.fetch(function (err, users) {
        if (err) {
            console.log(err);
        }
        res.render('userlist', {
            title: 'imooc 用户列表页',
            users: users
        })
    })

});

//signin
app.post('/user/signin', function(req, res){
    console.log('welcome to signin');
    var _user = req.body.user,
        name = _user.name,
        password = _user.password;

    // console.log(_user);

    User.findOne({name: name}, function(err, user){
        // console.log(user);
        if(err) {
            console.log(err);
        }
        if(user){
            user.comparePassword(password, function(err, isMatch){
                if (err) {
                    console.log(err);
                }

                if(isMatch){
                    console.log('signin success');
                    res.redirect('/admin/userlist');
                }else{
                    console.log('password is not matched');
                    res.redirect('/');
                }
            });
        }else{
            res.redirect('/');
        }
    });
    
});