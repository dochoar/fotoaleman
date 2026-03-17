// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // e.preventDefault(); // Default behavior is improved with multi-page setup
        // Only prevent default if it's an anchor on the same page
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// --- DYNAMIC GLOBAL LIGHTBOX IMPLEMENTATION ---
function initLightbox() {
    // 1. Create modal HTML dynamically if it doesn't exist
    if (!document.getElementById("global-image-modal")) {
        const modalHTML = `
            <div id="global-image-modal" class="custom-lightbox-modal">
                <span class="lightbox-close">&times;</span>
                <img class="lightbox-content" id="lightbox-img" src="" alt="">
                <div id="lightbox-caption"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById("global-image-modal");
    const modalImg = document.getElementById("lightbox-img");
    const captionText = document.getElementById("lightbox-caption");
    const closeBtn = document.querySelector(".lightbox-close");

    // 2. Event Delegation: Listen for clicks on the entire document
    document.addEventListener("click", function (e) {
        // Find if an image or its gallery container was clicked
        let img = e.target.closest('img');
        
        // If clicking on the gallery item container (not directly on the img pixel),
        // find the first image inside it
        if (!img) {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                img = galleryItem.querySelector('img');
            }
        }
        
        if (!img) return;

        // Filtering: Ignore logos, icons, QR codes or elements with .no-lightbox
        const isExcluded = 
            img.alt.toLowerCase().includes("logo") || 
            img.src.toLowerCase().includes("logo") || 
            img.src.toLowerCase().includes("qr") || 
            img.classList.contains("no-lightbox") ||
            img.closest('.logo') ||
            // Excluir SOLAMENTE los banners de categorías de la página de inicio (que son enlaces directos)
            (img.closest('a.card') && (img.closest('a.card').getAttribute('href').endsWith('.html')));

        if (isExcluded) return;

        // Prevent default if it's inside an anchor (priority to lightbox)
        const isInsideAnchor = img.closest('a');
        if (isInsideAnchor) {
            e.preventDefault();
        }

        modal.style.display = "flex";
        setTimeout(() => {
            modal.classList.add("show");
        }, 10);
        
        modalImg.src = img.src;
        captionText.innerHTML = ""; // No mostrar nombres ni descripciones
        document.body.style.overflow = "hidden";
    });

    // 3. Close modal logic
    const closeModal = () => {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }, 300);
    };

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target !== modalImg) {
                closeModal();
            }
        });
    }
    
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && modal.style.display === "flex") {
            closeModal();
        }
    });
}

// Fade-in animation on scroll using Intersection Observer
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });



    // --- REUSABLE CAROUSEL CLASS ---
    class Carousel {
        constructor(containerSelector) {
            this.container = document.querySelector(containerSelector);
            if (!this.container) return;

            this.track = this.container.querySelector('.carousel-track');
            this.slides = Array.from(this.track.children);
            this.nextButton = this.container.querySelector('.carousel-button--right');
            this.prevButton = this.container.querySelector('.carousel-button--left');
            this.dotsNav = this.container.querySelector('.carousel-nav');
            this.dots = this.dotsNav ? Array.from(this.dotsNav.children) : [];

            this.currentIndex = 0;
            this.autoplayInterval = null;

            // Touch properties
            this.touchStartX = 0;
            this.touchEndX = 0;
            this.swipeThreshold = 50; // Minimum distance for a swipe

            this.init();
        }

        init() {
            this.setSlidePositions();
            this.addEventListeners();
            this.startAutoplay();
            this.updateArrows(0);

            window.addEventListener('resize', () => {
                this.setSlidePositions();
                this.moveToSlide(this.currentIndex);
            });
        }

        setSlidePositions() {
            const slideWidth = this.slides[0].getBoundingClientRect().width;
            this.slides.forEach((slide, index) => {
                slide.style.left = slideWidth * index + 'px';
            });
        }

        moveToSlide(targetIndex) {
            const targetSlide = this.slides[targetIndex];
            this.track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            
            this.slides[this.currentIndex].classList.remove('current-slide');
            targetSlide.classList.add('current-slide');

            if (this.dots.length > 0) {
                this.dots[this.currentIndex].classList.remove('current-slide');
                this.dots[targetIndex].classList.add('current-slide');
            }

            this.updateArrows(targetIndex);
            this.currentIndex = targetIndex;
        }

        updateArrows(index) {
            if (!this.prevButton || !this.nextButton) return;
            
            if (index === 0) {
                this.prevButton.classList.add('is-hidden');
                this.nextButton.classList.remove('is-hidden');
            } else if (index === this.slides.length - 1) {
                this.prevButton.classList.remove('is-hidden');
                this.nextButton.classList.add('is-hidden');
            } else {
                this.prevButton.classList.remove('is-hidden');
                this.nextButton.classList.remove('is-hidden');
            }
        }

        addEventListeners() {
            if (this.prevButton) {
                this.prevButton.addEventListener('click', () => {
                    const targetIndex = this.currentIndex - 1;
                    this.moveToSlide(targetIndex);
                    this.resetAutoplay();
                });
            }

            if (this.nextButton) {
                this.nextButton.addEventListener('click', () => {
                    const targetIndex = this.currentIndex + 1;
                    this.moveToSlide(targetIndex);
                    this.resetAutoplay();
                });
            }

            if (this.dotsNav) {
                this.dotsNav.addEventListener('click', e => {
                    const targetDot = e.target.closest('button');
                    if (!targetDot) return;

                    const targetIndex = this.dots.findIndex(dot => dot === targetDot);
                    this.moveToSlide(targetIndex);
                    this.resetAutoplay();
                });
            }

            // Touch events for swipe
            this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
            this.track.addEventListener('touchend', () => this.handleTouchEnd());
        }

        handleTouchStart(e) {
            this.touchStartX = e.touches[0].clientX;
        }

        handleTouchMove(e) {
            this.touchEndX = e.touches[0].clientX;
        }

        handleTouchEnd() {
            const swipeDistance = this.touchEndX - this.touchStartX;
            
            // Check if touchEndX was actually updated (not just a tap)
            if (this.touchEndX === 0) return;

            if (Math.abs(swipeDistance) > this.swipeThreshold) {
                if (swipeDistance > 0) {
                    // Swipe Right (Go to Previous)
                    if (this.currentIndex > 0) {
                        this.moveToSlide(this.currentIndex - 1);
                        this.resetAutoplay();
                    }
                } else {
                    // Swipe Left (Go to Next)
                    if (this.currentIndex < this.slides.length - 1) {
                        this.moveToSlide(this.currentIndex + 1);
                        this.resetAutoplay();
                    }
                }
            }
            
            // Reset values
            this.touchStartX = 0;
            this.touchEndX = 0;
        }

        startAutoplay() {
            this.autoplayInterval = setInterval(() => {
                const isLastSlide = this.currentIndex === this.slides.length - 1;
                const targetIndex = isLastSlide ? 0 : this.currentIndex + 1;
                this.moveToSlide(targetIndex);
            }, 10000); // Increased from 5000ms to 10000ms for more reading time
        }

        resetAutoplay() {
            clearInterval(this.autoplayInterval);
            this.startAutoplay();
        }
    }

    // Initialize Carousels
    new Carousel('.celebrity-carousel');
    new Carousel('.reviews-carousel');

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Optional: Toggle icon between bars and times
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                    icon.style.color = 'var(--color-black)'; // Ensure close icon is visible on white menu
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    icon.style.color = ''; // Reset color
                }
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    icon.style.color = '';
                }
            });
        });
    }

    // Video Carousel Logic
    const videoCards = document.querySelectorAll('.video-card');

    videoCards.forEach(card => {
        const video = card.querySelector('video');
        const overlay = card.querySelector('.video-overlay');

        if (video && overlay) {
            // Remove autoplay attributes just in case
            video.removeAttribute('autoplay');
            video.removeAttribute('loop');

            card.addEventListener('click', async (e) => {
                // Prevent click if clicking on controls
                if (e.target === video && video.controls) return;

                if (video.paused) {
                    try {
                        // Ensure we aren't silenced if possible, but handle limitations
                        // video.muted = false;
                        await video.play();
                        card.classList.add('playing');
                        video.controls = true;
                    } catch (err) {
                        console.warn("Video playback failed, trying muted:", err);
                        try {
                            video.muted = true;
                            await video.play();
                            card.classList.add('playing');
                            video.controls = true;
                        } catch (err2) {
                            console.error("Video playback failed completely:", err2);
                        }
                    }
                } else {
                    video.pause();
                    card.classList.remove('playing');
                }
            });

            video.addEventListener('ended', () => {
                card.classList.remove('playing');
                video.load(); // Reset to poster
                video.controls = false;
            });

            video.addEventListener('pause', () => {
                if (!video.ended && !video.seeking) {
                    card.classList.remove('playing');
                    video.controls = false; // Optional: hide controls again to show clean overlay?
                }
            });

            video.addEventListener('play', () => {
                card.classList.add('playing');
                video.controls = true;
            });
        }
    });
}

// Ensure everything runs on load
initLightbox();
initAnimations();
