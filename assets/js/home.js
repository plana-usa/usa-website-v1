

(()=>{

    let images;
    let imageIndex = 0;
    const MAX_SCALE = 1.1;
    const DURATION = 4;
    let prevImage;






    const loop = () => {
        showNext();
        imageIndex ++;
        gsap.delayedCall(DURATION, loop);
    }
    const showNext = () => {
        if (imageIndex >= images.length) imageIndex = 0;
        const img = images[imageIndex];
        if(prevImage) {
            gsap.set(prevImage, {zIndex:1});
            gsap.to(prevImage, {autoAlpha:0, duration:1})
        }
        gsap.timeline({
            onComplete: ()=>{

            }
        })
            .set(img, {zIndex:2})
            .fromTo(img, {autoAlpha:0}, {autoAlpha:1, duration:1, ease:Linear.easeNone}, 0)
            .fromTo(img, { scale:MAX_SCALE}, {scale:1, duration:DURATION + 1, ease:Linear.easeNone}, 0)
        prevImage = img;
    }



    window.initPage = () => {
        images = document.querySelectorAll('.kv .slider .img');
        gsap.set(images, {autoAlpha:0, zIndex:1});
    }

    window.startPage = () => {
        if ( document.querySelector('#homeVideo')) {
            const video = document.querySelector('#homeVideo video');
            gsap.timeline({
                scrollTrigger: {
                    trigger: document.querySelector('#homeVideo'),
                    start: 'top bottom',
                    end: 'top 40%',
                    scrub: 0.0000001,
                    onEnter: self => {
                        video.currentTime = 0;
                        video.play();
                    }
                }
            })
                .from(document.querySelector('#homeVideo .__video'), {y:'-50%', scale:0.825, opacity:0, ease:Linear.easeNone}, 0)
        }

        loop();
    }
})();