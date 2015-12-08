var mongoose = require('mongoose');
//mongoose.connect('mongodb://127.0.0.1/imooc');
var MovieSchema = new mongoose.Schema({
	doctor: String,
	title: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	year: String,
	poster: String,
	meta: {
		createAt:{
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

MovieSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

MovieSchema.statics = {
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

module.exports = MovieSchema;


