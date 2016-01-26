var User = require('../models/user');

//signup page
exports.signuppage = function(req, res){
    res.render('signup', {
        title: '用户注册页'
    });
}

//signin page
exports.signinpage = function(req, res){
    res.render('signin', {
        title: '用户登录页'
    });
}

//signup
exports.signup = function(req, res){
    var _user = req.body.user;

    //用户名要求唯一，先根据用户输入的用户名去数据库里查找若存在该用户，则不再添加.
    User.find({name: _user.name}, function(err, user){
        if(err) console.log(err);
        
        if(user && user.length){
            return res.redirect('/signin');
        }else{
            var user = new User(_user);
            user.save(function(err, user){
                if(err) console.log(err);
                return res.redirect('/');
            });
        }
    });  
}

//userlist
exports.list = function(req, res){ 
    User.fetch(function (err, users) {
        if (err) {
            console.log(err);
        }
        res.render('userlist', {
            title: 'imooc 用户列表页',
            users: users
        })
    })

}

//signin
exports.signin = function(req, res){
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
                    req.session.user = user;
                    res.redirect('/');
                }else{
                    console.log('password is not matched');
                    res.redirect('/signin');
                }
            });
        }else{
            res.redirect('/signup');
        }
    });
    
}

//logout
exports.logout = function(req, res){
    delete req.session.user;
    // delete app.locals.user;
    res.redirect('/');
}

//user middle module
//need signin
exports.signinRequired = function(req, res, next){
    var _user = req.session.user;
    if(!_user){
        return res.redirect('/signin');
    }
    next();
}

//need admin authorization
exports.adminRequired = function(req, res, next){
    var _user = req.session.user;
    if(_user.role < 2){
        return res.redirect('/unauthorized');
    }
    next();
}

//Unauthorized page
exports.unauthorized = function(req, res){
    res.render('unauthorized', {
        title: '未经授权'
    });
}