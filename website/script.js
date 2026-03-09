// TSA Portfolio - script.js

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       0. MOBILE NAV HAMBURGER TOGGLE
       ========================================= */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        // Animate the hamburger lines into an X
        navToggle.classList.toggle('open');
    });

    // Close menu when any nav link is tapped (single-page navigation)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('open');
        });
    });



    /* =========================================
       1. CERTIFICATE CAROUSEL LOGIC
       ========================================= */
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button--right');
    const prevButton = document.querySelector('.carousel-button--left');
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);

    let currentSlideIndex = 0;

    const arrangeSlides = () => {
        // Arrange slides horizontally
        const slideWidth = slides[0].getBoundingClientRect().width;
        slides.forEach((slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        });
    };

    // Call once to setup layout, and on resize
    arrangeSlides();
    window.addEventListener('resize', arrangeSlides);

    const moveToSlide = (track, currentSlide, targetSlide, targetIndex) => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';

        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('current-indicator');
        targetDot.classList.add('current-indicator');
    };

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
    };

    // Next Button Click
    nextButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const currentDot = dotsNav.querySelector('.current-indicator');
        currentSlideIndex++;

        if (currentSlideIndex >= slides.length) return; // boundary check

        const nextSlide = slides[currentSlideIndex];
        const nextDot = dots[currentSlideIndex];

        moveToSlide(track, currentSlide, nextSlide, currentSlideIndex);
        updateDots(currentDot, nextDot);
        hideShowArrows(slides, prevButton, nextButton, currentSlideIndex);
    });

    // Previous Button Click
    prevButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const currentDot = dotsNav.querySelector('.current-indicator');
        currentSlideIndex--;

        if (currentSlideIndex < 0) return; // boundary check

        const prevSlide = slides[currentSlideIndex];
        const prevDot = dots[currentSlideIndex];

        moveToSlide(track, currentSlide, prevSlide, currentSlideIndex);
        updateDots(currentDot, prevDot);
        hideShowArrows(slides, prevButton, nextButton, currentSlideIndex);
    });

    // Indicator Click
    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;

        const currentSlide = track.querySelector('.current-slide');
        const currentDot = dotsNav.querySelector('.current-indicator');
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];

        currentSlideIndex = targetIndex;

        moveToSlide(track, currentSlide, targetSlide, targetIndex);
        updateDots(currentDot, targetDot);
        hideShowArrows(slides, prevButton, nextButton, targetIndex);
    });

    // Auto-advance Carousel (Optional)
    let autoPlayInterval = setInterval(() => {
        if (currentSlideIndex === slides.length - 1) {
            // Reset to 0
            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.current-indicator');
            currentSlideIndex = 0;
            moveToSlide(track, currentSlide, slides[0], 0);
            updateDots(currentDot, dots[0]);
            hideShowArrows(slides, prevButton, nextButton, 0);
        } else {
            nextButton.click();
        }
    }, 5000); // 5s interval

    document.querySelector('.carousel-container').addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            if (currentSlideIndex === slides.length - 1) {
                const currentSlide = track.querySelector('.current-slide');
                const currentDot = dotsNav.querySelector('.current-indicator');
                currentSlideIndex = 0;
                moveToSlide(track, currentSlide, slides[0], 0);
                updateDots(currentDot, dots[0]);
                hideShowArrows(slides, prevButton, nextButton, 0);
            } else {
                nextButton.click();
            }
        }, 5000);
    });

    /* Touch/Swipe support for carousel on mobile */
    const carouselTrackContainer = document.querySelector('.carousel-track-container');
    let touchStartX = 0;
    let touchEndX = 0;

    carouselTrackContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselTrackContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) { // minimum swipe distance
            if (diff > 0 && currentSlideIndex < slides.length - 1) {
                nextButton.click(); // swipe left → next
            } else if (diff < 0 && currentSlideIndex > 0) {
                prevButton.click(); // swipe right → prev
            }
        }
    }, { passive: true });




    /* =========================================
       2. DATA MINING CHARTS (CHART.JS)
       ========================================= */

    // Chart Global Defaults
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Outfit', sans-serif";
    const gridOptions = {
        color: 'rgba(255, 255, 255, 0.05)'
    };

    // Data parsed from the problem statement:
    // Category, 2022, 2023, 2024
    // Technical, 1, 2, 2
    // Social, 0, 1, 1
    // Personal, 1, 0, 1

    const ctxYearly = document.getElementById('yearlyTrendChart').getContext('2d');
    new Chart(ctxYearly, {
        type: 'bar',
        data: {
            labels: ['2022', '2023', '2024'],
            datasets: [
                {
                    label: 'Technical',
                    data: [1, 2, 2],
                    backgroundColor: 'rgba(99, 102, 241, 0.7)',
                    borderColor: '#6366f1',
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'Social',
                    data: [0, 1, 1],
                    backgroundColor: 'rgba(236, 72, 153, 0.7)',
                    borderColor: '#ec4899',
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'Personal',
                    data: [1, 0, 1],
                    backgroundColor: 'rgba(20, 184, 166, 0.7)',
                    borderColor: '#14b8a6',
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: gridOptions, ticks: { stepSize: 1 } },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: { position: 'top' }
            }
        }
    });

    // Category Distribution (Total over 3 years)
    // Technical: 5, Social: 2, Personal: 2
    const ctxCategory = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctxCategory, {
        type: 'doughnut',
        data: {
            labels: ['Technical', 'Social', 'Personal'],
            datasets: [{
                data: [5, 2, 2],
                backgroundColor: [
                    '#6366f1', // primary
                    '#ec4899', // secondary
                    '#14b8a6'  // accent
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // Region/Level Distribution (Total)
    // Intra-college: 2, Inter-college: 4, National: 3
    // Note: Extrapolated from the specific user dataset in prompt summary.
    const ctxRegion = document.getElementById('regionChart').getContext('2d');
    new Chart(ctxRegion, {
        type: 'polarArea',
        data: {
            labels: ['Intra-college', 'Inter-college', 'National'],
            datasets: [{
                label: 'Events Count',
                data: [2, 4, 3],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.5)',
                    'rgba(236, 72, 153, 0.5)',
                    'rgba(20, 184, 166, 0.5)'
                ],
                borderColor: [
                    '#6366f1',
                    '#ec4899',
                    '#14b8a6'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    grid: gridOptions,
                    ticks: { backdropColor: 'transparent', color: '#94a3b8', stepSize: 1 }
                }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // CO Achievement Radar
    const ctxRadar = document.getElementById('coRadarChart').getContext('2d');
    new Chart(ctxRadar, {
        type: 'radar',
        data: {
            labels: ['CO1: Welfare App', 'CO2: Pragmatic Skills', 'CO3: Engg Solution', 'CO4: Comm/Paper'],
            datasets: [{
                label: 'Achievement Rating',
                data: [5, 4, 4, 1],
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: '#6366f1',
                pointBackgroundColor: '#ec4899',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#ec4899'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: '#94a3b8', font: { size: 11 } },
                    ticks: {
                        backdropColor: 'transparent',
                        color: '#94a3b8',
                        stepSize: 1,
                        min: 0,
                        max: 5
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
});
