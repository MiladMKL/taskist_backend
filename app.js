const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const tasksRouter = require('./controllers/tasks')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

/* --------------------------------
 * MongoDB Connection
 * -------------------------------- */
// The responsibility of establishing the connection to the database has been given to the app.js module. The note.js file under the models directory only defines the Mongoose schema for notes.
logger.info('connecting to', config.MONGODB_URI)

mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB:', error.message)
	})

/* --------------------------------
 * Middleware
 * -------------------------------- */
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

/* --------------------------------
 * Routes
 * -------------------------------- */
// tasksRouter ist ein Middleware, daher kann es mit app.use() verwendet/importiert werden
app.use('/api/tasks', tasksRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
/* --------------------------------
 * Own Middleware
 * -------------------------------- */
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
