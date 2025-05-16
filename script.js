document.addEventListener('DOMContentLoaded', () => {
    
    // Fetch user profile function
    window.fetchUserProfile = async function () {
      const userId = document.getElementById('user-id-input').value;
      const profileSection = document.getElementById('user-profile');
  
      if (!userId) {
        alert('Please enter a user ID.');
        return;
      }
  
      setLoading(true);
  
      try {
        const response = await fetch(`https://mx.velodata.org/api/v2/teach/users/${userId}`);
        if (!response.ok) throw new Error(`User with ID ${userId} not found`);
  
        const { data } = await response.json();
        const attrs = data.attributes;
  
        document.getElementById('profile-image').src = attrs.profile_image || 'https://via.placeholder.com/150';
        document.getElementById('user-name').textContent = attrs.name || 'No Name Provided';
        document.getElementById('user-email').textContent = attrs.email || 'No Email Provided';
        document.getElementById('user-address').textContent =
          `${attrs.address_1 || ''} ${attrs.address_2 || ''} ${attrs.city || ''} ${attrs.state || ''} ${attrs.postcode || ''}`.trim();
  
        profileSection.classList.remove('d-none');
      } catch (err) {
        console.error(err);
        alert('Failed to load user profile.');
        profileSection.classList.add('d-none');
      } finally {
        setLoading(false);
      }
    };
  
    // Add helper function to show loading indicator
    function setLoading(isLoading) {
      const loadingIndicator = document.getElementById('loading');
      if (loadingIndicator) {
        loadingIndicator.style.display = isLoading ? 'block' : 'none';
      }
    }
     
  });
  
// Data View
function DataView() {
    const tbody = document.getElementById('user-table-body');
    const message = document.getElementById('response-message');
    const BASE_API_URL = 'https://mx.velodata.org/api/v2'; // Replace with your real API base URL

  
    fetch(`${BASE_API_URL}/teach/users`)
      .then(res => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then(json => {
        const users = json.data;
        tbody.innerHTML = '';
  
        if (!users.length) {
          tbody.innerHTML = '<tr><td colspan="7">No users found.</td></tr>';
          return;
        }
  
        users.forEach(user => {
          const attr = user.attributes;
          const row = `
            <tr>
              <td>
                ${attr.profile_image
                  ? `<img src="${attr.profile_image}" alt="Profile" style="width:70px; height:70px; object-fit:cover; border-radius:35px;">`
                  : '-'}
              </td>
              <td>${user.id}</td>
              <td>${attr.name || '-'}</td>
              <td>${attr.email || '-'}</td>
              <td>${attr.address_1 || '-'}</td>
              <td>${attr.city || '-'}</td>
              <td>${attr.state || '-'}</td>
              <td>${attr.postcode || '-'}</td>
            </tr>`;
          tbody.insertAdjacentHTML('beforeend', row);
        });
      })
      .catch(err => {
        tbody.innerHTML = '<tr><td colspan="7">Failed to load users.</td></tr>';
        message.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
      });
  }
  
  // ✅ Ensure DOM is fully loaded before running
  document.addEventListener("DOMContentLoaded", function () {
    DataView();

    
  });
      



// Existing code for the TODO app
const todoInput = document.getElementById("todo-input");
const addTodoButton = document.getElementById("add-todo");
const clearCompletedButton = document.getElementById("clear-completed");
const todoTableBody = document.getElementById("todo-table-body");
const statusMessage = document.getElementById("status-message");
const loadingIndicator = document.getElementById("loading");

document.addEventListener("DOMContentLoaded", loadTodos);

function showMessage(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = isError ? "red" : "green";
  setTimeout(() => { statusMessage.textContent = ""; }, 3000);
}

function setLoading(isLoading) {
  loadingIndicator.style.display = isLoading ? "block" : "none";
}

function getTodos() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

function saveTodosToLocalStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const todos = getTodos();
  todos.forEach(renderTodo);
}

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText === "") {
    showMessage("Please enter a valid TODO!", true);
    return;
  }

  const newTodo = {
    id: Date.now(),
    text: todoText,
    completed: false,
    createdAt: new Date().toLocaleString(),
  };

  const todos = getTodos();
  todos.push(newTodo);
  saveTodosToLocalStorage(todos);

  renderTodo(newTodo);
  todoInput.value = "";
  showMessage("TODO added successfully!");
}

