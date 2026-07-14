document.addEventListener('DOMContentLoaded', function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    initMenu();
    initReveal(reduceMotion);
    initDecorTrace(reduceMotion);
    initProjectTrace(reduceMotion);
    initLinkage(reduceMotion);
    initCansat(reduceMotion);
    initExcavator(reduceMotion);
    initBow(reduceMotion);
    initGo2(reduceMotion);
    initMhReach(reduceMotion);
    initCansatSbus(reduceMotion);

    // 0..1 progress of a section through the viewport (symmetric both
    // scroll directions, stable under fast scroll: pure function of layout)
    function sectionProgress(el) {
        const rect = el.getBoundingClientRect();
        const total = rect.height + window.innerHeight;
        return Math.min(1, Math.max(0, (window.innerHeight - rect.top) / total));
    }

    // shared scroll driver: rAF-throttled, gated by an IO on the svg
    function driveOnScroll(svg, update) {
        let active = false;
        let ticking = false;

        function onScroll() {
            if (!active || ticking) return;
            ticking = true;
            requestAnimationFrame(function () { ticking = false; update(); });
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

        // Reversible: toggle as elements enter AND leave the viewport, so
        // reveal-in content animates back out when you scroll up (matching
        // the scroll-scrubbed decor). No unobserve. rootMargin keeps the
        // toggle off the very edge so it doesn't flicker.
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                entry.target.classList.toggle('is-visible', entry.isIntersecting);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function (el) { observer.observe(el); });
    }

    // Marginalia draw-in: each drawing traces itself once as it enters.
    // Homepage sections only — project-page studies are handled by
    // initProjectTrace below, which scroll-scrubs the linework instead
    // so it reverses on scroll-up.
    function initDecorTrace(reduceMotion) {
        const clusters = Array.prototype.filter.call(
            document.querySelectorAll('.decor-trace'),
            function (el) { return !el.closest('.post-view'); }
        );

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

    // Project-page linework: scroll-scrubbed and reversible instead of
    // the homepage's one-shot draw-in. The primary outline (dec-line /
    // dec-dim) tracks sectionProgress(svg) directly every frame, so the
    // drawing draws in as it scrolls up into view and un-draws as it
    // leaves. Secondary annotation (ghost underlay, dims, arrows, notes)
    // still fades in once via .is-drawn, matching the homepage's polish —
    // only the traced outline itself needed to become reversible.
    function initProjectTrace(reduceMotion) {
        const svgs = document.querySelectorAll('.post-view .decor-trace');

        if (!svgs.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            svgs.forEach(function (svg) { svg.classList.add('is-drawn'); });
            return;
        }

        svgs.forEach(function (svg) {
            // Reversible reveal for the secondary annotation layer (ghost
            // underlay, arrows, notes): toggle .is-drawn as the sheet enters
            // and leaves view, matching the reversible linework below. Low
            // threshold so a tall multi-study sheet shows annotation for
            // whichever study is on screen.
            const revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    svg.classList.toggle('is-drawn', entry.isIntersecting);
                });
            }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
            revealObserver.observe(svg);

            const traced = svg.querySelectorAll('.dec-line, .dec-dim');
            if (!traced.length) return;

            // Each stroke draws in by ITS OWN travel through the viewport,
            // not the whole svg's. On a tall sheet stacking several studies
            // this means every study draws when it is actually on screen and
            // un-draws on the way back up — instead of all strokes sharing
            // one whole-sheet offset (which left lower studies blank until
            // you had scrolled past them). Reads are batched before writes
            // to avoid layout thrash.
            function update() {
                const ih = window.innerHeight;
                const rects = [];
                for (let i = 0; i < traced.length; i++) rects.push(traced[i].getBoundingClientRect());
                for (let j = 0; j < traced.length; j++) {
                    const r = rects[j];
                    const p = Math.min(1, Math.max(0, (ih - r.top) / (r.height + ih)));
                    traced[j].style.strokeDashoffset = 100 - p * 100;
                }
            }

            update();
            driveOnScroll(svg, update);
        });
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
            const p = sectionProgress(section);
            setPose(T_MIN + p * (T_MAX - T_MIN));
            traj.style.strokeDashoffset = 100 - p * 100;
        }

        driveOnScroll(svg, update);
    }

    // CanSat deployment: confirmed sequence only — the cover lifts off
    // along the axis, then torsion springs rotate the arms outward
    // around their hinges. Baked SVG pose = deployed (no-JS state).
    function initCansat(reduceMotion) {
        const svg = document.querySelector('.decor-cansat');

        if (!svg || reduceMotion) return;

        const cover = svg.querySelector('.cs-cover');
        const armL = svg.querySelector('.cs-arm-l');
        const armR = svg.querySelector('.cs-arm-r');
        const arcs = svg.querySelectorAll('.cs-arc');

        if (!cover || !armL || !armR) return;

        if (!('IntersectionObserver' in window)) {
            arcs.forEach(function (a) { a.style.strokeDashoffset = 0; });
            return;
        }

        // hinge points in viewBox units (must match gen-sketch.js:
        // body centre x=200, radius 36, hinge y=230)
        const HLX = 168, HRX = 232, HY = 230;
        const COVER_LIFT = -170, ARM_FOLD = 92;

        // pace off the deployment study's own extent, not the whole (now
        // multi-study, very tall) sheet — the arcs sit at its centre and
        // have a fixed bbox, so they make a stable anchor.
        const anchor = svg.querySelector('.cs-arc') || svg;

        function update() {
            // the study's own travel through the viewport is the timeline,
            // so the deployment plays while the drawing is on screen
            const p = sectionProgress(anchor);
            const c = Math.min(1, Math.max(0, (p - 0.15) / 0.28));        // cover off first
            const q = Math.min(1, Math.max(0, (p - 0.38) / 0.34));        // then arms swing
            cover.setAttribute('transform', 'translate(0 ' + (COVER_LIFT * c) + ')');
            armL.setAttribute('transform', 'rotate(' + (-ARM_FOLD * (1 - q)) + ' ' + HLX + ' ' + HY + ')');
            armR.setAttribute('transform', 'rotate(' + (ARM_FOLD * (1 - q)) + ' ' + HRX + ' ' + HY + ')');
            arcs.forEach(function (a) { a.style.strokeDashoffset = 100 - q * 100; });
        }

        update();
        driveOnScroll(svg, update);
    }

    // SANY excavator: nested SVG groups make each child move in its
    // parent's coordinate system, preserving the real boom/stick/bucket joints.
    function initExcavator(reduceMotion) {
        const svg = document.querySelector('.decor-excavator');
        if (!svg) return;

        const boom = svg.querySelector('.ex-boom');
        const stick = svg.querySelector('.ex-stick');
        const bucket = svg.querySelector('.ex-bucket');
        if (!boom || !stick || !bucket) return;

        function setPose(p) {
            const cycle = 0.5 - 0.5 * Math.cos(p * Math.PI * 2);
            boom.setAttribute('transform', 'rotate(' + (-10 + cycle * 22) + ' 185 220)');
            stick.setAttribute('transform', 'rotate(' + (16 - cycle * 38) + ' 310 98)');
            bucket.setAttribute('transform', 'rotate(' + (-18 + cycle * 52) + ' 369 211)');
        }

        if (reduceMotion || !('IntersectionObserver' in window)) {
            setPose(0.5);
            return;
        }

        // pace off just the excavator's own extent, not the whole (now
        // very tall, multi-study) machinehub sheet.
        const scope = svg.querySelector('.ex-scope') || svg;
        function update() { setPose(sectionProgress(scope)); }
        update();
        driveOnScroll(svg, update);
    }

    // Robotic violin bowing: a continuous rosin-coated fishing-line LOOP
    // runs around two motor wheels that straddle the string (one wheel
    // left of the string span, one right — opposite sides of the
    // string). Both wheels sit on the same side of the BOW: the short
    // top run between them is the single contact run that crosses the
    // strings at 90 degrees, while the loop's return run is routed
    // below, clear of the strings. Both wheels spin the same rotational
    // sense to drive the loop. Reverses cleanly when scrolling back up.
    function initBow(reduceMotion) {
        const svg = document.querySelector('.decor-violin');

        if (!svg) return;

        const flow = svg.querySelector('.vs-flow');
        const wheelA = svg.querySelector('.vs-wheel-a');
        const wheelB = svg.querySelector('.vs-wheel-b');
        if (!flow || !wheelA || !wheelB) return;

        if (reduceMotion || !('IntersectionObserver' in window)) return;

        function update() {
            const p = sectionProgress(svg);
            // dashes travel around the loop; both wheels drive it the
            // same direction. Reverses cleanly when scrolling back up.
            flow.style.strokeDashoffset = (-p * 280) + '';
            wheelA.setAttribute('transform', 'rotate(' + (p * 540) + ' 176 178)');
            wheelB.setAttribute('transform', 'rotate(' + (p * 540) + ' 264 178)');
        }

        update();
        driveOnScroll(svg, update);
    }

    // Go2 ego-circle navigation study: a robot marker rides the planned
    // path (getPointAtLength) as the study scrolls through view, the
    // path draws in step with it, and the scan ring's sweep line rotates
    // in sync — all pure functions of sectionProgress(svg), so scrolling
    // back up retraces the path and un-sweeps the scan exactly.
    function initGo2(reduceMotion) {
        const svg = document.querySelector('.decor-go2');
        if (!svg) return;

        const path = svg.querySelector('.go-path');
        const marker = svg.querySelector('.go2-marker');
        const sweep = svg.querySelector('.go2-sweep');
        if (!path) return;

        const len = path.getTotalLength();
        const SCX = 192, SCY = 209; // ego-circle centre (approx.)

        function setPose(p) {
            const t = Math.min(1, Math.max(0, p));
            const at = t * len;
            const pt = path.getPointAtLength(at);

            if (marker) {
                const ahead = path.getPointAtLength(Math.min(len, at + 2));
                const heading = Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180 / Math.PI + 90;
                marker.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ') rotate(' + heading + ')');
            }

            path.style.strokeDashoffset = 100 - t * 100;

            if (sweep) sweep.setAttribute('transform', 'rotate(' + (t * 300 - 60) + ' ' + SCX + ' ' + SCY + ')');
        }

        if (reduceMotion || !('IntersectionObserver' in window)) {
            setPose(1); // finished: robot at goal, path fully drawn
            return;
        }

        function update() { setPose(sectionProgress(svg)); }
        update();
        driveOnScroll(svg, update);
    }

    // Excavator reach envelope: the working-range sweep wedge draws itself
    // through the arc as the reach study scrolls through view — paced by the
    // study's own travel (not the tall sheet), reversible on scroll-up.
    function initMhReach(reduceMotion) {
        const svg = document.querySelector('.decor-machinehub');
        if (!svg) return;

        const sweep = svg.querySelector('.mh-reach-sweep');
        const reach = svg.querySelector('.mh-reach');
        if (!sweep || !reach) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            sweep.style.strokeDashoffset = 0; // show the finished sweep
            return;
        }

        function update() { sweep.style.strokeDashoffset = 100 - sectionProgress(reach) * 100; }
        update();
        driveOnScroll(svg, update);
    }

    // CanSat SBUS signal path: the accent flow line traces MCU -> FC -> ESC
    // -> motor as the diagram scrolls through view, mirroring the cs-arc /
    // go-path convention. Paced by the sbus study's own extent, reversible.
    function initCansatSbus(reduceMotion) {
        const svg = document.querySelector('.decor-cansat');
        if (!svg) return;

        const flow = svg.querySelector('.sb-flow');
        const scope = svg.querySelector('.cs-sbus');
        if (!flow || !scope) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            flow.style.strokeDashoffset = 0; // show the finished line
            return;
        }

        function update() { flow.style.strokeDashoffset = 100 - sectionProgress(scope) * 100; }
        update();
        driveOnScroll(svg, update);
    }
});
