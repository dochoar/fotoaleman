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

// Lightbox implementation
var modal = document.getElementById("image-modal");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

// Get all images with class card-img
var images = document.querySelectorAll(".card-img");

if (images.length > 0) {
    images.forEach(function (img) {
        // Skip images that are inside links to allow navigation
        if (img.closest('a')) return;

        img.onclick = function () {
            if (modal) {
                modal.style.display = "block";
                modalImg.src = this.src;
                // Try to find the title in the card content
                // Try to find the title and price in the card content
                var cardContent = this.nextElementSibling;
                if (cardContent) {
                    var title = cardContent.querySelector("h3");
                    var type = cardContent.querySelector(".card-type");
                    var price = cardContent.querySelector(".card-price");

                    var captionHTML = "";
                    if (title) captionHTML += "<h3>" + title.innerHTML + "</h3>";
                    if (type) captionHTML += "<p>" + type.innerHTML + "</p>";
                    if (price) captionHTML += "<div class='card-price' style='color: var(--color-gold); font-weight: 700; margin-top: 10px;'>" + price.innerHTML + "</div>";

                    captionText.innerHTML = captionHTML || this.alt;
                } else {
                    captionText.innerHTML = this.alt;
                }
            }
        }
    });
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
if (span) {
    span.onclick = function () {
        if (modal) modal.style.display = "none";
    }
}

// Close on clicking outside the image
if (modal) {
    modal.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}


// Fade-in animation on scroll using Intersection Observer
document.addEventListener("DOMContentLoaded", function () {
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
    // });
});
