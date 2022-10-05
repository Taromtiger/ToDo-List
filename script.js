(function () {
  // Globals
  const todoList = document.querySelector('.todo-list');
  const userSelect = document.querySelector('.user-todo');
  const form = document.querySelector('form');
  let todos = [];
  let users = [];

  // Attach Events
  document.addEventListener('DOMContentLoaded', initApp);
  form.addEventListener('submit', handleSubmit);

  /******************************************/
  // Basic ligic

  // Функція яка знаходить ім'я користувача із об'єкта
  function getUserName(userId) {
    const user = users.find((u) => u.id === userId);
    return user.name;
  }

  // Функція яка створює і додає на сторінку чекбокс, задачу, власника і кнопку видалення задачі
  function printTodo({ id, userId, title, completed }) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = id;
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(
      userId
    )}</b></span>`;

    // Створення чекбокса для відмітки про виконання задачі
    const status = document.createElement('input');
    status.type = 'checkbox';
    status.checked = completed;
    status.addEventListener('change', handleToDoChange);
    /******************************************/

    // Створення кнопки видалення задачі
    const close = document.createElement('span');
    close.innerHTML = '&times;';
    close.className = 'close';
    close.addEventListener('click', handleClose);
    /******************************************/

    // Додавання чекбокса і кнопки закриття на сторінку
    li.prepend(status);
    li.append(close);
    /******************************************/

    // Додавання задачі на сторінку
    todoList.prepend(li);
    /******************************************/
  }

  // Функція, яка додає користувачів в меню вибору
  function createUserOption(user) {
    const option = document.createElement('option');
    option.value = user.id;
    option.innerText = user.name;

    userSelect.append(option);
  }

  // Функція видалення задачі із сторінки
  function removeTodo(todoId) {
    todos == todos.filter((todo) => todo.id !== todoId);

    const todo = todoList.querySelector(`[data-id = '${todoId}']`);
    todo.querySelector('input').removeEventListener('change', handleToDoChange);
    todo.querySelector('.close').removeEventListener('click', handleClose);

    todo.remove();
  }

  // Функція опрацювання помилки
  function alertError(error) {
    alert(error.message);
  }

  /******************************************/
  // Event Logic

  // Функція отримує задачі і користувачів і зберігає їх у зовнішніх змінних на верхніх рівнях
  function initApp() {
    Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
      [todos, users] = values;

      // Відправляє задачу в розмітку
      todos.forEach((todo) => printTodo(todo));
      users.forEach((user) => createUserOption(user));
    });
  }

  // Створення і додавання нової задачі
  function handleSubmit(event) {
    event.preventDefault();

    // console.log(form.todo.value);
    // console.log(form.user.value);

    createTodo({
      userId: Number(form.user.value),
      title: form.todo.value,
      completed: false,
    });
  }

  // Функція зміни статусу задачі
  function handleToDoChange() {
    const todoId = this.parentElement.dataset.id;
    const completed = this.checked;

    toggleToDoComplete(todoId, completed);
  }

  // Функція видалення задачі
  function handleClose() {
    const todoId = this.parentElement.dataset.id;
    deleteTodo(todoId);
  }

  /******************************************/

  // Async logic

  /******************************************/
  async function getAllTodos() {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos?_limit=30'
      );
      const data = await response.json();

      return data;
    } catch (error) {
      alertError(error);
    }
  }
  /******************************************/

  /******************************************/
  async function getAllUsers() {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );
      const data = await response.json();

      return data;
    } catch (error) {
      alertError(error);
    }
  }
  /******************************************/

  // Функція відправки нових даних на сервер
  async function createTodo(todo) {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos',
        {
          method: 'POST',
          body: JSON.stringify(todo),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const newTodo = await response.json();
      printTodo(newTodo);
    } catch (error) {
      alertError(error);
    }
  }

  /******************************************/

  // Функція зміни статусу задачі
  async function toggleToDoComplete(todoId, completed) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ completed }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to connect with server.');
      }
    } catch (error) {
      alertError(error);
    }
  }

  /******************************************/

  // Функція видалення задачі
  async function deleteTodo(todoId) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // const data = await response.json();
      // console.log(data);

      if (response.ok) {
        removeTodo(todoId);
      } else {
        throw new Error('Failed to connect with server.');
      }
    } catch (error) {
      alertError(error);
    }
  }
});

// Globals
const todoList = document.querySelector('.todo-list');
const userSelect = document.querySelector('.user-todo');
const form = document.querySelector('form');
let todos = [];
let users = [];

// Attach Events
document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleSubmit);

/******************************************/
// Basic ligic

// Функція яка знаходить ім'я користувача із об'єкта
function getUserName(userId) {
  const user = users.find((u) => u.id === userId);
  return user.name;
}

// Функція яка створює і додає на сторінку чекбокс, задачу, власника і кнопку видалення задачі
function printTodo({ id, userId, title, completed }) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.id = id;
  li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(
    userId
  )}</b></span>`;

  // Створення чекбокса для відмітки про виконання задачі
  const status = document.createElement('input');
  status.type = 'checkbox';
  status.checked = completed;
  status.addEventListener('change', handleToDoChange);
  /******************************************/

  // Створення кнопки видалення задачі
  const close = document.createElement('span');
  close.innerHTML = '&times;';
  close.className = 'close';
  close.addEventListener('click', handleClose);
  /******************************************/

  // Додавання чекбокса і кнопки закриття на сторінку
  li.prepend(status);
  li.append(close);
  /******************************************/

  // Додавання задачі на сторінку
  todoList.prepend(li);
  /******************************************/
}

