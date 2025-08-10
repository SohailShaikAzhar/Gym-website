// Dashboard Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    
    // Initialize Chart.js for progress visualization
    initializeProgressChart();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load user data
    loadUserData();
});

// Dashboard initialization
function initializeDashboard() {
    // Set current date
    const currentDate = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.querySelector('.current-date').textContent = currentDate.toLocaleDateString('en-US', dateOptions);
    
    // Update quick stats
    updateQuickStats();
    
    // Load today's workout
    loadTodaysWorkout();
    
    // Load upcoming classes
    loadUpcomingClasses();
    
    // Load fitness goals
    loadFitnessGoals();
    
    // Load recent workouts
    loadRecentWorkouts();
    
    // Load nutrition data
    loadNutritionData();
}

// Initialize Chart.js progress chart
function initializeProgressChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;
    
    // Create canvas element for Chart.js
    const canvas = document.createElement('canvas');
    canvas.id = 'progressChartCanvas';
    ctx.appendChild(canvas);
    
    // Sample data - in real app, this would come from backend
    const chartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Weight (lbs)',
            data: [180, 178, 176, 174],
            borderColor: '#ff6b35',
            backgroundColor: 'rgba(255, 107, 53, 0.1)',
            tension: 0.4,
            fill: true
        }, {
            label: 'Body Fat %',
            data: [22, 21.5, 21, 20.5],
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };
    
    const config = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            elements: {
                point: {
                    radius: 6,
                    hoverRadius: 8
                }
            }
        }
    };
    
    // Create chart
    const progressChart = new Chart(canvas, config);
    
    // Store chart reference for potential updates
    window.progressChart = progressChart;
}

// Set up event listeners
function setupEventListeners() {
    // Add goal button
    const addGoalBtn = document.querySelector('.add-goal-btn');
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', openAddGoalModal);
    }
    
    // Modal close button
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeAddGoalModal);
    }
    
    // Modal backdrop click
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAddGoalModal();
            }
        });
    }
    
    // Add goal form submission
    const addGoalForm = document.getElementById('addGoalForm');
    if (addGoalForm) {
        addGoalForm.addEventListener('submit', handleAddGoal);
    }
    
    // User avatar click
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
        userAvatar.addEventListener('click', toggleUserMenu);
    }
    
    // Start workout button
    const startWorkoutBtn = document.querySelector('.start-workout-btn');
    if (startWorkoutBtn) {
        startWorkoutBtn.addEventListener('click', startWorkout);
    }
    
    // Log workout button
    const logWorkoutBtn = document.querySelector('.log-workout-btn');
    if (logWorkoutBtn) {
        logWorkoutBtn.addEventListener('click', logWorkout);
    }
}

// Update quick stats
function updateQuickStats() {
    // In real app, these would come from backend
    const stats = {
        workouts: 12,
        goalProgress: 75,
        classesThisWeek: 3
    };
    
    document.querySelector('.workouts-count .stat-number').textContent = stats.workouts;
    document.querySelector('.goal-progress-count .stat-number').textContent = stats.goalProgress + '%';
    document.querySelector('.classes-count .stat-number').textContent = stats.classesThisWeek;
}

// Load today's workout
function loadTodaysWorkout() {
    // Sample workout data - in real app, this would come from backend
    const todaysWorkout = {
        name: 'Upper Body Strength',
        type: 'Strength Training',
        duration: '45 minutes',
        intensity: 'High',
        exercises: ['Bench Press', 'Pull-ups', 'Overhead Press', 'Rows']
    };
    
    const workoutName = document.querySelector('.workout-name');
    const workoutDetails = document.querySelector('.workout-details');
    
    if (workoutName) {
        workoutName.textContent = todaysWorkout.name;
    }
    
    if (workoutDetails) {
        workoutDetails.innerHTML = `
            <p><strong>Type:</strong> ${todaysWorkout.type}</p>
            <p><strong>Duration:</strong> ${todaysWorkout.duration}</p>
            <p><strong>Intensity:</strong> ${todaysWorkout.intensity}</p>
        `;
    }
}

