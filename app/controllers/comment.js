var Comment = require('../models/comment');
var _ = require('underscore');

//post comment
exports.save = function(req, res) {
    var _comment = req.body.comment,
        movieId = _comment.movie;

    //判断是否是回复.
    if (_comment.cid) {
        Comment.findById(_comment.cid, function(err, comment) {
            if (err) {
                console.log(err);
            }
            var reply = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content
            };
            comment.reply.push(reply);

            comment.save(function(err, comment) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/detail/' + movieId);
            });
        })
    } else {
        var comment = new Comment(_comment);

        comment.save(function(err, comment) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/detail/' + movieId);
        });
    }

}