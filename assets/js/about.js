
(()=>{
    const NUM_CNT = 30;
    window.initPage = () => {
        document.querySelectorAll('.feature').forEach(feature => {
            const num = feature.querySelector('.__num');
            if (num ) {
                const value = Number(num.innerText);
                num.innerText = '';

                const from = value - NUM_CNT;
                const to = value;
                let html = '';
                for (let i = from; i <= to; i++) {
                    html +=  `<span>${i}</span>`;
                }
                num.innerHTML = `<span class="__roll">${html}</span>`;;
            }

            const COUNTRIES = ['Japan' ,'UAE', 'France', 'Indonesia', 'Australia', 'USA', 'India', 'Türkiye', 'Korea'];
            const char = feature.querySelector('.__char');

            if (char ) {
                const value = char.innerText;
                char.innerText = '';
                const length = value.length;
                const chars = [];
                for (let i = 0; i < COUNTRIES.length * 4; i++) {
                    let str = COUNTRIES[i % COUNTRIES.length];
                    chars.push(str);
                }
                let html = '';
                for (let i = 0; i < chars.length; i++) {
                    html += `<span>${chars[i]}</span>`;
                }
                html += `<span>${value}</span>`;
                char.innerHTML = `<span class="__roll">${html}</span>`;
            }
        })
    }

    window.startPage = () => {
        document.querySelectorAll('.feature').forEach((feature, index) => {
            const motionTxt = feature.querySelector('.__motion-txt');
            const delay = index * .15;
            const tl = gsap.timeline({
                delay: delay,
                scrollTrigger: {
                    trigger: feature,
                    start: 'top 80%',
                    end: 'top -100000%',
                }
            })
                .from(feature, {autoAlpha:0, y:'3rem', duration:1.4, ease:Quint.easeOut}, 0)
                .from(feature.querySelector('h5'), {autoAlpha:0, y:'2rem', duration:1.4, ease:Quint.easeOut}, 0.2)
                .from(feature.querySelector('p'), {autoAlpha:0, y:'2rem', duration:1.4, ease:Quint.easeOut}, 0.4)
            if (motionTxt) {
                tl.fromTo(motionTxt.querySelector('.__roll'), {y:0}, {y:'-100%', duration:6, ease:Quint.easeOut}, 0)
                    .from(feature.querySelector('h4 i'), {autoAlpha:0, width:0, duration:1.4, ease:Quint.easeOut}, '-=1')
            }

        })

        gsap.timeline({
            scrollTrigger: {
                trigger: document.querySelector('.__roadmap'),
                start: 'top 50%',
                end: 'bottom 50%',
                pin: document.querySelector('.__roadmap .__line .__icon'),
                pinSpacing: false,
                scrub: true,
                onToggle: self => {
                    document.querySelector('.__roadmap .__line .__icon').classList.toggle('__active', self.isActive);
                }
            }
        })
            // .to(document.querySelector('.__roadmap .__line .__icon img'), {rotate:2000, duration:1, ease:Linear.easeNone}, 0)

        document.querySelectorAll('.__roadmap .__list dl').forEach(dl => {
           ScrollTrigger.create({
                trigger: dl,
                start: 'top 50%',
                end: 'bottom 50%',
                onToggle: self => {
                    dl.classList.toggle('__active', self.isActive);
                }
           })
        });
    }
})();