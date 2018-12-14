import AudioController from './AudioController';
import CHARACTERS from './defs/charatersDef';
import SCENES from './defs/scenesDef';
import Moh from './Moh';
import NavigationUi from './ui/NavigationUi';
import BackgroundPanel from './ui/BackgroudPanel';

import Track from './utils/track';

let navControllerInstance = null;

class NavController {

    constructor() {
        if (navControllerInstance) {
            return navControllerInstance;
        }

        this.worldWrapper = document.getElementsByClassName("wrapper")[0];
        this.closeAboutUI = document.getElementsByClassName("about-block-close")[0];
        this.aboutSection = document.getElementsByClassName("about-block")[0];
        this.navUI = new NavigationUi();
        this.currentExperience = 0;
        this.characters = CHARACTERS;
        this.backgroundPanel = new BackgroundPanel();
        this.moh = new Moh();

        this.audioController = new AudioController();


        this.navUI.previous.addEventListener("mousedown", this.previousExp.bind(this));
        this.navUI.next.addEventListener("mousedown", this.nextExp.bind(this));
        this.navUI.about.addEventListener("mousedown", this.goAbout.bind(this));
        this.navUI.allMoments.addEventListener("mousedown", this.allExp.bind(this));
        this.closeAboutUI.addEventListener("mousedown", this.closeAbout.bind(this));
        navControllerInstance = this;
        TweenMax.set(this.aboutSection, {scale:.8, y:20});
    }

    nextExp(){
        this.moh.directionHideTo = "left";
        this.moh.directionShowFrom = "right";
        this.moh.nextExp();
        this.audioController.play("random");
    }

    previousExp(){
        this.moh.directionHideTo = "right";
        this.moh.directionShowFrom = "left";
        this.moh.previousExp();
        this.audioController.play("random");
    }
    allExp(){
        this.moh.directionHideTo = "none";
        this.moh.directionShowFrom = "none";
        this.moh.allExp();
        this.audioController.play("random");
    }

    goAbout(){
        Track.event('ui', 'click', 'about', 1);
        TweenMax.to(this.worldWrapper, 1, {y:"100%", ease:Power4.easeInOut});
        TweenMax.to(this.aboutSection, 1, {scale:1, y:0, ease:Power4.easeInOut});
        this.audioController.play("random");
    }

    closeAbout(){
        TweenMax.to(this.worldWrapper, 1, {y:"0%", ease:Power4.easeInOut});
        TweenMax.to(this.aboutSection, 1, {scale:.8, y:20, ease:Power4.easeInOut});
        this.audioController.play("random");
    }

    updateExperience(indx){
        var direction = (this.currentExperience < indx) ? "right" : "left";
        this.currentExperience = indx;
        this.navUI.updateColor(this.characters[this.currentExperience].tc);
        this.backgroundPanel.update(this.characters[this.currentExperience].bc, direction);
    }

    updateColor(color){
        this.navUI.updateColor(color);
    }

    hideMomentsNav(){
        this.navUI.hideMomentsNav();
    }
    showMomentsNav(){
        this.navUI.showMomentsNav();
    }
}

export default NavController;


// WEBPACK FOOTER //
// ./src/assets/scripts/NavController.js