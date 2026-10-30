
(()=>{
    window.initPage = () => {
        document.querySelectorAll('.product-detail').forEach((detail) => {
            detail.querySelectorAll('.__plus').forEach((plus) => {
                plus.addEventListener('click', (e) => {
                    e.preventDefault();
                    const index = plus.getAttribute('data-index');
                    const isActive = plus.classList.contains('__active');
                    detail.querySelectorAll('.__plus').forEach((item) => {
                        item.classList.remove('__active');
                    });

                    detail.querySelectorAll('.__specs .__desc').forEach((item) => {
                        item.classList.remove('__active');
                    });

                    detail.querySelectorAll('.__specs .__spot').forEach((item) => {
                        item.classList.remove('__active');
                    });


                    if (isActive === false) {
                        plus.classList.add('__active');
                        detail.querySelector('.__specs .__desc[data-index="' + index + '"]').classList.add('__active');
                        detail.querySelector('.__specs .__spot[data-index="' + index + '"]').classList.add('__active');
                    }


                });
            });

            detail.querySelectorAll('.__specs .__desc').forEach((desc) => {
                desc.addEventListener('click', (e) => {
                    e.preventDefault();
                    detail.querySelectorAll('.__plus').forEach((item) => {
                        item.classList.remove('__active');
                    });
                    detail.querySelectorAll('.__specs .__desc').forEach((item) => {
                        item.classList.remove('__active');
                    });
                    detail.querySelectorAll('.__specs .__spot').forEach((item) => {
                        item.classList.remove('__active');
                    });
                });
            });


            document.querySelectorAll('.__design-detail').forEach((detail) => {
                detail.querySelectorAll('.__plus').forEach((plus) => {
                    plus.addEventListener('click', (e) => {
                        e.preventDefault();
                        const index = plus.getAttribute('data-index');
                        detail.querySelectorAll('.__plus').forEach((item) => {
                            item.classList.remove('__active');
                        });
                        plus.classList.add('__active');

                        detail.querySelectorAll('.__d').forEach((item) => {
                            item.classList.remove('__active');
                        });
                        detail.querySelector('.__d[data-index="' + index + '"]').classList.add('__active');
                    });
                });

                detail.querySelectorAll('.__d').forEach((desc) => {
                    desc.addEventListener('click', (e) => {
                        e.preventDefault();
                        detail.querySelectorAll('.__plus').forEach((item) => {
                            item.classList.remove('__active');
                        });

                        detail.querySelectorAll('.__d').forEach((item) => {
                            item.classList.remove('__active');
                        });
                    });
                });
            });
        });

    }

    window.startPage = () => {
        ScrollTrigger.create({
            trigger: '.__cp-01',
            start: 'top 70%',
            end: 'top top',
            onToggle: (self) => {
                if (self.isActive) {
                    document.querySelectorAll('.__cp-01 .__plus').forEach((item, index) => {
                        item.classList.add('__init');
                    });
                }
            }
        })

        ScrollTrigger.create({
            trigger: '.__hybrid',
            start: 'top 70%',
            end: 'top top',
            onToggle: (self) => {
                document.querySelector('.__hybrid').classList.toggle('__active', self.isActive);
                if (self.isActive) {
                    document.querySelectorAll('.__hybrid .__plus').forEach((item, index) => {
                        item.classList.add('__init');
                    });
                }
            }
        })

        ScrollTrigger.create({
            trigger: '.__design-detail',
            start: 'top 70%',
            end: 'top top',
            onToggle: (self) => {
                if (self.isActive) {
                    document.querySelectorAll('.__design-detail .__plus').forEach((item, index) => {
                        item.classList.add('__init');
                    });
                }
            }
        })

        document.querySelectorAll('.__use-cases article').forEach((item) => {
            gsap.timeline({
                scrollTrigger: {
                    trigger: item.querySelector('.__img'),
                    start: 'top bottom',
                    end: 'bottom bottom',
                    // pin: item.querySelector('.__img img'),
                    // pinSpacing: false,
                    scrub: 0.00001
                }
            })
                .from(item.querySelector('.__img img'), {y:'-30%', ease:Linear.easeNone});
        });

    }
})();

// Noise tooltip (67 dBA): tap/click toggles, outside tap or Esc closes — added 2026-10-29
const initNoiseTip = () => {
    const btn = document.querySelector('.__tip-btn');
    if (!btn) return;
    const dl = btn.closest('.__has-tip');
    const close = () => { dl.classList.remove('__tip-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        const open = dl.classList.toggle('__tip-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => { if (!dl.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initNoiseTip); else initNoiseTip();

// Use-case cards: flag button toggles civilian / military image — added 2026-10-30
const initMilitaryToggle = () => {
    document.querySelectorAll('.__use-cases article').forEach((article) => {
        const buttons = article.querySelectorAll('.__flag-btn');
        if (!buttons.length) return;
        buttons.forEach((btn) => btn.addEventListener('click', (e) => {
            e.preventDefault();
            const on = article.classList.toggle('__military');
            buttons.forEach((b) => {
                b.setAttribute('aria-pressed', on ? 'true' : 'false');
                b.setAttribute('aria-label', on ? 'Show the civilian configuration' : 'Show the military and tactical configuration');
            });
        }));
    });
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMilitaryToggle); else initMilitaryToggle();

// Leveraging Legacy Infrastructure band: letter-by-letter headline + centre-out wipe on the chart — added 2026-10-30
const initInfraBand = () => {
    const band = document.getElementById('infraBand');
    if (!band || !window.gsap || !window.SplitText) return;
    const title = band.querySelector('.__infra-title');
    const chart = band.querySelector('.__infra-chart');
    const img = chart.querySelector('img');
    const split = new SplitText(title, {type: 'words,chars'});
    gsap.set(split.chars, {y: '0.6em', autoAlpha: 0, rotateX: -60, transformOrigin: '50% 100%'});
    gsap.set(title, {perspective: 600});
    gsap.set(chart, {clipPath: 'inset(0 50% 0 50%)'});
    gsap.set(img, {scale: 1.08, autoAlpha: 0});
    gsap.timeline({
        scrollTrigger: {trigger: band, start: 'top 75%', end: 'top -100000%'}
    })
        .to(split.chars, {y: '0em', autoAlpha: 1, rotateX: 0, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.025}, 0)
        .fromTo(chart, {clipPath: 'inset(0% 50% 0% 50%)'}, {clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.out'}, 0.45)
        .to(img, {scale: 1, autoAlpha: 1, duration: 1.6, ease: 'expo.out'}, 0.45);
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initInfraBand); else initInfraBand();
