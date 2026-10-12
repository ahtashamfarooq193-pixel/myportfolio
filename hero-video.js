(() => {
    const stage = document.querySelector('.hero-stage');
    if (!stage) return;
    const video = stage.querySelector('video');
    const button = document.querySelector('.hero-character-hit');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    video.muted = true;
    let paused = reduced.matches;
    let visible = true;
    let finished = false;
    const label = () => {
        button.setAttribute('aria-label', finished ? 'Replay character entry' : paused ? 'Play character animation' : 'Pause character animation');
        button.setAttribute('aria-pressed', String(paused));
    };
    const play = async () => {
        if (paused || finished || !visible || document.hidden) return;
        if (!video.getAttribute('src')) video.src = video.dataset.src;
        try { await video.play(); }
        catch (error) { if (error.name !== 'AbortError') { paused = true; label(); } }
    };
    video.addEventListener('playing', () => stage.classList.add('is-playing'));
    video.addEventListener('ended', () => { finished = true; paused = true; label(); });
    video.addEventListener('error', () => { stage.classList.remove('is-playing'); paused = true; label(); });
    button.addEventListener('click', () => {
        if (finished) { finished = false; video.currentTime = 0; paused = false; }
        else paused = !paused;
        label();
        if (paused) video.pause(); else play();
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); else play(); });
    new IntersectionObserver(([item]) => {
        visible = item.isIntersecting;
        if (visible) play(); else video.pause();
    }, { threshold: 0.05 }).observe(stage);
    reduced.addEventListener('change', () => {
        if (reduced.matches) { paused = true; video.pause(); label(); }
    });
    label();
    play();
})();
