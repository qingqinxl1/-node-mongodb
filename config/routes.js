var Index = require('../app/controllers/index'),
	Movie = require('../app/controllers/movie'),
	User = require('../app/controllers/user'),
	Comment = require('../app/controllers/comment');

module.exports = function(app){
	//pre usersession handle
	app.use(function(req, res, next){
	    var _user = req.session.user;    
	    app.locals.user = _user;

	    next();
	});

	//index page(route)
	app.get('/', Index.index);


	//movie page(route)
	app.get('/movie/detail/:id', Movie.detail);
	app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired,  Movie.update);
	app.post('/admin/movie/new', User.signinRequired, User.adminRequired,  Movie.save);
	app.get('/admin/movie', User.signinRequired, User.adminRequired,  Movie.create);
	app.get('/admin/movie/list', User.signinRequired, User.adminRequired,  Movie.list);
	app.delete('/admin/movie/list', User.signinRequired, User.adminRequired,  Movie.del);

	//user page(route)
	app.post('/user/signup', User.signup);
	app.post('/user/signin', User.signin);
	app.get('/admin/userlist', User.signinRequired, User.adminRequired, User.list);
	app.get('/logout', User.logout);
	app.get('/signup', User.signuppage);
	app.get('/signin', User.signinpage);
	app.get('/unauthorized', User.unauthorized);

	//comment
	app.post('/user/comment', User.signinRequired, Comment.save);
}
