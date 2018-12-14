import {TweenMax, Power4} from 'gsap'

let experienceInfo = null;

class ExperienceInfo {

    constructor() {
        if (experienceInfo) {
            return experienceInfo;
        }
        this.order = document.getElementsByClassName("experience-info-order")[0];
        this.title = document.getElementsByClassName("experience-info-title")[0];
        this.instruction = document.getElementsByClassName("experience-info-instructions")[0];
        this.line = CSSRulePlugin.getRule(".experience-info-order:after");


        TweenMax.set(this.order, {y: 10, autoAlpha: 0});
        TweenMax.set(this.title, {y: 10, autoAlpha: 0});
        TweenMax.set(this.instruction, {y: 10, autoAlpha: 0});
        TweenMax.set(this.line, {cssRule: {widht: 0, autoAlpha: 0}});
        TweenMax.set(this.line, {cssRule: {widht: 0, autoAlpha: 0}});
        experienceInfo = this;
    }

    update(indx, exp) {

        this.hide(() => {


            TweenMax.set(this.line, {cssRule: {backgroundColor: exp.tc}});
            this.order.innerHTML = "0" + (indx + 1);
            TweenMax.set(this.order, {y: 10, color: exp.tc});
            this.title.innerHTML = exp.title;
            TweenMax.set(this.title, {y: 10, color: exp.tc});
            this.instruction.innerHTML = exp.instruction;
            TweenMax.set(this.instruction, {y: 10, color: exp.tc});

            this.show();
        })
    }

    hide(callback) {

        this.hideTl = new TimelineMax({onComplete: callback});
        this.hideTl.add("start");

        this.hideTl.to(this.line, .6, {
            cssRule: {width: 0, autoAlpha: 0}, ease: Power4.easeIn
        }, "start");

        this.hideTl.to(this.order, .3, {
            y: -10, autoAlpha: 0, ease: Power4.easeIn
        }, "start");

        this.hideTl.to(this.title, .3, {
            y: -10, autoAlpha: 0, ease: Power4.easeIn
        }, "start+=.1");

        this.hideTl.to(this.instruction, .3, {
            y: -10, autoAlpha: 0, ease: Power4.easeIn
        }, "start+=.2");
    }

    show(callback) {
        this.showTl = new TimelineMax({onComplete: callback});
        this.showTl.add("start");
        this.showTl.to(this.line, .4, {cssRule: {width: 30, autoAlpha: 1}, ease: Power4.easeOut}, "start");
        this.showTl.to(this.order, .4, {y: 0, autoAlpha: 1, ease: Power4.easeOut}, "start");
        this.showTl.to(this.title, .4, {y: 0, autoAlpha: 1, ease: Power4.easeOut}, "start+=.1");
        this.showTl.to(this.instruction, .4, {y: 0, autoAlpha: 1, ease: Power4.easeOut}, "start+=.2");

    }
}

export default ExperienceInfo;


// WEBPACK FOOTER //
// ./src/assets/scripts/ui/ExperienceInfo.js