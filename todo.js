$(document).ready(function () {

    let alltodos ={todos:[]};
    if(localStorage.getItem("alltodos") === null) {
        localStorage.setItem("alltodos", JSON.stringify(alltodos));
    }
    let fetchedTodos = JSON.parse(localStorage.getItem("alltodos"));
    function pushNewTodo(task, completed) {
        fetchedTodos.todos.push({
            id: getTodoId(),
            title: task,
            completed: completed
        });
        saveTodos();
    }
    function saveTodos() {
        localStorage.setItem("alltodos", JSON.stringify(fetchedTodos));
    }
    function getTodoId() {
        let i=0;
        fetchedTodos.todos.forEach(function (todo) {
           i = todo.id;
        });
        return i+1;
    }
    function showFilters() {
        if(fetchedTodos.todos.length > 0) {
            $("#filters").show();
        } else{
            $("#filters").hide();
        }
    }
    showFilters();

    function showFetchedTodos() {
        $("ul").html("");
        for(let i=0; i<fetchedTodos.todos.length; i++) {
            $(".todos").append("<li class='list-group-item'><input type='checkbox'>" +
                "<span class='check'>&#10004;</span> " +
                "<label>" + fetchedTodos.todos[i].title + "</label>" +
                "<input type='text' class='edittodo' placeholder='edit'>" +
                "<button>X</button></li>");
            $(".todoinput").val("");
        }
        let i=0;
        $("li").each(function () {
           $(this).attr("id", ""+fetchedTodos.todos[i].id);
           if(fetchedTodos.todos[i].completed === true) {
               $(this).find(".check").css("color", "#248914").css("transform", "scale(2)");
               $(this).find("input[type=checkbox]").prop("checked", true);
               $(this).find("label").addClass("complete");
           } else {
               $(this).find(".check").css("color", "red").css("transform", "scale(1.5)");
               $(this).find("input[type=checkbox]").prop("checked", false);
               $(this).find("label").removeClass("complete");
           }
           i++;
        });
        calculate();
    }
    showFetchedTodos();

    $(".todoinput").keypress(function (e) {
        const task = $(this).val();
        if(task !== "") {
            if(e.keyCode === 13) {
                $(".todos").append("<li class='list-group-item'><input type='checkbox'>" +
                    "<span class='check'>&#10004;</span> " +
                    "<label>" + task + "</label>" +
                    "<input type='text' class='edittodo' placeholder='edit'>" +
                    "<button>X</button></li>");
                $(".todoinput").val("");
                $(".todos").find("li:last-child").attr("id", ""+getTodoId());
                pushNewTodo(task, false);
                calculate();
                showFilters();
            }
        }
    });
    function completeTask() {
        let checkbox = $(this).parent().find("input[type=checkbox]");
        let changeID = parseInt($(this).parent().attr("id"));
        if(checkbox.prop("checked") === true) {
            $(this).css("color", "red").css("transform", "scale(1.5)");
            checkbox.prop("checked", false);
            $(this).parent().find("label").removeClass("complete");
            fetchedTodos.todos.forEach(function(todo) {
                if(todo.id === changeID) {
                    todo.completed = false;
                }
            });
        } else {
            $(this).css("color", "#248914").css("transform", "scale(2)");
            checkbox.prop("checked", true);
            $(this).parent().find("label").addClass("complete");
            fetchedTodos.todos.forEach(function (todo) {
                if(todo.id === changeID) {
                    todo.completed = true;
                }
            });
        }
        saveTodos();
    }

    $(document).on('click', ".check", completeTask);

    $(document).on('click', "li > button", function () {
        $(this).parent().remove();
        let deleteID = parseInt($(this).parent().attr("id"));
        fetchedTodos.todos.forEach(function (todo) {
            if(todo.id === deleteID) {
                fetchedTodos.todos.splice(fetchedTodos.todos.indexOf(todo), 1);
            }
        });
        calculate();
        saveTodos();
    });
    $("#select").click(function () {
        let checkboxes = $("input[type=checkbox]");
        if(checkboxes.prop("checked")) {
            $(".check").css("color", "red").css("transform", "scale(1.5)");
            checkboxes.prop("checked", false);
            $("label").removeClass("complete");
            fetchedTodos.todos.forEach(function (todo) {
               todo.completed = false;
            });
        } else {
            fetchedTodos.todos.forEach(function (todo) {
                todo.completed = true;
            });
            $(".check").css("color", "#248914").css("transform", "scale(2)");
            checkboxes.prop("checked", true);
            $("label").addClass("complete");
        }
        calculate();
        saveTodos();
        activeButton();
    });
    $("#clearcomp").click(function () {
        fetchedTodos.todos = $.grep(fetchedTodos.todos, function (todo) {
           return  (todo.completed === false);
        });
       saveTodos();
       calculate();
       showFetchedTodos();
    });
    $(document).on('dblclick', 'label', function () {
        $(this).hide();
        $(this).parent().find("input[type=text]").val("").show().focus();
    });
    $(document).on('keypress', 'li > input[type=text]', function(e) {
        let editLabel = $(this).val();
        if(e.keyCode) {
            if(e.keyCode!==13 || editLabel==="") {
                return;
            }
        }
        $(this).parent().find("label").show();
        $(this).parent().find("label").html(""+editLabel);
        let changeID = parseInt($(this).parent().attr("id"));
        fetchedTodos.todos.forEach(function(todo) {
            if(todo.id === changeID) {
                todo.title = editLabel;
            }
        });
        saveTodos();
        $(this).hide();
    });
    $(document).on('focusout', 'li > input[type=text]', function () {
        $(this).parent().find("label").show();
        $(this).hide();
    });

    $("#all").click(function () {
        $("#all").addClass("active");
        $("#active").removeClass("active");
        $("#completed").removeClass("active");
        $('li').show();
    });
    function onActive() {
        $("#active").addClass("active");
        $("#all").removeClass("active");
        $("#completed").removeClass("active");
        $('li').find(":checked").parent().hide();
        $("input:checkbox:not(:checked)").parent().show();
    }
    function onCompleted() {
        $("#completed").addClass("active");
        $("#active").removeClass("active");
        $("#all").removeClass("active");
        $("input:checkbox:not(:checked)").parent().hide();
        $('li').find(":checked").parent().show();
    }
     function calculate() {
        let checkboxes = $("input[type=checkbox]");
        let compcount = checkboxes.filter(":checked").length;
        $("#clearcomp").text("Clear Completed: " + compcount);
        let pendcount = checkboxes.length - compcount;
        $("#pendcount").text("Pending: " + pendcount);
    }
    calculate();
    function activeButton() {
        if($("#active").hasClass("active")) {
            onActive();
        }
        if($("#completed").hasClass("active")) {
            onCompleted();
        }
    }
    $(document).on('click', ".check", function () {
        calculate();
        activeButton();
    });
    $("#active").click(onActive);
    $("#completed").click(onCompleted);
});