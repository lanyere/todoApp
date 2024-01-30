(function() {

    function createAppTitle(title) {
        let appTitle = document.createElement('h2'); // динамическое создание h2 заголовка
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form'); // создание HTML элементов
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3'); // mb-3 = margin-bottom: 3px;
        input.classList.add('form-control'); // для bootstrap стилизация
        input.placeholder = 'Введите название нового дела';

        input.addEventListener('input', function() { // убираем disabled с кнопки
            let button = document.querySelector('.btn-primary');
            button.removeAttribute('disabled');
        });

        buttonWrapper.classList.add('input-group-append'); // спозиционировать элемент справа от поля ввода (кнопку)
        button.classList.add('btn', 'btn-primary'); // btn-primary - синий цвет в bootstrap, также используется когда только 1 кнопка в form
        button.textContent = 'Добавить дело';
        button.setAttribute('disabled', true);


        buttonWrapper.append(button); 
        form.append(input); // добавление элементов в форму
        form.append(buttonWrapper); // добавление элементов в форму

        return {
            form,
            input,
            button,
        }
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group'); // 
        return list;
    }

    function createTodoItem(todo) {
        if (!isTodo(todo)) {
            console.log('todo не является объектом или не имеет поле name / done');
            return 
        }

        if (typeof todo.name !== 'string' || todo.name === '') {
            console.log('incorrect name');
            return;
        }

        // создание элемента <li> в DOM
        let item = document.createElement('li');

        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center'); // CSS стили в виде классов через bootstrap
        item.textContent = todo.name;
        item.id = todo.id;
        item.done = todo.done;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success'); // CSS стили через класс для кнопки Готово (done)
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger'); // CSS стили через класс для кнопки Удалить (delete)
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton,
        }
    }

    function isTodo(todo) {
        if (typeof todo !== 'object') {
            return false;
        }
    
        if (!('name' in todo)) {
            return false;
        }
        return true;
    }
    
    function setLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function getLocalStorage(key) {
        let todo = localStorage.getItem(key);
        todo = todo ? JSON.parse(todo) : [];
        return todo;

    }

    function setEventDone(todoItem, listName) {
        
        todoItem.item.classList.toggle('list-group-item-success');
        
        let todoArr = getLocalStorage(listName);

        console.log(todoItem.item.id);
        const index = todoArr.findIndex(item => item.id === parseInt(todoItem.item.id, 10));

        if (index === -1) {
            console.log(`id ${parseInt(todoItem.item.id, 10)} is not found:\n${todoArr}`);
            return;
        }

        todoArr[index].done = !todoArr[index].done;
        setLocalStorage(listName, todoArr);
    }

    function setEventDelete(todoItem, listName) {
        if (confirm('Вы уверены?')) {
            console.log('ID: ', todoItem.item.id);
            const itemId = parseInt(todoItem.item.id, 10);
            
            let todoArr = getLocalStorage(listName);

            todoArr = todoArr.filter(item => item.id !== itemId);
            console.log(todoArr);
            
            todoItem.item.remove();
            setLocalStorage(listName, todoArr);
        }
    }

    function setEventSubmit(todoItemForm, todoList, listName) {

        if (!todoItemForm.input.value) {
            // если ничего не введено - игнорируем;
            return;
        }

        let todo = {
            name: todoItemForm.input.value, 
        };
        
        todoArr = getLocalStorage(listName);

        let maxId = -1; // если todoArr = [], то +1 будет id: 0

        // с помощью reduce - находим элемент с максимальным id
        maxId = todoArr.reduce((max, item) => Math.max(max, item.id), maxId); 

        // прибавляем +1 к maxId и регистрируем наш todo
        todo.id = maxId + 1;
        todo.done = false;

        todoArr.push(todo);
        setLocalStorage(listName, todoArr);
        
        let todoItem = createTodoItem(todo);
        
        // добавляем реагирование на клик кнопок
        todoItem.doneButton.addEventListener('click', function() {
            setEventDone(todoItem, listName);
        });

        todoItem.deleteButton.addEventListener('click', function() {
            setEventDelete(todoItem, listName);
        });

        // добавляем в DOM
        todoList.append(todoItem.item);
        
        // стираем автоматически значение поля
        todoItemForm.input.value = ''; 
        todoItemForm.button.setAttribute('disabled', true);
    }

    function getAllTodos(todoList, listName) {
        let todoArr = getLocalStorage(listName);
        console.log(todoArr);

        console.log(todoArr.length)
        todoArr.forEach(todo => { // forEach - потому, что нам не нужно останавливать цикл и мы хотим получить все элементы
            let item = document.createElement('li');

            let buttonGroup = document.createElement('div');
            let doneButton = document.createElement('button');
            let deleteButton = document.createElement('button');

            item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center'); // CSS стили в виде классов через bootstrap
            item.textContent = todo.name;
            item.id = todo.id;
            item.done = todo.done;

            buttonGroup.classList.add('btn-group', 'btn-group-sm');
            doneButton.classList.add('btn', 'btn-success'); // CSS стили через класс для кнопки Готово (done)
            doneButton.textContent = 'Готово';
            deleteButton.classList.add('btn', 'btn-danger'); // CSS стили через класс для кнопки Удалить (delete)
            deleteButton.textContent = 'Удалить';

            doneButton.addEventListener('click', function() {
                setEventDone(todoItem, listName);
            });

            deleteButton.addEventListener('click', function() {
                setEventDelete(todoItem, listName);
            });

            let todoItem = {
                item: item,
                doneButton: doneButton,
                deleteButton: deleteButton,
            }

            buttonGroup.append(doneButton);
            buttonGroup.append(deleteButton);

            item.append(buttonGroup);
            todoList.append(item);
        });
    }

    function createTodoApp(container, title = 'Список дел', listName) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
    
        container.append(todoAppTitle);
        container.append(todoItemForm.form); // потому, что возвращается объект и здесь выбираем form
        container.append(todoList);

        getAllTodos(todoList, listName);
    
        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault(); // предотвращаем стандартное поведение браузера, а именно перезагрузка страницы при отправке формы
            setEventSubmit(todoItemForm, todoList, listName);
        });
    }

    window.createTodoApp = createTodoApp;

    // let todoArr = [];
})();