import { TodoItem } from './../model/todo-item.mjs';

export class TodoService {

    /**
     * the items property will hold all items of the type TodoItem.
     * Naturally we would therefore choose to assign the items property to an
     * Array. But this will result in problems of accessing the right item, because
     * the index can't be trusted once we removed an item somewhere within the array.
     * So we need an Array that also holds a key to the todo item.
     * Such a structure exists in JavaScript as Map Object.
     */
    constructor() {
        this.items = new Map();
    }

    /**
     * This function promise to return a map object of TodoItems.
     * @returns { Promise<Map<TodoItem>> } - 
     */
    getItems() {

        // return new Promise(resolve => {
        //     this.items = new Map();

        //     // Adding a default test value
        //     this.addTodoItem(new TodoItem('maak de opdrachten'))
        //     .then (key => this.updateDoneOfTodoItem(key, true))
        //     .then (response => {
        //         resolve(this.items)
        //     });
        // });

        return fetch('/v1/todos')
        .then (response => response.json())
        .then (response => {
            this.items = new Map();
            const list = response.map(item => {
                const key = item[0];
                const value = item[1];
                let todo = new TodoItem();
                todo = Object.assign(todo, value);
                this.items.set(key, todo); 
            });
            return this.items;
        });
    }

    /**
     * This function promises to add the given item to the collection of items.
     * @param item { TodoItem } - item to be added
     * @returns { Promise<number> } - key of the added item
     */
    addTodoItem(item) {
        // determine a key.
        // one way to get a key would be to use a number starting at 0 or 1 as iterator.
        // this however would mean that we either have to store the number somewhere or
        // determine the next number based on the keys that are already in use.
        // However since we might end up with a client / server app we might again encounter
        // the same problems than with Arrays on a single computer.
        // An alternative is the use of a timestamp, which is based on the number of
        // milliseconds since the epoch (1-1-1970), in a client / server setting there is
        // than still a chance of a collision (two computers that add an item at the exact
        // same time), but the change for this is low and could even further be reduced
        // using an additional (random) factor.

        // ---------------- Code without server -----------------------
        // return new Promise((resolve) => {
        //     let timestamp = Date.now();
        //     this.items.set(timestamp, item);
        //     resolve( timestamp);
        // });

        // You can also use this return value to store it as an index to this item in the html,
        // as well as to solve the A11Y issue.

        // ---------------- Code with server -----------------------
        return fetch('/v1/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(item)
        })
        .then (response => response.json())
        .then (timestamp => {
            this.items.set(timestamp, item);
            return (Number(timestamp));
        });
    }


    /**
     * This function promises to sets the done value of the TodoItem that belongs to the key.  
     * @param key 
     * @param done 
     */
    updateDoneOfTodoItem(key, done) {
        // return new Promise(resolve => {
        //     let todo = this.items.get(key);
        //     todo.setDone(done);
        //     resolve();
        // });

        let todo = this.items.get(key);
        todo.setDone(done);
        return fetch(`/v1/todos/${key}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(todo)
        });
    }

    /**
     * This function promises to remove the TodoItem that belongs to the key given. 
     * @param key { number } - the key of the item to be removed
     * @returns { Promise<boolean> } - true if the item has been removed, otherwise false.
     */
    removeTodoItem(key) {
        // return new Promise(resolve => resolve(this.items.delete(key)));

        return fetch(`/v1/todos/${key}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
        .then (response => response.json());
    }

    /**
     * This function promises to delete all todoItems
     */
    clearTodoItems() {
        // return new Promise(resolve => {
        //     this.items.clear();
        //     resolve(true);
        // });

        return fetch('/v1/todos', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
        .then (response => response.json());
    }

}