const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	date: Date,
	completed: Boolean,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
})

// delete _v (mongo versioning field) variable from this collection
taskSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model('Task', taskSchema)
