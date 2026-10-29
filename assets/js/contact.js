
(()=>{
    window.initPage = () => {
    }

    window.startPage = () => {

        document.querySelectorAll('.swiper').forEach((el) => {
           new Swiper(el, {
                pagination: {
                    el: el.querySelector('.swiper-pagination'),
                    type: 'bullets',
                },
                navigation: {
                    nextEl: el.querySelector('.swiper-button-next'),
                    prevEl: el.querySelector('.swiper-button-prev'),
                }
           });
        });
    }
})();