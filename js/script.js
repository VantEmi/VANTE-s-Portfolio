/* =========================================================
   VANTE PORTFOLIO — script.js
   Brand: VANTE
   Author: Emiliano Cervantes
   Functions:
   - Loader
   - Custom cursor
   - Navbar mobile
   - Scroll progress
   - Scroll reveal
   - Active nav links
   - Photography filters
   - Lightbox
   - Video autoplay control
   - Current year
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    /* =====================================================
       ELEMENTOS BASE
    ===================================================== */

    const body = document.body;

    const loader = document.getElementById("loader");

    const cursor = document.getElementById("cursor");
    const cursorDot = document.getElementById("cursorDot");

    const scrollProgress = document.getElementById("scrollProgress");

    const siteHeader = document.getElementById("siteHeader");
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".navbar__menu a");

    const revealElements = document.querySelectorAll(".reveal");

    const filterButtons = document.querySelectorAll(".filter-button");
    const photoItems = document.querySelectorAll(".photo-item");

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");
    const lightboxTriggers = document.querySelectorAll("[data-lightbox]");

    const currentYear = document.getElementById("currentYear");

    let lightboxImages = [];
    let currentLightboxIndex = 0;

    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* =====================================================
       LOADER
    ===================================================== */

    window.addEventListener("load", () => {
        if (!loader) return;

        setTimeout(() => {
            loader.classList.add("loader--hidden");
        }, 650);

        setTimeout(() => {
            loader.style.display = "none";
        }, 1600);
    });

    /* =====================================================
       CUSTOM CURSOR
    ===================================================== */

    const isTouchDevice = window.matchMedia("(hover: none)").matches;

    if (!isTouchDevice && cursor && cursorDot) {
        let mouseX = 0;
        let mouseY = 0;

        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener("mousemove", (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.14;
            cursorY += (mouseY - cursorY) * 0.14;

            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            requestAnimationFrame(animateCursor);
        };

        animateCursor();

        const hoverTargets = document.querySelectorAll(
            "a, button, .featured-card, .project-card, .video-card, .photo-item, .gallery-thumb"
        );

        hoverTargets.forEach((target) => {
            target.addEventListener("mouseenter", () => {
                cursor.classList.add("is-hovering");
            });

            target.addEventListener("mouseleave", () => {
                cursor.classList.remove("is-hovering");
            });
        });

        document.addEventListener("mouseleave", () => {
            cursor.style.opacity = "0";
            cursorDot.style.opacity = "0";
        });

        document.addEventListener("mouseenter", () => {
            cursor.style.opacity = "1";
            cursorDot.style.opacity = "1";
        });
    }

    /* =====================================================
       NAVBAR MOBILE
    ===================================================== */

    const closeMobileMenu = () => {
        if (!navToggle || !navMenu) return;

        navToggle.classList.remove("is-open");
        navMenu.classList.remove("is-open");
        body.classList.remove("no-scroll");
    };

    const openMobileMenu = () => {
        if (!navToggle || !navMenu) return;

        navToggle.classList.add("is-open");
        navMenu.classList.add("is-open");
        body.classList.add("no-scroll");
    };

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.contains("is-open");

            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 860) {
            closeMobileMenu();
        }
    });

    /* =====================================================
       SCROLL HEADER + PROGRESS BAR
    ===================================================== */

    const updateScrollUI = () => {
        const scrollTop = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercent}%`;
        }

        if (siteHeader) {
            if (scrollTop > 40) {
                siteHeader.classList.add("scrolled");
            } else {
                siteHeader.classList.remove("scrolled");
            }
        }
    };

    updateScrollUI();

    window.addEventListener("scroll", updateScrollUI);

    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.14,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    }

    /* =====================================================
       ACTIVE NAV LINKS
    ===================================================== */

    const sections = document.querySelectorAll("section[id]");

    if ("IntersectionObserver" in window && sections.length > 0) {
        const navObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const sectionId = entry.target.getAttribute("id");

                    navLinks.forEach((link) => {
                        link.classList.remove("active");

                        const href = link.getAttribute("href");

                        if (href === `#${sectionId}`) {
                            link.classList.add("active");
                        }
                    });
                });
            },
            {
                threshold: 0.35
            }
        );

        sections.forEach((section) => {
            navObserver.observe(section);
        });
    }

    /* =====================================================
       PHOTOGRAPHY FILTERS
    ===================================================== */

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");

            filterButtons.forEach((btn) => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            photoItems.forEach((item) => {
                const category = item.getAttribute("data-category");

                if (filter === "all" || category === filter) {
                    item.classList.remove("is-hidden");

                    setTimeout(() => {
                        item.classList.add("is-visible");
                    }, 30);
                } else {
                    item.classList.add("is-hidden");
                    item.classList.remove("is-visible");
                }
            });
        });
    });

    /* =====================================================
       LIGHTBOX
    ===================================================== */

    lightboxImages = Array.from(lightboxTriggers).map((trigger) => {
        return trigger.getAttribute("data-lightbox");
    });

    const openLightbox = (index) => {
        if (!lightbox || !lightboxImage || lightboxImages.length === 0) return;

        currentLightboxIndex = index;

        const imageSrc = lightboxImages[currentLightboxIndex];

        lightboxImage.src = imageSrc;
        lightboxImage.alt = "Expanded VANTE portfolio image";

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");

        body.classList.add("no-scroll");
    };

    const closeLightbox = () => {
        if (!lightbox || !lightboxImage) return;

        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");

        body.classList.remove("no-scroll");

        setTimeout(() => {
            lightboxImage.src = "";
        }, 300);
    };

    const showNextImage = () => {
        if (lightboxImages.length === 0) return;

        currentLightboxIndex++;

        if (currentLightboxIndex >= lightboxImages.length) {
            currentLightboxIndex = 0;
        }

        lightboxImage.src = lightboxImages[currentLightboxIndex];
    };

    const showPrevImage = () => {
        if (lightboxImages.length === 0) return;

        currentLightboxIndex--;

        if (currentLightboxIndex < 0) {
            currentLightboxIndex = lightboxImages.length - 1;
        }

        lightboxImage.src = lightboxImages[currentLightboxIndex];
    };

    lightboxTriggers.forEach((trigger, index) => {
        trigger.addEventListener("click", () => {
            openLightbox(index);
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener("click", showNextImage);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener("click", showPrevImage);
    }

    if (lightbox) {
        lightbox.addEventListener("click", (event) => {
            const clickedOutsideImage = event.target === lightbox;

            if (clickedOutsideImage) {
                closeLightbox();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        const isLightboxOpen = lightbox && lightbox.classList.contains("is-open");

        if (!isLightboxOpen) return;

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            showNextImage();
        }

        if (event.key === "ArrowLeft") {
            showPrevImage();
        }
    });

    /* =====================================================
       VIDEO AUTOPLAY CONTROL
       Pausa videos cuando no están visibles para ahorrar rendimiento.
    ===================================================== */

    const videos = document.querySelectorAll("video");

    videos.forEach((video) => {
        video.muted = true;
        video.playsInline = true;

        const playVideo = () => {
            const playPromise = video.play();

            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Algunos navegadores bloquean autoplay.
                    // No pasa nada: el usuario podrá reproducirlo manualmente.
                });
            }
        };

        playVideo();
    });

    if ("IntersectionObserver" in window) {
        const videoObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;

                    if (entry.isIntersecting) {
                        const playPromise = video.play();

                        if (playPromise !== undefined) {
                            playPromise.catch(() => {});
                        }
                    } else {
                        video.pause();
                    }
                });
            },
            {
                threshold: 0.22
            }
        );

        videos.forEach((video) => {
            videoObserver.observe(video);
        });
    }

    /* =====================================================
       SMOOTH SCROLL OFFSET
       Ajusta el scroll para que la navbar fija no tape títulos.
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const targetId = anchor.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const targetElement = document.querySelector(targetId);

            if (!targetElement) return;

            event.preventDefault();

            const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
            const targetPosition =
                targetElement.getBoundingClientRect().top + window.scrollY - headerHeight + 2;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });

    /* =====================================================
       PARALLAX SUAVE DEL HERO
    ===================================================== */

    const heroVideo = document.querySelector(".hero__video");
    const heroContent = document.querySelector(".hero__content");

    const updateHeroParallax = () => {
        const scrollY = window.scrollY;

        if (heroVideo) {
            heroVideo.style.transform = `translateY(${scrollY * 0.16}px) scale(1.04)`;
        }

        if (heroContent) {
            heroContent.style.transform = `translateY(${scrollY * -0.045}px)`;
        }
    };

    window.addEventListener("scroll", () => {
        if (window.scrollY < window.innerHeight) {
            updateHeroParallax();
        }
    });

    /* =====================================================
       IMAGE ERROR FALLBACK
       Si falta una imagen, evita que se vea roto.
    ===================================================== */

    const images = document.querySelectorAll("img");

    images.forEach((image) => {
        image.addEventListener("error", () => {
            image.style.opacity = "0.12";
            image.style.filter = "grayscale(1)";
            image.style.background =
                "linear-gradient(135deg, rgba(95,75,139,0.35), rgba(13,11,20,0.95))";

            const parent = image.parentElement;

            if (parent && !parent.querySelector(".missing-media-label")) {
                const label = document.createElement("span");

                label.className = "missing-media-label";
                label.textContent = "Add media";

                label.style.position = "absolute";
                label.style.left = "50%";
                label.style.top = "50%";
                label.style.transform = "translate(-50%, -50%)";
                label.style.zIndex = "5";
                label.style.padding = "8px 12px";
                label.style.borderRadius = "999px";
                label.style.background = "rgba(13, 11, 20, 0.72)";
                label.style.border = "1px solid rgba(252, 250, 250, 0.14)";
                label.style.backdropFilter = "blur(12px)";
                label.style.color = "#FCFAFA";
                label.style.fontSize = "0.72rem";
                label.style.fontWeight = "800";
                label.style.letterSpacing = "0.12em";
                label.style.textTransform = "uppercase";
                label.style.pointerEvents = "none";

                parent.style.position = "relative";
                parent.appendChild(label);
            }
        });
    });

    /* =====================================================
       VIDEO ERROR FALLBACK
       Si falta un video, muestra un aviso elegante.
    ===================================================== */

    videos.forEach((video) => {
        video.addEventListener("error", () => {
            const parent = video.parentElement;

            if (parent && !parent.querySelector(".missing-media-label")) {
                const label = document.createElement("span");

                label.className = "missing-media-label";
                label.textContent = "Add video";

                label.style.position = "absolute";
                label.style.left = "50%";
                label.style.top = "50%";
                label.style.transform = "translate(-50%, -50%)";
                label.style.zIndex = "5";
                label.style.padding = "8px 12px";
                label.style.borderRadius = "999px";
                label.style.background = "rgba(13, 11, 20, 0.72)";
                label.style.border = "1px solid rgba(252, 250, 250, 0.14)";
                label.style.backdropFilter = "blur(12px)";
                label.style.color = "#FCFAFA";
                label.style.fontSize = "0.72rem";
                label.style.fontWeight = "800";
                label.style.letterSpacing = "0.12em";
                label.style.textTransform = "uppercase";
                label.style.pointerEvents = "none";

                parent.style.position = "relative";
                parent.appendChild(label);
            }
        });
    });
});