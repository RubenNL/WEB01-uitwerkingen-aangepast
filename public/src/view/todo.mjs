import { TodoService } from "../service/todo-service.mjs";
import { TodoItem } from "../model/todo-item.mjs";

// assign the DOM-node value to the variables that corresponds to with the name of the variable. 
const addItemButton = document.querySelector('.new-task__addbtn');
const clearButton = document.querySelector('.clear-btn');
const refreshButton = document.querySelector('.refresh-btn');
const todoList = document.querySelector('.todo-list');
const newTaskInput = document.querySelector('.new-task__input');


/**
 * @param -
 * @return -
 * Goal of this function is the creation of html element using DOM related javascript methods, without the use of the innerHTML property.
 * The result should add the following to the "header"-element of the todo.html file:
 * 
 *  <h1>TODO App</h1>
 *  <p>Build with vanilla JS, HTML and CSS</p>
 * 
 * There is no other reason to this function than to practice with DOM manipulation using JavaScript.
 */
function addHeaderAndSubtitle() {
    const headerElement = document.querySelector('header');
    
    const h1Element = document.createElement('h1');
    const h1Text = document.createTextNode('TODO App');
    h1Element.append(h1Text);
    headerElement.append(h1Element);

    const pElement = document.createElement('p');
    const pText = document.createTextNode('Build with vanilla JS, HTML and CSS');
    pElement.append(pText);
    headerElement.append(pElement);
}

/**
 * This function expects the reference to a single li element of the todolist. 
 * It then will determine if the checkbox is checked or not, and depending on this checkbox state
 * it will add or remove the todo-item__task--done class to the label element, in order to
 *  style the task.
 * 
 * @param liNode {DOM node}
 */
function styleTodoElement(liNode) {
    const checkboxElement = liNode.querySelector('.todo-item__checkbox');
    const labelElement = liNode.querySelector('label');
    if (checkboxElement.checked) {
        labelElement.classList.add("todo-item__task--done");
    } else {
        labelElement.classList.remove("todo-item__task--done");
    }
}

/**
 * This checkboxHandler will be called when the user clicks on the checkbox of an li element.
 * This function expects to receive the reference of the li element to which the checkbox belongs.
 * From this li element the function will extract the key of the task and will then call the 
 * service to update the state of that task, according to the checked state of the checkbox. 
 * Once the service has updated the state of the task this function will update the visual representation 
 * of the task using the function styleTodoElement.
 * @param liNode {DOM node} 
 */
function checkboxHandler(liNode) {
    const key = Number(liNode.querySelector('input').id);
    const done = liNode.querySelector('input').checked;
    
    todoService.updateDoneOfTodoItem(key, done)
    .then ( () => {
        styleTodoElement(liNode);
    });
}

/**
 * This handler will be called when the user clicks to remove a certain task.
 * The function expects to receive the reference of the li element to which the remove button belongs.
 * From this li element the function will extract the key of the task and will then call the
 * service to remove the Todo item.
 * Once the service succeeded in the deletion of the task this function will update the DOM by removing the
 * li node from it.
 * @param liNode {DOM node}
 */
function removeTaskHandler(liNode) {
    const key = Number(liNode.querySelector('input').id);
    todoService.removeTodoItem(key)
    .then( success => {
        if (success) {
            liNode.remove();
            disableClear();        
        }
    });
}

/**
 * This function will add the todoItem to the list of todoItems on the screen, 
 * by first cloning the template, then applying the parameters of this function to this clone
 * and finally adding the clone to the list of todo items.
 * 
 * @param id {number}
 * @param todoItem {TodoItem}
 */
function addTodoItemElement(id, todoItem) {
    // cloning the template
    const todoItemTemplate = document.getElementById("todo-item-template");
    const toDoItemTemplateClone = document.importNode(todoItemTemplate.content, true);

    // applying the parameters
    const labelElement = toDoItemTemplateClone.querySelector('label');
    labelElement.textContent = todoItem.task;
    labelElement.setAttribute('for', id);
    const checkboxElement = toDoItemTemplateClone.querySelector('.todo-item__checkbox');
    checkboxElement.setAttribute('name', id);
    checkboxElement.setAttribute('id', id);
    checkboxElement.checked = todoItem.done;
    styleTodoElement(toDoItemTemplateClone);
    checkboxElement.addEventListener('click', event => 
            checkboxHandler(event.target.parentNode)
    );

    const deleteItem = toDoItemTemplateClone.querySelector('.todo-item__remove-btn');
    deleteItem.addEventListener('click', event => {
        removeTaskHandler(event.target.parentNode);
    });

    // appending to the todolist
    let itemFragment = document.createDocumentFragment();
    itemFragment.append(toDoItemTemplateClone);
    todoList.append(itemFragment);
    clearButton.removeAttribute('disabled');
}

