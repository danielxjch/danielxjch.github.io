document.addEventListener('DOMContentLoaded', function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    initMenu();
    initReveal(reduceMotion);
    initDecorTrace(reduceMotion);
    initLinkage(reduceMotion);

    // Mobile menu
    function initMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');

        if (!menuToggle || !mobileNav) return;

        menuToggle.addEventListener('click', function () {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        document.addEventListener('click', function (event) {
            if (!event.target.closest('nav')) {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
    }

    // Scroll reveal for content cards
    function initReveal(reduceMotion) {
        const revealEls = document.querySelectorAll('.reveal');

        if (!revealEls.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            revealEls.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function (el) { observer.observe(el); });
    }

    // Marginalia draw-in: each drawing traces itself once as it enters
    function initDecorTrace(reduceMotion) {
        const clusters = document.querySelectorAll('.decor-trace');

        if (!clusters.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            clusters.forEach(function (el) { el.classList.add('is-drawn'); });
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-drawn');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        clusters.forEach(function (el) { observer.observe(el); });
    }

    // Four-bar kinematic study: crank angle rides the projects section's
    // scroll progress; the coupler point traces its curve as you go.
    function initLinkage(reduceMotion) {
        const svg = document.querySelector('.decor-linkage');
        const section = document.getElementById('projects');

        if (!svg || !section || reduceMotion) return;

        const crank = svg.querySelector('.fb-crank');
        const rocker = svg.querySelector('.fb-rocker');
        const coupler = svg.querySelector('.fb-coupler');
        const traj = svg.querySelector('.fb-traj');

        if (!crank || !rocker || !coupler || !traj) return;

        if (!('IntersectionObserver' in window)) {
            traj.style.strokeDashoffset = 0; // show the finished curve
            return;
        }

        // Geometry in viewBox units: pivots hang the linkage from the frame,
        // links r2 (crank) / r3 (coupler) / r4 (rocker) form a crank-rocker.
        const O2X = 60, O2Y = 70, O4X = 150, O4Y = 70;
        const R2 = 34, R3 = 95, R4 = 60;
        const T_MIN = 25 * Math.PI / 180, T_MAX = 155 * Math.PI / 180;
        const DEG = 180 / Math.PI;

        let active = false;
        let ticking = false;

        function setPose(t2) {
            const ax = O2X + R2 * Math.cos(t2);
            const ay = O2Y + R2 * Math.sin(t2);
            const dx = O4X - ax, dy = O4Y - ay;
            const d = Math.hypot(dx, dy);
            const a = (R3 * R3 - R4 * R4 + d * d) / (2 * d);
            const h = Math.sqrt(Math.max(0, R3 * R3 - a * a));
            const ux = dx / d, uy = dy / d;
            const bx = ax + a * ux - h * uy; // fixed branch: no pose pops
            const by = ay + a * uy + h * ux;
            const t3 = Math.atan2(by - ay, bx - ax) * DEG;
            const t4 = Math.atan2(by - O4Y, bx - O4X) * DEG;

            crank.setAttribute('transform', 'rotate(' + (t2 * DEG) + ' ' + O2X + ' ' + O2Y + ')');
            rocker.setAttribute('transform', 'rotate(' + t4 + ' ' + O4X + ' ' + O4Y + ')');
            coupler.setAttribute('transform', 'translate(' + ax + ' ' + ay + ') rotate(' + t3 + ')');
        }

        function update() {
            ticking = false;
            const rect = section.getBoundingClientRect();
            const total = rect.height + window.innerHeight;
            const p = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / total));
            setPose(T_MIN + p * (T_MAX - T_MIN));
            traj.style.strokeDashoffset = 100 - p * 100;
        }

        function onScroll() {
            if (!active || ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        }

        new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                active = entry.isIntersecting && svg.getClientRects().length > 0;
                if (active) update();
            });
        }).observe(svg);

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
    }
});
