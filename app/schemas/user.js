var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//mongoose.connect('mongodb://127.0.0.1/imooc');
var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

UserSchema.pre('save', function(next){
	var user = this;

	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if (err) {
			return next(err);
		}else{
			bcrypt.hash(user.password, salt, function(err, hash){
				if (err) return next(err);

				user.password = hash;
				next();
			});
		}
	});

	// next();
});

//用户密码校验.
UserSchema.methods = {
	comparePassword: function(_password, cb){
		// console.log(this.password);
		bcrypt.compare(_password, this.password, function(err, isMatch){
			if(err) console.log(err);
			cb(null, isMatch);
		});
	}
};

UserSchema.statics = {
	fetch: function(cb){
		return this.find({})
				.sort('meta.updateAt')
				.exec(cb);
	},
	findById: function(id, cb){
		return this.findOne({'_id': id})
				.exec(cb);
	}
};

module.exports = UserSchema;


