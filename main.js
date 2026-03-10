// ================================
// Le Gandhi – Main JavaScript
// ================================

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initTestimonials();
    initLanguageToggle();
    initFAQ();
    initLightbox();
    initHeroVideo();
    removeLogoWhiteBackground();
});

// ================================
// Sticky Header
// ================================
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ================================
// Mobile Menu
// ================================
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ================================
// Smooth Scroll
// ================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerH = document.querySelector('.header')?.offsetHeight || 80;
                const top = target.getBoundingClientRect().top + window.scrollY - headerH;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

// ================================
// Scroll Reveal (Intersection Observer)
// ================================
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
}

// ================================
// Testimonial Carousel
// ================================
function initTestimonials() {
    const track = document.querySelector('.testimonial-track');
    const dots = document.querySelectorAll('.testimonial-dot');
    if (!track || !dots.length) return;

    let current = 0;
    const total = dots.length;

    function goTo(index) {
        current = index;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Auto-rotate every 5 seconds
    setInterval(() => goTo((current + 1) % total), 5000);
}

// ================================
// Language Toggle (FR / EN)
// ================================
function initLanguageToggle() {
    const lang = localStorage.getItem('gandhi-lang') || 'fr';
    applyLanguage(lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newLang = btn.dataset.lang;
            localStorage.setItem('gandhi-lang', newLang);
            applyLanguage(newLang);
        });
    });
}

function applyLanguage(lang) {
    if (!translations || !translations[lang]) return;
    const t = translations[lang];

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                el.innerHTML = t[key];
            }
        }
    });

    // Update active lang button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update html lang attribute
    document.documentElement.lang = lang;
}

// ================================
// FAQ Accordion
// ================================
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item.active').forEach(openItem => {
                openItem.classList.remove('active');
                openItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Toggle current
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// ================================
// Gallery Lightbox
// ================================
function initLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    closeBtn?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ================================
// Hero Video Audio Toggle
// ================================
function initHeroVideo() {
    const video = document.getElementById('heroVideo');
    const toggle = document.getElementById('audioToggle');
    const hero = document.querySelector('.hero');
    if (!video || !toggle || !hero) return;

    // Start muted for autoplay compliance, reduced volume
    video.muted = true;
    video.volume = 0.3;

    function updateIcon() {
        const icon = toggle.querySelector('i');
        icon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    }

    toggle.addEventListener('click', () => {
        video.muted = !video.muted;
        updateIcon();
    });

    // Auto-mute when scrolling past the hero section
    window.addEventListener('scroll', () => {
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        if (window.scrollY > heroBottom - 100 && !video.muted) {
            video.muted = true;
            updateIcon();
        }
    }, { passive: true });
}

// ================================
// Remove White Background from Logo
// ================================
function removeLogoWhiteBackground() {
    document.querySelectorAll('.nav-logo img').forEach(img => {
        const process = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                // Calculate how close to white this pixel is
                const brightness = (r + g + b) / 3;
                if (brightness > 220) {
                    // Fade out near-white pixels smoothly
                    const alpha = Math.max(0, (255 - brightness) * (255 / 35));
                    data[i + 3] = Math.min(data[i + 3], Math.round(alpha));
                }
            }
            ctx.putImageData(imageData, 0, 0);
            img.src = canvas.toDataURL('image/png');
        };
        if (img.complete && img.naturalWidth > 0) {
            process();
        } else {
            img.addEventListener('load', process);
        }
    });
}

// ================================
// WhatsApp Reservation Redirect
// ================================
// ⚠️ CHANGE THIS to the restaurant's WhatsApp number (with country code, no spaces/dashes)
const WHATSAPP_NUMBER = '33561992103';

