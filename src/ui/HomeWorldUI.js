import {TweenMax, Power4, TimelineMax} from 'gsap'

let homeUIInstance = null;

class HomeWorldUI {

    constructor() {

        if (homeUIInstance) {
            return homeUIInstance;
        }

        this.homeUi = document.getElementsByClassName("home-ui")[0];
        this.title = document.getElementsByClassName("home-ui-title")[0];
        this.description = document.getElementsByClassName("home-ui-description")[0];
        this.ctaBgr = document.getElementsByClassName("home-ui-cta-bgr")[0];
        this.cta = document.getElementsByClassName("home-ui-cta")[0];
        this.ctaText = document.getElementsByClassName("home-ui-cta-text")[0];

        TweenMax.set(this.homeUi, {autoAlpha: 0});
        TweenMax.set(this.title, {autoAlpha: 0});
        TweenMax.set(this.description, {autoAlpha: 0});
        TweenMax.set(this.cta, {autoAlpha: 0});
        TweenMax.set(this.ctaBgr, {autoAlpha: 0});

        homeUIInstance = this;
    }

    update(title, description, color) {

        this.hide(() => {
            this.title.innerHTML = title;
            TweenMax.set(this.title, {y: 10, color: color});
            this.description.innerHTML = description;
            TweenMax.set(this.description, {y: 10});
            TweenMax.to(this.ctaBgr, 1, {borderColor: color});
            TweenMax.to(this.ctaText, 1, {color: color});
            this.show();
        })
    }

    hide(callback) {
        this.tlCtaClose = new TimelineMax({onComplete: callback});

        this.tlCtaClose.to(this.ctaText, .15, {scale: 0, ease: Power4.easeIn});
        this.tlCtaClose.to(this.ctaBgr, .15, {scale: 0, ease: Power4.easeIn});
        this.tlCtaClose.add("textes");

        this.tlCtaClose.to(this.title, .3, {y: -10, autoAlpha: 0, ease: Power4.easeIn}, "textes +=.15");
        this.tlCtaClose.to(this.description, .3, {y: -10, autoAlpha: 0, ease: Power4.easeIn}, "textes += .1");
        this.tlCtaClose.add(() => {
            TweenMax.set(this.cta, {autoAlpha: 0});
        })
    }

    show(callback) {
        this.tlCtaOpen = new TimelineMax({onComplete: callback});
        this.tlCtaOpen.set(this.homeUi, {autoAlpha: 1});
        this.tlCtaOpen.set(this.cta, {autoAlpha: 1});
        this.tlCtaOpen.set(this.ctaBgr, {autoAlpha: 1});
        this.tlCtaOpen.to(this.title, .3, {y: 0, autoAlpha: 1, ease: Power4.easeOut}, "textes +=.15");
        this.tlCtaOpen.to(this.description, .3, {y: 0, autoAlpha: 1, ease: Power4.easeOut}, "textes += .1");

        this.tlCtaOpen.add("cta");

        this.tlCtaOpen.to(this.ctaText, .15, {scale: 1, ease: Power4.easeOut}, "cta +=.15");
        this.tlCtaOpen.to(this.ctaBgr, .15, {scale: 1, ease: Power4.easeOut}, "cta +=.15");
    }
}

export default HomeWorldUI;


// WEBPACK FOOTER //
// ./src/assets/scripts/ui/HomeWorldUI.js