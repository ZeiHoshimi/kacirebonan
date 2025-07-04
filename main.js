document.addEventListener('DOMContentLoaded', () => {

    // --- Intro Screen (Gerbang Pembuka) Logic ---
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.add('reveal');
        }, 500);

        setTimeout(() => {
            document.body.classList.add('tirai-gone');
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.classList.remove('hidden');
                heroContent.classList.add('show');
            }
        }, 4800);
    });
    // --- Intro Screen (Gerbang Pembuka) Logic End ---


    // --- Intersection Observer untuk Fade-in Contact Orbs ---
    const contactOrbs = document.querySelectorAll('.contact-orb');
    const observerOptionsContact = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerContact = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptionsContact);

    contactOrbs.forEach(orb => {
        observerContact.observe(orb);
    });
    // --- Intersection Observer untuk Fade-in Contact Orbs End ---


    // --- Intersection Observer for Tourism Cards (Pariwisata) ---
    const tourismCards = document.querySelectorAll('.tourism-section-wrapper .card');
    const observerOptionsTourism = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerTourism = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptionsTourism);

    tourismCards.forEach(card => {
        observerTourism.observe(card);
    });
    // --- Intersection Observer for Tourism Cards (Pariwisata) End ---


    // --- Efek Expand/Slide-in Detail pada Orb (Fitur maks 3 item aktif) ---
    const activeOrbs = new Set();

    contactOrbs.forEach(orb => {
        orb.addEventListener('click', (event) => {
            const isActive = orb.classList.contains('active');

            if (event.target.closest('.orb-back a') || event.target.closest('.orb-back button')) {
                return;
            }

            if (isActive) {
                orb.classList.remove('active');
                activeOrbs.delete(orb);
            } else {
                if (activeOrbs.size >= 3) {
                    const oldestOrb = activeOrbs.values().next().value;
                    oldestOrb.classList.remove('active');
                    activeOrbs.delete(oldestOrb);
                }
                orb.classList.add('active');
                activeOrbs.add(orb);
            }
        });
    });
    // --- Efek Expand/Slide-in Detail pada Orb (Fitur maks 3 item aktif) End ---


    // --- Copy Button ---
    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const textToCopy = button.dataset.copy;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Disalin!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1500);
            }).catch(err => {
                console.error('Gagal menyalin: ', err);
                const originalText = button.textContent;
                button.textContent = 'Gagal!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1500);
            });
        });
    });
    // --- Copy Button End ---


    // --- History Timeline (Sejarah) ---
    const yearList = document.getElementById('yearList');
    const yearItems = document.querySelectorAll('.year-item');
    const contents = document.querySelectorAll('.year-content'); // eslint-disable-line no-unused-vars

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function scrollToActiveItemInYearList(itemElement) {
        if (!itemElement || !yearList) return;

        if (isMobile()) {
            const listRect = yearList.getBoundingClientRect();
            const itemRect = itemElement.getBoundingClientRect();

            const scrollLeft = itemRect.left - listRect.left + yearList.scrollLeft - (listRect.width / 2) + (itemRect.width / 2);

            yearList.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }

    function scrollToActiveContentInRightPanel() {
        if (!isMobile()) {
            const activeContent = document.querySelector('.year-content.active');
            if (activeContent) {

                const offset = 80;
                const elementPosition = activeContent.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

            }
        }
    }

    function activateYear(item) {
        yearItems.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');

        const year = item.dataset.year;
        localStorage.setItem("activeYear", year);

        const currentActiveContent = document.querySelector('.year-content.active');
        if (currentActiveContent) {
            currentActiveContent.classList.remove('active');
        }

        const newContent = document.getElementById('content' + year);
        if (newContent) {
            setTimeout(() => {
                newContent.classList.add('active');
                scrollToActiveContentInRightPanel();
                scrollToActiveItemInYearList(item);
            }, 100);
        }

        const titleEl = document.getElementById('dynamicTitle');
        if (titleEl) {
            const titleMap = {
                "1400": "1400-an — Awal Mula Cirebon",
                "1500": "1500-an — Kejayaan Kesultanan Cirebon",
                "1600": "1600-an — Kontak Awal dengan Dunia Barat",
                "1700": "1700-an — Konflik dan Perpecahan",
                "1800": "1800-an — Dominasi Belanda & Keraton",
                "1900": "1900-an — Pergerakan & Kemerdekaan",
                "2000": "2000-an — Cirebon Modern dan Digital"
            };
            titleEl.innerText = titleMap[year] || `Tahun ${year}`;
        }
    }

    const btnUp = document.getElementById('btnUp');
    const btnDown = document.getElementById('btnDown');

    if (btnUp) {
        btnUp.addEventListener('click', () => {
            if (!isMobile()) {
                yearList.scrollBy({ top: -60, behavior: 'smooth' });
            }
        });
    }
    if (btnDown) {
        btnDown.addEventListener('click', () => {
            if (!isMobile()) {
                yearList.scrollBy({ top: 60, behavior: 'smooth' });
            }
        });
    }

    yearItems.forEach(item => {
        item.addEventListener('click', () => {
            activateYear(item);
        });
    });

    if (yearList) {
        yearList.addEventListener('scroll', () => {
            if (!isMobile()) {
                clearTimeout(yearList._scrollTimer);
                yearList._scrollTimer = setTimeout(() => {
                    const listRect = yearList.getBoundingClientRect();
                    let closest = null;
                    let closestDist = Infinity;

                    yearItems.forEach(item => {
                        const itemRect = item.getBoundingClientRect();
                        const dist = Math.abs(itemRect.top + itemRect.height / 2 - (listRect.top + listRect.height / 2));
                        if (dist < closestDist) {
                            closestDist = dist;
                            closest = item;
                        }
                    });

                    if (closest && !closest.classList.contains('selected')) {
                        activateYear(closest);
                    }
                }, 100);
            }
        });
    }

    const savedYear = localStorage.getItem('activeYear');
    let initialActiveItem = null;

    if (savedYear) {
        initialActiveItem = document.querySelector(`.year-item[data-year="${savedYear}"]`);
    }

    if (!initialActiveItem) {
        initialActiveItem = document.querySelector('.year-item.selected');
    }

    if (!initialActiveItem && yearItems.length > 0) {
        initialActiveItem = yearItems[0];
    }
    // --- History Timeline (Sejarah) End ---


    // --- Seni & Budaya ---
    window.openDetailSeni = function (id) {
        document.getElementById("seni-grid-view").style.display = "none";
        document.getElementById("seni-detail-view").style.display = "block";

        const sections = document.querySelectorAll("#seni-detail-view .detail-section");
        sections.forEach(section => {
            section.style.display = "none";
        });

        document.getElementById(id).style.display = "block";
        updateSidebarSeni(id);
        window.scrollTo(0, 0);
        window.location.hash = id;
    }

    window.goBackSeni = function () {
        document.getElementById("seni-detail-view").style.display = "none";
        document.getElementById("seni-grid-view").style.display = "block";
        window.location.hash = "";
    }

    window.updateSidebarSeni = function (activeId) {
        const sidebarItems = document.querySelectorAll('#seni-detail-view .sidebar-item');
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            if (item.id === `sidebar-${activeId}`) {
                item.classList.add('active');
            }
        });
    }
    // --- Seni & Budaya End ---


    // --- Kuliner ---
    window.openDetailKuliner = function (id) {
        document.getElementById("kuliner-grid-view").style.display = "none";
        document.getElementById("kuliner-detail-view").style.display = "block";

        const sections = document.querySelectorAll("#kuliner-detail-view .detail-section");
        sections.forEach(section => {
            section.style.display = "none";
        });

        document.getElementById(id).style.display = "block";
        updateSidebarKuliner(id);
        window.scrollTo(0, 0);
        window.location.hash = id;
    }

    window.goBackKuliner = function () {
        document.getElementById("kuliner-detail-view").style.display = "none";
        document.getElementById("kuliner-grid-view").style.display = "block";
        window.location.hash = "";
    }

    window.updateSidebarKuliner = function (activeId) {
        const sidebarItems = document.querySelectorAll('#kuliner-detail-view .sidebar-item');
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            if (item.id === `sidebar-${activeId.replace('-detail', '')}`) {
                item.classList.add('active');
            }
        });
    }
    // --- Kuliner End ---


    // --- Global Hash Checker on Load (untuk deep linking) ---
    const hash = window.location.hash.replace("#", "");
    if (hash) {
        if (document.getElementById("seni-grid-view") && document.getElementById("seni-detail-view") && document.getElementById(hash)) {
            if (document.getElementById(hash).closest('#seni-detail-view')) {
                openDetailSeni(hash);
            }
        }
        else if (document.getElementById("kuliner-grid-view") && document.getElementById("kuliner-detail-view") && document.getElementById(hash)) {
            if (document.getElementById(hash).closest('#kuliner-detail-view')) {
                openDetailKuliner(hash);
            }
        } else {
            // Jika hash ada tapi bukan detail seni/kuliner, pastikan tidak ada scroll otomatis
            // atau arahkan ke beranda jika hash tidak valid
            if (hash && document.getElementById(hash)) {
                // Biarkan browser scroll ke sana, tapi jika ada masalah, bisa ditangani di sini
                // Contoh: window.location.hash = ''; // Hapus hash agar tidak langsung scroll
            } else {
                // Jika hash tidak ada atau tidak valid, pastikan di beranda
                window.scrollTo(0, 0); // Scroll ke paling atas halaman
            }
        }
    } else {
        // Default: tampilkan grid view untuk Seni dan Kuliner jika tidak ada hash di URL
        if (document.getElementById("seni-grid-view")) {
            document.getElementById("seni-grid-view").style.display = "block";
            if (document.getElementById("seni-detail-view")) {
                document.getElementById("seni-detail-view").style.display = "none";
            }
        }
        if (document.getElementById("kuliner-grid-view")) {
            document.getElementById("kuliner-grid-view").style.display = "block";
            if (document.getElementById("kuliner-detail-view")) {
                document.getElementById("kuliner-detail-view").style.display = "none";
            }
        }
        window.scrollTo(0, 0); // Pastikan halaman di paling atas (Beranda)
    }
    // --- Global Hash Checker on Load End ---


    // --- Bottom Nav & Smooth Scroll with Offset ---
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
    const headerOffset = 100; // Sesuaikan offset ini sesuai tinggi bottom-nav + padding jika perlu

    bottomNavItems.forEach(navItem => {
        navItem.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const bottomNavObserverOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const bottomNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentActiveNav = document.querySelector('.bottom-nav .nav-item.active');
                if (currentActiveNav) {
                    currentActiveNav.classList.remove('active');
                }
                const targetNavItem = document.querySelector(`.bottom-nav .nav-item[href="#${entry.target.id}"]`);
                if (targetNavItem) {
                    targetNavItem.classList.add('active');
                }
            }
        });
    }, bottomNavObserverOptions);

    sections.forEach(section => {
        bottomNavObserver.observe(section);
    });

    const initialActiveSection = document.querySelector('section[id]');
    if (initialActiveSection) {
        const targetNavItem = document.querySelector(`.bottom-nav .nav-item[href="#${initialActiveSection.id}"]`);
        if (targetNavItem) {
            targetNavItem.classList.add('active');
        }
    }
    // --- Bottom Nav & Smooth Scroll with Offset End ---


    // --- Form Kontak Feedback ---
    const contactForm = document.querySelector('.contact-form-section form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const nameInput = this.querySelector('input[type="text"]');
            const emailInput = this.querySelector('input[type="email"]');
            const messageTextarea = this.querySelector('textarea');

            const name = nameInput.value;
            const email = emailInput.value;
            const message = messageTextarea.value;

            // Validasi sederhana (pastikan tidak kosong)
            if (!name || !email || !message) {
                alert('Mohon lengkapi semua kolom formulir!');
                return;
            }

            console.log('Mengirim pesan:', { name, email, message });

            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            submitButton.textContent = 'Mengirim...';
            submitButton.disabled = true;

            setTimeout(() => {
                // Di sini simulasi sukses, jika ada error bisa tambahkan logika gagal
                submitButton.textContent = 'Pesan Terkirim!';
                submitButton.style.backgroundColor = '#4CAF50';

                setTimeout(() => {
                    contactForm.reset(); // Mengosongkan form
                    submitButton.textContent = originalButtonText;
                    submitButton.style.backgroundColor = '';
                    submitButton.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
    // --- Form Kontak Feedback End const offset = 80;---

});