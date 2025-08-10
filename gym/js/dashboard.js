// Dashboard Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard components
    initializeProgressChart();
    initializeGoalModal();
    initializeUserMenu();
    initializeDashboardInteractions();
    updateDashboardData();
});

// Initialize Progress Chart using Chart.js
function initializeProgressChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;

    const progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Weight (lbs)',
                data: [200, 198, 195, 192],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: 'Body Fat %',
                data: [22, 21.5, 21, 20.5],
                borderColor: '#48bb78',
                backgroundColor: 'rgba(72, 187, 120, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
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
    });

    // Handle period change
    const periodSelect = document.querySelector('.progress-period');
    if (periodSelect) {
        periodSelect.addEventListener('change', function() {
            updateChartData(progressChart, this.value);
        });
    }
}

// Update chart data based on selected period
function updateChartData(chart, period) {
    let labels, weightData, fatData;
    
    switch(period) {
        case 'week':
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            weightData = [192, 191.8, 191.5, 191.2, 191, 190.8, 190.5];
            fatData = [20.5, 20.4, 20.3, 20.2, 20.1, 20.0, 19.9];
            break;
        case 'month':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            weightData = [200, 198, 195, 192];
            fatData = [22, 21.5, 21, 20.5];
            break;
        case 'year':
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            weightData = [210, 208, 205, 202, 200, 198, 196, 194, 192, 190, 188, 186];
            fatData = [25, 24.5, 24, 23.5, 23, 22.5, 22, 21.5, 21, 20.5, 20, 19.5];
            break;
    }
    
    chart.data.labels = labels;
    chart.data.datasets[0].data = weightData;
    chart.data.datasets[1].data = fatData;
    chart.update();
}

// Initialize Goal Modal
function initializeGoalModal() {
    const modal = document.getElementById('goalModal');
    const addGoalBtn = document.getElementById('addGoalBtn');
    const closeBtn = document.querySelector('.close');
    const goalForm = document.getElementById('goalForm');

    if (!modal || !addGoalBtn) return;

    // Open modal
    addGoalBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    // Close modal
    closeBtn.addEventListener('click', function() {
        closeModal();
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Handle form submission
    goalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleGoalSubmission();
    });

    // Set minimum date for deadline
    const deadlineInput = document.getElementById('goalDeadline');
    if (deadlineInput) {
        const today = new Date().toISOString().split('T')[0];
        deadlineInput.min = today;
    }
}

// Close modal function
function closeModal() {
    const modal = document.getElementById('goalModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    const goalForm = document.getElementById('goalForm');
    if (goalForm) {
        goalForm.reset();
    }
}

// Handle goal form submission
function handleGoalSubmission() {
    const formData = new FormData(document.getElementById('goalForm'));
    const goalData = {
        type: formData.get('goalType'),
        title: formData.get('goalTitle'),
        target: formData.get('goalTarget'),
        deadline: formData.get('goalDeadline'),
        description: formData.get('goalDescription'),
        progress: 0,
        status: 'in-progress'
    };

    // Add goal to the goals list
    addGoalToList(goalData);
    
    // Close modal
    closeModal();
    
    // Show success notification
    showNotification('Goal created successfully!', 'success');
}

// Add new goal to the goals list
function addGoalToList(goalData) {
    const goalsList = document.querySelector('.goals-list');
    if (!goalsList) return;

    const goalItem = document.createElement('div');
    goalItem.className = 'goal-item';
    goalItem.innerHTML = `
        <div class="goal-info">
            <h4>${goalData.title}</h4>
            <p>Target: ${goalData.target}</p>
            <div class="goal-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${goalData.progress}%"></div>
                </div>
                <span class="progress-text">${goalData.progress}%</span>
            </div>
        </div>
        <span class="goal-status ${goalData.status}">${goalData.status.replace('-', ' ')}</span>
    `;

    // Add animation
    goalItem.style.opacity = '0';
    goalItem.style.transform = 'translateY(20px)';
    goalsList.appendChild(goalItem);

    // Animate in
    setTimeout(() => {
        goalItem.style.transition = 'all 0.3s ease';
        goalItem.style.opacity = '1';
        goalItem.style.transform = 'translateY(0)';
    }, 10);
}

// Initialize User Menu
function initializeUserMenu() {
    const userToggle = document.querySelector('.user-toggle');
    const userDropdown = document.querySelector('.user-dropdown');

    if (!userToggle || !userDropdown) return;

    // Toggle dropdown on click (for mobile)
    userToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        userDropdown.classList.remove('show');
    });

    // Handle dropdown item clicks
    const dropdownItems = userDropdown.querySelectorAll('a');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.getAttribute('href').substring(1);
            handleUserAction(action);
        });
    });
}

// Handle user menu actions
function handleUserAction(action) {
    switch(action) {
        case 'profile':
            showNotification('Profile page coming soon!', 'info');
            break;
        case 'settings':
            showNotification('Settings page coming soon!', 'info');
            break;
        case 'logout':
            if (confirm('Are you sure you want to logout?')) {
                showNotification('Logging out...', 'info');
                // Add logout logic here
            }
            break;
    }
}

