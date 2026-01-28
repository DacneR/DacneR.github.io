document.addEventListener('DOMContentLoaded', function() {

    // ======================================================
    // 1. EFECTO DE PARTÍCULAS (OPTIMIZADO MODO OSCURO)
    // ======================================================
    function initParticles() {
        const container = document.getElementById('particles-js');
        if (!container) return; 

        container.innerHTML = '';

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 4 + 2; 
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 10; 
            const opacity = Math.random() * 0.4 + 0.1; 

            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background-color: white; 
                border-radius: 50%;
                left: ${posX}%;
                top: ${posY}%;
                opacity: ${opacity};
                pointer-events: none;
                animation: floatingParticles ${duration}s infinite linear;
                box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
            `;
            container.appendChild(particle);
        }

        if (!document.getElementById('particle-anim-style')) {
            const styleSheet = document.createElement("style");
            styleSheet.id = 'particle-anim-style';
            styleSheet.innerText = `
                @keyframes floatingParticles {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    20% { opacity: 0.5; }
                    80% { opacity: 0.5; }
                    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }
    initParticles();


    // ======================================================
    // 2. EFECTO TILT 3D (SOLO TARJETAS PEQUEÑAS)
    // ======================================================
    
    // AQUÍ ESTABA EL ERROR: Antes seleccionábamos todo '.bg-surface'.
    // AHORA: Seleccionamos solo las tarjetas específicas dentro de cada sección.
    const cards = document.querySelectorAll(
        '.tilt-card, ' +                // Proyectos
        '#experience .bg-surface, ' +   // Tarjetas de Experiencia (Solo las de adentro)
        '#skills .bg-secondary, ' +     // Tarjetas de Habilidades
        '.bg-secondary\\/50'            // Tarjetas de Contacto y Sobre Mí (Las pequeñas)
    );

    if (window.matchMedia("(hover: hover)").matches) { 
        cards.forEach(card => {
            // Transición suave
            card.style.transition = 'transform 0.2s ease-out, box-shadow 0.3s ease, border-color 0.3s ease';
            card.style.transformStyle = 'preserve-3d';

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Divisor en 80 para que el movimiento sea sutil y no maree
                const rotateX = ((y - centerY) / 80) * -1;
                const rotateY = (x - centerX) / 80;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
                card.style.zIndex = '20'; 
                card.style.borderColor = 'rgba(245, 158, 11, 0.4)'; // Borde ámbar suave
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.6s ease, border-color 0.5s ease'; 
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                card.style.zIndex = '1';
                card.style.borderColor = ''; 
            });
        });
    }


    // ======================================================
    // 3. MÁQUINA DE ESCRIBIR
    // ======================================================
    const typeElement = document.querySelector('.typewriter');
    if (typeElement) {
        const words = ["Desarrollador Full-Stack", "Backend .NET", "Experto en Odoo", "Frontend React"];
        let wordIndex = 0;
        let charIndex = 0;
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


    // ======================================================
    // 4. MENU HAMBURGUESA
    // ======================================================
    const menuBtn = document.getElementById('mobileMenuToggle');
    const closeBtn = document.getElementById('closeMenuBtn');
    const navbar = document.getElementById('navbar');
    const overlay = document.getElementById('mobileOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        if(!navbar) return;
        navbar.classList.toggle('-translate-x-full');
        
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

    if(menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if(closeBtn) closeBtn.addEventListener('click', toggleMenu);
    if(overlay) overlay.addEventListener('click', toggleMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) toggleMenu();
        });
    });

});