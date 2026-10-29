window.addEventListener('DOMContentLoaded', ()=>{
    gsap.registerPlugin(
        SplitText,
        ScrollTrigger,
        ScrollSmoother,
        ScrollToPlugin,
        TextPlugin
    )

    window.addEventListener('load', ()=>{
        start();
    });

    gsap.delayedCall(2, start);
    function start() {
        // ScrollTrigger.update();
        // ScrollTrigger.refresh();
        if ( document.querySelector('body').classList.contains('start') ) return;
        document.querySelector('body').classList.add('start');
        requestAnimationFrame(()=>{
            window.initPage();
            if ( document.querySelector('body').classList.contains('home') === false || window.location.hash === '#skip' ) {
                startApp();
            } else {
                showLoading();
            }
        })
    }
});

function showLoading() {
    const loadingTxt = document.querySelector('#loading .__txt');
    const loadingTxtSplit = new SplitText(loadingTxt.querySelector('span'), {type: 'chars'});
    gsap.set(loadingTxt, {autoAlpha:1} )
    gsap.timeline({
        onComplete: ()=>{
            startApp();
        }
    })
        .fromTo(loadingTxtSplit.chars, {y:'110%'}, {y:'0%', duration:1.25, stagger:.08, ease:Circ.easeInOut}, 0)
        .fromTo(loadingTxt.querySelector('i'), {autoAlpha: 0, x:'0%'}, {autoAlpha:1, x:'0%', duration:1, ease:Circ.easeOut}, 1.2)
        .fromTo(loadingTxt.querySelector('i img'), {rotate: -500}, {rotate:0, duration:2, ease:Quint.easeOut}, 1.2)
        .to('#loading', {y:'-110%', duration:1.6, ease:Quint.easeInOut}, 2.8)
        .to('#loading .__inner', {y:'100%', duration:1.6, ease:Quint.easeInOut}, 2.8)
    // .to(loadingTxt.querySelector('i img'), {rotate:1000, duration:2, ease:Circ.easeInOut}, 2.8)

}

function startApp() {
    document.querySelector('body').classList.remove('loading');
    if ( document.querySelector('body').dataset.device === 'desktop' ) {
        ScrollSmoother.create({
            smooth: 2,
            smoothTouch: 0.2,
            effects: true,
        });
    }
    initHeader();
    initFooter();
    initKV();
    initAnim();
    window.startPage();

    ScrollTrigger.update();
    ScrollTrigger.refresh();

    requestAnimationFrame(()=>{
        const hash = window.location.hash;
        if ( hash && hash !== '') {
            const target = document.querySelector(`[data-anchor="${hash}"]`);
            if (target) gsap.to(window, {scrollTo:{y:target, offsetY:-1}, duration:.6, ease:Quad.easeOut});
        }
    })

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', ()=>{
            ScrollTrigger.update();
            // ScrollTrigger.refresh();
        });
    })

}

function initFooter() {
    gsap.timeline({
        scrollTrigger: {
            trigger:'[data-device="desktop"] #footer',
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0.0000001,
        }
    })
        .from('[data-device="desktop"] #footer .footer-content', {y:'-50%', ease:Linear.easeNone}, 0)
}

function initHeader() {
    const btnNavToggle = document.querySelector('.btn-nav-toggle');
    if (btnNavToggle) {
        btnNavToggle.addEventListener('click',(e)=>{
            e.preventDefault();
            btnNavToggle.classList.toggle('active');
        });
    }


    ScrollTrigger.create({
        trigger: '.main-content',
        start:'top top',
        end:'bottom top',
        onUpdate: ({direction}) => {
            document.querySelector('#header').classList.toggle('opaque', window.scrollY > 50);
        }
    })
}

function initKV() {
    document.querySelectorAll('.section-kv').forEach(section => {
        const title = section.querySelector('.__title');
        const subTitle = section.querySelector('.__sub-title');
        const titleSplit = new SplitText(title, {type: 'lines'});
        const subTitleSplit = new SplitText(subTitle, {type: 'lines'});
        gsap.timeline()
            .fromTo(titleSplit.lines, {y:'0.25em', autoAlpha:0}, {y:'0em', autoAlpha:1, duration:1.2, ease:Quint.easeOut, onComplete:()=>{
                    titleSplit.revert();
                }}, .2)
            .fromTo(subTitleSplit.lines, {y:'1em', autoAlpha:0}, {y:'0em', autoAlpha:1, duration:1.4, ease:Quint.easeOut, onComplete:()=>{
                    subTitleSplit.revert();
                }}, .4)
            .fromTo(section.querySelector('.__cta'), {y:'1em', autoAlpha:0}, {y:'0em', autoAlpha:1, duration:1.4, ease:Quint.easeOut}, .6)


        gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.0000001,
                pin: true,
                pinSpacing: false,
                onLeave: () => {
                    section.classList.add('hide');
                },
                onEnter: () => {
                    section.classList.remove('hide');
                },
                onEnterBack: () => {
                    section.classList.remove('hide');
                }
            }
        })
            .to(section.querySelector('.section-inner'), {y:'-90%', ease:Linear.easeNone}, 0)
            .to(section.querySelector('.kv'), {y:'40%', ease:Linear.easeNone}, 0)

        requestAnimationFrame(()=>{
            section.classList.add('loaded');
        });

    })

    document.querySelectorAll('.section-fixed-kv').forEach(section => {
        const st = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.0000001,
                pin: section.querySelector('.fixed-kv .kv'),
                pinSpacing: false,
                invalidateOnRefresh: true,
                onToggle: ({isActive}) => {
                    section.classList.toggle('hide', !isActive);
                }
            }
        })
            .fromTo(section.querySelector('.fixed-kv .img'), {y:'0%', backgroundPosition:'50% 0%'},{y:'0%', backgroundPosition:'50% 100%', ease:Linear.easeNone}, 0)
    });
}

function initAnim() {
    document.querySelectorAll('[data-anim-group]').forEach(group => {
        const lines = [];
        group.querySelectorAll('[data-anim-obj="lines"]').forEach(line => {
            const lineSplit = new SplitText(line, {type: 'lines'});
            gsap.set(lineSplit.lines, {y:'1rem', autoAlpha:0});
            lines.push(lineSplit.lines);
            line.lineSplit = lineSplit;
        })
        gsap.set(group.querySelectorAll('[data-anim-obj="img"]'), {y:'30%', autoAlpha:0});
        gsap.timeline({
            scrollTrigger: {
                trigger: group,
                start: 'top 80%',
                end: 'top -100000%',
            }
        })
            .to(lines, {y:'0rem', autoAlpha:1, duration:1.6, ease:Quint.easeOut, stagger: .1, onComplete:()=>{
                    group.querySelectorAll('[data-anim-obj="lines"]').forEach(line => {
                        line.lineSplit.revert();
                    });
        }}, 0)
            .to(group.querySelectorAll('[data-anim-obj="img"]'), {y:'0%', autoAlpha:1, duration:1.6, ease:Quint.easeOut, stagger: .2}, 0);
    });

    const $header = document.querySelector('#header');
    document.querySelectorAll('section[data-theme]').forEach(section => {
        const rect = section.getBoundingClientRect();
        if ( rect.y === 0) {
            $header.setAttribute('data-theme', section.dataset.theme);
        }
        ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            onToggle: ({isActive}) => {
                if (isActive) {
                    $header.setAttribute('data-theme', section.dataset.theme);
                }
            }
        })
    })
}