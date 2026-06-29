(function() {
    let tasks = [];
    let currentFilter = 'all';

    const taskListEl = document.getElementById('taskList');
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const filterTabs = document.getElementById('filterTabs');
    const taskCountSpan = document.getElementById('taskCount');

    function generateId() {
        return Date.now() + Math.random().toString(36).slice(2, 8);
    }

    function render() {
        let filtered = tasks;
        if (currentFilter === 'active') {
            filtered = tasks.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filtered = tasks.filter(t => t.completed);
        }

        taskListEl.innerHTML = '';

        if (filtered.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-state';
            emptyDiv.innerHTML = `
                <i class="fas fa-clipboard-list"></i>
                <p>No tasks yet. Add one above!</p>
                <div class="sub-message">✨ stay productive</div>
            `;
            taskListEl.appendChild(emptyDiv);
        } else {
            filtered.forEach(task => {
                const li = document.createElement('li');
                li.className = 'task-item' + (task.completed ? ' completed' : '');
                li.dataset.id = task.id;

                const leftDiv = document.createElement('div');
                leftDiv.className = 'task-left';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = task.completed;
                checkbox.addEventListener('change', function(e) {
                    e.stopPropagation();
                    toggleTaskCompletion(task.id);
                });

                const textSpan = document.createElement('span');
                textSpan.className = 'task-text';
                textSpan.textContent = task.text;

                leftDiv.appendChild(checkbox);
                leftDiv.appendChild(textSpan);

                const delBtn = document.createElement('button');
                delBtn.className = 'delete-btn';
                delBtn.innerHTML = '<i class="fas fa-times"></i>';
                delBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    deleteTask(task.id);
                });

                li.appendChild(leftDiv);
                li.appendChild(delBtn);
                taskListEl.appendChild(li);
            });
        }

        const activeCount = tasks.filter(t => !t.completed).length;
        taskCountSpan.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`;

        document.querySelectorAll('.filter-tabs button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === currentFilter) {
                btn.classList.add('active');
            }
        });
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (text === '') {
            taskInput.focus();
            return;
        }

        tasks.push({
            id: generateId(),
            text: text,
            completed: false,
        });
        taskInput.value = '';
        taskInput.focus();
        render();
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        render();
    }

    function toggleTaskCompletion(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            render();
        }
    }

    function setFilter(filter) {
        if (filter === currentFilter) return;
        currentFilter = filter;
        render();
    }

    addBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    filterTabs.addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (!btn || !btn.dataset.filter) return;
        setFilter(btn.dataset.filter);
    });

    tasks = [
        {
            id: generateId(),
            text: 'Review design draft',
            completed: false,
        },
        {
            id: generateId(),
            text: 'Prepare weekly report',
            completed: false,
        },
        {
            id: generateId(),
            text: 'Team sync at 3pm',
            completed: true,
        },
    ];

    render();
})();