/**
 * This function should be called once the add task button has been clicked or the user had hit enter on the input text box.
 * 
 * The function will read the content of the task input box and in case the task is not empty, it will add a "TodoItem" for
 * the task via the todoService.
 * Once the method of the todoservice is finished it will return an id for the newly created task.
 * The addTaskHandler should then be able to call the addTodoItemElement in order to display the newly created task in the todo list.
 * At the end of this function the input field of the input text box should be empty again.
 */
function addTaskHandler() {
    console.trace();
    let task = newTaskInput.value;
    if (task != '') {
        const item = new TodoItem(task);
        todoService.addTodoItem(item)
        .then( id => {
            addTodoItemElement(id, item);
        });
    }
    newTaskInput.value = '';     
}

/**
 * In case there is one or more task in the todo list this function will enable the clear button.
 * Otherwise, when the list of todo items is empty, this function will disable the clear button.
 */
function disableClear() {
    const liElements = todoList.querySelectorAll('li');

    if (liElements.length == 0) {
        clearButton.setAttribute('disabled', '');
    } else {
        clearButton.removeAttribute('disabled');
    }
}

/**
 * The task of this function is to remove all tasks from the DOM, but not from the list maintained by the service / server 
 */
function clearVisualList() {
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }
}

/**
 * This function will asked the user, using the modal dialog box, whether (s)he is sure that the user wants to remove all tasks.
 * Once the user confirms that all tasks should be removed, this function will call the service to clear all items.
 * When the service function has finished this function will clear all todo items from the DOM and will close the 
 * dialogbox.
 */
function clearTodoList() {
    const dialog = document.querySelector('dialog');
    dialog.showModal();
    const yesBtn = document.querySelector('.dialog__yesbtn');
    const noBtn = document.querySelector('.dialog__nobtn');
    yesBtn.addEventListener('click', event => {

        todoService.clearTodoItems()
        .then (success => {
            if (success) {
                clearVisualList();
                dialog.close();
                clearButton.setAttribute('disabled', '');                
            }
        });
    });
    noBtn.addEventListener('click', event => {
        dialog.close();
    });
}

/**
 * This function will call the service to get all its todo items.
 * And for each item it gets from the service, this function will make sure that it is added to the DOM.
 */
function initItems() {
    todoService.getItems()
    .then(items => {
        items.forEach((item, key) => {
            addTodoItemElement(key, item);
        });
    });
}

/**
 * This handler function will be called when its time to refresh in order to stay in sync with list of the server.
 * There are many ways to accomplish this task. For now it's ok to accomplish this task using the no so good performing and
 * nasty solution by first clearing the visual list (otherwise the server would remove the items) and then fetching the 
 * list of all items and rebuild the screen.  
 */
function refreshHandler() {
    clearVisualList();
    initItems();
}


// ------------------------------------------------- main program -------------------------------------------

addHeaderAndSubtitle();

/**
 * add code to listen to the add task button (assignment 5) and the enter key (assignment 9). 
 * Each of this listeners should call the addTaskHandler function once they are triggered.
 */
addItemButton.addEventListener( 'click', event => addTaskHandler() );
newTaskInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        addTaskHandler();
    }
});

/**
 * add code to listen to the clear button and let it call the clearTodoList function once it is clicked. 
 */
clearButton.addEventListener( 'click', event => clearTodoList() );

/**
 * add code to listen to the refresh button and let it call the refreshHandler function once it is clicked.
 */
refreshButton.addEventListener('click', event => refreshHandler() );
setInterval(refreshHandler, 5000);

/**
 * Haal het commentaar van onderstaande regel weg als je aan assignment TODO: ... begint 
 */
const todoService = new TodoService();
initItems();