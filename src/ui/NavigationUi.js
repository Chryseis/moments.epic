import {TweenMax, Power4} from 'gsap'

let navUiInstance = null;

class NavigationUi{

    constructor(){

        if(navUiInstance){
            return navUiInstance;
        }

        this.linksBorders = document.getElementsByClassName("link-border-color");
        this.links = document.getElementsByClassName("link");
        this.epicLogo = document.getElementsByClassName("epic-logo-svg")[0];
        this.gridIcon = document.getElementsByClassName("grid-icon")[0];
        this.sublines = CSSRulePlugin.getRule(".link:after");
        this.momentsNavContainer = document.getElementsByClassName("moments-nav-container")[0];
        this.previous = document.getElementsByClassName("link-previous")[0];
        this.next = document.getElementsByClassName("link-next")[0];
        this.allMoments = document.getElementsByClassName("link-all")[0];
        this.about = document.getElementsByClassName("link-about")[0];

        this.speaker = document.getElementsByClassName("speakerIcon")[0];

        TweenMax.set(this.momentsNavContainer, { x: "100%" });

        navUiInstance = this;
    }

    updateColor(col){
        TweenMax.to(this.linksBorders, 1, { borderColor: col });
        TweenMax.to(this.links, 1, { color: col });
        TweenMax.to(this.epicLogo, 1, { fill: col });
        TweenMax.to(this.gridIcon, 1, { fill: col });
        TweenMax.to(this.sublines, 1, { cssRule: { backgroundColor: col } });
        TweenMax.to(this.speaker, 1, { fill: col });
    }

    showMomentsNav(){
        TweenMax.to(this.momentsNavContainer, 1, { x: "0%", ease:Power4.easeOut });
    }

    hideMomentsNav(){
        TweenMax.to(this.momentsNavContainer, 1, { x: "100%", ease:Power4.easeIn });
    }
}

export default NavigationUi;



// WEBPACK FOOTER //
// ./src/assets/scripts/ui/NavigationUi.js