// Initialize Dashboard Interactions
function initializeDashboardInteractions() {
    // Workout actions
    const startWorkoutBtn = document.querySelector('.workout-actions .btn-primary');
    if (startWorkoutBtn) {
        startWorkoutBtn.addEventListener('click', function() {
            showNotification('Starting workout...', 'success');
            // Add workout start logic here
        });
    }

    // Class join buttons
    const joinButtons = document.querySelectorAll('.classes-card .btn-outline');
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            const className = this.closest('.class-item').querySelector('h4').textContent;
            showNotification(`Joining ${className}...`, 'success');
            // Add class joining logic here
        });
    });

    // Log meal button
    const logMealBtn = document.querySelector('.nutrition-card .btn-outline');
    if (logMealBtn) {
        logMealBtn.addEventListener('click', function() {
            showNotification('Meal logging coming soon!', 'info');
        });
    }

    // View details buttons
    const viewDetailsBtns = document.querySelectorAll('.btn-outline');
    viewDetailsBtns.forEach(button => {
        if (button.textContent === 'View Details') {
            button.addEventListener('click', function() {
                showNotification('Detailed view coming soon!', 'info');
            });
        }
    });
}

// Update Dashboard Data
function updateDashboardData() {
    // Update current date
    updateCurrentDate();
    
    // Update quick stats with real-time data
    updateQuickStats();
    
    // Update nutrition data
    updateNutritionData();
}

// Update current date in workout card
function updateCurrentDate() {
    const workoutDate = document.querySelector('.workout-date');
    if (workoutDate) {
        const today = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        workoutDate.textContent = today.toLocaleDateString('en-US', options);
    }

    const nutritionDate = document.querySelector('.nutrition-date');
    if (nutritionDate) {
        const today = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        nutritionDate.textContent = today.toLocaleDateString('en-US', options);
    }
}

// Update quick stats with animated counters
function updateQuickStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const finalValue = stat.textContent;
        const isPercentage = finalValue.includes('%');
        const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
        
        if (!isNaN(numericValue)) {
            animateCounter(stat, 0, numericValue, isPercentage);
        }
    });
}

// Animate counter from start to end value
function animateCounter(element, start, end, isPercentage) {
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = isPercentage ? `${current}%` : current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Update nutrition data with real-time values
function updateNutritionData() {
    // Simulate real-time nutrition updates
    const macroBars = document.querySelectorAll('.macro-fill');
    const macroValues = document.querySelectorAll('.macro-value');
    
    macroBars.forEach((bar, index) => {
        const currentWidth = bar.style.width;
        const targetWidth = getRandomWidth();
        
        // Animate to new width
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, index * 200);
    });
}

// Get random width for nutrition bars (for demo purposes)
function getRandomWidth() {
    const widths = ['75%', '82%', '78%', '85%'];
    return widths[Math.floor(Math.random() * widths.length)];
}

// Show notification function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Get notification color based on type
function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#48bb78';
        case 'error': return '#f56565';
        case 'warning': return '#ed8936';
        default: return '#4299e1';
    }
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.classList.contains('btn-outline') || this.textContent === 'View Details') {
            this.style.pointerEvents = 'none';
            const originalText = this.textContent;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.pointerEvents = 'auto';
            }, 2000);
        }
    });
});

// Add hover effects for cards
document.querySelectorAll('.dashboard-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Initialize tooltips for progress bars
document.querySelectorAll('.progress-bar').forEach(bar => {
    bar.addEventListener('mouseenter', function() {
        const fill = this.querySelector('.progress-fill');
        const width = fill.style.width;
        this.title = `Progress: ${width}`;
    });
});

// Add keyboard navigation for modal
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('goalModal');
    if (modal && modal.style.display === 'block') {
        if (e.key === 'Escape') {
            closeModal();
        }
    }
});

// Add form validation for goal creation
function validateGoalForm() {
    const title = document.getElementById('goalTitle').value.trim();
    const target = document.getElementById('goalTarget').value.trim();
    const deadline = document.getElementById('goalDeadline').value;
    
    if (title.length < 3) {
        showNotification('Goal title must be at least 3 characters long', 'error');
        return false;
    }
    
    if (target.length < 2) {
        showNotification('Please enter a valid target value', 'error');
        return false;
    }
    
    if (!deadline) {
        showNotification('Please select a deadline', 'error');
        return false;
    }
    
    const selectedDate = new Date(deadline);
    const today = new Date();
    if (selectedDate <= today) {
        showNotification('Deadline must be in the future', 'error');
        return false;
    }
    
    return true;
}

// Override form submission to include validation
const goalForm = document.getElementById('goalForm');
if (goalForm) {
    goalForm.addEventListener('submit', function(e) {
        if (!validateGoalForm()) {
            e.preventDefault();
            return false;
        }
    });
}