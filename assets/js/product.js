
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