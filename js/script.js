document.addEventListener('DOMContentLoaded', function() {

    // ======================================================
    // 1. EFECTO DE PARTÍCULAS (SOLUCIÓN DEFINITIVA)
    // ======================================================
    function initParticles() {
        const container = document.getElementById('particles-js');
        
        // Si no existe el contenedor, no hacemos nada (evita errores)
        if (!container) {
            console.error("No encontré el div 'particles-js'. Revisa el HTML.");
            return;
        }

        // Limpiamos por si acaso
        container.innerHTML = '';

        // Creamos 25 partículas
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            
            // Aleatoriedad
            const size = Math.random() * 6 + 2; // Entre 2px y 8px
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 15 + 10; // Entre 10s y 25s
            const opacity = Math.random() * 0.5 + 0.1;

            // Estilos IN-LINE para asegurar que se vean
            particle.style.position = 'absolute';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = 'white'; // Blanco puro
            particle.style.borderRadius = '50%';
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.opacity = opacity;
            particle.style.pointerEvents = 'none';
            // Animación CSS inyectada
            particle.style.animation = `floatingParticles ${duration}s infinite linear`;
            
            container.appendChild(particle);
        }

        // Inyectamos la Keyframe Animation en el documento
        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
            @keyframes floatingParticles {
                0% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
                50% { opacity: 0.5; }
                100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Ejecutamos partículas
    initParticles();


    // ======================================================
    // 2. EFECTO TILT 3D (TARJETAS QUE SE MUEVEN)
    // ======================================================
    // Seleccionamos automáticamente tus tarjetas de "Sobre mí" y "Proyectos"
    // Buscamos los divs que tienen fondo blanco (bg-white) o gris (bg-gray-50) y bordes redondeados
    const cards = document.querySelectorAll('.bg-white.rounded-xl, .bg-gray-50.rounded-xl');

    if (window.matchMedia("(hover: hover)").matches) { // Solo en PC con mouse
        cards.forEach(card => {
            // Configuración inicial de transición
            card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
            card.style.transformStyle = 'preserve-3d';

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Cálculo del ángulo (Divisor más alto = movimiento más sutil)
                const rotateX = ((y - centerY) / 25) * -1;
                const rotateY = (x - centerX) / 25;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                card.style.zIndex = '20'; // Traer al frente
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.5s ease'; // Salida suave
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                card.style.zIndex = '1';
            });
        });
    }


    // ======================================================
    // 3. MÁQUINA DE ESCRIBIR (TYPEWRITER)
    // ======================================================
    const typeElement = document.querySelector('.typewriter');
    if (typeElement) {
        const words = ["Desarrollador Full-Stack", "Experto en Odoo", "Backend .NET", "Frontend React"];
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
                typeSpeed = 2000; // Pausa al terminar palabra
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
    // 4. LÓGICA DEL MENÚ (HAMBURGUESA)
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

// Función global para el botón HTML
function downloadCV() {
    alert("Iniciando descarga del CV...");
}