// Функція, яка додає користувачів в меню вибору
function createUserOption(user) {
  const option = document.createElement('option');
  option.value = user.id;
  option.innerText = user.name;

  userSelect.append(option);
}

// Функція видалення задачі із сторінки
function removeTodo(todoId) {
  todos == todos.filter((todo) => todo.id !== todoId);

  const todo = todoList.querySelector(`[data-id = '${todoId}']`);
  todo.querySelector('input').removeEventListener('change', handleToDoChange);
  todo.querySelector('.close').removeEventListener('click', handleClose);

  todo.remove();
}

// Функція опрацювання помилки
function alertError(error) {
  alert(error.message);
}

/******************************************/
// Event Logic

// Функція отримує задачі і користувачів і зберігає їх у зовнішніх змінних на верхніх рівнях
function initApp() {
  Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
    [todos, users] = values;

    // Відправляє задачу в розмітку
    todos.forEach((todo) => printTodo(todo));
    users.forEach((user) => createUserOption(user));
  });
}

// Створення і додавання нової задачі
function handleSubmit(event) {
  event.preventDefault();

  // console.log(form.todo.value);
  // console.log(form.user.value);

  createTodo({
    userId: Number(form.user.value),
    title: form.todo.value,
    completed: false,
  });
}

// Функція зміни статусу задачі
function handleToDoChange() {
  const todoId = this.parentElement.dataset.id;
  const completed = this.checked;

  toggleToDoComplete(todoId, completed);
}

// Функція видалення задачі
function handleClose() {
  const todoId = this.parentElement.dataset.id;
  deleteTodo(todoId);
}

/******************************************/

// Async logic

/******************************************/
async function getAllTodos() {
  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/todos?_limit=30'
    );
    const data = await response.json();

    return data;
  } catch (error) {
    alertError(error);
  }
}
/******************************************/

/******************************************/
async function getAllUsers() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();

    return data;
  } catch (error) {
    alertError(error);
  }
}
/******************************************/

// Функція відправки нових даних на сервер
async function createTodo(todo) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const newTodo = await response.json();
    printTodo(newTodo);
  } catch (error) {
    alertError(error);
  }
}

/******************************************/

// Функція зміни статусу задачі
async function toggleToDoComplete(todoId, completed) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ completed }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to connect with server.');
    }
  } catch (error) {
    alertError(error);
  }
}

/******************************************/

// Функція видалення задачі
async function deleteTodo(todoId) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    // const data = await response.json();
    // console.log(data);

    if (response.ok) {
      removeTodo(todoId);
    } else {
      throw new Error('Failed to connect with server.');
    }
  } catch (error) {
    alertError(error);
  }
}
