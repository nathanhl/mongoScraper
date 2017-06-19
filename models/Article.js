var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// creates article schema
var ArticleSchema = new Schema ({
	title: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	note: {
		type: Schema.Types.ObjectId,
		ref: 'Note'
	}
});


var Article = mongoose.model('Article', ArticleSchema);

//exports articles
module.exports = Article;