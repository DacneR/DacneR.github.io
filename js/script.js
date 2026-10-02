import { animate, onScroll, stagger, utils } from './vendor/anime.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function boot() {
    initParticles();
    initTypewriter();
    initMenu();
    initTilt();
    initUnfold();
    if (!reducedMotion) initMotion();
}

function initUnfold() {
    if (reducedMotion) {
        document.querySelectorAll('#skills .unfold').forEach((panel) => panel.classList.add('is-open'));
    }
    document.querySelectorAll('#experience').forEach((section) => {
        const panels = section.querySelectorAll('.unfold');
        if (!panels.length) return;
        if (reducedMotion) {
            panels.forEach((panel) => panel.classList.add('is-open'));
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            panels.forEach((panel, index) => {
                setTimeout(() => panel.classList.add('is-open'), index * 140);
            });
            observer.disconnect();
        }, { threshold: 0.25 });
        observer.observe(section);
    });
}

function initParticles() {
    const container = document.getElementById('particles-js');
    if (!container || reducedMotion) return;
    container.innerHTML = '';
    for (let i = 0; i < 48; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 3.5 + 1.5;
        particle.style.cssText = `
            position:absolute;width:${size}px;height:${size}px;border-radius:50%;
            left:${Math.random() * 100}%;top:${Math.random() * 100}%;
            background:#8fcec0;opacity:${Math.random() * 0.55 + 0.2};
            pointer-events:none;box-shadow:0 0 10px rgba(143,206,192,.7);
            animation:floatingParticles ${Math.random() * 16 + 10}s infinite linear;
        `;
        container.appendChild(particle);
    }
    if (!document.getElementById('particle-anim-style')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'particle-anim-style';
        styleSheet.textContent = `
            @keyframes floatingParticles {
                0% { transform: translateY(20vh) scale(.6); opacity: 0; }
                15% { opacity: .45; }
                85% { opacity: .2; }
                100% { transform: translateY(-80vh) scale(1); opacity: 0; }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

function initTilt() {
    if (!window.matchMedia('(hover: hover)').matches || reducedMotion) return;
    document.querySelectorAll('.tilt-surface').forEach((card) => {
        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const rotateX = ((event.clientY - rect.top - rect.height / 2) / 80) * -1;
            const rotateY = (event.clientX - rect.left - rect.width / 2) / 80;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

function showStatic() {
    document.querySelectorAll('.hero-reveal, .reveal-card').forEach((el) => {
        el.style.opacity = '1';
    });
    document.querySelectorAll('.unfold').forEach((panel) => panel.classList.add('is-open'));
}

function initMotion() {
    const ring = document.querySelector('.avatar-ring');
    if (ring) {
        animate(ring, {
            rotate: 360,
            loop: true,
            ease: 'inOutExpo',
            duration: 9000,
        });
    }

    const hero = document.querySelectorAll('.hero-reveal');
    if (hero.length) {
        animate(hero, {
            opacity: [0, 1],
            y: [28, 0],
            delay: stagger(90),
            duration: 900,
            ease: 'inOutExpo',
        });
    }

    const aboutCards = document.querySelectorAll('.about-card');
    const about = document.querySelector('#about');
    if (aboutCards.length && about) {
        const startState = {
            '--radius': '4px',
            '--x': '-8rem',
            '--pseudo-el-after-scale': '1',
            borderRadius: () => 'var(--radius)',
            translateX: () => 'var(--x)',
        };
        let running = [];
        let inside = false;

        function resetAboutCards() {
            running.forEach((animation) => animation.cancel());
            running = [];
            utils.set(aboutCards, startState);
        }

        function playAboutCards() {
            resetAboutCards();
            requestAnimationFrame(() => {
                aboutCards.forEach((card, index) => {
                    running.push(animate(card, {
                        '--radius': '16px',
                        '--x': '0rem',
                        '--pseudo-el-after-scale': '1.06',
                        delay: index * 160,
                        duration: 1000,
                        ease: 'inOutExpo',
                    }));
                });
            });
        }

        resetAboutCards();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
                    if (inside) return;
                    inside = true;
                    playAboutCards();
                    return;
                }
                if (!entry.isIntersecting) {
                    inside = false;
                    resetAboutCards();
                }
            });
        }, { threshold: [0, 0.25] });
        observer.observe(about);

        document.querySelectorAll('a[href="#about"]').forEach((link) => {
            link.addEventListener('click', () => {
                if (inside) playAboutCards();
                else resetAboutCards();
            });
        });
    }

    const jobCards = document.querySelectorAll('.job-card');
    const experience = document.querySelector('#experience');
    if (jobCards.length && experience) {
        const jobStart = { width: '48px', x: '-15rem', rotate: '0turn' };
        let jobRunning = [];
        let jobInside = false;

        function resetJobs() {
            jobRunning.forEach((animation) => animation.cancel());
            jobRunning = [];
            utils.set(jobCards, jobStart);
        }

        function playJobs() {
            resetJobs();
            requestAnimationFrame(() => {
                jobCards.forEach((card, index) => {
                    jobRunning.push(animate(card, {
                        width: '100%',
                        x: '0rem',
                        rotate: '0turn',
                        delay: index * 180,
                        duration: 900,
                        ease: 'outExpo',
                    }));
                });
            });
        }

        resetJobs();

        const jobObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
                    if (jobInside) return;
                    jobInside = true;
                    playJobs();
                    return;
                }
                if (!entry.isIntersecting) {
                    jobInside = false;
                    resetJobs();
                }
            });
        }, { threshold: [0, 0.25] });
        jobObserver.observe(experience);

        document.querySelectorAll('a[href="#experience"]').forEach((link) => {
            link.addEventListener('click', () => {
                if (jobInside) playJobs();
                else resetJobs();
            });
        });
    }

    const skillCards = document.querySelectorAll('#skills .reveal-card');
    const skillPanels = document.querySelectorAll('#skills .unfold');
    const skills = document.querySelector('#skills');
    if (skillCards.length && skills) {
        const cascade = [0, 180, 260, 420, 500, 600];
        let skillRunning = [];
        let skillTimers = [];
        let skillInside = false;

        function resetSkills() {
            skillTimers.forEach((timer) => clearTimeout(timer));
            skillTimers = [];
            skillRunning.forEach((animation) => animation.cancel());
            skillRunning = [];
            skillPanels.forEach((panel) => panel.classList.remove('is-open'));
            utils.set(skillCards, { opacity: 0, y: '-2.25rem', scale: 0.94 });
        }

        function playSkills() {
            resetSkills();
            requestAnimationFrame(() => {
                skillCards.forEach((card, index) => {
                    skillRunning.push(animate(card, {
                        opacity: 1,
                        y: '0rem',
                        scale: 1,
                        delay: cascade[index] ?? index * 140,
                        duration: 780,
                        ease: 'outExpo',
                    }));
                    const panel = skillPanels[index];
                    if (!panel) return;
                    skillTimers.push(setTimeout(() => panel.classList.add('is-open'), (cascade[index] ?? 0) + 280));
                });
            });
        }

        resetSkills();

        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
                    if (skillInside) return;
                    skillInside = true;
                    playSkills();
                    return;
                }
                if (!entry.isIntersecting) {
                    skillInside = false;
                    resetSkills();
                }
            });
        }, { threshold: [0, 0.25] });
        skillObserver.observe(skills);

        document.querySelectorAll('a[href="#skills"]').forEach((link) => {
            link.addEventListener('click', () => {
                if (skillInside) playSkills();
                else resetSkills();
            });
        });
    }

    ['#projects'].forEach((section) => {
        const cards = document.querySelectorAll(`${section} .reveal-card`);
        if (!cards.length) return;
        animate(cards, {
            opacity: [0, 1],
            delay: stagger(80),
            duration: 800,
            ease: 'inOutExpo',
            autoplay: onScroll({
                target: section,
                sync: 'play',
            }),
        });
    });
}

function initTypewriter() {
    const typeElement = document.getElementById('typewriter-text');
    if (!typeElement) return;

    const words = ['Forward Deployed Engineer', 'Odoo 18 en cliente', 'React en producto', 'Búsqueda y alertas'];
    if (reducedMotion) {
        typeElement.textContent = words[0];
        return;
    }

    let wordIndex = 0;
    let charIndex = words[0].length - 1;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typeElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

function initMenu() {
    const menuBtn = document.getElementById('mobileMenuToggle');
    const closeBtn = document.getElementById('closeMenuBtn');
    const navbar = document.getElementById('navbar');
    const overlay = document.getElementById('mobileOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        if (!navbar) return;
        const willOpen = navbar.classList.contains('hidden');
        navbar.classList.toggle('hidden');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        if (menuBtn) menuBtn.setAttribute('aria-label', willOpen ? 'Cerrar menú' : 'Abrir menú');

        if (overlay) {
            if (overlay.classList.contains('hidden')) {
                overlay.classList.remove('hidden');
                setTimeout(() => overlay.classList.remove('opacity-0'), 10);
            } else {
                overlay.classList.add('opacity-0');
                setTimeout(() => overlay.classList.add('hidden'), 300);
            }
        }
    }

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) toggleMenu();
        });
    });
}

function start() {
    try {
        boot();
    } catch (error) {
        showStatic();
        console.error(error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}