// Load upcoming classes
function loadUpcomingClasses() {
    // Sample class data - in real app, this would come from backend
    const upcomingClasses = [
        {
            time: '09:00',
            name: 'Yoga Flow',
            instructor: 'Sarah Johnson'
        },
        {
            time: '17:30',
            name: 'HIIT Cardio',
            instructor: 'Mike Chen'
        },
        {
            time: '19:00',
            name: 'Strength Training',
            instructor: 'Alex Rodriguez'
        }
    ];
    
    const classesList = document.querySelector('.upcoming-classes-list');
    if (!classesList) return;
    
    classesList.innerHTML = '';
    
    upcomingClasses.forEach(classItem => {
        const classElement = document.createElement('div');
        classElement.className = 'class-item';
        classElement.innerHTML = `
            <div class="class-time">${classItem.time}</div>
            <div class="class-details">
                <h4>${classItem.name}</h4>
                <p>with ${classItem.instructor}</p>
            </div>
        `;
        classesList.appendChild(classElement);
    });
}

// Load fitness goals
function loadFitnessGoals() {
    // Sample goals data - in real app, this would come from backend
    const goals = [
        {
            name: 'Lose 10 pounds',
            target: '180 → 170 lbs',
            progress: 60,
            status: 'in-progress'
        },
        {
            name: 'Run 5K',
            target: '0 → 3.1 miles',
            progress: 100,
            status: 'completed'
        },
        {
            name: 'Bench Press 200 lbs',
            target: '150 → 200 lbs',
            progress: 25,
            status: 'not-started'
        }
    ];
    
    const goalsList = document.querySelector('.goals-list');
    if (!goalsList) return;
    
    goalsList.innerHTML = '';
    
    goals.forEach(goal => {
        const goalElement = document.createElement('div');
        goalElement.className = 'goal-item';
        goalElement.innerHTML = `
            <div class="goal-header">
                <span class="goal-name">${goal.name}</span>
                <span class="goal-status ${goal.status}">${goal.status.replace('-', ' ')}</span>
            </div>
            <div class="goal-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${goal.progress}%"></div>
                </div>
            </div>
            <div class="goal-target">${goal.target}</div>
        `;
        goalsList.appendChild(goalElement);
    });
}

// Load recent workouts
function loadRecentWorkouts() {
    // Sample workout history - in real app, this would come from backend
    const recentWorkouts = [
        {
            name: 'Lower Body Strength',
            date: '2 days ago',
            rating: 4
        },
        {
            name: 'Cardio HIIT',
            date: '3 days ago',
            rating: 5
        },
        {
            name: 'Upper Body',
            date: '5 days ago',
            rating: 3
        }
    ];
    
    const workoutsList = document.querySelector('.recent-workouts-list');
    if (!workoutsList) return;
    
    workoutsList.innerHTML = '';
    
    recentWorkouts.forEach(workout => {
        const workoutElement = document.createElement('div');
        workoutElement.className = 'workout-item';
        
        const stars = generateStars(workout.rating);
        
        workoutElement.innerHTML = `
            <div class="workout-details">
                <h4>${workout.name}</h4>
                <p>${workout.date}</p>
            </div>
            <div class="workout-rating">
                ${stars}
            </div>
        `;
        workoutsList.appendChild(workoutElement);
    });
}

// Generate star rating HTML
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star star"></i>';
        } else {
            stars += '<i class="fas fa-star star empty"></i>';
        }
    }
    return stars;
}

// Load nutrition data
function loadNutritionData() {
    // Sample nutrition data - in real app, this would come from backend
    const nutritionData = {
        protein: { current: 120, target: 150, unit: 'g' },
        carbs: { current: 200, target: 250, unit: 'g' },
        fat: { current: 65, target: 80, unit: 'g' },
        fiber: { current: 25, target: 30, unit: 'g' }
    };
    
    Object.keys(nutritionData).forEach(macro => {
        const macroElement = document.querySelector(`.macro-item[data-macro="${macro}"]`);
        if (!macroElement) return;
        
        const data = nutritionData[macro];
        const percentage = Math.min((data.current / data.target) * 100, 100);
        
        const progressFill = macroElement.querySelector('.macro-fill');
        const currentValue = macroElement.querySelector('.macro-current');
        const targetValue = macroElement.querySelector('.macro-target');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (currentValue) {
            currentValue.textContent = `${data.current}${data.unit}`;
        }
        
        if (targetValue) {
            targetValue.textContent = `${data.target}${data.unit}`;
        }
    });
}

