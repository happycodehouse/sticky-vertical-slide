const custom = {};
const mediaQuery = window.matchMedia("(min-width: 1025px)");
const body = document.body;
let lenis, scrollT, currentT, windowWidth, isTouchDevice;

gsap.registerPlugin(ScrollTrigger);

custom.utils = {
    smoothScroll: () => {
        function breakPoint(mediaQuery) {
            if (mediaQuery.matches) {
                if (!lenis) {
                    lenis = new Lenis({
                        duration: 1
                    });

                    lenis.on("scroll", ScrollTrigger.update);
                    gsap.ticker.add(function (time) {
                        lenis.raf(time * 1000);
                    });

                    gsap.ticker.lagSmoothing(0);
                }
            }
        }

        breakPoint(mediaQuery);
        mediaQuery.addEventListener("change", breakPoint);
    },
    dataMotion: () => {
        if ($("[data-motion]").length > 0) {
            $("[data-motion]").each((idx, item) => {
                ScrollTrigger.create({
                    id: "dataMotion" + idx,
                    trigger: $(item),
                    scrub: 0.5,
                    start: "top 70%",
                    markers: false,
                    invalidateOnRefresh: true,
                    onEnter: () => $(item).addClass("active"),
                    // onLeaveBack: () => $(item).removeClass("active")
                });
            });
        }
    },
    verticalMotion: () => {
        function toggleProductTitle(action) {
            if (action === "hide") {
                $(".product_title").addClass("hide");
            } else {
                $(".product_title").removeClass("hide");
            }
        }

        function toggleAccordion() {
            let _$this = $(this);
            let _$list = _$this.find(".item_list");

            if (_$this.hasClass("on")) {
                _$this.removeClass("on");
                _$list.stop().slideUp();
            } else {
                _$this.addClass("on");
                _$list.stop().slideDown();
            }
        }

        (function introSection() {
            const $secIntro = $(".sec_intro");
            const $productTabBtn = $secIntro.find(".product_tab a");
            let initColor = $productTabBtn.filter(".active").data("product-tab");
            let productColor = initColor;
            console.log(productColor);

            const secIntroSwiper = new Swiper($secIntro.find(".swiper"), {
                slidesPerView: "auto",
                navigation: {
                    prevEl: '.swiper-btn-prev',
                    nextEl: '.swiper-btn-next'
                },
                loop: true
            });

            let $productSlides = $(secIntroSwiper.slides);
            let $productSlidesImg = $productSlides.find("img");
            console.log($productSlidesImg);

            function setProductColor(color) {
                $productSlidesImg.each(function () {
                    let $img = $(this);
                    if ($img.data("product-color") === color) {
                        $img.css("opacity", "1");
                    } else {
                        $img.css("opacity", "0");
                    }
                });
            }

            setProductColor(initColor);

            function selectColor() {
                let _$this = $(this);
                _$this.addClass("active");
                _$this.siblings("a").removeClass("active");

                productColor = _$this.data("product-tab");
                setProductColor(productColor);
            }

            $productTabBtn.on("click", selectColor);
        })();

        (function visualSection() {
            let secVisualTl;
            const $secVisual = $(".sec_visual");
            const $trigger = $secVisual.find(".trigger");
            const $secVisualDesc = $secVisual.find(".desc");
            const $secVisualBgCover = $secVisual.find(".bg_cover");

            $secVisualDesc.eq(0).addClass("on");
            $secVisualBgCover.eq(0).addClass("on");

            function secVisualMotion(idx) {
                let prevIdx = 0;

                return {
                    onStart: () => {
                        console.log('Current Index:', idx);

                        $secVisualDesc.removeClass("on");
                        $secVisualBgCover.removeClass("on");

                        $secVisualDesc.eq(idx).addClass("on");
                        $secVisualBgCover.eq(idx).addClass("on prev");
                        if (idx === 0) {
                            prevIdx = 0;
                        } else {
                            prevIdx = idx - 1;
                        }
                        console.log('Previous Index:', prevIdx);
                    },
                    onReverseComplete: () => {
                        console.log("reverse current ", idx);
                        console.log("reverse prevIdx ", prevIdx);
                        $secVisualDesc.removeClass("on");
                        $secVisualDesc.eq(prevIdx).addClass("on");
                        $secVisualBgCover.eq(prevIdx).addClass("on");
                        $secVisualBgCover.eq(prevIdx).removeClass("prev");
                        $secVisualBgCover.eq(idx).removeClass("prev on");
                        if (prevIdx === 0) {
                            $secVisualBgCover.eq(0).addClass("on");
                        }
                    },
                    duration: 1,
                    ease: "none"
                }
            }

            secVisualTl = gsap.timeline({
                scrollTrigger: {
                    trigger: $secVisual,
                    start: "top top",
                    end: "bottom bottom",
                    markers: false,
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            })
                .to($trigger, {y: 100, duration: 0.5})
                .to($secVisualDesc.eq(0), secVisualMotion(0))
                .to($secVisualDesc.eq(1), secVisualMotion(1))
                .to($secVisualDesc.eq(2), secVisualMotion(2))
                .to($secVisualDesc.eq(3), secVisualMotion(3));
        })();

        (function chargeSection() {
            let chargeSecTl;
            const $secCharge = $(".sec_charge");
            const $secChargeBg = $secCharge.find(".bg");

            chargeSecTl = gsap.timeline({
                scrollTrigger: {
                    trigger: $secCharge,
                    start: "top-=50% top",
                    end: "bottom+=100% bottom",
                    scrub: true,
                    markers: false,
                    onEnter: () => toggleProductTitle("hide"),
                    onLeaveBack: () => toggleProductTitle("show"),
                    onEnterBack: () => toggleProductTitle("hide"),
                    onLeave: () => toggleProductTitle("hide")
                }
            }).to($secChargeBg, {
                y: -150,
                duration: 1,
                ease: "none"
            })
        })();

        (function fitSection() {
            let secFitTl;
            const $secFit = $(".sec_fit");
            const $bgWrap = $secFit.find(".bg_wrap");
            const $txtWrap = $secFit.find(".txt_wrap");

            secFitTl = gsap.timeline({
                scrollTrigger: {
                    trigger: $secFit,
                    start: "top-=25% top",
                    end: "bottom bottom",
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            }).to($bgWrap, {
                clipPath: "inset(0% 0%)",
                duration: 1,
                ease: "none"
            }).to($txtWrap, {
                alpha: 1,
                visibility: "visible",
                duration: 1,
                ease: "none"
            });
        })();

        (function horizonScrollSection() {
            let secHorizontalScrollTl;

            const $secHorizontalScroll = $(".sec_horizontal_scroll");
            const $scroll = $secHorizontalScroll.find(".scroll");

            secHorizontalScrollTl = gsap.timeline({
                scrollTrigger: {
                    trigger: $secHorizontalScroll,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            }).to($scroll, {
                left: "-33%",
                duration: 1,
                ease: "none"
            });
        })();

        (function safetySection() {
            const $secSafety = $(".sec_safety");
            const $accordion = $secSafety.find(".accordion_list");
            const $accordionItem = $accordion.children("li");

            if ($accordionItem.hasClass("on")) {
                $accordionItem.filter(".on").find(".item_list").slideDown();
            }

            $accordionItem.on("click", toggleAccordion);
        })();
    },
    init: () => {
        custom.utils.smoothScroll();
        custom.utils.dataMotion();
        custom.utils.verticalMotion();
    }
}

$(window).on('load resize', function () {
    windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    isTouchDevice = (getComputedStyle(document.documentElement).getPropertyValue("--pointer")) == "coarse";
});

custom.utils.init();