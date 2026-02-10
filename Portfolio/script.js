

window.addEventListener("load", () => {

    const animations = [
        { selector: ".top-tags", class: "from-top", delay: 0 },
        { selector: ".left h1", class: "from-left", delay: 0.3 },
        { selector: ".desc", class: "from-left", delay: 0.6 },
        { selector: ".live-line", class: "from-bottom", delay: 0.9 },
        { selector: ".buttons", class: "zoom-in", delay: 1.2 },
        { selector: ".site-link", class: "from-bottom", delay: 1.5 },
        { selector: ".right", class: "from-right", delay: 0.6 },
        { selector: ".stats", class: "from-bottom", delay: 1.8 },
    ];

    animations.forEach(item => {
        const el = document.querySelector(item.selector);
        if (el) {
            el.style.animationDelay = `${item.delay}s`;
            el.classList.add(item.class);
        }
    });

    // ===== HIDE INTRO =====
    setTimeout(() => {
        const intro = document.getElementById("intro");
        const site = document.getElementById("real-site");

        intro.classList.add("smooth-out");

        setTimeout(() => {
            intro.style.display = "none";
            site.style.display = "block";
            initScrollAnimations();
        }, 1200);
    }, 3800);
});


// ===============================
// SCROLL REVEAL (SECTIONS)
// ===============================
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        ".slide-in-left, .slide-in-right, .slide-in-up"
    );

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translate(0)";
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    elements.forEach(el => observer.observe(el));
}


// ===============================

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".ul-list li");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach(item => {
        item.classList.remove("active");

        const link = item.querySelector("a");
        if (link && link.getAttribute("href") === `#${current}`) {
            item.classList.add("active");
        }
    });
});

// ===============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            window.scrollTo({
                top: target.offsetTop - 120,
                behavior: "smooth"
            });
        }
    });
});

// ===============================
// TILT CARD EFFECT
// ===============================
const cards = document.querySelectorAll(".project-card");

cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    });
});

// ===============================
// EMAIL JS INTEGRATION
// ===============================
(function () {
    // https://dashboard.emailjs.com/admin/account
    emailjs.init({
        publicKey: "j55OgS5dZ3DHe9plE",
    });
})();

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            // these IDs from the previous steps
            emailjs.sendForm('service_q6lieqp', 'template_ymrylf5', this)
                .then(() => {
                    console.log('SUCCESS!');
                    alert('Message sent successfully!');
                    this.reset();
                }, (error) => {
                    console.log('FAILED...', error);
                    alert('Failed to send message. Please try again.');
                });
        });
    }
});


// ===============================
// MOBILE MENU TOGGLE
// ===============================
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".ul-list");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

    // Close menu when a link is clicked
    document.querySelectorAll(".ul-list li a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
        });
    });
}
// ===============================
// FEEDBACK SYSTEM (JSON Storage)
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    const feedbackTrack = document.getElementById('feedback-track');
    const addBtn = document.getElementById('add-feedback-btn');
    const modal = document.getElementById('feedback-modal');
    const closeBtn = document.querySelector('.close-modal');
    const feedbackForm = document.getElementById('feedback-form');

    // 1. Load Feedback
    loadFeedback();

    function loadFeedback() {
        fetch('feedback.json')
            .then(response => response.json())
            .then(data => {
                feedbackTrack.innerHTML = ''; // Clear existing
                data.forEach(item => {
                    addFeedbackCard(item);
                });
            })
            .catch(error => console.error('Error loading feedback:', error));
    }

    // 2. Render Card
    function addFeedbackCard(data) {
        const card = document.createElement('div');
        card.className = 'feedback-card';
        card.innerHTML = `
            <div class="quote-icon">
                <i class="fas fa-quote-left"></i>
            </div>
            <p class="feedback-text">"${data.message}"</p>
            <div class="client-info">
                <div class="client-details">
                    <h4>${data.name}</h4>
                    <span>${data.role}</span>
                </div>
            </div>
        `;

        feedbackTrack.appendChild(card);

        // Re-apply tilt effect to the new card
        applyTilt(card);
    }

    // 3. Handle Form Submission
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newFeedback = {
                name: document.getElementById('f-name').value,
                role: document.getElementById('f-role').value,
                message: document.getElementById('f-message').value
            };

            fetch('/submit-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newFeedback)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        addFeedbackCard(newFeedback); // Add to UI immediately
                        feedbackForm.reset();
                        modal.style.display = 'none';
                        alert('Thank you for your feedback!');
                    } else {
                        alert('Error submitting feedback. Please try again.');
                    }
                })
               .catch(error => {
                    console.error('Error:', error);
                    alert('Error: Could not connect to the server. If this is deployed on a static site (like GitHub Pages), the Python backend will not work.');
                });
        });
    }

    // 4. Modal Interactions
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Tilt Helper
    function applyTilt(card) {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
        });
    }
});

