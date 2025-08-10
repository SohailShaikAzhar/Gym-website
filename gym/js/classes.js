document.addEventListener('DOMContentLoaded', function() {
    
    // Class filtering functionality
    const filterTabs = document.querySelectorAll('.filter-tab');
    const classCards = document.querySelectorAll('.class-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter class cards
            classCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.classList.add('visible');
                        card.classList.remove('hidden');
                    }, 100);
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('visible');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Class booking functionality
    const bookButtons = document.querySelectorAll('.book-class');
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close');
    const bookingForm = document.getElementById('bookingForm');
    const classNameInput = document.getElementById('className');
    const classTimeSelect = document.getElementById('classTime');
    
    // Class time mappings
    const classTimes = {
        'CrossFit': ['7:00 AM', '6:00 PM'],
        'Zumba': ['11:00 AM'],
        'Boxing': ['6:00 PM'],
        'Yoga': ['8:00 AM', '7:00 PM'],
        'Personal Training': ['By Appointment'],
        'HIIT Training': ['5:30 PM']
    };

    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const className = this.getAttribute('data-class');
            classNameInput.value = className;
            
            // Populate time options
            classTimeSelect.innerHTML = '<option value="">Select Time</option>';
            const times = classTimes[className] || [];
            times.forEach(time => {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                classTimeSelect.appendChild(option);
            });
            
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('classDate').min = today;
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Handle booking form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const bookingData = {
            className: document.getElementById('className').value,
            classDate: document.getElementById('classDate').value,
            classTime: document.getElementById('classTime').value,
            memberName: document.getElementById('memberName').value,
            memberEmail: document.getElementById('memberEmail').value,
            memberPhone: document.getElementById('memberPhone').value
        };

        // Validate form
        if (!validateBookingForm(bookingData)) {
            return;
        }

        // Simulate booking submission
        submitBooking(bookingData);
    });

    // Schedule navigation
    let currentWeekOffset = 0;
    const scheduleNav = {
        prev: document.querySelector('.prev-week'),
        next: document.querySelector('.next-week'),
        currentWeek: document.getElementById('current-week')
    };

    scheduleNav.prev.addEventListener('click', function() {
        currentWeekOffset--;
        updateScheduleDisplay();
    });

    scheduleNav.next.addEventListener('click', function() {
        currentWeekOffset++;
        updateScheduleDisplay();
    });

    // Schedule slot booking
    const scheduleBookButtons = document.querySelectorAll('.book-slot');
    scheduleBookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const classSlot = this.closest('.class-slot');
            const classInfo = classSlot.querySelector('.class-info');
            const className = classInfo.querySelector('h4').textContent;
            const classTime = classInfo.querySelector('p').textContent;
            
            if (className === 'Closed') return;
            
            // Pre-fill the booking form
            classNameInput.value = className;
            
            // Extract time from the schedule
            const timeMatch = classTime.match(/(\d{1,2}:\d{2}\s*[AP]M)/);
            if (timeMatch) {
                classTimeSelect.innerHTML = '<option value="">Select Time</option>';
                const option = document.createElement('option');
                option.value = timeMatch[1];
                option.textContent = timeMatch[1];
                classTimeSelect.appendChild(option);
                classTimeSelect.value = timeMatch[1];
            }
            
            // Set date to the current week
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + (currentWeekOffset * 7));
            const dayOfWeek = currentDate.getDay();
            const targetDay = getDayOffset(className, classTime);
            if (targetDay !== null) {
                currentDate.setDate(currentDate.getDate() + targetDay);
                document.getElementById('classDate').value = currentDate.toISOString().split('T')[0];
            }
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Initialize schedule display
    updateScheduleDisplay();

    // Utility functions
    function validateBookingForm(data) {
        if (!data.className || !data.classDate || !data.classTime || 
            !data.memberName || !data.memberEmail || !data.memberPhone) {
            showNotification('Please fill out all required fields.', 'error');
            return false;
        }

        if (!validateEmail(data.memberEmail)) {
            showNotification('Please enter a valid email address.', 'error');
            return false;
        }

        if (!validatePhone(data.memberPhone)) {
            showNotification('Please enter a valid phone number.', 'error');
            return false;
        }

        return true;
    }

    function submitBooking(bookingData) {
        // Show loading state
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Success
            showNotification('Class booked successfully! We\'ll send you a confirmation email.', 'success');
            bookingForm.reset();
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    function updateScheduleDisplay() {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + (currentWeekOffset * 7));
        
        // Get the start of the week (Monday)
        const dayOfWeek = currentDate.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(currentDate);
        monday.setDate(currentDate.getDate() + mondayOffset);
        
        // Format the week display
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const weekStart = monday.toLocaleDateString('en-US', options);
        const weekEnd = new Date(monday);
        weekEnd.setDate(monday.getDate() + 6);
        const weekEndStr = weekEnd.toLocaleDateString('en-US', options);
        
        scheduleNav.currentWeek.textContent = `Week of ${weekStart} - ${weekEndStr}`;
    }

    function getDayOffset(className, classTime) {
        const dayMap = {
            'Monday': 0,
            'Tuesday': 1,
            'Wednesday': 2,
            'Thursday': 3,
            'Friday': 4,
            'Saturday': 5,
            'Sunday': 6
        };

        // Extract day from class time or use class name to determine day
        for (const [day, offset] of Object.entries(dayMap)) {
            if (classTime.includes(day) || className.includes(day)) {
                return offset;
            }
        }
        
        return null;
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 3000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#28a745';
                break;
            case 'error':
                notification.style.backgroundColor = '#dc3545';
                break;
            case 'warning':
                notification.style.backgroundColor = '#ffc107';
                notification.style.color = '#212529';
                break;
            default:
                notification.style.backgroundColor = '#17a2b8';
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.length <= 1) return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('.main-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add loading animation to class cards
    classCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 100);
    });

    // Keyboard navigation for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Form field focus effects
    const formInputs = document.querySelectorAll('.form-group input, .form-group select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Auto-populate member info if available in localStorage
    const savedMemberInfo = localStorage.getItem('memberInfo');
    if (savedMemberInfo) {
        try {
            const memberInfo = JSON.parse(savedMemberInfo);
            if (memberInfo.name) document.getElementById('memberName').value = memberInfo.name;
            if (memberInfo.email) document.getElementById('memberEmail').value = memberInfo.email;
            if (memberInfo.phone) document.getElementById('memberPhone').value = memberInfo.phone;
        } catch (e) {
            console.log('Could not load saved member info');
        }
    }

    // Save member info on form submission
    bookingForm.addEventListener('submit', function() {
        const memberInfo = {
            name: document.getElementById('memberName').value,
            email: document.getElementById('memberEmail').value,
            phone: document.getElementById('memberPhone').value
        };
        localStorage.setItem('memberInfo', JSON.stringify(memberInfo));
    });
});