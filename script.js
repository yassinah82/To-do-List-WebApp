let input = document.getElementById("todo-input");

let submit = document.querySelector(".add-btn");
let todoListDiv = document.querySelector(".todo-list");
let clearAllBtn = document.querySelector(".clear-btn");
let controls = document.querySelector(".controls");
let pendingTodos = document.getElementById("pending");
let completedTodos = document.getElementById("completed");
let allTodos = document.getElementById("all");
let alert = document.querySelector(".alert");
let counter = document.getElementById("counter");
let countLeft = 0;
let countCompleted = 0;
let todosArray = [];

getTodosDataFromLocalStorage();

submit.onclick = function () {
    if (input.value !== "") {
        if (isHTML(input.value)) {
            displayAlert("HTML tags are not allowed!", "danger");
        } else {
            if (submit.value === "update") {
                editTodoByID(input.getAttribute("data-id"), input.value);
                submit.value = "add";
                displayAlert("Todo updated successfully", "success");
            }
            else {
                addTodoItem(input.value);
                // set all tab to active because we added a new todo which is not completed yet 
                let allTab = document.getElementById("all");
                allTab.click();
                displayAlert("Todo added successfully", "success");
            }
            input.value = "";
        }
    }
    else {
        displayAlert("Please enter data ", "danger");
    }
};

function addTodoItem(todoTitle) {
    let todoItemObj = {
        id: Date.now(),
        title: todoTitle,
        completed: false
    };

    todosArray.push(todoItemObj);


    addTodoItemToHTML(todoItemObj);
    addTodosDataToLocalStorage(todosArray);

}

function addTodoItemToHTML(todoItemObj) {
    const todoItem = document.createElement("div");

    todoItemObj.completed ? todoItem.className = "todo-item-done" : todoItem.className = "todo-item";

    todoItem.setAttribute("data-id", todoItemObj.id);

    todoItem.innerHTML =
        `<div class="todo-text">
        <input type="checkbox" name="todo-checkbox" id="${"todo-checkbox-id-" + todoItemObj.id + ""}"  
        ${todoItemObj.completed ? "checked" : ""}   class="todo-checkbox" onChange="toggleTodoStatusById(this)" "/> 
        <lable for="${"todo-checkbox-" + todoItemObj.id + "id"}"  class="todo-title" data-id=${todoItemObj.id}>
        ${todoItemObj.title}</lable> 
        </div>
    </div>
        <div class="btn-container">
        <button type="button" class="edit-btn"></button>
        <button type="button" class="delete-btn"></button>
    </div>`;

    // this keyword in the toggleTodoStatus function is 
    // referring to the checkbox element of the current todo item element to access the checkbox element's id attribute

    todoListDiv.appendChild(todoItem);
    updateCounter();
}


todoListDiv.addEventListener("click", (event) => {
    console.log("Clicked on :", event.target.className, "with id:", event.target.getAttribute("data-id"));

    if (event.target.classList.contains("todo-item")) {
        let todoItemElement = event.target; // get the todo item element
        let id = todoItemElement.getAttribute("data-id"); // get the id of the todo item element

        toggleTodoStatusByIDandTodoItem(id, todoItemElement);

        if (pendingTodos.classList.contains("active")) {
            todoItemElement.remove();
        }
    }
    else if (event.target.classList.contains("todo-item-done")) {
        let todoItemElement = event.target; // get the todo item element
        let id = todoItemElement.getAttribute("data-id"); // get the id of the todo item element

        toggleTodoStatusByIDandTodoItem(id, todoItemElement);
        // to update the completed todos ui 
        if (completedTodos.classList.contains("active")) {
            todoItemElement.remove();
        }
    }
    else if (event.target.classList.contains("todo-text")) {
        let todoItemElement = event.target.parentElement; // get the todo item element
        let id = todoItemElement.getAttribute("data-id"); // get the id of the todo item element

        toggleTodoStatusByIDandTodoItem(id, todoItemElement);
        if (completedTodos.classList.contains("active") || pendingTodos.classList.contains("active")) {
            todoItemElement.remove();
        }
    }
    else if (event.target.classList.contains("todo-title")) {
        let todoItemElement = event.target.parentElement.parentElement; // get the todo item element
        let id = todoItemElement.getAttribute("data-id"); // get the id of the todo item element

        toggleTodoStatusByIDandTodoItem(id, todoItemElement);
        if (completedTodos.classList.contains("active") || pendingTodos.classList.contains("active")) {
            todoItemElement.remove();
        }

    }


    else if (event.target.classList.contains("delete-btn")) {
        let todoItemElement = event.target.parentElement.parentElement; // get the todo item element

        deleteTodoByID(todoItemElement.getAttribute("data-id"));

        todoItemElement.remove();
    }

    else if (event.target.classList.contains("edit-btn")) {
        input.value = event.target.parentElement.parentElement.querySelector(".todo-title").innerText;
        //input.value = event.target.parentElement.parentElement.querySelector(".todo-text").innerHTML;
        input.setAttribute("data-id", event.target.parentElement.parentElement.getAttribute("data-id"));

        submit.value = "update";
    }
    else {
        console.log("No action");
    }
    // else if (event.target.classList.contains("todo-checkbox")) {

    //     let todoItemElement = event.target.parentElement.parentElement; // get the todo item element
    //     let id = todoItemElement.getAttribute("data-id"); // get the id of the todo item element

    //     toggleTodoStatusByIDandTodoItem(id, todoItemElement);

    // }
    updateCounter();
});
function toggleTodoStatusById(clickedCheckbox) {
    let id = clickedCheckbox.getAttribute("id").split("-")[3];
    clickedCheckbox.checked = !clickedCheckbox.checked;
    console.log("id:", id);
    let todoItemElement = document.querySelector(`[data-id="${id}"]`);
    console.log("this: ", this)
    console.log("onChange", todoItemElement);
    toggleTodoStatusByIDandTodoItem(id, todoItemElement);
    updateCounter();
}

