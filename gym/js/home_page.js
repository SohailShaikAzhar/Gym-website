document.addEventListener('DOMContentLoaded', function() {

    // Expandable class card functionality
    document.querySelectorAll('.learn-more-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = btn.closest('.expandable');
            card.classList.toggle('expanded');
            if (card.classList.contains('expanded')) {
                btn.textContent = 'Show Less';
            } else {
                btn.textContent = 'Learn More';
            }
        });
    });

    // Dynamic Copyright Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name === '' || email === '' || message === '') {
                alert('Please fill out all required fields.');
                return;
            }
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // If validation passes
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Newsletter Form Validation
    const newsletterForm = document.getElementById('newsletterForm');
    if(newsletterForm) {
        newsletterForm.addEventListener('submit', function(e){
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // If validation passes
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});