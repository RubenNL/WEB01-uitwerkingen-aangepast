const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const rootdir = 'public';

let todoItems = new Map();

// Create a default test value
let timestamp = Date.now();
todoItems.set(timestamp, {
    "task": "maak alle opdrachten",
    "done": true
});

app.use(express.static(rootdir));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/v1/todos', (req, res) => {
    console.log('GET all todo items');
    console.log(todoItems);
    res.json(Array.from(todoItems));
});

app.delete('/v1/todos', (req, res) => {
    console.log('DELETE all todo items');
    todoItems.clear();
    res.send(true); // since Map.clear returns a void, true will be returned to indicate that it was a success.
})

app.get('/v1/todos/:key', (req, res) => {
    const key = Number(req.params.key);
    console.log(`GET todo item ${key}`);

    res.json(todoItems.get(key));
});

app.post('/v1/todos', (req, res) => {
    const item = req.body;

    let timestamp = Date.now();
    todoItems.set(timestamp, item);

    console.dir(`POST todo item ${timestamp}`);
    console.dir(item);

    res.send(`${timestamp}`);
});

app.put('/v1/todos/:key', (req, res) => {
    const key = Number(req.params.key);
    const item = req.body;
    console.log(`PUT todo item ${key} with body`);
    console.dir(item);

    todoItems.set(key, item);

    console.log(todoItems);

    res.send(true);
});

app.delete('/v1/todos/:key', (req, res) => {
    const key = Number(req.params.key);
    const success = todoItems.delete(key);

    console.log(`DELETE todo item: ${key} | ${success}`);

    res.send(success);
});

app.listen(port, () => console.log(`Server is running on port ${port}`));