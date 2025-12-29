document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
    }

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        });
    });

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header styling on scroll
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shadow-md', 'bg-white/90', 'backdrop-blur-sm');
                header.classList.remove('bg-white');
            } else {
                header.classList.remove('shadow-md', 'bg-white/90', 'backdrop-blur-sm');
                header.classList.add('bg-white');
            }
        });
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const statusDiv = document.getElementById('status-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous status
            if (statusDiv) {
                statusDiv.classList.add('hidden');
                statusDiv.classList.remove('bg-green-100', 'text-green-700', 'bg-red-100', 'text-red-700');
                statusDiv.textContent = '';
            }

            // Get values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Client-side validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            // Set loading state
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // API URL (Backend expected on port 5000)
                const API_URL = 'https://jephta-backend.onrender.com/send-email';

                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Message sent successfully! Thank you for contacting me.');
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Something went wrong.');
                }

            } catch (error) {
                console.error('Error:', error);
                alert(`Error: ${error.message}. Is the server running?`);
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
            // // 
            // message.addEventListener('input', () => {
            //     submitBtn.disabled = false;
            // });

        });
    }
});
