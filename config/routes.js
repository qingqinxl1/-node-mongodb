var Index = require('../app/controllers/index'),
	Movie = require('../app/controllers/movie'),
	User = require('../app/controllers/user');

module.exports = function(app){
	//pre usersession handle
	app.use(function(req, res, next){
	    var _user = req.session.user;    
	    app.locals.user = _user;

	    next();
	});

	/**
	 * index page(route)
	 */
	app.get('/', Index.index);


	/**
	 * movie page(route)
	 */
	app.get('/detail/:id', Movie.detail);
	app.get('/admin/update/:id', Movie.update);
	app.post('/admin/movie/new', Movie.save);
	app.get('/admin/movie', Movie.create);
	app.get('/admin/list', Movie.list);
	app.delete('/admin/list', Movie.del);

	//user page(route)
	app.post('/user/signup', User.signup);
	app.post('/user/signin', User.signin);
	app.get('/admin/userlist', User.list);
	app.get('/logout', User.logout);
}
