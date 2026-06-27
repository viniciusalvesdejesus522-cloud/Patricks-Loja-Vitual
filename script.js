document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initScrollEffects();
    initMobileMenu();
    generateParticles();
    initScrollReveal();
    initBeforeAfterSlider();
    initCarouselGallery();
    initFAQAccordion();
});

/* -------------------------------------------------------------
   CURSOR PERSONALIZADO (CÍRCULO AZUL BRILHANTE)
------------------------------------------------------------- */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    if (!cursor || !cursorDot) return;

    let mouseX = 0, mouseY = 0; // Posição real do mouse
    let cursorX = 0, cursorY = 0; // Posição com atraso (lerp)
    
    // Atualiza posição real
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Ponto central move-se instantaneamente
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });
    
    // Animação LERP (atraso suave) para o círculo externo
    function animateCursor() {
        // LERP: Posição += (Destino - Atual) * Velocidade
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover em elementos clicáveis
    const clickables = document.querySelectorAll('a, button, .slider-handle, .carousel-nav-btn, .dot, .accordion-header');
    
    clickables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            // Mudar cor do ponto central para azul no hover para dar contraste
            cursorDot.style.backgroundColor = 'var(--light-blue)';
        });
        
        item.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursorDot.style.backgroundColor = 'var(--orange)';
        });
    });

    // Ocultar cursor se sair da tela
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });
}

/* -------------------------------------------------------------
   EFEITOS DE ROLAGEM (STICKY NAVBAR & SCROLLBAR COR)
------------------------------------------------------------- */
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        // Sticky Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Detecção do Final da Página para Scrollbar Laranja
        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.documentElement.scrollHeight;
        
        // Se estiver a menos de 50px do final, aplica a classe
        if (pageHeight - scrollPosition < 60) {
            document.body.classList.add('scroll-at-bottom');
        } else {
            document.body.classList.remove('scroll-at-bottom');
        }
    });
}

/* -------------------------------------------------------------
   MENU MOBILE DRAWER
------------------------------------------------------------- */
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Fecha o menu ao clicar em qualquer link
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggleBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

/* -------------------------------------------------------------
   GERAÇÃO DE PARTÍCULAS NO FUNDO HERO
------------------------------------------------------------- */
function generateParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const numberOfParticles = 20;

    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Configurações aleatórias de tamanho e posicionamento
        const size = Math.random() * 8 + 3; // 3px a 11px
        const left = Math.random() * 100; // 0% a 100%
        const delay = Math.random() * 8; // delay até 8s
        const duration = Math.random() * 6 + 6; // velocidade de 6s a 12s

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;

        // Cores suaves de azul e branco
        const opacity = Math.random() * 0.4 + 0.1;
        particle.style.backgroundColor = i % 2 === 0 ? `rgba(42, 140, 255, ${opacity})` : `rgba(255, 255, 255, ${opacity})`;

        container.appendChild(particle);
    }
}

/* -------------------------------------------------------------
   SCROLL REVEAL E CONTADORES DE NÚMEROS
------------------------------------------------------------- */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Se contiver estatísticas, inicia o contador
                const numbers = entry.target.querySelectorAll('.stat-number');
                if (numbers.length > 0) {
                    numbers.forEach(num => startCounter(num));
                }
                
                obs.unobserve(entry.target); // Revela apenas uma vez
            }
        });
    }, {
        threshold: 0.15 // Inicia quando 15% do elemento estiver visível
    });

    reveals.forEach(rev => {
        observer.observe(rev);
    });
}

function startCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 1500; // Duração de 1.5s
    const stepTime = 15; // Atualização a cada 15ms
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;
    
    let currentNumber = 0;
    let step = 0;
    
    const timer = setInterval(() => {
        currentNumber += increment;
        step++;
        
        if (step >= totalSteps) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentNumber);
        }
    }, stepTime);
}

/* -------------------------------------------------------------
   SLIDER INTERATIVO ANTES E DEPOIS
------------------------------------------------------------- */
function initBeforeAfterSlider() {
    const slider = document.querySelector('.before-after-slider');
    const afterImg = document.querySelector('.after-image');
    const handle = document.querySelector('.slider-handle');

    if (!slider || !afterImg || !handle) return;

    let isDragging = false;

    function moveSlider(x) {
        const rect = slider.getBoundingClientRect();
        // Normaliza a posição x do toque/mouse relativa ao container
        let position = ((x - rect.left) / rect.width) * 100;
        
        // Define limites (0% a 100%)
        if (position < 0) position = 0;
        if (position > 100) position = 100;
        
        // Atualiza elementos
        afterImg.style.width = `${position}%`;
        handle.style.left = `${position}%`;
    }

    // Eventos de Mouse
    handle.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    
    slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        moveSlider(e.clientX);
    });

    // Eventos Touch (Dispositivos Móveis)
    handle.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('touchend', () => isDragging = false);
    
    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        moveSlider(e.touches[0].clientX);
    });
}

/* -------------------------------------------------------------
   CARROSSEL COM LIGHTBOX
------------------------------------------------------------- */
function initCarouselGallery() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const dotsContainer = document.querySelector('.carousel-dots');
    const dots = Array.from(document.querySelectorAll('.dot'));
    
    if (!track || slides.length === 0) return;

    let currentIndex = 0;

    function updateCarouselPosition() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Atualiza os dots
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarouselPosition();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarouselPosition();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarouselPosition();
        });
    });

    // Lightbox para clique e visualização em Tela Cheia
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-content');
    const lightboxCap = document.getElementById('lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    slides.forEach(slide => {
        const img = slide.querySelector('img');
        const caption = slide.querySelector('.slide-caption');
        
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxCap.textContent = caption ? caption.textContent : "";
            lightbox.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Fecha ao clicar fora da imagem
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === closeBtn) {
            lightbox.classList.remove('active');
        }
    });

    // Suporte para fechar com tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    });
}

/* -------------------------------------------------------------
   FAQ ACORDEÃO (EFEITO SANFONA ELEGANTE)
------------------------------------------------------------- */
function initFAQAccordion() {
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const isActive = item.classList.contains('active');
            
            // Fecha todos os outros itens (efeito sanfona estrito)
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.accordion-content').style.maxHeight = null;
            });

            // Abre o item atual se ele não estava ativo
            if (!isActive) {
                item.classList.add('active');
                // Define altura baseada no conteúdo
                content.style.maxHeight = `${content.scrollHeight}px`;
            }
        });
    });
}
