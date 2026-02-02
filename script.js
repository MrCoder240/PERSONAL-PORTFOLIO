
          // Mobile menu toggle
        // NOTE: For full accessibility, preferred using a <button> with aria-expanded and manage focus trapping for overlays.
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        // Guard clause in case elements are missing (prevents runtime errors)
        if (hamburger && navMenu) {
            // Should toggle the visual mobile menu by adding/removing the 'active' class
            const toggleMenu = () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                // If using a <button>, should update aria-expanded here
            };

            // Click handler
            hamburger.addEventListener('click', toggleMenu);

            // Keyboard accessibility: allowed Enter/Space to toggle when hamburger has tabindex
            hamburger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMenu();
                }
            });
        }
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }));
        
        // Smooth scrolling for navigation links
        // This enhances UX for hash links. The anchor check prevents '#' placeholder from blocking behavior.
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                // Allow external/target=_blank links to behave normally
                const href = this.getAttribute('href');
                if (!href || href === '#') return;

                // Prevents default only for same-document anchors
                if (href.startsWith('#')) {
                    e.preventDefault();

                    const targetId = href;
                    const targetElement = document.querySelector(targetId);
                    if(targetElement) {
                        // Subtracted header height so the section isn't hidden beneath fixed header
                        const headerOffset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        // Move focus for accessibility after scrolling
                        targetElement.setAttribute('tabindex', '-1');
                        targetElement.focus({ preventScroll: true });
                    }
                }
            });
        });
        
        // Animated skill bars when they come into view
        // Uses getBoundingClientRect for a lightweight intersection check.
        // For larger projects prefer IntersectionObserver for better perf.
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const animateSkillBars = () => {
            skillBars.forEach(bar => {
                const level = bar.getAttribute('data-level') || 0;
                const rect = bar.getBoundingClientRect();
                
                // If the skill bar is in the viewport, sets its width to the declared percentage
                if(rect.top < window.innerHeight && rect.bottom >= 0) {
                    // Clamp values between 0 and 100 for safety
                    const safeLevel = Math.max(0, Math.min(100, Number(level)));
                    bar.style.width = safeLevel + '%';
                }
            });
        };
        
        // Initial check and then on scroll
        // Debounce/throttle if we add heavier work inside the handler.
        animateSkillBars();
        window.addEventListener('scroll', animateSkillBars);
        window.addEventListener('resize', animateSkillBars);

        
        /* =========================
          DARK / LIGHT MODE
        ========================= */
       const toggle = document.createElement('div');
       toggle.className = 'theme-toggle';
       toggle.innerHTML = '<i class="fas fa-moon"></i>';
       document.body.appendChild(toggle);

       const setTheme = mode => {
       document.body.classList.toggle('dark', mode === 'dark');
       localStorage.setItem('theme', mode);
        toggle.innerHTML = mode === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
        };

        toggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark');
        setTheme(isDark ? 'light' : 'dark');
    });

        const savedTheme = localStorage.getItem('theme');
       if (savedTheme) setTheme(savedTheme);
         else {
          // Default to system preference if no saved theme
          const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          setTheme(prefersDark ? 'dark' : 'light');
         }
         /* =========================
          CURSOR GLOW EFFECT
        ========================= */
        const glow = document.createElement("div");
        glow.className = "cursor-glow";
        document.body.appendChild(glow);

        document.addEventListener("mousemove", (e) => {
            glow.style.left = e.clientX + "px";
            glow.style.top = e.clientY + "px";
        });

        /* =========================
        TIMELINE REVEAL
        ========================= */

        const timelineItems = document.querySelectorAll('.timeline-item');

        const revealTimeline = () => {
            const trigger = window.innerHeight * 0.85;

            timelineItems.forEach(item => {
                if (item.getBoundingClientRect().top < trigger) {
                    item.classList.add('show');
                }
            });
        };

        window.addEventListener('scroll', revealTimeline);
        revealTimeline();

/* =========================
   FORM HANDLED 100% VIA JS
========================= */

             const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // STOP browser + Formspree

        const button = contactForm.querySelector("button[type='submit']");
        const originalText = button.innerText;

        button.innerText = "Sending...";
        button.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(
                "https://formspree.io/f/mwvqqjww",
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            if (!response.ok) throw new Error("Failed");

            // SUCCESS
            button.innerText = "Message Sent ✓";
            contactForm.reset();

            setTimeout(() => {
                button.innerText = originalText;
                button.disabled = false;
            }, 3000);

        } catch (err) {
            // ERROR
            button.innerText = "Error! Try Again";
            button.disabled = false;

            setTimeout(() => {
                button.innerText = originalText;
            }, 3000);
        }
    });
}
/* Add this to your script.js file after the existing code */

