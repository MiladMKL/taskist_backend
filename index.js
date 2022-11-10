app.use(express.static("build"))

// Import
const express = require("express")
const app = express()

// Allow for requests from all origins
const cors = require("cors")
app.use(cors())

// Without this the body would be undefined
app.use(express.json())

let tasks = [
	{
		id: 1,
		title: "learn HTML",
		date: "2022-05-30T17:30:31.098Z",
		completed: true,
	},
	{
		id: 2,
		title: "learn Javascript",
		date: "2022-05-30T18:39:34.091Z",
		completed: false,
	},
	{
		id: 3,
		title: "learn React Native",
		date: "2022-05-30T19:20:14.298Z",
		completed: true,
	},
]

// app.get("/", (request, response) => {
// 	response.send("<h1>Welcome!</h1>")
// })

app.get("/api/tasks", (request, response) => {
	response.json(tasks)
})

app.get("/api/tasks/:id", (request, response) => {
	const id = Number(request.params.id)
	const task = tasks.find((task) => task.id === id)

	if (task) {
		response.json(task)
	} else {
		response.status(404).json({ message: "Task not found" })
	}
})

app.delete("/api/tasks/:id", (request, response) => {
	const id = Number(request.params.id)
	tasks = tasks.filter((task) => task.id !== id)

	response.status(204).end()
})

app.post("/api/tasks", (request, response) => {
	const task = request.body
	console.log(task)
	response.json(task)
})

// Use environment variable PORT or PORT 3001 if not specified
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
