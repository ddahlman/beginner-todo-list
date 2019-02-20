$(document).ready(function () {

    var now = new Date();
    /*.slice ger oss de sista två karaktärerna av en string så om det är 10 så blir det inte 010 eftersom slice(-2) tar dom sista två karaktärerna endast
     I DOM-form så är typen date vilket kräver åååå-mm-dd och det här löser det problemet*/
    var today = now.getFullYear() + '-' +
        ('0' + (now.getMonth() + 1)).slice(-2) + '-' +
        ('0' + now.getDate()).slice(-2);
    $('#today').val(today);

    var disablePastDays = today;
    document.getElementsByName('best-before')[0].setAttribute('min', disablePastDays);

    function get_todos() {

        var todos_str = localStorage.getItem('todolist');

        if (todos_str === null) {
            /*todos är en global variabel för att den inte har en var innan*/
            todos = [];
        } else {
            todos = JSON.parse(todos_str);
        }
        return todos;
    }

    function addItem(e) {
        e.preventDefault();
        /*skapade en array av todoItem så att man kanske kan pusha till den sen*/
        var obj = {
            headline: document.getElementById('headline').value,
            todoItem: [document.getElementById('todoItem').value],
            bestBefore: document.getElementById('bestBefore').value,
            today: document.getElementById('today').value,
        };

        if (obj.headline && obj.todoItem !== "") {
            var todos = get_todos();
            todos.push(obj);
            localStorage.setItem('todolist', JSON.stringify(todos));
            headline.value = "";
            document.getElementById('todoItem').value = "";
            bestBefore.value = "";
            document.getElementById('head-error').innerHTML = "";
            document.getElementById('todo-error').innerHTML = "";

            show();

        } else if (obj.headline || obj.todoItem === "") {
            document.getElementById('head-error').innerHTML = "Rubrik krävs!";
            document.getElementById('todo-error').innerHTML = "Du behöver fylla i vad du vill göra!";
        }
        return false;
    }

    function removeItem() {
        var id = this.getAttribute('id');
        var todos = get_todos();
        todos.splice(id, 1);
        localStorage.setItem('todolist', JSON.stringify(todos));

        show();

        return false;
    }



    function rmvItem() {
        var divId = this.parentNode.parentNode.parentNode.parentNode.getAttribute('id');
        var id = this.getAttribute('id');
        var todos = get_todos();
        var todoArray;
        for (var i = 0; i < todos.length; i++) {
            if (divId === 'div' + i) {
                obj = todos[i];
                todoArray = obj.todoItem;
                todoArray.splice(id, 1);
                localStorage.setItem('todolist', JSON.stringify(todos));

                show();
            }
        }
        return false;
    }

    function addTasks() {
        var todos = get_todos();

        var id = this.parentNode.parentNode.parentNode.getAttribute('id');
        console.log(id);
        var thisDiv = document.getElementById(id);
        console.log(thisDiv.childNodes);
        var ulList = thisDiv.childNodes[1];

        var li = document.createElement('li');
        li.className = 'list-group-item';
        var divInpGroup = document.createElement('div');
        divInpGroup.className = 'input-group';
        var addlistInp = document.createElement('input');
        addlistInp.className = 'this-item form-control';
        addlistInp.setAttribute('type', 'text');
        var spanInput = document.createElement('span');
        spanInput.className = 'input-group-btn';
        var addSaveBtn = document.createElement('input');
        addSaveBtn.setAttribute('type', 'button');
        addSaveBtn.setAttribute('value', 'spara');
        addSaveBtn.className = 'save-item btn btn-success';

        li.appendChild(divInpGroup);
        divInpGroup.appendChild(addlistInp);
        divInpGroup.appendChild(spanInput);
        spanInput.appendChild(addSaveBtn);

        ulList.appendChild(li);

        var saveItem = document.getElementsByClassName('save-item');
        for (var i = 0; i < saveItem.length; i++) {
            saveItem[i].addEventListener('click', saveThisItem);
        }

        function saveThisItem() {
            var thisItem = document.getElementsByClassName('this-item');
            var thisInput;
            for (var k = 0; k < thisItem.length; k++) {
                thisInput = thisItem[k];
                thisInput.setAttribute('id', 'input' + [k]);
            }
            var inputID = thisInput.getAttribute('id');
            var userInput = document.getElementById(inputID).value;
            var todoArray;

            for (var i = 0; i < todos.length; i++) {
                if (id === 'div' + i) {
                    var obj = todos[i];
                    todoArray = obj.todoItem;
                    todoArray.push(userInput);

                    localStorage.setItem('todolist', JSON.stringify(todos));
                    show();
                }
            }
        }
        return false;
    }

    function show() {
        var todos = get_todos();

        var li = '<li>';
        for (var i = 0; i < todos.length; i++) {
            obj = todos[i];

            /*Gör en ny date variabel(bestBf) av obj.bestBefore eftersom jag sätter om bfDate till -3*/
            var bestBf = new Date(obj.bestBefore);
            var bfDate = new Date(obj.bestBefore);
            var bf3Days = new Date(bfDate.setDate(bfDate.getDate() - 3));

            if (now < bf3Days) {
                li += "<div id='div" + i + "' class='panel panel-info'><div class='panel-heading clearfix'>" + obj.headline + " " + obj.today + " <strong>gör innan: </strong>" + obj.bestBefore +
                    "<div class='btn-group pull-right'><button id='nr" + i + "' class='btn btn-info addTask'>Lägg till task</button>" +
                    "<button id='" + i + "' class='btn btn-danger remove'><span class='glyphicon glyphicon-remove'></span></button></div></div>" +
                    "<ul class='list-group'>";
            } else if (now > bestBf) {
                li += "<div id='div" + i + "' class='panel panel-danger'><div class='panel-heading clearfix'><strong class='expired'>Tiden har gått ut!</strong>" + " " + obj.headline + " " + obj.today + " <strong>gör innan: </strong>" + obj.bestBefore +
                    "<div class='btn-group pull-right'><button id='nr" + i + "' class='btn btn-info addTask'>Lägg till task</button>" +
                    "<button id='" + i + "' class='btn btn-danger remove'><span class='glyphicon glyphicon-remove'></span></button></div></div>" +
                    "<ul class='list-group'>";
            } else if (now <= bestBf && now >= bf3Days) {
                li += "<div id='div" + i + "' class='panel panel-warning'><div class='panel-heading clearfix'><strong class='warning'>Gör den nu!</strong>" + " " + obj.headline + " " + obj.today + " <strong>gör innan: </strong>" + obj.bestBefore +
                    "<div class='btn-group pull-right'><button id='nr" + i + "' class='btn btn-info addTask'>Lägg till task</button>" +
                    "<button id='" + i + "' class='btn btn-danger remove'><span class='glyphicon glyphicon-remove'></span></button></div></div>" +
                    "<ul class='list-group'>";
            } else {
                li += "<div id='div" + i + "' class='panel panel-info'><div class='panel-heading clearfix'>" + obj.headline + " " + obj.today + " <strong>gör innan: </strong>" + obj.bestBefore +
                    "<div class='btn-group pull-right'><button id='nr" + i + "' class='btn btn-info addTask'>Lägg till task</button>" +
                    "<button id='" + i + "' class='btn btn-danger remove'><span class='glyphicon glyphicon-remove'></span></button></div></div>" +
                    "<ul class='list-group'>";
            }
            var todoArray = obj.todoItem;
            for (var l = 0; l < todoArray.length; l++) {
                todoItem = todoArray[l];
                li += "<li class='list-group-item clearfix'>" + todoItem +
                    "<div class='btn-group pull-right'><button id='" + l + "' class='btn btn-default rmv'><span class='glyphicon glyphicon-minus text-danger'></span></button></div>" +
                    "</li>";
            }
            li += '</ul></div>';
        }

        document.getElementById('addedItems').innerHTML = li;

        var addTask = document.getElementsByClassName('addTask');
        for (var j = 0; j < addTask.length; j++) {
            addTask[j].addEventListener('click', addTasks);
        }

        var rmvItems = document.getElementsByClassName('rmv');
        for (var m = 0; m < rmvItems.length; m++) {
            rmvItems[m].addEventListener('click', rmvItem);
        }

        var removeBtn = document.getElementsByClassName('remove');
        for (var k = 0; k < removeBtn.length; k++) {
            removeBtn[k].addEventListener('click', removeItem);
        }

    }
    var clear = document.getElementById('clear');
    clear.addEventListener('click', removeLocalStorage);

    function removeLocalStorage(e) {
        localStorage.clear();
        show();
        e.preventDefault();
    }

    var save = document.getElementById('submit');
    save.addEventListener('click', addItem);


    show();
});