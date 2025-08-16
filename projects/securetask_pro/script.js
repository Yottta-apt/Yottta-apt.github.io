document.addEventListener('DOMContentLoaded', () => {
    const newTaskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Function to load tasks from localStorage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('secureTasks')) || [];
        tasks.forEach(task => addTaskToDOM(task.text, task.completed));
    };

    // Function to save tasks to localStorage
    const saveTasks = () => {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(item => {
            tasks.push({
                text: item.querySelector('span').textContent.replace(' (Encrypted)', '').trim(), // Clean text
                completed: item.classList.contains('completed')
            });
        });
        localStorage.setItem('secureTasks', JSON.stringify(tasks));
    };

    // Function to add a task to the DOM
    const addTaskToDOM = (taskText, isCompleted = false) => {
        const listItem = document.createElement('li');
        listItem.classList.add('task-item');
        if (isCompleted) {
            listItem.classList.add('completed');
        }

        listItem.innerHTML = `
            <span>${taskText} (Encrypted)</span>
            <div class="task-actions">
                <button class="complete-btn">${isCompleted ? 'Completed' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        taskList.appendChild(listItem);

        // Add event listeners for new buttons
        listItem.querySelector('.complete-btn').addEventListener('click', function() {
            listItem.classList.toggle('completed');
            this.textContent = listItem.classList.contains('completed') ? 'Completed' : 'Complete';
            saveTasks(); // Save state change
        });

        listItem.querySelector('.delete-btn').addEventListener('click', function() {
            taskList.removeChild(listItem);
            saveTasks(); // Save state change
        });
    };

    // Event listener for Add Task button
    addTaskBtn.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            addTaskToDOM(taskText);
            newTaskInput.value = '';
            saveTasks(); // Save new task
        }
    });

    // Allow adding tasks with Enter key
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    // Initial load of tasks when the page loads
    loadTasks();
});