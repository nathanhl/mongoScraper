var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creates note schema
var NoteSchema = new Schema ({

	title: {
		type: String
	},
	body: {
		type: String
	}
});

var Note = mongoose.model('Note', NoteSchema);

//export notes
module.exports = Note;