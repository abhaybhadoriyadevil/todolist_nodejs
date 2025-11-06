// Function to clean up index.ejs
exports.cleanupIndexFile = async () => {
    try {
        const fs = require('fs').promises;
        const path = require('path');
        
        const indexPath = path.join(__dirname, '..', 'views', 'index.ejs');
        const newContent = `<%- include('partials/header') %>

<div class="todo-container">
    <div class="todo-header">
        <h1>⚡NeoTask</h1>
        <div class="nav-links">
            <a href="/todos" class="view-todos-btn">
                <i class="fas fa-tasks"></i> View All Tasks
            </a>
        </div>
    </div>

    <!-- Add Task Form -->
    <form action="/add" method="POST" class="todo-form" id="todoForm">
        <div class="form-group">
            <input type="text" name="title" class="todo-input" placeholder="Task title..." required id="taskInput">
            <textarea name="description" class="todo-textarea" placeholder="Task description (optional)"></textarea>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Due Date:</label>
                <input type="datetime-local" name="dueDate" class="todo-input">
            </div>

            <div class="form-group">
                <label>Priority:</label>
                <select name="priority" class="todo-select">
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <div class="form-group">
                <label>Category:</label>
                <select name="category" class="todo-select">
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="shopping">Shopping</option>
                    <option value="health">Health</option>
                </select>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Tags:</label>
                <input type="text" name="tags" class="todo-input" placeholder="Comma-separated tags">
            </div>

            <div class="form-group">
                <label>Estimated Time (minutes):</label>
                <input type="number" name="estimatedTime" class="todo-input" min="0">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group recurring-group">
                <label>
                    <input type="checkbox" name="isRecurring" id="isRecurring">
                    Recurring Task
                </label>
                <div class="recurring-options" style="display: none;">
                    <select name="frequency" class="todo-select">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                    <input type="date" name="recurringEndDate" class="todo-input" placeholder="End Date">
                </div>
            </div>
        </div>

        <button type="submit" class="todo-button">Add Task</button>
    </form>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Auto-focus input when page loads
        document.getElementById('taskInput').focus();

        // Recurring options toggle
        const isRecurringEl = document.getElementById('isRecurring');
        if (isRecurringEl) {
            isRecurringEl.addEventListener('change', function() {
                const recurringOptions = document.querySelector('.recurring-options');
                recurringOptions.style.display = this.checked ? 'flex' : 'none';
            });
        }

        // Form validation
        document.getElementById('todoForm').addEventListener('submit', function(e) {
            const title = document.getElementById('taskInput').value.trim();
            if (!title) {
                e.preventDefault();
                alert('Please enter a task title');
                return;
            }

            if (isRecurringEl.checked) {
                const endDate = document.querySelector('input[name="recurringEndDate"]').value;
                if (!endDate) {
                    e.preventDefault();
                    alert('Please set an end date for recurring task');
                    return;
                }
            }
        });

        // Initialize datepicker if available
        if (typeof flatpickr !== 'undefined') {
            flatpickr('input[type="datetime-local"]', {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                time_24hr: true
            });
        }
    });
</script>

<%- include('partials/footer') %>`;

        await fs.writeFile(indexPath, newContent, 'utf8');
        console.log('Successfully cleaned up index.ejs');
        
    } catch (error) {
        console.error('Error cleaning up index.ejs:', error);
    }
};