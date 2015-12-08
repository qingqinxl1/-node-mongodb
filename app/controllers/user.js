var User = require('../models/user');

//signup
exports.signup = function(req, res){
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
                }else{
                    console.log('password is not matched');
                }
                res.redirect('/');
            });
        }else{
            res.redirect('/');
        }
    });
    
}

//logout
exports.logout = function(req, res){
    delete req.session.user;
    // delete app.locals.user;
    res.redirect('/');
}
