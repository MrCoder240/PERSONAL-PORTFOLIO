
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
        SECTION PARALLAX SCROLL
        ========================= */

        const sections = document.querySelectorAll("section");

        window.addEventListener("scroll", () => {
            const scrollY = window.scrollY;

            sections.forEach((section, index) => {
                const speed = 0.04 + index * 0.01;
                section.style.transform = `translateY(${scrollY * speed}px)`;
            });
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




    