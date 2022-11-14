const tasksRouter = require('express').Router()
const Task = require('../models/task')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/* Helper Functions
 * -------------------------------- */
// Isolates the token from the authorization header
const getTokenFrom = (request) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7)
	}
	return null
}
/* Routes
 * -------------------------------- */
// Kein /api/notes nötig da es in app.js mitgegeben wird!
tasksRouter.get('/', async (request, response) => {
	const tasks = await Task.find({}).populate('user', { username: 1, name: 1 })

	response.json(tasks)

	// Task.find({}).then((tasks) => {
	// 	response.json(tasks)
	// })
})

tasksRouter.get('/:id', (request, response, next) => {
	Task.findById(request.params.id)
		.then((task) => {
			if (task) {
				response.json(task)
			} else {
				response.status(404).end()
			}
		})
		.catch((error) => {
			next(error)
		})
})

tasksRouter.post('/', async (request, response, next) => {
	const body = request.body
	const token = getTokenFrom(request)
	const decodedToken = jwt.verify(token, process.env.SECRET)
	if (!decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}
	const user = await User.findById(decodedToken.id)

	// if (body.title === undefined) {
	// 	return response.status(400).json({ message: 'Title is required' })
	// }

	const task = new Task({
		title: body.title,
		completed: body.completed === undefined ? false : body.completed,
		date: new Date(),
		user: user._id,
	})

	const savedTask = await task.save()
	user.tasks = user.tasks.concat(savedTask._id)
	await user.save()

	response.json(savedTask)

	// task
	// 	.save()
	// 	.then((savedTask) => {
	// 		response.json(savedTask)
	// 	})
	// 	.catch((error) => next(error))
})

tasksRouter.delete('/:id', (request, response, next) => {
	Task.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end()
		})
		.catch((error) => next(error))
})

tasksRouter.put('/:id', (request, response, next) => {
	const body = request.body

	const task = {
		title: body.title,
		completed: body.completed || false,
	}

	Task.findByIdAndUpdate(request.params.id, task, { new: true })
		.then((updatedTask) => {
			response.json(updatedTask)
		})
		.catch((error) => next(error))
})

module.exports = tasksRouter