function renderTodo(todo) {
  const row = document.createElement("tr");
  row.dataset.id = todo.id;

  const taskCell = document.createElement("td");
  taskCell.textContent = todo.text;
  if (todo.completed) {
    taskCell.classList.add("completed");
  }

  const dateCell = document.createElement("td");
  dateCell.textContent = todo.createdAt;

  const completeCheckbox = document.createElement("input");
  completeCheckbox.type = "checkbox";
  completeCheckbox.checked = todo.completed;
  completeCheckbox.addEventListener("change", () =>
    toggleComplete(todo.id, taskCell, completeCheckbox)
  );

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "🗑";
  deleteButton.addEventListener("click", () =>
    deleteTodo(todo.id, row)
  );

  const completeCell = document.createElement("td");
  completeCell.appendChild(completeCheckbox);

  const deleteCell = document.createElement("td");
  deleteCell.appendChild(deleteButton);

  row.appendChild(taskCell);
  row.appendChild(dateCell);
  row.appendChild(completeCell);
  row.appendChild(deleteCell);

  todoTableBody.appendChild(row);
}

function toggleComplete(todoId, taskCell, checkbox) {
  const todos = getTodos().map(todo => {
    if (todo.id === todoId) {
      todo.completed = checkbox.checked;
    }
    return todo;
  });

  saveTodosToLocalStorage(todos);
  taskCell.classList.toggle("completed", checkbox.checked);
}

function deleteTodo(todoId, row) {
  const todos = getTodos().filter(todo => todo.id !== todoId);
  saveTodosToLocalStorage(todos);
  row.remove();
  showMessage("TODO deleted!");
}

function clearCompleted() {
  const todos = getTodos().filter(todo => !todo.completed);
  saveTodosToLocalStorage(todos);

  // Clear and re-render
  todoTableBody.innerHTML = "";
  todos.forEach(renderTodo);

  showMessage("Completed TODOs cleared!");
}

addTodoButton.addEventListener("click", addTodo);
clearCompletedButton.addEventListener("click", clearCompleted);
todoInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});

const BASE_API_URL = 'https://mx.velodata.org/api/v2';

const fetchForm = document.getElementById('fetch-user-form');
const updateForm = document.getElementById('update-address-form');
const responseMessage = document.getElementById('response-message');
const userIdInput = document.getElementById('user-id');

let currentUserId = null;

const fields = {
  name: document.getElementById('name'),
  address_1: document.getElementById('address_1'),
  address_2: document.getElementById('address_2'),
  address_3: document.getElementById('address_3'),
  city: document.getElementById('city'),
  state: document.getElementById('state'),
  postcode: document.getElementById('postcode')
};

fetchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = userIdInput.value.trim();
  if (!userId) return;

  try {
    const res = await fetch(`${BASE_API_URL}/teach/users/${userId}`);
    if (!res.ok) throw new Error(`User ${userId} not found`);
    const { data } = await res.json();

    currentUserId = data.id;
    const attrs = data.attributes;

    fields.name.value = attrs.name || '';
    fields.address_1.value = attrs.address_1 || '';
    fields.address_2.value = attrs.address_2 || '';
    fields.address_3.value = attrs.address_3 || '';
    fields.city.value = attrs.city || '';
    fields.state.value = attrs.state || '';
    fields.postcode.value = attrs.postcode || '';

    document.getElementById('profile-image').src = attrs.profile_image || 'https://via.placeholder.com/100x100?text=No+Image';

    updateForm.classList.remove('d-none');
    responseMessage.innerHTML = '';
  } catch (err) {
    updateForm.classList.add('d-none');
    responseMessage.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
  }
});

updateForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUserId) return;

  const payload = {
    address_1: fields.address_1.value.trim(),
    address_2: fields.address_2.value.trim(),
    address_3: fields.address_3.value.trim(),
    city: fields.city.value.trim(),
    state: fields.state.value.trim(),
    postcode: fields.postcode.value.trim()
  };

  try {
    const res = await fetch(`${BASE_API_URL}/teach/users/${currentUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`Update failed with status ${res.status}`);
    const result = await res.json();

    responseMessage.innerHTML = `<div class="alert alert-success">Address updated successfully for user ID: ${result.user.id}</div>`;
  } catch (err) {
    responseMessage.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
  }
});