function toggleTodoStatusByIDandTodoItem(id, todoItemElement) {
    todoItemElement.classList.contains("todo-item-done") ? todoItemElement.className = "todo-item" : todoItemElement.className = "todo-item-done";

    let checkbox = todoItemElement.querySelector(`#todo-checkbox-id-${id}`); // get the checkbox element of the current todo item element


    checkbox.checked = !checkbox.checked; // why double checked ? 

    todosArray.forEach(todo => {
        if (todo.id == id) {
            todo.completed = !todo.completed;
        }
    });

    addTodosDataToLocalStorage(todosArray);
}

function addTodosDataToLocalStorage(todosArray) {
    window.localStorage.setItem("Todos", JSON.stringify(todosArray));
}
function getTodosDataFromLocalStorage() {
    if (localStorage.getItem("Todos")) {
        todosArray = JSON.parse(localStorage.getItem("Todos"));
        addTodoElementsToHTML(todosArray);
    }
}
function addTodoElementsToHTML(todosArray) {
    todoListDiv.innerHTML = "";

    for (let i = 0; i < todosArray.length; i++) {
        addTodoItemToHTML(todosArray[i]);
    }
}

function deleteTodoByID(todoId) {
    todosArray = todosArray.filter((todo) => todo.id != todoId);
    addTodosDataToLocalStorage(todosArray);
}

function editTodoByID(id, text) {
    todosArray.forEach(todo => { if (todo.id == id) { todo.title = text; } });
    addTodoElementsToHTML(todosArray);
    addTodosDataToLocalStorage(todosArray);
}

clearAllBtn.addEventListener("click", clearAllTodos);

function clearAllTodos() {
    todosArray = [];
    todoListDiv.innerHTML = "";
    updateCounter();
    addTodosDataToLocalStorage(todosArray);
}


controls.addEventListener("click", (event) => {
    console.log("Clicked on :", event.target.id);
    if (event.target.id == "all") {
        addTodoElementsToHTML(todosArray);
        allTodos.className = "active";
        pendingTodos.className = "";
        completedTodos.className = "";
    }
    else if (event.target.id == "pending") {
        addTodoElementsToHTML(todosArray.filter((todo) => !todo.completed));
        allTodos.className = "";
        pendingTodos.className = "active";
        completedTodos.className = "";

    }
    else if (event.target.id == "completed") {
        addTodoElementsToHTML(todosArray.filter((todo) => todo.completed));
        allTodos.className = "";
        pendingTodos.className = "";
        completedTodos.className = "active";
    }
});




// display alert
function displayAlert(text, action) {
    alert.textContent = text;
    alert.className = `alert alert-${action}`;
    alert.style.display = 'block'; // Show the alert

    // Hide the alert after 3 seconds
    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
        alert.style.display = 'none'; // Hide the alert
    }, 3000);
}
/* 
they dont have to understand this code 
the general idea is to try to make an element that is not in the DOM yet 
and add it to the DOM and if it not rises an error it means that the string 
is an HTML string and not a string of text
so we return true 
 */
function isHTML(str) {
    var a = document.createElement('div');
    a.innerHTML = str;

    for (var c = a.childNodes, i = c.length; i--;) {
        if (c[i].nodeType == 1) return true;
    }

    return false;
}


function updateCounter() {
    countCompleted = todosArray.reduce((acc, todo) => {
        if (todo.completed) {
            return acc + 1;
        }
        else {
            return acc;
        }
    }, 0);
    countPending = todosArray.length - countCompleted;
    counter.innerHTML = `
    <span class="counter-left"> ${countPending} </span> &nbsp;&nbsp; pending &nbsp;
    & &nbsp;
    <span class="counter-completed">&nbsp;${countCompleted} &nbsp;</span> completed
    `;
}

// use enter key to add todo item
input.addEventListener("keyup", (event) => {
    if (event.key == 'Enter') {
        submit.onclick();
    }
});