function handleReservationWhatsApp(event) {
    event.preventDefault();

    const name = document.getElementById('resName')?.value.trim() || '';
    const email = document.getElementById('resEmail')?.value.trim() || '';
    const phone = document.getElementById('resPhone')?.value.trim() || '';
    const date = document.getElementById('resDate')?.value || '';
    const time = document.getElementById('resTime')?.value || '';
    const guestsSelect = document.getElementById('resGuests');
    const guests = guestsSelect ? guestsSelect.options[guestsSelect.selectedIndex].text : '';
    const message = document.getElementById('resMessage')?.value.trim() || '';

    // Format the date nicely
    let formattedDate = date;
    if (date) {
        const d = new Date(date + 'T00:00:00');
        formattedDate = d.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Format the time nicely
    let formattedTime = time;
    if (time) {
        const [h, m] = time.split(':');
        formattedTime = `${h}h${m}`;
    }

    // Build the WhatsApp message (no emojis — they break in URL encoding)
    let waMessage = '*Nouvelle R\u00e9servation \u2013 Le Gandhi*\n\n';
    waMessage += '*Nom :* ' + name + '\n';
    if (email) waMessage += '*Email :* ' + email + '\n';
    if (phone) waMessage += '*T\u00e9l\u00e9phone :* ' + phone + '\n';
    waMessage += '*Date :* ' + formattedDate + '\n';
    waMessage += '*Heure :* ' + formattedTime + '\n';
    waMessage += '*Convives :* ' + guests + '\n';
    if (message) waMessage += '\n*Message :*\n' + message + '\n';
    waMessage += '\n---\nEnvoy\u00e9 depuis le site legandhi-toulouse.fr';

    // Encode and build WhatsApp URL
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

    // Show success confirmation before redirect
    showReservationConfirmation(() => {
        window.open(waUrl, '_blank');
    });
}

function showReservationConfirmation(callback) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'waConfirmOverlay';
    overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        opacity: 0; transition: opacity 0.3s ease;
    `;

    const card = document.createElement('div');
    card.style.cssText = `
        background: linear-gradient(145deg, #2a1a1a, #1a1a1a);
        border: 1px solid rgba(212, 168, 67, 0.3);
        border-radius: 20px;
        padding: 48px 40px;
        text-align: center;
        max-width: 420px;
        width: 90%;
        transform: scale(0.8); opacity: 0;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 168, 67, 0.1);
    `;

    const lang = document.documentElement.lang || 'fr';
    const isFr = lang === 'fr';

    card.innerHTML = `
        <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#25D366,#128C7E);
            display:flex;align-items:center;justify-content:center;margin:0 auto 24px;
            box-shadow: 0 8px 32px rgba(37,211,102,0.3);">
            <i class="fab fa-whatsapp" style="font-size:2.2rem;color:#fff;"></i>
        </div>
        <h3 style="font-family:'Playfair Display',serif;font-size:1.5rem;color:#f5f0e8;margin-bottom:12px;">
            ${isFr ? 'Réservation prête !' : 'Reservation Ready!'}
        </h3>
        <p style="color:#b8a99a;font-size:0.95rem;line-height:1.6;margin-bottom:28px;">
            ${isFr
            ? 'Vous allez être redirigé vers WhatsApp avec les détails de votre réservation. Appuyez simplement sur Envoyer.'
            : 'You will be redirected to WhatsApp with your reservation details. Just tap Send.'}
        </p>
        <button id="waConfirmBtn" style="
            background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;border:none;
            padding:14px 36px;border-radius:12px;font-size:1rem;font-weight:600;
            cursor:pointer;transition:all 0.3s ease;font-family:'Poppins',sans-serif;
            letter-spacing:0.5px;text-transform:uppercase;
            box-shadow: 0 4px 20px rgba(37,211,102,0.4);">
            <i class="fab fa-whatsapp" style="margin-right:8px;"></i>
            ${isFr ? 'Ouvrir WhatsApp' : 'Open WhatsApp'}
        </button>
        <button id="waCancelBtn" style="
            display:block;margin:16px auto 0;background:none;border:none;
            color:#b8a99a;font-size:0.85rem;cursor:pointer;font-family:'Poppins',sans-serif;
            padding:8px 16px;transition:color 0.2s ease;">
            ${isFr ? 'Annuler' : 'Cancel'}
        </button>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        card.style.transform = 'scale(1)';
        card.style.opacity = '1';
    });

    // Confirm button
    document.getElementById('waConfirmBtn').addEventListener('click', () => {
        closeOverlay();
        callback();
        // Reset form after redirect
        document.getElementById('reservationForm')?.reset();
    });

    // Cancel button
    document.getElementById('waCancelBtn').addEventListener('click', closeOverlay);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay();
    });

    // Hover effects
    const confirmBtn = document.getElementById('waConfirmBtn');
    confirmBtn.addEventListener('mouseenter', () => {
        confirmBtn.style.transform = 'translateY(-2px)';
        confirmBtn.style.boxShadow = '0 8px 30px rgba(37,211,102,0.6)';
    });
    confirmBtn.addEventListener('mouseleave', () => {
        confirmBtn.style.transform = 'translateY(0)';
        confirmBtn.style.boxShadow = '0 4px 20px rgba(37,211,102,0.4)';
    });

    function closeOverlay() {
        overlay.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        card.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
    }
}
