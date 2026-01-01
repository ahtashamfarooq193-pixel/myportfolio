// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Loader Animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');

    gsap.to(loader, {
        opacity: 0,
        duration: 1,
        delay: 0.5,
        onComplete: () => {
            loader.style.display = 'none';
            initAnimations();
        }
    });
});

function initAnimations() {
    // Horizontal Scroll Logic
    let sections = gsap.utils.toArray(".panel");

    // Only enable horizontal scroll on desktop
    if (window.innerWidth > 768) {
        let totalWidth = sections.length * 100;

        gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: ".wrapper",
                pin: true,
                scrub: 1,
                snap: 1 / (sections.length - 1),
                // Use the total width of all sections for the scroll duration/distance
                end: () => "+=" + document.querySelector(".wrapper").offsetWidth
            }
        });
    }

    // Hero Animations
    const heroTl = gsap.timeline();

    heroTl.from(".hero-title .line", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
    })
        .from(".hero-footer p", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        }, "-=0.5")
        .from(".hero-bg-text", {
            x: 100,
            opacity: 0,
            duration: 1.5,
            ease: "power2.out"
        }, "-=1");

    // About Section Animations
    gsap.from(".about-text", {
        scrollTrigger: {
            trigger: ".about",
            containerAnimation: window.innerWidth > 768 ? gsap.getTweensOf(sections)[0] : null,
            start: "left center",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".stat", {
        scrollTrigger: {
            trigger: ".about",
            containerAnimation: window.innerWidth > 768 ? gsap.getTweensOf(sections)[0] : null,
            start: "left center",
            toggleActions: "play none none reverse"
        },
        x: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Skills Animations (Floating Effect)
    gsap.from(".skill-tag", {
        scrollTrigger: {
            trigger: ".skills",
            containerAnimation: window.innerWidth > 768 ? gsap.getTweensOf(sections)[0] : null,
            start: "left center",
            toggleActions: "play none none reverse"
        },
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: {
            amount: 1,
            from: "random"
        },
        ease: "back.out(1.7)"
    });

    // Projects Animations
    gsap.from(".project-card", {
        scrollTrigger: {
            trigger: ".projects",
            containerAnimation: window.innerWidth > 768 ? gsap.getTweensOf(sections)[0] : null,
            start: "left center",
            toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Contact Animations
    gsap.from(".huge-link", {
        scrollTrigger: {
            trigger: ".contact",
            containerAnimation: window.innerWidth > 768 ? gsap.getTweensOf(sections)[0] : null,
            start: "left center",
            toggleActions: "play none none reverse"
        },
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
}

// Refresh ScrollTrigger on resize
window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
});
