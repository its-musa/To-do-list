const form = document.querySelector("#to-do-form");
const todoInput = document.querySelector("#to-do-input");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-all");

eventListeners();

function eventListeners() {
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearTodos);
}

function addTodo(e) {
    const newTodo = todoInput.value.trim();
    if (newTodo === "") {
        showAlert("warning", "Please enter a to-do");
    }
    
    else {
        if (checkTodo(newTodo) === true) {
            showAlert("danger", "The to-do has already been created");
        }

        else {
            addTodoToUI(newTodo);
            addTodoToStorage(newTodo);
            showAlert("success", "The to-do has been added succesfully");    
        }

        todoInput.value = "";
        
    }

    e.preventDefault();
}

function checkTodo(newTodo) {
    let thereIsTodo = false
    
    if (localStorage.getItem("todos") === null) {
        thereIsTodo = false;
    }

    else {
        for (let i = 0; i < getTodosFromStorage().length; i++) {
            if (newTodo == getTodosFromStorage()[i]) {
                thereIsTodo = true;
            }
        }
    }

    return thereIsTodo;
}

function addTodoToUI(newTodo) {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";
    listItem.innerHTML = newTodo + `
    <a href='#' class='delete-item'>
        <i class='fa-solid fa-remove'></i>
    </a>
    `
    todoList.appendChild(listItem);
}

function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();

    todos.push(newTodo);

    localStorage.setItem("todos", JSON.stringify(todos));

}

function getTodosFromStorage() {
    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = [];
    }

    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    return todos;
}

function loadTodosToUI() {
    getTodosFromStorage().forEach(todos => {
        addTodoToUI(todos);
    });
}

function deleteTodo(e) {
    let deletingTodo = e.target.parentElement.parentElement;

    if (e.target.className === "fa-solid fa-remove") {
        deleteTodoFromUI(deletingTodo);
        deleteTodoFromStorage(deletingTodo.textContent.trim());
        showAlert("success", "The to-do has been deleted successfully"); 
    }
}

function deleteTodoFromUI(deletingTodo) {
    deletingTodo.remove();
}

function deleteTodoFromStorage(deletingTodo) {
    let todos = getTodosFromStorage();

    todos.forEach((todo,index) => {
        if (todo === deletingTodo) {
            todos.splice(index, 1);
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}

function filterTodos() {
    const value = filter.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");
    listItems.forEach(listItem => {
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(value) === -1) {
            listItem.style = "display: none !important";
        }
        
        else {
            listItem.style = "display: flex"
        }
    });
}


function clearTodos() {
    if (confirm("Are you sure about you want to clear all tasks?")) {
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.clear();
    }
}

function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);
    setTimeout(() => {
        $(".alert").fadeOut(1000);
    }, 1000);
}