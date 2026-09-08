/**
 * ==========================================================================
 * STACKLY WEALTH ADVISORY - UNIFIED JAVASCRIPT CORE
 * Single Script Architecture for All Pages
 * 
 * Strict Colors: #0B3C5D, #FFFFFF, #D4AF37
 * Zero Backend | 100% Client-Side
 * ==========================================================================
 */

(function () {
    'use strict';

    // Helper: Detect Current Page
    function getCurrentPage() {
        const path = window.location.pathname;
        let page = path.split('/').pop() || 'index.html';
        if (page.includes('?')) page = page.split('?')[0];
        if (page.includes('#')) page = page.split('#')[0];
        if (page === '' || page === '/') return 'index.html';
        return page.toLowerCase();
    }

    // Helper: Extract Formatted Name from Email Address
    function getNameFromEmail(email) {
        if (!email || typeof email !== 'string') return '';
        const atIndex = email.indexOf('@');
        const username = atIndex !== -1 ? email.slice(0, atIndex) : email;
        if (!username.trim()) return '';

        // Split by non-letter separators: dots, underscores, hyphens, pluses
        const rawParts = username.split(/[._\-+]+/).filter(Boolean);
        if (!rawParts.length) return username.trim();

        const formattedWords = rawParts.map(part => {
            const noDigits = part.replace(/\d+$/, '');
            const word = noDigits || part;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).filter(Boolean);

        return formattedWords.length ? formattedWords.join(' ') : username.trim();
    }

    // Toast Notification System (Disabled - pop-ups removed across all pages)
    function showToast(message, icon = 'fa-check-circle', duration = 3500) {
        // Pop-up disabled across all pages per user request
        const existingToast = document.querySelector('.luxury-toast');
        if (existingToast) {
            existingToast.remove();
        }
        return;
    }

    // ==========================================================================
    // 1. GLOBAL COMPONENTS & INTERACTIONS
    // ==========================================================================
    function initGlobal() {
        // Sticky Header & Navbar Scroll Transition
        const header = document.querySelector('.main-header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 40) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, { passive: true });
        }

        // Active Navigation Link Highlighting
        const currentPage = getCurrentPage();
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === 'index.html' && (href === './' || href === 'index.html'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Mobile Hamburger Drawer
        const navToggle = document.querySelector('.nav-toggle');
        const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
        let navSavedScrollY = 0;

        function preventNavBackgroundTouch(e) {
            if (navMenuWrapper && navMenuWrapper.classList.contains('active')) {
                if (!navMenuWrapper.contains(e.target) && !navToggle.contains(e.target)) {
                    e.preventDefault();
                }
            }
        }

        function openNavMenu() {
            if (navToggle && navMenuWrapper) {
                navSavedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
                navToggle.classList.add('open');
                navMenuWrapper.classList.add('active');
                document.documentElement.classList.add('nav-open-locked');
                document.body.classList.add('nav-open-locked');
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
                document.addEventListener('touchmove', preventNavBackgroundTouch, { passive: false });
            }
        }

        function closeNavMenu() {
            if (navToggle && navMenuWrapper && navMenuWrapper.classList.contains('active')) {
                navToggle.classList.remove('open');
                navMenuWrapper.classList.remove('active');
                document.documentElement.classList.remove('nav-open-locked');
                document.body.classList.remove('nav-open-locked');
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                document.removeEventListener('touchmove', preventNavBackgroundTouch);
                window.scrollTo(0, navSavedScrollY);
            }
        }

        if (navToggle && navMenuWrapper) {
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (navMenuWrapper.classList.contains('active')) {
                    closeNavMenu();
                } else {
                    openNavMenu();
                }
            });

            // Close menu when clicking any link or action button inside drawer
            const menuLinks = navMenuWrapper.querySelectorAll('a, button');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    closeNavMenu();
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (navMenuWrapper.classList.contains('active') && !navMenuWrapper.contains(e.target) && !navToggle.contains(e.target)) {
                    closeNavMenu();
                }
            });

            // Close menu on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenuWrapper.classList.contains('active')) {
                    closeNavMenu();
                }
            });

            // Auto-close on resize to desktop
            window.addEventListener('resize', () => {
                if (window.innerWidth > 991 && navMenuWrapper.classList.contains('active')) {
                    closeNavMenu();
                }
            });
        }

        // Custom Luxury Desktop Cursor
        if (window.innerWidth > 1024) {
            initLuxuryCursor();
        }

        // Magnetic & Ripple Buttons
        initButtonEffects();

        // Fallback Intersection Observer for Reveal Animations
        initScrollReveals();

        // Universal 404 Redirection Engine
        init404Redirections();
    }

    // Luxury Cursor
    function initLuxuryCursor() {
        const dot = document.createElement('div');
        const outline = document.createElement('div');
        dot.className = 'custom-cursor-dot';
        outline.className = 'custom-cursor-outline';
        document.body.appendChild(dot);
        document.body.appendChild(outline);

        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            outline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover expansions
        const interactiveEls = document.querySelectorAll('a, button, input, .luxury-card, .solution-card, .why-card, .advisor-card');
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => outline.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => outline.classList.remove('cursor-hover'));
        });
    }

    // Button Effects (Ripple & Magnetic)
    function initButtonEffects() {
        const buttons = document.querySelectorAll('.btn, .nav-login-btn, .auth-submit-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const ripple = document.createElement('span');
                ripple.className = 'btn-ripple';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });

            // Magnetic Pull on hover for large primary buttons
            if (btn.classList.contains('btn-primary') && window.innerWidth > 1024) {
                btn.addEventListener('mousemove', function (e) {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                });
                btn.addEventListener('mouseleave', function () {
                    this.style.transform = 'translate(0px, 0px)';
                });
            }
        });
    }

    // Intersection Observer Reveal Animations
    function initScrollReveals() {
        const revealElements = document.querySelectorAll('[data-aos], .solution-card, .why-card, .value-card, .advisor-card, .insight-card, .blog-card');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(el);
        });
    }

    // Universal 404 Redirection Engine
    function init404Redirections() {
        document.addEventListener('click', (e) => {
            const page = getCurrentPage();

            // 1. Pages completely exempted from 404 redirection
            if (page === '404.html' || page === 'login.html' || page === 'signup.html') {
                return;
            }

            // 2. User/Profile icon or pill click routes directly to 404.html
            if (e.target.closest('.topbar-user-profile') || e.target.closest('.topbar-user-icon') || e.target.classList.contains('fa-circle-user')) {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = '404.html';
                return;
            }

            // 3. Locate closest link or button
            const btn = e.target.closest('button');
            const link = e.target.closest('a');
            const target = btn || link;
            if (!target) return;

            // 3. Form submit buttons: allow form validation and submit handler to execute first
            const form = target.closest('form');
            if (form && (target.type === 'submit' || (target.tagName === 'BUTTON' && target.type !== 'button'))) {
                return;
            }

            // 4. Form utility buttons (e.g. password visibility toggler)
            if (target.classList.contains('password-toggle-btn')) {
                return;
            }

            // 5. Dashboard Specific Rules
            if (page === 'user-dashboard.html' || page === 'client-dashboard.html') {
                // EXEMPTION: Logo click routes to login.html
                if ((target.closest('.sidebar-brand-link') || target.closest('.topbar-mobile-logo') || target.classList.contains('sidebar-logo') || target.closest('.sidebar-brand')) && !target.closest('.sidebar-close-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = 'login.html';
                    return;
                }

                // EXEMPTION: Sidebar navigation and sidebar logout
                if (target.closest('.dashboard-sidebar')) {
                    return;
                }
                // EXEMPTION: Mobile sidebar drawer toggle button
                if (target.closest('.dashboard-mobile-toggle')) {
                    return;
                }

                // ALL other links and buttons in dashboards redirect to 404
                e.preventDefault();
                e.stopPropagation();
                window.location.href = '404.html';
                return;
            }

            // 6. General Webpages (index, about, services, blog, contact)
            // EXEMPTION: Navlinks inside main header
            if (target.closest('.main-header') || target.closest('header') || target.closest('.nav-menu-wrapper') || target.closest('.nav-toggle') || target.closest('.auth-back-link')) {
                return;
            }

            // EXEMPTION: Footer links
            if (target.closest('.main-footer') || target.closest('footer')) {
                return;
            }

            // ALL OTHER links and buttons redirect to 404
            e.preventDefault();
            e.stopPropagation();
            window.location.href = '404.html';
        }, true);
    }

    // ==========================================================================
    // 2. PAGE SPECIFIC LOGIC: HOME (INDEX.HTML)
    // ==========================================================================
    function initHome() {
        // GSAP Hero Animations
        if (window.gsap) {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.from('.hero-badge', { y: -20, opacity: 0, duration: 0.8 })
              .from('.hero-title', { y: 30, opacity: 0, duration: 1 }, '-=0.4')
              .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6');

            // Floating Card Parallax if present
            const heroSection = document.querySelector('.hero-section');
            const floatingCard = document.querySelector('.hero-floating-card');
            if (heroSection && floatingCard && window.innerWidth > 1024) {
                heroSection.addEventListener('mousemove', (e) => {
                    const xAxis = (window.innerWidth / 2 - e.pageX) / 45;
                    const yAxis = (window.innerHeight / 2 - e.pageY) / 45;
                    floatingCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
                });
                heroSection.addEventListener('mouseleave', () => {
                    floatingCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
                });
            }
        }

        // Animated Statistics Counter
        const stats = document.querySelectorAll('.stat-number');
        if (stats.length) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        const finalVal = parseInt(target.getAttribute('data-count'), 10);
                        const prefix = target.getAttribute('data-prefix') || '';
                        const suffix = target.getAttribute('data-suffix') || '';
                        let current = 0;
                        const increment = Math.ceil(finalVal / 60);
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= finalVal) {
                                current = finalVal;
                                clearInterval(timer);
                            }
                            target.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
                        }, 25);
                        statsObserver.unobserve(target);
                    }
                });
            }, { threshold: 0.5 });

            stats.forEach(stat => statsObserver.observe(stat));
        }

        // How We Work Timeline Scroll fill
        const timelineProgress = document.querySelector('.timeline-line-progress');
        const timelineSection = document.querySelector('.timeline-container');
        if (timelineProgress && timelineSection) {
            window.addEventListener('scroll', () => {
                const rect = timelineSection.getBoundingClientRect();
                const totalHeight = rect.height;
                const visibleTop = window.innerHeight - rect.top;
                if (visibleTop > 0 && rect.top < window.innerHeight) {
                    const pct = Math.min(100, Math.max(0, (visibleTop / (totalHeight + window.innerHeight * 0.4)) * 100));
                    timelineProgress.style.height = `${pct}%`;
                }
            }, { passive: true });
        }
    }

    // ==========================================================================
    // SHARED STRICT VALIDATION ARCHITECTURE
    // ==========================================================================
    const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    const STRICT_PHONE_CHARS_REGEX = /^[+\d\s\-().]{8,25}$/;
    const STRICT_NAME_CHARS_REGEX = /^[a-zA-Z\s'-]{3,50}$/;

    function setFieldError(field, errorElem, message) {
        if (!field) return;
        const group = field.closest('.auth-form-group') || field.closest('.form-group-full') || field.closest('.form-group') || field.parentElement;
        if (group) {
            group.classList.add('has-error');
            group.classList.remove('has-success');
        }
        const err = errorElem || (group ? group.querySelector('.form-error-msg') : null);
        if (err) {
            const span = err.querySelector('span');
            if (span && message) span.textContent = message;
            err.style.display = 'flex';
        }
    }

    function clearFieldError(field, errorElem, markSuccess = true) {
        if (!field) return;
        const group = field.closest('.auth-form-group') || field.closest('.form-group-full') || field.closest('.form-group') || field.parentElement;
        if (group) {
            group.classList.remove('has-error');
            const hasVal = field.type === 'checkbox' ? field.checked : (field.value && field.value.trim().length > 0);
            if (markSuccess && hasVal) {
                group.classList.add('has-success');
            } else {
                group.classList.remove('has-success');
            }
        }
        const err = errorElem || (group ? group.querySelector('.form-error-msg') : null);
        if (err) {
            err.style.display = 'none';
        }
    }

    function triggerFormShake(form) {
        if (!form) return;
        form.classList.remove('form-shake');
        void form.offsetWidth;
        form.classList.add('form-shake');
    }

    const FormValidators = {
        name: (val) => {
            if (!val || !val.trim()) return { valid: false, message: 'This field is required' };
            const trimmed = val.trim();
            if (trimmed.length < 3) return { valid: false, message: 'Name must be at least 3 letters.' };
            if (trimmed.length > 50) return { valid: false, message: 'Name cannot exceed 50 characters.' };
            if (!STRICT_NAME_CHARS_REGEX.test(trimmed)) return { valid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes.' };
            if ((trimmed.match(/[a-zA-Z]/g) || []).length < 3) return { valid: false, message: 'Name must contain at least 3 alphabetic letters.' };
            return { valid: true };
        },
        email: (val) => {
            if (!val || !val.trim()) return { valid: false, message: 'This field is required' };
            const trimmed = val.trim();
            if (!STRICT_EMAIL_REGEX.test(trimmed) || trimmed.includes('..') || trimmed.startsWith('.') || trimmed.includes('@.') || trimmed.includes('.@')) {
                return { valid: false, message: 'Please enter a valid email address (e.g. name@domain.com).' };
            }
            return { valid: true };
        },
        phone: (val) => {
            if (!val || !val.trim()) return { valid: false, message: 'This field is required' };
            const trimmed = val.trim();
            if (!STRICT_PHONE_CHARS_REGEX.test(trimmed)) {
                return { valid: false, message: 'Phone number contains invalid characters.' };
            }
            const digits = trimmed.replace(/\D/g, '');
            if (digits.length < 10) return { valid: false, message: 'Phone number must have at least 10 digits.' };
            if (digits.length > 15) return { valid: false, message: 'Phone number cannot exceed 15 digits.' };
            return { valid: true };
        },
        loginPassword: (val) => {
            if (!val || !val.trim()) return { valid: false, message: 'This field is required' };
            if (val.length < 8) return { valid: false, message: 'Password must be at least 8 characters.' };
            return { valid: true };
        },
        signupPassword: (val) => {
            if (!val || !val.trim()) return { valid: false, message: 'This field is required' };
            if (val.length < 8) return { valid: false, message: 'Password must be at least 8 characters long.' };
            if (!/[A-Z]/.test(val)) return { valid: false, message: 'Password must include at least 1 uppercase letter.' };
            if (!/[a-z]/.test(val)) return { valid: false, message: 'Password must include at least 1 lowercase letter.' };
            if (!/[0-9]/.test(val)) return { valid: false, message: 'Password must include at least 1 number.' };
            if (!/[^A-Za-z0-9\s]/.test(val)) return { valid: false, message: 'Password must include at least 1 special character.' };
            return { valid: true };
        },
        confirmPassword: (val, originalPwd) => {
            if (!val || !val.trim()) return { valid: false, message: 'This field is required' };
            if (val !== originalPwd) return { valid: false, message: 'Passwords do not match.' };
            return { valid: true };
        },
        terms: (checked) => {
            if (!checked) return { valid: false, message: 'This field is required' };
            return { valid: true };
        },
        subject: (val, min = 4) => {
            if (!val || !val.trim()) return { valid: false, message: 'This field is required' };
            if (val.trim().length < min) return { valid: false, message: `Subject must be at least ${min} characters.` };
            return { valid: true };
        },
        message: (val, min = 20) => {
            if (!val || !val.trim()) return { valid: false, message: 'This field is required' };
            if (val.trim().length < min) return { valid: false, message: `Please provide more details (at least ${min} characters).` };
            return { valid: true };
        },
        text: (val, label, min = 3) => {
            if (!val || !val.trim()) return { valid: false, message: 'This field is required' };
            if (val.trim().length < min) return { valid: false, message: `${label} must be at least ${min} characters.` };
            return { valid: true };
        },
        dateFuture: (val) => {
            if (!val || !val.trim()) return { valid: false, message: 'This field is required' };
            const chosen = new Date(val);
            if (isNaN(chosen.getTime())) return { valid: false, message: 'Invalid date format.' };
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (chosen < today) return { valid: false, message: 'Date cannot be in the past.' };
            return { valid: true };
        },
        dateRequired: (val) => {
            if (!val || !val.trim()) return { valid: false, message: 'This field is required' };
            const d = new Date(val);
            if (isNaN(d.getTime())) return { valid: false, message: 'Invalid date format.' };
            return { valid: true };
        },
        dateRange: (startVal, endVal) => {
            if (!startVal || !startVal.trim()) return { valid: false, field: 'start', message: 'This field is required' };
            if (!endVal || !endVal.trim()) return { valid: false, field: 'end', message: 'This field is required' };
            const s = new Date(startVal);
            const e = new Date(endVal);
            if (isNaN(s.getTime())) return { valid: false, field: 'start', message: 'Invalid start date.' };
            if (isNaN(e.getTime())) return { valid: false, field: 'end', message: 'Invalid end date.' };
            if (s > e) return { valid: false, field: 'end', message: 'End date must be on or after start date.' };
            return { valid: true };
        }
    };

    function attachStrictValidation(field, errorElem, validatorFn) {
        if (!field) return () => true;

        const validate = () => {
            const res = validatorFn(field.type === 'checkbox' ? field.checked : field.value);
            if (!res.valid) {
                setFieldError(field, errorElem, res.message);
                return false;
            } else {
                clearFieldError(field, errorElem, true);
                return true;
            }
        };

        field.addEventListener('blur', () => {
            validate();
        });

        field.addEventListener('input', () => {
            const group = field.closest('.auth-form-group') || field.closest('.form-group-full') || field.closest('.form-group') || field.parentElement;
            if (group && group.classList.contains('has-error')) {
                validate();
            }
        });

        if (field.type === 'checkbox' || field.type === 'date' || field.tagName === 'SELECT') {
            field.addEventListener('change', () => {
                validate();
            });
        }

        return validate;
    }

    // Universal Password Visibility Toggle
    document.addEventListener('click', function (e) {
        const toggleBtn = e.target.closest('.password-toggle-btn');
        if (toggleBtn) {
            e.preventDefault();
            const targetId = toggleBtn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = toggleBtn.querySelector('i');
            if (input && icon) {
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        }
    });

    // ==========================================================================
    // 3. PAGE SPECIFIC LOGIC: BLOG (BLOG.HTML)
    // ==========================================================================
    function initBlog() {
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            const nameInput = document.getElementById('nlName');
            const emailInput = document.getElementById('nlEmail');
            const nameError = document.getElementById('nlNameError');
            const emailError = document.getElementById('nlEmailError');

            const validateName = attachStrictValidation(nameInput, nameError, FormValidators.name);
            const validateEmail = attachStrictValidation(emailInput, emailError, FormValidators.email);

            newsletterForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const isNameValid = validateName();
                const isEmailValid = validateEmail();

                if (!isNameValid || !isEmailValid) {
                    triggerFormShake(newsletterForm);
                    if (!isNameValid && nameInput) nameInput.focus();
                    else if (!isEmailValid && emailInput) emailInput.focus();
                    showToast('Please provide valid contact details.', 'fa-triangle-exclamation');
                    return;
                }

                const btn = document.getElementById('nlSubmitBtn');
                if (btn) btn.disabled = true;

                showToast('Subscribing to Wealth Intelligence...', 'fa-circle-notch fa-spin');
                setTimeout(() => {
                    showToast('Thank you for subscribing to Stackly Private Intelligence.', 'fa-check');
                    newsletterForm.reset();
                    if (btn) btn.disabled = false;
                    document.querySelectorAll('#newsletterForm .has-success').forEach(el => el.classList.remove('has-success'));
                    setTimeout(() => {
                        window.location.href = '404.html';
                    }, 400);
                }, 600);
            });
        }
    }

    // ==========================================================================
    // 4. PAGE SPECIFIC LOGIC: CONTACT (CONTACT.HTML)
    // ==========================================================================
    function initContact() {
        // FAQ Accordion
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (question && answer) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    faqItems.forEach(other => {
                        other.classList.remove('active');
                        const otherAns = other.querySelector('.faq-answer');
                        if (otherAns) otherAns.style.maxHeight = null;
                    });
                    if (!isActive) {
                        item.classList.add('active');
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                });
            }
        });

        // Strict Contact Form Validation
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            const name = document.getElementById('contactName');
            const email = document.getElementById('contactEmail');
            const phone = document.getElementById('contactPhone');
            const subject = document.getElementById('contactSubject');
            const message = document.getElementById('contactMessage');
            const submitBtn = document.getElementById('contactSubmitBtn');

            const nameErr = document.getElementById('contactNameError');
            const emailErr = document.getElementById('contactEmailError');
            const phoneErr = document.getElementById('contactPhoneError');
            const subErr = document.getElementById('contactSubjectError');
            const msgErr = document.getElementById('contactMessageError');

            const validateName = attachStrictValidation(name, nameErr, FormValidators.name);
            const validateEmail = attachStrictValidation(email, emailErr, FormValidators.email);
            const validatePhone = attachStrictValidation(phone, phoneErr, FormValidators.phone);
            const validateSubject = attachStrictValidation(subject, subErr, (val) => FormValidators.subject(val, 4));
            const validateMsg = attachStrictValidation(message, msgErr, (val) => FormValidators.message(val, 20));

            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const vName = validateName();
                const vEmail = validateEmail();
                const vPhone = validatePhone();
                const vSubject = validateSubject();
                const vMsg = validateMsg();

                if (!vName || !vEmail || !vPhone || !vSubject || !vMsg) {
                    triggerFormShake(contactForm);
                    const firstInvalid = !vName ? name : (!vEmail ? email : (!vPhone ? phone : (!vSubject ? subject : message)));
                    if (firstInvalid) firstInvalid.focus();
                    showToast('Please correct the highlighted consultation fields.', 'fa-triangle-exclamation');
                    return;
                }

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = `<span>Transmitting Inquiry...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
                }

                showToast('Encrypting inquiry and establishing secure fiduciary link...', 'fa-shield-halved');

                setTimeout(() => {
                    showToast('Consultation request transmitted securely. A Senior Wealth Strategist will connect within 24 hours.', 'fa-check');
                    contactForm.reset();
                    document.querySelectorAll('#contactForm .has-success').forEach(el => el.classList.remove('has-success'));
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = `<span>Transmit Confidential Inquiry</span> <i class="fa-solid fa-lock"></i>`;
                    }
                    setTimeout(() => {
                        window.location.href = '404.html';
                    }, 400);
                }, 800);
            });
        }

            // ----------------------------------------------------------------------
            // Interactive Global Headquarters & Office Map Navigator
            // ----------------------------------------------------------------------
            const OFFICE_HUBS = {
                salem: {
                    title: 'Stackly Corporate HQ (Salem)',
                    address: '<i class="fa-solid fa-building text-gold"></i> MMR Complex, Chinna Thirupathi, near Chinna Muniyappan Kovil, Salem, Tamil Nadu 636008',
                    phone: '<i class="fa-solid fa-phone text-gold"></i> +91 98765 43210',
                    deskStatus: 'Global Corporate Hub • Mon-Sat 9am-7pm IST',
                    embedUrl: 'https://maps.google.com/maps?q=11.6829566,78.1739798&hl=en&z=17&output=embed',
                    directionsUrl: 'https://www.google.com/maps/place/Stackly/@11.6829566,78.1739798,17z/data=!3m1!4b1!4m6!3m5!1s0x3babefef7fd970bb:0xe11aef1a71994f9!8m2!3d11.6829566!4d78.1739798!16s%2Fg%2F11l660s35r?entry=ttu'
                },
                newyork: {
                    title: 'New York Global Desk',
                    address: '<i class="fa-solid fa-building text-gold"></i> 745 Fifth Avenue, 28th Floor, New York, NY 10151',
                    phone: '<i class="fa-solid fa-phone text-gold"></i> +1 (212) 940-8800',
                    deskStatus: 'Primary Custodial Hub • Mon-Fri 8am-6pm EST',
                    embedUrl: 'https://maps.google.com/maps?q=745+Fifth+Avenue+New+York+NY&t=&z=15&ie=UTF8&iwloc=&output=embed',
                    directionsUrl: 'https://maps.google.com/?q=745+Fifth+Avenue+New+York+NY'
                },
                london: {
                    title: 'London European Desk',
                    address: '<i class="fa-solid fa-building text-gold"></i> 1 Curzon Street, Mayfair, London W1J 5HD, UK',
                    phone: '<i class="fa-solid fa-phone text-gold"></i> +44 (20) 7946 0991',
                    deskStatus: 'European Wealth Desk • Mon-Fri 9am-6pm GMT',
                    embedUrl: 'https://maps.google.com/maps?q=1+Curzon+Street+Mayfair+London&t=&z=15&ie=UTF8&iwloc=&output=embed',
                    directionsUrl: 'https://maps.google.com/?q=1+Curzon+Street+Mayfair+London'
                },
                singapore: {
                    title: 'Singapore APAC Hub',
                    address: '<i class="fa-solid fa-building text-gold"></i> Marina Bay Financial Centre, T2, Singapore 018983',
                    phone: '<i class="fa-solid fa-phone text-gold"></i> +65 6789 2100',
                    deskStatus: 'APAC Mandate Hub • Mon-Fri 9am-6pm SGT',
                    embedUrl: 'https://maps.google.com/maps?q=Marina+Bay+Financial+Centre+Tower+2+Singapore&t=&z=15&ie=UTF8&iwloc=&output=embed',
                    directionsUrl: 'https://maps.google.com/?q=Marina+Bay+Financial+Centre+Tower+2+Singapore'
                }
            };

            function switchOfficeMap(hubKey, scrollToMap) {
                const data = OFFICE_HUBS[hubKey];
                if (!data) return;

                // Update Tab Buttons
                document.querySelectorAll('.map-hub-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.getAttribute('data-hub') === hubKey);
                });

                // Update Map Iframe
                const iframe = document.getElementById('contactMapIframe');
                if (iframe && iframe.src !== data.embedUrl) {
                    iframe.style.opacity = '0.4';
                    iframe.src = data.embedUrl;
                    setTimeout(() => {
                        iframe.style.opacity = '1';
                    }, 300);
                }

                // Update Text Elements
                const titleElem = document.getElementById('mapCityName');
                const statusElem = document.getElementById('mapDeskStatus');
                const addrElem = document.getElementById('mapAddressLine');
                const phoneElem = document.getElementById('mapPhoneLine');
                const directionsBtn = document.getElementById('mapDirectionsLink');

                if (titleElem) titleElem.textContent = data.title;
                if (statusElem) statusElem.textContent = data.deskStatus;
                if (addrElem) addrElem.innerHTML = data.address;
                if (phoneElem) phoneElem.innerHTML = data.phone;
                if (directionsBtn) directionsBtn.href = data.directionsUrl;

                if (scrollToMap) {
                    const mapCard = document.getElementById('contactMapCard');
                    if (mapCard) {
                        mapCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }

            // Hub Navigation Buttons
            const mapHubBtns = document.querySelectorAll('.map-hub-btn');
            mapHubBtns.forEach(btn => {
                btn.addEventListener('click', function () {
                    const hub = this.getAttribute('data-hub');
                    switchOfficeMap(hub, false);
                });
            });

            // "View on Map" buttons on Location Cards below
            const viewOnMapBtns = document.querySelectorAll('.view-on-map-btn');
            viewOnMapBtns.forEach(btn => {
                btn.addEventListener('click', function () {
                    const hub = this.getAttribute('data-hub');
                    switchOfficeMap(hub, true);
                    showToast(`Switched map navigator to ${OFFICE_HUBS[hub].title}`, 'fa-map-pin');
                });
            });
        }

    // ==========================================================================
    // 5. PAGE SPECIFIC LOGIC: AUTH (LOGIN.HTML & SIGNUP.HTML)
    // ==========================================================================
    function initAuth() {
        let currentRole = 'User';

        // Role Switcher Tabs (User vs Client)
        const roleBtns = document.querySelectorAll('.role-tab-btn');
        roleBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                roleBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentRole = this.getAttribute('data-role') || 'User';
            });
        });

        // ----------------------------------------------------------------------
        // Strict Login Handler
        // ----------------------------------------------------------------------
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            const emailInput = document.getElementById('loginEmail');
            const passInput = document.getElementById('loginPassword');
            const emailError = document.getElementById('loginEmailError');
            const passError = document.getElementById('loginPasswordError');
            const loginBtn = document.getElementById('loginSubmitBtn');

            const validateEmail = attachStrictValidation(emailInput, emailError, FormValidators.email);
            const validatePass = attachStrictValidation(passInput, passError, FormValidators.loginPassword);

            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const vEmail = validateEmail();
                const vPass = validatePass();

                if (!vEmail || !vPass) {
                    triggerFormShake(loginForm);
                    if (!vEmail && emailInput) emailInput.focus();
                    else if (!vPass && passInput) passInput.focus();
                    showToast('Please correct your login credentials.', 'fa-triangle-exclamation');
                    return;
                }

                if (loginBtn) {
                    loginBtn.disabled = true;
                    loginBtn.innerHTML = `<span>Authenticating Credentials...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
                }

                const emailVal = emailInput.value.trim();
                const derivedName = getNameFromEmail(emailVal);
                try {
                    localStorage.setItem('stackly_auth_email', emailVal);
                    localStorage.setItem('stackly_auth_name', derivedName);
                    sessionStorage.setItem('stackly_auth_email', emailVal);
                    sessionStorage.setItem('stackly_auth_name', derivedName);
                } catch (err) {
                    console.warn('Storage unavailable', err);
                }

                showToast(`Authenticating ${currentRole} Portal session...`, 'fa-shield-halved');

                setTimeout(() => {
                    showToast('Access granted. Entering private wealth desk...', 'fa-check');
                    setTimeout(() => {
                        if (currentRole.toLowerCase() === 'client') {
                            window.location.href = 'client-dashboard.html';
                        } else {
                            window.location.href = 'user-dashboard.html';
                        }
                    }, 400);
                }, 800);
            });
        }

        // ----------------------------------------------------------------------
        // Strict Signup Handler
        // ----------------------------------------------------------------------
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            const nameInput = document.getElementById('signupName');
            const emailInput = document.getElementById('signupEmail');
            const phoneInput = document.getElementById('signupPhone');
            const passInput = document.getElementById('signupPassword');
            const confirmInput = document.getElementById('signupConfirmPassword');
            const termsInput = document.getElementById('signupTerms');

            const nameError = document.getElementById('signupNameError');
            const emailError = document.getElementById('signupEmailError');
            const phoneError = document.getElementById('signupPhoneError');
            const passError = document.getElementById('signupPasswordError');
            const confirmError = document.getElementById('signupConfirmError');
            const termsError = document.getElementById('signupTermsError');
            const signupBtn = document.getElementById('signupSubmitBtn');

            const validateName = attachStrictValidation(nameInput, nameError, FormValidators.name);
            const validateEmail = attachStrictValidation(emailInput, emailError, FormValidators.email);
            const validatePhone = attachStrictValidation(phoneInput, phoneError, FormValidators.phone);

            // Live Password Checklist Evaluator
            function updatePasswordCriteria(val) {
                const critLength = document.getElementById('critLength');
                const critUpper = document.getElementById('critUpper');
                const critNumber = document.getElementById('critNumber');
                const critSpecial = document.getElementById('critSpecial');

                const hasLength = val.length >= 8;
                const hasUpper = /[A-Z]/.test(val);
                const hasNumber = /[0-9]/.test(val);
                const hasSpecial = /[^A-Za-z0-9\s]/.test(val);

                if (critLength) critLength.classList.toggle('met', hasLength);
                if (critUpper) critUpper.classList.toggle('met', hasUpper);
                if (critNumber) critNumber.classList.toggle('met', hasNumber);
                if (critSpecial) critSpecial.classList.toggle('met', hasSpecial);

                return hasLength && hasUpper && hasNumber && hasSpecial;
            }

            const validatePass = () => {
                if (!passInput) return true;
                const res = FormValidators.signupPassword(passInput.value);
                if (!res.valid) {
                    setFieldError(passInput, passError, res.message);
                    return false;
                } else {
                    clearFieldError(passInput, passError, true);
                    return true;
                }
            };

            const validateConfirm = () => {
                if (!confirmInput) return true;
                const res = FormValidators.confirmPassword(confirmInput.value, passInput ? passInput.value : '');
                if (!res.valid) {
                    setFieldError(confirmInput, confirmError, res.message);
                    return false;
                } else {
                    clearFieldError(confirmInput, confirmError, true);
                    return true;
                }
            };

            const validateTerms = () => {
                if (!termsInput) return true;
                const res = FormValidators.terms(termsInput.checked);
                if (!res.valid) {
                    setFieldError(termsInput, termsError, res.message);
                    return false;
                } else {
                    clearFieldError(termsInput, termsError, true);
                    return true;
                }
            };

            if (passInput) {
                passInput.addEventListener('input', function () {
                    const allMet = updatePasswordCriteria(this.value);
                    if (allMet) {
                        clearFieldError(passInput, passError, true);
                    } else if (passInput.closest('.auth-form-group') && passInput.closest('.auth-form-group').classList.contains('has-error')) {
                        validatePass();
                    }
                    if (confirmInput && confirmInput.value) {
                        validateConfirm();
                    }
                });
                passInput.addEventListener('blur', function () {
                    validatePass();
                });
            }

            if (confirmInput) {
                confirmInput.addEventListener('input', function () {
                    if (confirmInput.closest('.auth-form-group') && confirmInput.closest('.auth-form-group').classList.contains('has-error')) {
                        validateConfirm();
                    }
                });
                confirmInput.addEventListener('blur', function () {
                    validateConfirm();
                });
            }

            if (termsInput) {
                termsInput.addEventListener('change', function () {
                    validateTerms();
                });
                termsInput.addEventListener('blur', function () {
                    validateTerms();
                });
            }

            signupForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const vName = validateName();
                const vEmail = validateEmail();
                const vPhone = validatePhone();
                const vPass = validatePass();
                const vConfirm = validateConfirm();
                const vTerms = validateTerms();

                if (!vName || !vEmail || !vPhone || !vPass || !vConfirm || !vTerms) {
                    triggerFormShake(signupForm);
                    const firstInvalid = !vName ? nameInput : 
                                        (!vEmail ? emailInput : 
                                        (!vPhone ? phoneInput : 
                                        (!vPass ? passInput : 
                                        (!vConfirm ? confirmInput : termsInput))));
                    if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
                    showToast('Please fulfill all required registration fields correctly.', 'fa-triangle-exclamation');
                    return;
                }

                if (signupBtn) {
                    signupBtn.disabled = true;
                    signupBtn.innerHTML = `<span>Creating Institutional Account...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
                }

                const emailVal = emailInput.value.trim();
                const derivedName = nameInput.value.trim() || getNameFromEmail(emailVal);
                try {
                    localStorage.setItem('stackly_auth_email', emailVal);
                    localStorage.setItem('stackly_auth_name', derivedName);
                    sessionStorage.setItem('stackly_auth_email', emailVal);
                    sessionStorage.setItem('stackly_auth_name', derivedName);
                } catch (err) {
                    console.warn('Storage unavailable', err);
                }

                showToast(`Establishing encrypted ${currentRole} credentials...`, 'fa-shield-halved');

                setTimeout(() => {
                    showToast('Account successfully created! Initializing fiduciary portal...', 'fa-check');
                    setTimeout(() => {
                        if (currentRole.toLowerCase() === 'client') {
                            window.location.href = 'client-dashboard.html';
                        } else {
                            window.location.href = 'user-dashboard.html';
                        }
                    }, 600);
                }, 1000);
            });
        }
    }

    // ==========================================================================
    // 6. PAGE SPECIFIC LOGIC: DASHBOARDS (USER & CLIENT)
    // ==========================================================================
    function initDashboards() {
        // Mobile Sidebar Full Screen Drawer
        const mobileToggle = document.querySelector('.dashboard-mobile-toggle');
        const sidebar = document.querySelector('.dashboard-sidebar');
        const sidebarClose = document.querySelector('.sidebar-close-btn');

        let savedScrollY = 0;

        function preventBackgroundTouch(e) {
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                if (!sidebar.contains(e.target)) {
                    e.preventDefault();
                }
            }
        }

        function openSidebar() {
            if (sidebar) {
                savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
                sidebar.classList.add('mobile-open');
                document.documentElement.classList.add('sidebar-locked');
                document.body.classList.add('sidebar-locked');
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
                document.addEventListener('touchmove', preventBackgroundTouch, { passive: false });
            }
        }

        function closeSidebar() {
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                document.documentElement.classList.remove('sidebar-locked');
                document.body.classList.remove('sidebar-locked');
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                document.removeEventListener('touchmove', preventBackgroundTouch);
                window.scrollTo(0, savedScrollY);
            }
        }

        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (sidebar.classList.contains('mobile-open')) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            });

            if (sidebarClose) {
                sidebarClose.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeSidebar();
                });
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeSidebar();
                }
            });

            document.addEventListener('click', (e) => {
                if (sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                    closeSidebar();
                }
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth > 1024 && sidebar && sidebar.classList.contains('mobile-open')) {
                    closeSidebar();
                }
            });
        }

        // Apply authenticated user details (Name & Email from login)
        let authEmail = '';
        let authName = '';
        try {
            authEmail = localStorage.getItem('stackly_auth_email') || sessionStorage.getItem('stackly_auth_email') || '';
            authName = localStorage.getItem('stackly_auth_name') || sessionStorage.getItem('stackly_auth_name') || '';
        } catch (err) {
            console.warn('Storage access error', err);
        }

        if (!authName && authEmail) {
            authName = getNameFromEmail(authEmail);
        }

        if (authName) {
            // Apply respective name in welcome section
            const welcomeStrong = document.querySelector('.topbar-greeting p strong');
            if (welcomeStrong) {
                welcomeStrong.textContent = authName;
            }

            // Apply name in welcome banner title
            const userDisplayNames = document.querySelectorAll('.user-display-name');
            userDisplayNames.forEach(el => {
                const firstName = authName.split(' ')[0] || authName;
                el.textContent = firstName;
            });

            // Apply name in profile logo section
            const profileName = document.querySelector('.topbar-user-profile .uname');
            if (profileName) {
                profileName.textContent = authName;
            }

            const profileImg = document.querySelector('.topbar-user-profile img');
            if (profileImg) {
                profileImg.alt = authName;
                profileImg.title = authName;
            }

            // Also synchronize Profile settings form name if present
            const userProfNameInput = document.getElementById('userProfName');
            if (userProfNameInput) userProfNameInput.value = authName;

            const clientFidNameInput = document.getElementById('clientFiduciaryName');
            if (clientFidNameInput) clientFidNameInput.value = authName;
        }

        if (authEmail) {
            // Apply mail id in profile logo section
            const profileEmail = document.querySelector('.topbar-user-profile .urole');
            if (profileEmail) {
                profileEmail.textContent = authEmail;
                profileEmail.style.textTransform = 'none';
                profileEmail.title = authEmail;
            }

            // Also synchronize Profile settings form email if present
            const userProfEmailInput = document.getElementById('userProfEmail');
            if (userProfEmailInput) userProfEmailInput.value = authEmail;
        }

        // Logout Link Session Cleanup
        const logoutLinks = document.querySelectorAll('.sidebar-logout');
        logoutLinks.forEach(link => {
            link.addEventListener('click', () => {
                try {
                    localStorage.removeItem('stackly_auth_email');
                    localStorage.removeItem('stackly_auth_name');
                    sessionStorage.removeItem('stackly_auth_email');
                    sessionStorage.removeItem('stackly_auth_name');
                } catch (e) {}
            });
        });

        // Title Mapping for Tabs
        const tabTitles = {
            'dashboard': 'Portfolio Overview',
            'portfolio': 'Portfolio Holdings & Risk Analysis',
            'investments': 'Institutional Investments & Projections',
            'transactions': 'Transaction Ledger & Cash Flow',
            'reports': 'Certified Statements & Tax Reports',
            'profile': 'Investor Profile & Credentials',
            'support': 'Fiduciary Advisory Support Desk',
            'overview': 'Private Wealth Overview',
            'wealthplan': 'Consolidated Wealth Architecture',
            'goals': 'Financial Goals Roadmap',
            'documents': 'Encrypted Legal Document Vault',
            'messages': 'Encrypted Advisory Messaging Desk'
        };

        // Tab Switching Engine
        function switchTab(tabId) {
            if (!tabId) return;
            const targetContent = document.getElementById(`tab-${tabId}`);
            if (!targetContent) return;

            // Hide all tabs
            const allTabs = document.querySelectorAll('.dashboard-tab-content');
            allTabs.forEach(tab => tab.classList.remove('active'));

            // Show active tab
            targetContent.classList.add('active');

            // Update active state on sidebar links
            const sidebarLinks = document.querySelectorAll('.sidebar-item');
            sidebarLinks.forEach(link => {
                const linkTab = link.getAttribute('data-tab');
                const linkHref = link.getAttribute('href') ? link.getAttribute('href').replace('#', '') : '';
                if (linkTab === tabId || linkHref === tabId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Update Topbar Greeting Title if exists
            const topbarTitle = document.getElementById('topbarTitle') || document.querySelector('.topbar-greeting h2');
            if (topbarTitle && tabTitles[tabId]) {
                topbarTitle.textContent = tabTitles[tabId];
            }

            // Close mobile sidebar if open
            if (typeof closeSidebar === 'function') {
                closeSidebar();
            } else if (sidebar && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                document.documentElement.classList.remove('sidebar-locked');
                document.body.classList.remove('sidebar-locked');
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                if (typeof preventBackgroundTouch === 'function') {
                    document.removeEventListener('touchmove', preventBackgroundTouch);
                }
            }

            // Re-render charts or animated bars when switching into tabs
            if (tabId === 'dashboard') {
                initSvgCharts();
            }

            if (tabId === 'overview' || tabId === 'goals') {
                const goalBars = targetContent.querySelectorAll('.goal-bar-fill');
                goalBars.forEach(bar => {
                    const width = bar.getAttribute('data-width') || bar.style.width || '80%';
                    bar.style.width = '0%';
                    setTimeout(() => { bar.style.width = width; }, 100);
                });
            }
        }

        // Bind Sidebar Links & Data-Switch-Tab buttons
        document.addEventListener('click', (e) => {
            const tabBtn = e.target.closest('[data-tab], [data-switch-tab], .sidebar-item');
            if (tabBtn) {
                const tabId = tabBtn.getAttribute('data-tab') || 
                              tabBtn.getAttribute('data-switch-tab') || 
                              (tabBtn.getAttribute('href') ? tabBtn.getAttribute('href').replace('#', '') : null);
                
                if (tabId && tabId !== 'login.html') {
                    e.preventDefault();
                    history.replaceState(null, '', `#${tabId}`);
                    switchTab(tabId);
                }
            }
        });

        // Read Initial Hash on Load
        const initialHash = window.location.hash ? window.location.hash.replace('#', '') : null;
        if (initialHash) {
            switchTab(initialHash);
        } else {
            // Default active
            const defaultActive = document.querySelector('.dashboard-tab-content.active');
            if (defaultActive) {
                const defaultId = defaultActive.id.replace('tab-', '');
                switchTab(defaultId);
            }
        }

        // Notification Button Toast
        const notifyBtn = document.querySelector('.topbar-notify-btn');
        if (notifyBtn) {
            notifyBtn.addEventListener('click', () => {
                showToast('Portfolio rebalancing completed. All targets on track.', 'fa-bell');
            });
        }

        // Quick Actions Toasts
        const quickBtns = document.querySelectorAll('[data-action]');
        quickBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const action = this.getAttribute('data-action');
                if (action === 'download') {
                    showToast('Generating certified Fiduciary Report (PDF)...', 'fa-file-pdf');
                } else if (action === 'invest') {
                    showToast('Allocating capital tranche to selected fund...', 'fa-plus-circle');
                } else if (action === 'advisor') {
                    showToast('Connecting with Senior Wealth Strategist...', 'fa-comments');
                }
            });
        });

        // ----------------------------------------------------------------------
        // Interactive Investment Projection Calculator
        // ----------------------------------------------------------------------
        const contribSlider = document.getElementById('contribSlider');
        const yearsSlider = document.getElementById('yearsSlider');
        const returnSlider = document.getElementById('returnSlider');

        function updateProjectionSimulator() {
            if (!contribSlider || !yearsSlider || !returnSlider) return;

            const monthly = parseFloat(contribSlider.value);
            const years = parseInt(yearsSlider.value);
            const annualRate = parseFloat(returnSlider.value) / 100;
            const monthlyRate = annualRate / 12;
            const totalMonths = years * 12;

            // Future value of an annuity formula
            const futureVal = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
            const principal = monthly * totalMonths;
            const gains = futureVal - principal;
            const totalPortfolio = 1842500 + futureVal;

            const fmt = (num) => '$' + Math.round(num).toLocaleString();

            const contribDisp = document.getElementById('contribDisplay');
            const yearsDisp = document.getElementById('yearsDisplay');
            const returnDisp = document.getElementById('returnDisplay');
            const principalVal = document.getElementById('totalPrincipalVal');
            const gainsVal = document.getElementById('totalGainsVal');
            const totalVal = document.getElementById('projectedTotalVal');

            if (contribDisp) contribDisp.textContent = `${fmt(monthly)} / month`;
            if (yearsDisp) yearsDisp.textContent = `${years} Years`;
            if (returnDisp) returnDisp.textContent = `${(annualRate * 100).toFixed(1)}%`;
            if (principalVal) principalVal.textContent = fmt(principal);
            if (gainsVal) gainsVal.textContent = `+${fmt(gains)}`;
            if (totalVal) totalVal.textContent = fmt(totalPortfolio);
        }

        if (contribSlider && yearsSlider && returnSlider) {
            contribSlider.addEventListener('input', updateProjectionSimulator);
            yearsSlider.addEventListener('input', updateProjectionSimulator);
            returnSlider.addEventListener('input', updateProjectionSimulator);
            updateProjectionSimulator();
        }

        // ----------------------------------------------------------------------
        // Transactions Table Filter & Search
        // ----------------------------------------------------------------------
        const txnFilterButtons = document.querySelectorAll('#txnFilterGroup .filter-tab-btn');
        const txnTable = document.getElementById('txnTable');
        const txnSearch = document.getElementById('txnSearchInput');

        if (txnFilterButtons.length && txnTable) {
            txnFilterButtons.forEach(btn => {
                btn.addEventListener('click', function () {
                    txnFilterButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    const filter = this.getAttribute('data-filter');
                    const rows = txnTable.querySelectorAll('tbody tr');
                    rows.forEach(row => {
                        const rowType = row.getAttribute('data-type');
                        if (filter === 'all' || rowType === filter) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    });
                });
            });
        }

        if (txnSearch && txnTable) {
            txnSearch.addEventListener('input', function () {
                const query = this.value.toLowerCase();
                const rows = txnTable.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });
            });
        }

        // ----------------------------------------------------------------------
        // ----------------------------------------------------------------------
        // Strict Interactive Forms Handling
        // ----------------------------------------------------------------------

        // 1. Custom Statement Report Generator Form
        const customReportForm = document.getElementById('customReportForm');
        if (customReportForm) {
            const startInput = document.getElementById('reportStartDate');
            const endInput = document.getElementById('reportEndDate');
            const startErr = document.getElementById('reportStartError');
            const endErr = document.getElementById('reportEndError');

            const validateStartDate = () => {
                const val = startInput ? startInput.value.trim() : '';
                if (!val) {
                    setFieldError(startInput, startErr, 'This field is required');
                    return false;
                }
                const s = new Date(val);
                if (isNaN(s.getTime())) {
                    setFieldError(startInput, startErr, 'Invalid start date.');
                    return false;
                }
                clearFieldError(startInput, startErr, true);

                // If end date is also present, validate order
                const endVal = endInput ? endInput.value.trim() : '';
                if (endVal) {
                    const e = new Date(endVal);
                    if (!isNaN(e.getTime())) {
                        if (s > e) {
                            setFieldError(endInput, endErr, 'End date must be on or after start date.');
                        } else {
                            clearFieldError(endInput, endErr, true);
                        }
                    }
                }
                return true;
            };

            const validateEndDate = () => {
                const val = endInput ? endInput.value.trim() : '';
                if (!val) {
                    setFieldError(endInput, endErr, 'This field is required');
                    return false;
                }
                const e = new Date(val);
                if (isNaN(e.getTime())) {
                    setFieldError(endInput, endErr, 'Invalid end date.');
                    return false;
                }

                // If start date is also present, validate order
                const startVal = startInput ? startInput.value.trim() : '';
                if (startVal) {
                    const s = new Date(startVal);
                    if (!isNaN(s.getTime()) && s > e) {
                        setFieldError(endInput, endErr, 'End date must be on or after start date.');
                        return false;
                    }
                }
                clearFieldError(endInput, endErr, true);
                return true;
            };

            const validateDates = () => {
                const isStartValid = validateStartDate();
                const isEndValid = validateEndDate();
                return isStartValid && isEndValid;
            };

            if (startInput) {
                ['input', 'change', 'blur'].forEach(evt => {
                    startInput.addEventListener(evt, validateStartDate);
                });
            }

            if (endInput) {
                ['input', 'change', 'blur'].forEach(evt => {
                    endInput.addEventListener(evt, validateEndDate);
                });
            }

            customReportForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const ok = validateDates();
                if (!ok) {
                    triggerFormShake(customReportForm);
                    if (startInput && !startInput.value.trim()) {
                        startInput.focus();
                    } else if (endInput && !endInput.value.trim()) {
                        endInput.focus();
                    }
                    showToast('Please correct the report date range.', 'fa-triangle-exclamation');
                    return;
                }

                showToast('Compiling certified financial statement...', 'fa-file-arrow-down');
                setTimeout(() => {
                    window.location.href = '404.html';
                }, 400);
            });
        }

        // 2. User Profile Details Form
        const userProfForm = document.getElementById('profileDetailsForm');
        if (userProfForm) {
            const pName = document.getElementById('userProfName');
            const pEmail = document.getElementById('userProfEmail');
            const pPhone = document.getElementById('userProfPhone');
            const pAddr = document.getElementById('userProfAddress');
            const pNameErr = document.getElementById('userProfNameError');
            const pEmailErr = document.getElementById('userProfEmailError');
            const pPhoneErr = document.getElementById('userProfPhoneError');
            const pAddrErr = document.getElementById('userProfAddressError');

            const vName = attachStrictValidation(pName, pNameErr, FormValidators.name);
            const vEmail = attachStrictValidation(pEmail, pEmailErr, FormValidators.email);
            const vPhone = attachStrictValidation(pPhone, pPhoneErr, FormValidators.phone);
            const vAddr = attachStrictValidation(pAddr, pAddrErr, (val) => FormValidators.text(val, 'Residence address', 6));

            userProfForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const okName = vName();
                const okEmail = vEmail();
                const okPhone = vPhone();
                const okAddr = vAddr();

                if (!okName || !okEmail || !okPhone || !okAddr) {
                    triggerFormShake(userProfForm);
                    const firstInvalid = !okName ? pName : (!okEmail ? pEmail : (!okPhone ? pPhone : pAddr));
                    if (firstInvalid) firstInvalid.focus();
                    showToast('Please correct your profile fields.', 'fa-triangle-exclamation');
                    return;
                }

                const updatedName = pName ? pName.value.trim() : '';
                const updatedEmail = pEmail ? pEmail.value.trim() : '';
                if (updatedName) {
                    try {
                        localStorage.setItem('stackly_auth_name', updatedName);
                        sessionStorage.setItem('stackly_auth_name', updatedName);
                    } catch (e) {}
                    const welcomeStrong = document.querySelector('.topbar-greeting p strong');
                    if (welcomeStrong) welcomeStrong.textContent = updatedName;
                    const userDisplayNames = document.querySelectorAll('.user-display-name');
                    userDisplayNames.forEach(el => {
                        const firstName = updatedName.split(' ')[0] || updatedName;
                        el.textContent = firstName;
                    });
                    const profileName = document.querySelector('.topbar-user-profile .uname');
                    if (profileName) profileName.textContent = updatedName;
                }
                if (updatedEmail) {
                    try {
                        localStorage.setItem('stackly_auth_email', updatedEmail);
                        sessionStorage.setItem('stackly_auth_email', updatedEmail);
                    } catch (e) {}
                    const profileEmail = document.querySelector('.topbar-user-profile .urole');
                    if (profileEmail) {
                        profileEmail.textContent = updatedEmail;
                        profileEmail.style.textTransform = 'none';
                    }
                }

                showToast('Personal & tax profile credentials updated.', 'fa-shield-check');
                setTimeout(() => {
                    window.location.href = '404.html';
                }, 400);
            });
        }

        // 3. User Priority Support Form
        const userSupportForm = document.getElementById('supportTicketForm');
        if (userSupportForm) {
            const sSub = document.getElementById('supportSubject');
            const sMsg = document.getElementById('supportMessage');
            const sSubErr = document.getElementById('supportSubjectError');
            const sMsgErr = document.getElementById('supportMessageError');

            const vSub = attachStrictValidation(sSub, sSubErr, (val) => FormValidators.subject(val, 4));
            const vMsg = attachStrictValidation(sMsg, sMsgErr, (val) => FormValidators.message(val, 15));

            userSupportForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const okSub = vSub();
                const okMsg = vMsg();

                if (!okSub || !okMsg) {
                    triggerFormShake(userSupportForm);
                    if (!okSub && sSub) sSub.focus();
                    else if (!okMsg && sMsg) sMsg.focus();
                    showToast('Please provide subject and detailed inquiry.', 'fa-triangle-exclamation');
                    return;
                }

                showToast('Priority request dispatched to Marcus Vance (CIO).', 'fa-paper-plane');
                userSupportForm.reset();
                document.querySelectorAll('#supportTicketForm .has-success').forEach(el => el.classList.remove('has-success'));
                setTimeout(() => {
                    window.location.href = '404.html';
                }, 400);
            });
        }

        // 4. Client Entity Structure Form
        const clientProfForm = document.getElementById('clientProfileForm');
        if (clientProfForm) {
            const entName = document.getElementById('clientEntityName');
            const entDomicile = document.getElementById('clientDomicile');
            const entFid = document.getElementById('clientFiduciaryName');
            const entNameErr = document.getElementById('clientEntityNameError');
            const entDomicileErr = document.getElementById('clientDomicileError');
            const entFidErr = document.getElementById('clientFiduciaryNameError');

            const vEntName = attachStrictValidation(entName, entNameErr, (val) => FormValidators.text(val, 'Entity name', 4));
            const vDomicile = attachStrictValidation(entDomicile, entDomicileErr, (val) => FormValidators.text(val, 'Jurisdiction', 3));
            const vFid = attachStrictValidation(entFid, entFidErr, FormValidators.name);

            clientProfForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const okName = vEntName();
                const okDomicile = vDomicile();
                const okFid = vFid();

                if (!okName || !okDomicile || !okFid) {
                    triggerFormShake(clientProfForm);
                    const firstInvalid = !okName ? entName : (!okDomicile ? entDomicile : entFid);
                    if (firstInvalid) firstInvalid.focus();
                    showToast('Please check the entity structure fields.', 'fa-triangle-exclamation');
                    return;
                }

                const updatedFidName = entFid ? entFid.value.trim() : '';
                if (updatedFidName) {
                    try {
                        localStorage.setItem('stackly_auth_name', updatedFidName);
                        sessionStorage.setItem('stackly_auth_name', updatedFidName);
                    } catch (e) {}
                    const welcomeStrong = document.querySelector('.topbar-greeting p strong');
                    if (welcomeStrong) welcomeStrong.textContent = updatedFidName;
                    const userDisplayNames = document.querySelectorAll('.user-display-name');
                    userDisplayNames.forEach(el => {
                        const firstName = updatedFidName.split(' ')[0] || updatedFidName;
                        el.textContent = firstName;
                    });
                    const profileName = document.querySelector('.topbar-user-profile .uname');
                    if (profileName) profileName.textContent = updatedFidName;
                }

                showToast('Family office entity records updated securely.', 'fa-landmark');
                setTimeout(() => {
                    window.location.href = '404.html';
                }, 400);
            });
        }

        // 5. Client Boardroom Concierge Form
        const clientConciergeForm = document.getElementById('clientConciergeForm');
        if (clientConciergeForm) {
            const meetDate = document.getElementById('clientMeetingDate');
            const meetAgenda = document.getElementById('clientMeetingAgenda');
            const meetDateErr = document.getElementById('clientMeetingDateError');
            const meetAgendaErr = document.getElementById('clientMeetingAgendaError');

            const vDate = attachStrictValidation(meetDate, meetDateErr, FormValidators.dateFuture);
            const vAgenda = attachStrictValidation(meetAgenda, meetAgendaErr, (val) => FormValidators.message(val, 15));

            clientConciergeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const okDate = vDate();
                const okAgenda = vAgenda();

                if (!okDate || !okAgenda) {
                    triggerFormShake(clientConciergeForm);
                    if (!okDate && meetDate) meetDate.focus();
                    else if (!okAgenda && meetAgenda) meetAgenda.focus();
                    showToast('Please provide valid consultation details.', 'fa-triangle-exclamation');
                    return;
                }

                showToast('Executive boardroom session confirmed with Eleanor Sterling.', 'fa-calendar-check');
                clientConciergeForm.reset();
                document.querySelectorAll('#clientConciergeForm .has-success').forEach(el => el.classList.remove('has-success'));
                setTimeout(() => {
                    window.location.href = '404.html';
                }, 400);
            });
        }

        // ----------------------------------------------------------------------
        // Encrypted Chat Messaging Engine (Client Portal)
        // ----------------------------------------------------------------------
        const clientChatForm = document.getElementById('clientChatForm');
        const chatStream = document.getElementById('chatStream');
        const chatInput = document.getElementById('chatMessageInput');

        if (clientChatForm && chatInput) {
            clientChatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = chatInput.value.trim();
                if (!text) {
                    triggerFormShake(clientChatForm);
                    showToast('This field is required', 'fa-triangle-exclamation');
                    chatInput.focus();
                    return;
                }

                if (chatStream) {
                    const outgoingRow = document.createElement('div');
                    outgoingRow.className = 'chat-bubble-row outgoing';
                    outgoingRow.innerHTML = `
                        <div>
                            <div class="chat-bubble-msg">${text}</div>
                            <span class="chat-time-stamp" style="text-align: right;">Just now</span>
                        </div>
                    `;
                    chatStream.appendChild(outgoingRow);
                    chatInput.value = '';
                    chatStream.scrollTop = chatStream.scrollHeight;
                }

                showToast('Dispatching encrypted communication...', 'fa-paper-plane');
                setTimeout(() => {
                    window.location.href = '404.html';
                }, 400);
            });
        }

        // File Dropzone simulation
        const dropzone = document.getElementById('clientDocDropzone');
        if (dropzone) {
            dropzone.addEventListener('click', () => {
                showToast('Secure Document Vault: File uploaded and encrypted with AES-256.', 'fa-cloud-arrow-up');
            });
        }

        // FAQ Accordion in Dashboard Support Tab
        const dashboardFaqItems = document.querySelectorAll('.faq-accordion .faq-item');
        dashboardFaqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    dashboardFaqItems.forEach(other => other.classList.remove('active'));
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });

        // Initialize Pure SVG Financial Charts
        initSvgCharts();

        // Animate Client Goal Progress Bars
        const goalBars = document.querySelectorAll('.goal-bar-fill');
        if (goalBars.length) {
            setTimeout(() => {
                goalBars.forEach(bar => {
                    const width = bar.getAttribute('data-width') || '80%';
                    bar.style.width = width;
                });
            }, 300);
        }
    }

    // Pure SVG Financial Chart Renderer
    function initSvgCharts() {
        const lineChartContainer = document.getElementById('performanceLineChart');
        if (lineChartContainer) {
            // Render 12-Month Smooth Performance Curve
            const points = [
                { x: 30, y: 180, val: '$1.25M' },
                { x: 90, y: 170, val: '$1.30M' },
                { x: 150, y: 155, val: '$1.38M' },
                { x: 210, y: 160, val: '$1.35M' },
                { x: 270, y: 135, val: '$1.48M' },
                { x: 330, y: 120, val: '$1.55M' },
                { x: 390, y: 125, val: '$1.52M' },
                { x: 450, y: 100, val: '$1.65M' },
                { x: 510, y: 80, val: '$1.74M' },
                { x: 570, y: 65, val: '$1.80M' },
                { x: 630, y: 50, val: '$1.84M' }
            ];

            let pathD = `M ${points[0].x} ${points[0].y}`;
            for (let i = 0; i < points.length - 1; i++) {
                const xc = (points[i].x + points[i + 1].x) / 2;
                const yc = (points[i].y + points[i + 1].y) / 2;
                pathD += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
            }
            pathD += ` T ${points[points.length - 1].x} ${points[points.length - 1].y}`;

            const fillD = `${pathD} L 630 220 L 30 220 Z`;

            const svg = `
                <svg viewBox="0 0 660 240" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.35"/>
                            <stop offset="100%" stop-color="#0B3C5D" stop-opacity="0"/>
                        </linearGradient>
                    </defs>
                    <!-- Grid lines -->
                    <line x1="30" y1="50" x2="630" y2="50" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
                    <line x1="30" y1="100" x2="630" y2="100" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
                    <line x1="30" y1="150" x2="630" y2="150" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
                    <line x1="30" y1="200" x2="630" y2="200" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
                    
                    <!-- Area Fill -->
                    <path d="${fillD}" fill="url(#areaGrad)" />
                    <!-- Curve Line -->
                    <path d="${pathD}" fill="none" stroke="#D4AF37" stroke-width="3" stroke-linecap="round"/>
                    
                    <!-- Dots -->
                    ${points.map(p => `
                        <circle cx="${p.x}" cy="${p.y}" r="4" fill="#FFFFFF" stroke="#D4AF37" stroke-width="2" class="chart-point">
                            <title>${p.val}</title>
                        </circle>
                    `).join('')}
                </svg>
            `;
            lineChartContainer.innerHTML = svg;
        }

        const doughnutContainer = document.getElementById('allocationDoughnutChart');
        if (doughnutContainer) {
            // Render Pure SVG Doughnut Chart (Equities 45%, Fixed Income 25%, Real Estate 15%, Commodities 10%, Cash 5%)
            const svg = `
                <svg viewBox="0 0 200 200" width="100%" height="100%">
                    <!-- Background Circle -->
                    <circle cx="100" cy="100" r="70" fill="transparent" stroke="rgba(255,255,255,0.05)" stroke-width="28"/>
                    <!-- Equities (45%) -->
                    <circle cx="100" cy="100" r="70" fill="transparent" stroke="#D4AF37" stroke-width="28"
                            stroke-dasharray="197.9 440" stroke-dashoffset="0" transform="rotate(-90 100 100)"/>
                    <!-- Fixed Income (25%) -->
                    <circle cx="100" cy="100" r="70" fill="transparent" stroke="#125482" stroke-width="28"
                            stroke-dasharray="110 440" stroke-dashoffset="-197.9" transform="rotate(-90 100 100)"/>
                    <!-- Real Estate (15%) -->
                    <circle cx="100" cy="100" r="70" fill="transparent" stroke="#E5C768" stroke-width="28"
                            stroke-dasharray="66 440" stroke-dashoffset="-307.9" transform="rotate(-90 100 100)"/>
                    <!-- Commodities (10%) -->
                    <circle cx="100" cy="100" r="70" fill="transparent" stroke="#062235" stroke-width="28"
                            stroke-dasharray="44 440" stroke-dashoffset="-373.9" transform="rotate(-90 100 100)"/>
                    <!-- Center Hole text -->
                    <text x="100" y="95" text-anchor="middle" fill="#D4AF37" font-family="'Playfair Display', serif" font-size="20" font-weight="700">100%</text>
                    <text x="100" y="115" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="'Inter', sans-serif" font-size="9" letter-spacing="1">DIVERSIFIED</text>
                </svg>
            `;
            doughnutContainer.innerHTML = svg;
        }
    }

    // ==========================================================================
    // 7. PAGE SPECIFIC LOGIC: 404 ERROR (404.HTML)
    // ==========================================================================
    function init404() {
        const canvas = document.getElementById('errorCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let w = canvas.width = window.innerWidth;
            let h = canvas.height = window.innerHeight;

            window.addEventListener('resize', () => {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
            });

            const particles = [];
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8,
                    r: Math.random() * 2.5 + 1,
                    alpha: Math.random() * 0.6 + 0.2
                });
            }

            function render() {
                ctx.clearRect(0, 0, w, h);
                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0) p.x = w;
                    if (p.x > w) p.x = 0;
                    if (p.y < 0) p.y = h;
                    if (p.y > h) p.y = 0;

                    ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                });
                requestAnimationFrame(render);
            }
            render();

            // Parallax on 404 Rotating Rings
            const ringContainer = document.querySelector('.error-visual-container');
            if (ringContainer) {
                window.addEventListener('mousemove', (e) => {
                    const x = (window.innerWidth / 2 - e.pageX) / 30;
                    const y = (window.innerHeight / 2 - e.pageY) / 30;
                    ringContainer.style.transform = `translate(${x}px, ${y}px)`;
                });
            }
        }
    }

    // ==========================================================================
    // INITIALIZATION DISPATCHER
    // ==========================================================================
    document.addEventListener('DOMContentLoaded', () => {
        initGlobal();

        const page = getCurrentPage();

        // Element-aware and route-resilient page initialization
        if (page.includes('login') || page.includes('signup') || document.getElementById('loginForm') || document.getElementById('signupForm')) {
            initAuth();
        }
        if (page.includes('contact') || document.getElementById('contactForm')) {
            initContact();
        }
        if (page.includes('blog') || document.getElementById('newsletterForm')) {
            initBlog();
        }
        if (page.includes('dashboard') || document.querySelector('.dashboard-container') || document.getElementById('customReportForm') || document.getElementById('profileDetailsForm') || document.getElementById('clientProfileForm')) {
            initDashboards();
        }
        if (page.includes('404') || document.querySelector('.error-page-wrapper')) {
            init404();
        }
        if (page === 'index.html' || page === 'index' || page === '' || document.querySelector('.hero-section')) {
            initHome();
        }
    });

})();
