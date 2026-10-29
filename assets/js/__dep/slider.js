(()=>{

    let images;
    let imageIndex = 0;
    const MAX_SCALE = 1.1;
    const DURATION = 4;
    let prevImage;
    window.initSlider = () => {
        images = document.querySelectorAll('.kv .slider .img');
        gsap.set(images, {autoAlpha:0, zIndex:1});

    }
    window.startSlider = () => {
        loop();
    }

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
})();