import * as THREE from 'three';
import windefs from './defs/winDef';
import NavController from './NavController';
import AudioController from './AudioController';
import ExperienceInfo from './ui/ExperienceInfo';

import CHARACTERS from './defs/charatersDef';
import HomeWorld from './worlds/HomeWorld';
import BirdWorld from './worlds/BirdWorld';
import CatWorld from './worlds/CatWorld';
import DragonWorld from './worlds/DragonWorld';
import FishWorld from './worlds/FishWorld';
import LionWorld from './worlds/LionWorld';
import RabbitWorld from './worlds/RabbitWorld';

import Track from './utils/track';

let mohInstance = null;

class Moh {
    constructor() {
        if(mohInstance){
            return mohInstance;
        }
        mohInstance = this;

        this.directionHideTo = "none";
        this.directionShowFrom = "none";

        this.navController = new NavController();
        this.experienceInfo = new ExperienceInfo();
        this.currentExperience = 0;
        this.characters = CHARACTERS;
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(windefs.winWidth, windefs.winHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMapSoft = true;
        this.renderer.toneMappingExposure = 1.3;

        this.init();

    }

    init() {
        this.container = document.getElementsByClassName("world")[0];
        this.audioContorller = new AudioController();
        this.audioContorller.playBackground();
    }

    switchWorld(worldName) {
        if (this.currentWorld) {
            this.currentWorld.hide(this.directionHideTo, () => {
                this.currentWorld.destroy();
            window.location.hash = worldName;
            this.showWorld(worldName);
        });
        } else {
            window.location.hash = worldName;
            this.showWorld(worldName);
        }
    }

    showWorld(worldName) {
        Track.sendPage();
        var w;

        switch (worldName) {
            case "home":
                w = HomeWorld;
                break;
            case "lion":
                this.currentExperience = 0;
                w = LionWorld;
                break;
            case "cat":
                this.currentExperience = 1;
                w = CatWorld;
                break;
            case "dragon":
                this.currentExperience = 2;
                w = DragonWorld;
                break;
            case "bird":
                this.currentExperience = 3;
                w = BirdWorld;
                break;
            case "rabbit":
                this.currentExperience = 4;
                w = RabbitWorld;
                break;
            case "fish":
                console.log("swithching to fish world");
                this.currentExperience = 5;
                w = FishWorld;
                break;
            default:
                w = HomeWorld;
        }
        if (w != HomeWorld){
            this.navController.showMomentsNav();
            this.experienceInfo.update(this.currentExperience, this.characters[this.currentExperience]);
        }else{
            this.navController.hideMomentsNav();
            this.experienceInfo.hide();
        }
        this.navController.updateExperience(this.currentExperience);
        this.currentWorld = new w(this.container, this.renderer, windefs.winWidth, windefs.winHeight);
        this.currentWorld.show(this.directionShowFrom);
        this.currentWorld.updateSize(windefs.winWidth, windefs.winHeight);
    }

    nextExp(){
        this.currentExperience = (this.currentExperience<this.characters.length-1)? this.currentExperience + 1 : 0;
        this.switchWorld(this.characters[this.currentExperience].n);
    }

    previousExp(){
        this.currentExperience = (this.currentExperience>0)? this.currentExperience - 1 : this.characters.length-1;
        this.switchWorld(this.characters[this.currentExperience].n);
    }

    allExp(){
        this.switchWorld("home");
    }

    updateSize() {
        if (this.currentWorld) this.currentWorld.updateSize(windefs.winWidth, windefs.winHeight);
    }
    mouseMove(mousePos) {
        if (this.currentWorld) this.currentWorld.mouseMove(windefs.mousePos);
    }
    mouseDown(mousePos) {
        if (this.currentWorld) this.currentWorld.mouseDown(windefs.mousePos);
    }
    mouseUp(mousePos) {
        if (this.currentWorld) this.currentWorld.mouseUp(windefs.mousePos);
    }
    mouseWheel(deltaY) {
        if (this.currentWorld) this.currentWorld.mouseWheel(deltaY);
    }
    keyUp(keycode) {
        if (keycode === 37) {
            this.arrowLeft();
        } else if (keycode === 39) {
            this.arrowRight();
        }else if (keycode === 38 || keycode === 40) {
            this.arrowTopBottom();
        }

    }

    arrowLeft() {
        if (this.currentWorld.selectPrevious) {
            this.currentWorld.selectPrevious();
        } else {
            this.navController.previousExp();
        }
    }

    arrowRight() {
        if (this.currentWorld.selectNext) {
            this.currentWorld.selectNext();
        } else {
            this.navController.nextExp();
        }
    }

    arrowTopBottom() {
        if (this.currentWorld.goExperience) {
            this.currentWorld.goExperience();
        } else {
            this.navController.allExp();
        }
    }

    loop() {
        if (windefs.allowExperience){
            if (this.currentWorld) this.currentWorld.render();
        }
        requestAnimationFrame(this.loop.bind(this));
    }
}

export default Moh;



// WEBPACK FOOTER //
// ./src/assets/scripts/Moh.js