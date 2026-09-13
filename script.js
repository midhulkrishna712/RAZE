document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    // Elements
    // ============================================================
    const summonBtns = document.querySelectorAll('#summon-nexus-btn, #hero-cta-btn, #cta-summon-btn');
    const chatbotOverlay = document.getElementById('chatbot-overlay');
    const closeBtn = document.getElementById('close-chatbot');
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    // ============================================================
    // Floating Particles
    // ============================================================
    const particlesContainer = document.getElementById('particles-container');
    const colors = ['#ff4500', '#ffae00', '#ff2a00', '#ffc44d', '#ffd700'];

    function createParticles() {
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 8 + 4;
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = color;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 20 + 15) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    createParticles();

    // ============================================================
    // Navbar Scroll Effect
    // ============================================================
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        const sections = document.querySelectorAll('.section');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ============================================================
    // Scroll-triggered animations (Intersection Observer)
    // ============================================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.power-card, .mission-card, .trait-card, .timeline-item, .identity-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add the in-view style
    const style = document.createElement('style');
    style.textContent = '.in-view { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

    // Staggered animations for grids
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll('.power-card, .mission-card, .trait-card');
                children.forEach((child, index) => {
                    child.style.transitionDelay = (index * 0.1) + 's';
                    setTimeout(() => child.classList.add('in-view'), 10);
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('.powers-grid, .mission-cards, .trait-grid').forEach(el => {
        staggerObserver.observe(el);
    });

    // ============================================================
    // Power bar animation
    // ============================================================
    const powerBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.power-bar-fill');
                fills.forEach(fill => {
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 300);
                });
            }
        });
    }, { threshold: 0.3 });

    const powersGrid = document.querySelector('.powers-grid');
    if (powersGrid) powerBarObserver.observe(powersGrid);

    // ============================================================
    // Chatbot State Machine
    // ============================================================
    let currentState = 'init';
    const userData = {
        name: '',
        age: '',
        location: '',
        email: '',
        grievance: ''
    };

    // Open Chatbot
    summonBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            chatbotOverlay.classList.remove('hidden');
            if (currentState === 'init') {
                setTimeout(() => {
                    razeSpeak("Signal fire lit. Connection established.");
                    setTimeout(() => {
                        razeSpeak("Yo! I'm Raze. I burn away the darkness and protect the living. What's your name?");
                        currentState = 'awaiting_name';
                    }, 1200);
                }, 500);
            }
            setTimeout(() => chatInput.focus(), 300);
        });
    });

    // Close Chatbot
    closeBtn.addEventListener('click', () => {
        chatbotOverlay.classList.add('hidden');
    });

    // Close on overlay click
    chatbotOverlay.addEventListener('click', (e) => {
        if (e.target === chatbotOverlay) {
            chatbotOverlay.classList.add('hidden');
        }
    });

    // Handle Input
    const handleInput = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        userSpeak(text);
        chatInput.value = '';
        processState(text);
    };

    sendBtn.addEventListener('click', handleInput);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleInput();
    });

    // Chat Functions
    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message message-${sender}`;
        msgDiv.textContent = text;
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function userSpeak(text) {
        appendMessage(text, 'user');
    }

    function razeSpeak(text) {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        chatWindow.appendChild(typingDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        const delay = Math.max(800, text.length * 18);

        setTimeout(() => {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();
            appendMessage(text, 'nexus');
        }, delay);
    }

    function processState(input) {
        switch(currentState) {
            case 'awaiting_name':
                userData.name = input;
                currentState = 'awaiting_age';
                razeSpeak(`Nice to meet you, ${userData.name}! How many years have you been fighting the good fight? (How old are you?)`);
                break;
            
            case 'awaiting_age':
                userData.age = input;
                currentState = 'awaiting_location';
                razeSpeak(`Got it. And what part of the world are you holding down right now?`);
                break;

            case 'awaiting_location':
                userData.location = input;
                currentState = 'awaiting_email';
                razeSpeak(`Perfect. What's the best email address to send my signal flares to?`);
                break;

            case 'awaiting_email':
                if (validateEmail(input)) {
                    userData.email = input;
                    currentState = 'awaiting_grievance';
                    razeSpeak(`Thanks. Now, take a deep breath. Tell me... what kind of shadows are creeping up on you today? How can I help?`);
                } else {
                    razeSpeak(`Hmm, that email fizzled out. Please provide a valid one.`);
                }
                break;

            case 'awaiting_grievance':
                userData.grievance = input;
                currentState = 'completed';
                razeSpeak(`Message received loud and clear! I'm lighting a fire to clear out your shadows. A secure notification has been sent. Hang in there!`);
                sendNotification();
                break;

            case 'completed':
                razeSpeak(`I'm on my way. Is there anything else you want to tell me before I get there?`);
                break;
        }
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function sendNotification() {
        const serviceID = 'default_service';
        const templateID = 'template_raze';

        const templateParams = {
            visitor_name: userData.name,
            visitor_age: userData.age,
            visitor_location: userData.location,
            visitor_email: userData.email,
            visitor_grievance: userData.grievance,
            date_time: new Date().toLocaleString()
        };

        console.log("Attempting to send email notification with data:", templateParams);

        // Uncomment below to actually send emails once EmailJS is set up
        /*
        emailjs.send(serviceID, templateID, templateParams)
            .then(() => {
                console.log('SUCCESS! Email sent.');
            }, (err) => {
                console.error('FAILED to send email...', err);
            });
        */
    }

    // ============================================================
    // Mobile Menu (simple toggle)
    // ============================================================
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const navLinksEl = document.querySelector('.nav-links');
            if (navLinksEl) {
                navLinksEl.style.display = navLinksEl.style.display === 'flex' ? 'none' : 'flex';
                navLinksEl.style.position = 'absolute';
                navLinksEl.style.top = '100%';
                navLinksEl.style.left = '0';
                navLinksEl.style.right = '0';
                navLinksEl.style.background = 'white';
                navLinksEl.style.flexDirection = 'column';
                navLinksEl.style.padding = '1rem';
                navLinksEl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                navLinksEl.style.borderRadius = '0 0 12px 12px';
            }
        });
    }

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Close mobile menu if open
            const navLinksEl = document.querySelector('.nav-links');
            if (window.innerWidth <= 768 && navLinksEl) {
                navLinksEl.style.display = 'none';
            }
        });
    });
});
