var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Entry point
document.addEventListener("DOMContentLoaded", function () {
    var listElement = document.getElementById("todoList");
    TodoApp(listElement);
});
var updateStateEvent = new CustomEvent("updateState", {});
// Exemplo de generics
function makeState(initialState) {
    var state;
    function getState() {
        return state;
    }
    function setState(x) {
        state = x;
        document.dispatchEvent(updateStateEvent);
    }
    setState(initialState);
    return { getState: getState, setState: setState };
}
// Application
function TodoApp(listElement) {
    var _a = makeState([]), getState = _a.getState, setState = _a.setState;
    var dataSet = new Set(["home", "work"]);
    var nextId = 0;
    listElement.innerHTML = "\n    <ul></ul>\n    <span class=\"text-muted\">0 Done</span>\n    <a href=\"#\">Mark all done</a>\n    <form class=\"d-flex gap-1\">\n      <input class=\"form-control\" type=\"text\" name=\"text\" id=\"inputText\" placeholder=\"Text\" required />\n      \n      <input class=\"form-control\" list=\"tagOptions\" id=\"tagList\" placeholder=\"Tag\" />\n      <datalist id=\"tagOptions\">\n        ".concat(Array.from(dataSet)
        .map(function (el) { return "\n          <option value=\"".concat(el, "\">"); })
        .join("\n"), "\n      </datalist>\n\n      <button class=\"btn btn-outline-success\" type=\"submit\">Add</button>\n    </form>\n  ");
    var formElement = listElement.querySelector("form");
    var inputTextElement = listElement.querySelector("#inputText");
    var inputTagElement = listElement.querySelector("#tagList");
    var btnElement = listElement.querySelector("button");
    btnElement.addEventListener("click", function (ev) {
        ev.preventDefault();
        // Validação
        formElement.classList.add("was-validated");
        if (!formElement.checkValidity())
            return;
        setState(__spreadArray(__spreadArray([], getState(), true), [
            createTodo(inputTextElement.value, inputTagElement.value),
        ], false));
        // Resetar o form
        formElement.reset();
        formElement.classList.remove("was-validated");
    });
    var aElement = listElement.querySelector("a");
    aElement.addEventListener("click", function (ev) {
        ev.preventDefault();
        setState(completeAll(getState()));
    });
    function todoDivElement(todo) {
        var id = todo.id, text = todo.text, done = todo.done, tag = todo.tag;
        var todoDiv = document.createElement("div");
        todoDiv.classList.add("form-check");
        todoDiv.innerHTML = "\n    <input class=\"form-check-input\" type=\"checkbox\" id=\"".concat(id, "\">\n    <label class=\"form-check-label\" for=\"").concat(id, "\">\n      ").concat(text, "\n    </label>");
        if (tag) {
            var _a = createTodoTagTuple(tag), el1 = _a[0], el2 = _a[1];
            todoDiv.appendChild(el1);
            todoDiv.appendChild(el2);
        }
        var input = todoDiv.querySelector("input");
        if (done)
            input.setAttribute("checked", "");
        input.addEventListener("change", function (_) { return handleToggleTodo(todo); });
        return todoDiv;
    }
    function handleToggleTodo(todo) {
        var id = todo.id;
        var newTodo = toggleTodo(todo);
        var data = getState().filter(function (el) { return el.id != id; });
        data.push(newTodo);
        data.sort(function (a, b) { return a.id - b.id; });
        setState(data);
    }
    function toggleTodo(todo) {
        return __assign(__assign({}, todo), { done: !todo.done });
    }
    function createTodo(text, rawTag) {
        if (rawTag === void 0) { rawTag = ""; }
        return {
            id: nextId++,
            text: text,
            done: false,
            tag: getTodoTag(rawTag)
        };
    }
    function getTodoTag(tag) {
        return tag === "home" || tag === "work" ? tag : { custom: tag };
    }
    function createTodoTagTuple(tag) {
        var label = document.createElement("span");
        var icon = document.createElement("i");
        icon.classList.add("mx-1");
        icon.classList.add("bi");
        if (tag === "home") {
            icon.classList.add("bi-house");
            label.textContent = "Home";
        }
        else if (tag === "work") {
            icon.classList.add("bi-briefcase");
            label.textContent = "Work";
        }
        else if (tag === "school") {
            icon.classList.add("bi-mortarboard");
            label.textContent = "School";
        }
        else {
            icon.classList.add("bi-pin");
            label.textContent = tag.custom;
        }
        return [icon, label];
    }
    function completeAll(todos) {
        return todos.map(function (el) { return (__assign(__assign({}, el), { done: true })); });
    }
    function getTotalDone(todos) {
        return todos.reduce(function (acc, red) { return acc + Number(red.done); }, 0);
    }
    function render() {
        var todos = getState();
        var total = getTotalDone(todos);
        var ulElement = listElement.querySelector("ul");
        ulElement.innerHTML = "";
        var spanElement = listElement.querySelector("span");
        spanElement.innerText = "".concat(total, " Done");
        var todoDivs = todos.map(todoDivElement);
        todoDivs.forEach(function (el) { return ulElement.appendChild(el); });
    }
    document.addEventListener("updateState", function (_) {
        render();
    });
    setState([createTodo("First todo"), createTodo("Second todo")]);
}