/* =========================
   INTERACTIVE PARTICLE SYSTEM
========================= */
function initParticles() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 80;
    
    canvas.id = 'particles-js';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-2';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = document.body.classList.contains('dark') 
                ? 'rgba(96, 165, 250, 0.5)' 
                : 'rgba(37, 99, 235, 0.3)';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticlesArray() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        const maxDistance = 100;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.strokeStyle = document.body.classList.contains('dark')
                        ? `rgba(96, 165, 250, ${0.2 * (1 - distance / maxDistance)})`
                        : `rgba(37, 99, 235, ${0.1 * (1 - distance / maxDistance)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    // Initialize
    resizeCanvas();
    initParticlesArray();
    animateParticles();

    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        particles.length = 0;
        initParticlesArray();
    });

    // Update colors on theme change
    const observer = new MutationObserver(() => {
        particles.forEach(p => {
            p.color = document.body.classList.contains('dark')
                ? 'rgba(96, 165, 250, 0.5)'
                : 'rgba(37, 99, 235, 0.3)';
        });
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

/* =========================
   CURSOR TRAILS
========================= */
function initCursorTrails() {
    const trails = [];
    const trailCount = 5;
    let mouseX = 0;
    let mouseY = 0;

    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);
        trails.push({
            element: trail,
            x: 0,
            y: 0,
            size: (trailCount - i) * 4,
            opacity: (trailCount - i) / trailCount * 0.5
        });
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrails() {
        trails.forEach((trail, index) => {
            const targetX = index === 0 ? mouseX : trails[index - 1].x;
            const targetY = index === 0 ? mouseY : trails[index - 1].y;

            trail.x += (targetX - trail.x) * 0.3;
            trail.y += (targetY - trail.y) * 0.3;

            trail.element.style.left = `${trail.x}px`;
            trail.element.style.top = `${trail.y}px`;
            trail.element.style.width = `${trail.size}px`;
            trail.element.style.height = `${trail.size}px`;
            trail.element.style.opacity = trail.opacity;
            trail.element.style.backgroundColor = document.body.classList.contains('dark')
                ? 'rgba(96, 165, 250, 0.3)'
                : 'rgba(37, 99, 235, 0.2)';
        });

        requestAnimationFrame(animateTrails);
    }

    animateTrails();
}

/* =========================
   SCROLL PROGRESS INDICATOR
========================= */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

/* =========================
   FLOATING ELEMENTS
========================= */
function initFloatingElements() {
    const sectionCount = document.querySelectorAll('section').length;
    
    for (let i = 0; i < Math.min(3, sectionCount); i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        document.body.appendChild(element);
    }
}

/* =========================
   INITIALIZE ALL EFFECTS
========================= */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize effects
    initParticles();
    initCursorTrails();
    initScrollProgress();
    initFloatingElements();
    
    // Add parallax effect to sections
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('section');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.backgroundPosition = `center ${yPos}px`;
        });
    });
});

/* =========================
   INTERACTIVE SECTION HIGHLIGHTS
========================= */
function initSectionHighlights() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-section');
                // Trigger confetti effect for hero section
                if (entry.target.id === 'home') {
                    triggerWelcomeEffect();
                }
            } else {
                entry.target.classList.remove('active-section');
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
}

/* =========================
   WELCOME EFFECT (First visit)
========================= */
function triggerWelcomeEffect() {
    if (sessionStorage.getItem('welcomed')) return;
    
    // Add a subtle animation to hero section
    const hero = document.querySelector('#home');
    hero.style.animation = 'welcomePulse 2s ease';
    
    setTimeout(() => {
        hero.style.animation = '';
    }, 2000);
    
    sessionStorage.setItem('welcomed', 'true');
}

// Add welcome animation
const style = document.createElement('style');
style.textContent = `
    @keyframes welcomePulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    .active-section {
        animation: sectionFocus 0.6s ease;
    }
    
    @keyframes sectionFocus {
        0% { transform: translateY(20px); opacity: 0.8; }
        100% { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initialize section highlights
document.addEventListener('DOMContentLoaded', initSectionHighlights);

// You can also add this to the browser console to check FPS
(function() {
    var lastTime = 0;
    var frameCount = 0;
    var fps = 0;
    
    function checkFPS() {
        var now = performance.now();
        frameCount++;
        
        if (now >= lastTime + 1000) {
            fps = Math.round((frameCount * 1000) / (now - lastTime));
            frameCount = 0;
            lastTime = now;
            console.log('FPS:', fps);
        }
        
        requestAnimationFrame(checkFPS);
    }
    
    checkFPS();
})();

    
