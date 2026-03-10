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
        // Find if an image or a link containing an image was clicked
        const img = e.target.closest('img');
        
        if (!img) return;

        // Filtering: Ignore logos, icons, QR codes or elements with .no-lightbox
        const isExcluded = 
            img.alt.toLowerCase().includes("logo") || 
            img.src.toLowerCase().includes("logo") || 
            img.src.toLowerCase().includes("qr") || 
            img.classList.contains("no-lightbox");

        if (isExcluded) return;

        // If we reach here, it's a valid gallery image
        
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
        captionText.innerHTML = img.alt || "";
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

// Ensure initLightbox runs whether document is still loading or already loaded
initLightbox();

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



    // --- CAROUSEL LOGIC ---
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-button--right');
        const prevButton = document.querySelector('.carousel-button--left');
        const dotsNav = document.querySelector('.carousel-nav');
        const dots = Array.from(dotsNav.children);

        const slideWidth = slides[0].getBoundingClientRect().width;

        // Arrange the slides next to one another
        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        slides.forEach(setSlidePosition);

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        }

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('current-slide');
            targetDot.classList.add('current-slide');
        }

        const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
            if (targetIndex === 0) {
                prevButton.classList.add('is-hidden');
                nextButton.classList.remove('is-hidden');
            } else if (targetIndex === slides.length - 1) {
                prevButton.classList.remove('is-hidden');
                nextButton.classList.add('is-hidden');
            } else {
                prevButton.classList.remove('is-hidden');
                nextButton.classList.remove('is-hidden');
            }
        }

        // Click left
        prevButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const prevSlide = currentSlide.previousElementSibling;
            const currentDot = dotsNav.querySelector('.current-slide');
            const prevDot = currentDot.previousElementSibling;
            const prevIndex = slides.findIndex(slide => slide === prevSlide);

            moveToSlide(track, currentSlide, prevSlide);
            updateDots(currentDot, prevDot);
            hideShowArrows(slides, prevButton, nextButton, prevIndex);
        });

        // Click right
        nextButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling;
            const currentDot = dotsNav.querySelector('.current-slide');
            const nextDot = currentDot.nextElementSibling;
            const nextIndex = slides.findIndex(slide => slide === nextSlide);

            moveToSlide(track, currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
            hideShowArrows(slides, prevButton, nextButton, nextIndex);
        });

        // Click indicators
        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button');

            if (!targetDot) return;

            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.current-slide');
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            const targetSlide = slides[targetIndex];

            moveToSlide(track, currentSlide, targetSlide);
            updateDots(currentDot, targetDot);
            hideShowArrows(slides, prevButton, nextButton, targetIndex);
        });

        // Re-calculate slide positions on window resize
        window.addEventListener('resize', () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            slides.forEach((slide, index) => {
                slide.style.left = slideWidth * index + 'px';
            });
            // Reset to current slide position to avoid misalignment
            const currentSlide = track.querySelector('.current-slide');
            if (currentSlide) {
                track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
            }
        });
        // ... existing code ...

        // --- AUTOPLAY ---
        let autoplayInterval = null;

        const goToNextSlide = () => {
            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.current-slide');
            const currentIndex = slides.findIndex(slide => slide === currentSlide);
            const isLastSlide = currentIndex === slides.length - 1;

            const nextSlide = isLastSlide ? slides[0] : currentSlide.nextElementSibling;
            const nextDot = isLastSlide ? dots[0] : currentDot.nextElementSibling;
            const nextIndex = isLastSlide ? 0 : currentIndex + 1;

            moveToSlide(track, currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
            hideShowArrows(slides, prevButton, nextButton, nextIndex);
        };

        const startAutoplay = () => {
            autoplayInterval = setInterval(goToNextSlide, 4000);
        };

        const resetAutoplay = () => {
            clearInterval(autoplayInterval);
            startAutoplay();
        };

        // Reset timer on manual interaction
        nextButton.addEventListener('click', resetAutoplay);
        prevButton.addEventListener('click', resetAutoplay);
        dotsNav.addEventListener('click', resetAutoplay);

        startAutoplay();
    }

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
initAnimations();
