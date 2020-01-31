//ELEMENT SEÇMEK
const form = document.querySelector("#todo-form");
const todoinput = document.querySelector("#todo");
const todolist = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners() { //TÜM EVENTLER
    form.addEventListener("submit", addtodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

function clearAllTodos(e) {
    //ARAYUZDEN TODOLARI KALDIRMAK 

    if (confirm("Tümünü Silmek Istediğinize Emin Misiniz ? ")) { //true
        /* todolist.innerHTML=""; yöntem 1 ! */

        while (todolist.firstElementChild != null) { //YONTEM 2 
            todolist.removeChild(todolist.firstElementChild);
        }
        localStorage.removeItem("todos"); // localden de sildik !!

    }
}

function filterTodos(e) {
    const filtervalue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filtervalue) == -1) {
            //BULAMADI DEMEKTIR !!
            listItem.setAttribute("style", "display : none !important");
        } else {
            listItem.setAttribute("style", "display : block !important");
        }
    });
}

function deleteTodo(e) {
    if (e.target.className == "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success", "Todo Başarıyla Silindi !");
    }
}

function deleteTodoFromStorage(deleteTodo) {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo, index) {
        if (todo == deleteTodo) {
            todos.splice(index, 1); //arrayden değeri silebiliriz
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
    let todos = getTodosFromStorage();
    todos.forEach(function (todo) {
        addtodoTodoUI(todo);
    });
}

function addtodo(e) {
    const newTodo = todoinput.value.trim();
    let todos = getTodosFromStorage();
    let a = 0;
   
   
    todos.forEach(function (todo) {//Olanlar eklenmesin bölümü
        if (todo == newTodo) {
            showAlert("danger", "zaten böyle bir todo var");
            a = 1;


        } else if (newTodo == "") {
            showAlert("danger", "Lütfen bir todo girin !");
            a = 1;
        }
    });
    if (a == 0) {

        addtodoTodoUI(newTodo);

        showAlert("success", "Todo Başarılı bir şekilde eklenddi");
        addtodoToStorage(newTodo);


    }
    // if (newTodo == "") {
    //     showAlert("danger", "Lütfen bir todo girin");
    // } else {
    //     addtodoTodoUI(newTodo);

    //     showAlert("success", "Todo Başarılı bir şekilde eklenddi");
    //     addtodoToStorage(newTodo);
    // }






    //  addtodoTodoUI(newTodo); //String değeri Listİtem olarak UI'ya eklenecek !!

    e.preventDefault();
    todoinput.value = "";
}

function getTodosFromStorage() {
    let todos;
    if (localStorage.getItem("todos") == null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addtodoToStorage(newTodo) {
    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function addtodoTodoUI(newTodo) {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    const linkI = document.createElement("i");

    link.href = "#";
    link.className = "delete-item";

    linkI.className = "fa fa-remove";

    listItem.className = "list-group-item d-flex justify-content-between";
    //TEXT NODE
    listItem.appendChild(document.createTextNode(newTodo));

    link.appendChild(linkI);
    listItem.appendChild(link);
    todolist.appendChild(listItem); //ul ye ekleme
}

function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);
    setTimeout(function () {
        $(alert).hide(500);
    }, 1000);
}