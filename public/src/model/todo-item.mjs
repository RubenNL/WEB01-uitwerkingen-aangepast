export class TodoItem {
    constructor(task) {
        this.task = task;
        this.done = false;
    }

    setTask(task) {
        this.task = task;
    }

    getTask() {
        return this.task;
    }

    setDone(done) {
        this.done = done; 
    }

    isDone() {
        return this.done;
    }

    getItem() {
        return this;
    }
}