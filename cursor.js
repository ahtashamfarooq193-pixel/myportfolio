/* Fine-pointer enhancement; native cursor remains for touch and reduced motion. */
(() => {
    const enabled = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'pointer-dot';
    ring.className = 'pointer-ring';
    dot.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    document.body.append(dot, ring);
    let x = 0, y = 0, rx = 0, ry = 0, frame = 0, visible = false;
    function draw() {
        rx += (x - rx) * .2;
        ry += (y - ry) * .2;
        dot.style.transform = `translate3d(${x}px,${y}px,0)`;
        ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
        if (Math.abs(x-rx) + Math.abs(y-ry) > .1) frame = requestAnimationFrame(draw);
        else frame = 0;
    }
    function hide() {
        visible = false;
        document.documentElement.classList.remove('custom-pointer');
        dot.classList.remove('visible');
        ring.classList.remove('visible', 'pressed', 'over-link');
        cancelAnimationFrame(frame);
        frame = 0;
    }
    document.addEventListener('pointermove', e => {
        if (!enabled.matches || e.pointerType !== 'mouse') { hide(); return; }
        const target = e.target instanceof Element ? e.target : null;
        if (target?.closest('input, textarea, select, [contenteditable="true"], iframe')) { hide(); return; }
        x = e.clientX; y = e.clientY;
        if (!visible) {
            rx = x; ry = y; visible = true;
            document.documentElement.classList.add('custom-pointer');
            dot.classList.add('visible'); ring.classList.add('visible');
        }
        ring.classList.toggle('over-link', !!target?.closest('a, button, summary, [role="button"]'));
        if (!frame) frame = requestAnimationFrame(draw);
    }, { passive: true });
    document.addEventListener('pointerdown', () => { if (visible) ring.classList.add('pressed'); }, { passive: true });
    document.addEventListener('pointerup', () => ring.classList.remove('pressed'), { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    document.addEventListener('keydown', e => { if (e.key === 'Tab') hide(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
    window.addEventListener('blur', hide);
    enabled.addEventListener('change', hide);
})();