// Open add goal modal
function openAddGoalModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Close add goal modal
function closeAddGoalModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Handle add goal form submission
function handleAddGoal(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const goalData = {
        name: formData.get('goalName'),
        category: formData.get('goalCategory'),
        target: formData.get('goalTarget'),
        deadline: formData.get('goalDeadline'),
        description: formData.get('goalDescription')
    };
    
    // Validate form data
    if (!goalData.name || !goalData.target) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Simulate API call
    showNotification('Adding goal...', 'info');
    
    setTimeout(() => {
        // Add goal to the list
        addGoalToList(goalData);
        
        // Close modal and reset form
        closeAddGoalModal();
        e.target.reset();
        
        showNotification('Goal added successfully!', 'success');
        
        // Update goal count in quick stats
        updateGoalCount();
    }, 1000);
}

// Add goal to the goals list
function addGoalToList(goalData) {
    const goalsList = document.querySelector('.goals-list');
    if (!goalsList) return;
    
    const goalElement = document.createElement('div');
    goalElement.className = 'goal-item';
    goalElement.innerHTML = `
        <div class="goal-header">
            <span class="goal-name">${goalData.name}</span>
            <span class="goal-status not-started">not started</span>
        </div>
        <div class="goal-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
        </div>
        <div class="goal-target">${goalData.target}</div>
    `;
    
    goalsList.appendChild(goalElement);
}

// Update goal count in quick stats
function updateGoalCount() {
    const goalsList = document.querySelector('.goals-list');
    if (!goalsList) return;
    
    const totalGoals = goalsList.children.length;
    const completedGoals = goalsList.querySelectorAll('.goal-status.completed').length;
    const progressPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    
    const goalProgressElement = document.querySelector('.goal-progress-count .stat-number');
    if (goalProgressElement) {
        goalProgressElement.textContent = progressPercentage + '%';
    }
}

// Toggle user menu
function toggleUserMenu() {
    // In real app, this would show a dropdown menu
    showNotification('User menu clicked!', 'info');
}

// Start workout
function startWorkout() {
    showNotification('Starting workout...', 'info');
    
    // In real app, this would navigate to workout page or start workout timer
    setTimeout(() => {
        showNotification('Workout started! Good luck!', 'success');
    }, 1000);
}

// Log workout
function logWorkout() {
    showNotification('Logging workout...', 'info');
    
    // In real app, this would open a workout logging form
    setTimeout(() => {
        showNotification('Workout logged successfully!', 'success');
        
        // Update workout count
        const workoutCountElement = document.querySelector('.workouts-count .stat-number');
        if (workoutCountElement) {
            const currentCount = parseInt(workoutCountElement.textContent);
            workoutCountElement.textContent = currentCount + 1;
        }
    }, 1000);
}

// Load user data
function loadUserData() {
    // In real app, this would fetch user data from backend
    const userData = {
        name: 'John Doe',
        role: 'Premium Member',
        avatar: 'JD'
    };
    
    // Update user info in header
    const userNameElement = document.querySelector('.user-name');
    const userRoleElement = document.querySelector('.user-role');
    const userAvatarElement = document.querySelector('.user-avatar');
    
    if (userNameElement) {
        userNameElement.textContent = userData.name;
    }
    
    if (userRoleElement) {
        userRoleElement.textContent = userData.role;
    }
    
    if (userAvatarElement) {
        userAvatarElement.textContent = userData.avatar;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Utility function to format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Utility function to format time
function formatTime(date) {
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('en-US', options);
}

// Export functions for potential external use
window.dashboardFunctions = {
    initializeDashboard,
    updateQuickStats,
    loadTodaysWorkout,
    loadUpcomingClasses,
    loadFitnessGoals,
    loadRecentWorkouts,
    loadNutritionData,
    openAddGoalModal,
    closeAddGoalModal,
    showNotification
};