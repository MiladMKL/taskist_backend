const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

console.log("connecting to", url)

mongoose
	.connect(url)
	.then((result) => {
		console.log("connected to MongoDB")
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message)
	})

const taskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	date: Date,
	completed: Boolean,
})

// delete _v (mongo versioning field) variable from this collection
taskSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model("Task", taskSchema)
