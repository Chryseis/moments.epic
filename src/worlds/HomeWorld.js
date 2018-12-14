import * as THREE from 'three';
import windefs from '../defs/winDef';
import Moh from '../Moh';
import World from '../worlds/World';
import WordsParticles from '../worlds/WordsParticles';
import CHARACTERS from '../defs/charatersDef';
import SCENES from '../defs/scenesDef';
import NavController from '../NavController';
import BackgroundPanel from '../ui/BackgroudPanel';
import HomeWorldUI from '../ui/HomeWorldUI';

class HomeWorld extends World {
    constructor(container, renderer, width, height) {
        super(container, renderer, width, height);
        this.isExperiment = false;
        this.moh = new Moh();
        this.selectedCharacter = this.charactersArray[this.moh.currentExperience];

        this.firstSelection = true;

        this.controls.enabled = false;

        this.camCycleMove = {angle: 0};
        this.background = new BackgroundPanel();
        this.ui = new HomeWorldUI();

        this.navController = new NavController();
        this.ui.cta.addEventListener("mousedown", this.goExperience.bind(this));
        this.wheelenabled = false;
        this.enableWheel();
        this.initCharactersPos();
        this.createWordsParticles();
    }

    mouseWheel(deltaY) {
        if (!this.wheelenabled) return;
        if (Math.abs(deltaY) < 15) return;
        this.disableWheel();
        if (deltaY < 0) this.selectNext();
        else this.selectPrevious();
    }

    enableWheel() {
        this.wheelenabled = true;
    }

    disableWheel() {
        this.wheelenabled = false;
        this.toWheel = setTimeout(this.enableWheel.bind(this), 1200);
    }

    selectNext() {
        if (this.selectedCharacter.userData.index >= this.charactersArray.length - 1) return;
        var targetCharacter = this.charactersArray[this.selectedCharacter.userData.index + 1];
        this.updateSelection(targetCharacter);
    }

    selectPrevious() {
        if (this.selectedCharacter.userData.index < 1) return;
        var targetCharacter = this.charactersArray[this.selectedCharacter.userData.index - 1];
        this.updateSelection(targetCharacter);
    }

    createWordsParticles() {
        this.wordsParticles = new WordsParticles(this.renderer);
        this.wordsParticles.init(() => {
            this.scene.add(this.wordsParticles.particles);
            this.fboReady = true;
            this.updateSelection(this.selectedCharacter);
        });
    }

    goExperience() {
        this.audioController.play(this.audioController.goExpFile);
        this.moh.directionHideTo = "none";
        this.moh.directionShowFrom = "none";
        this.moh.switchWorld(this.selectedCharacter.userData.name)
    }

    hide(direction, callback) {
        this.isHiding = true;
        this.ui.hide();
        this.hideCharacters(() => {
            this.wordsParticles.hide(callback);
        });
    }

    show(direction, callback) {
    }

    createCharacter() {

        this.raycaster = new THREE.Raycaster();
        this.mousePos = new THREE.Vector2();

        this.characters = CHARACTERS;

        this.charactersArray = [];
        this.collidersArray = [];

        this.scaleMultiplier = SCENES.scaleMultiplier;
        this.charSpacing = 300;

        for (var i = 0, l = this.characters.length; i < l; i++) {
            var char = this.characters[i];
            var posx = i * this.charSpacing - l / 2 * this.charSpacing;
            posx *= this.scaleMultiplier;
            char.o = new char.c();
            char.o.init();
            char.o.group.position.y = char.posy * this.scaleMultiplier;
            char.o.group.rotation.y = char.rotationY;
            char.o.group.scale.set(char.scale * this.scaleMultiplier, char.scale * this.scaleMultiplier, char.scale * this.scaleMultiplier);

            char.wrapper = new THREE.Group();
            char.wrapper.add(char.o.group);
            char.wrapper.position.x = posx;
            char.wrapper.visible = false;

            char.wrapper.userData = {
                index: i,
                name: char.n,
                title: char.title,
                description: char.description,
                bc: char.bc,
                tc: char.tc,
                holder: char.o,
            };

            this.scene.add(char.wrapper);
            this.charactersArray.push(char.wrapper);
            this.collidersArray.push(char.o.collider);
        }
    }

    mouseDown(mousePos) {
        this.mousePos.x = mousePos.px;
        this.mousePos.y = -mousePos.py;
        this.raycaster.setFromCamera(this.mousePos, this.camera);
        var intersects = this.raycaster.intersectObjects(this.collidersArray);
        if (intersects.length > 0) {
            this.updateSelection(intersects[0].object.parent.parent);
        }
    }

    render() {
        if (this.fboReady) {
            this.wordsParticles.updateRender();
        }
        for (var i = 0, l = this.charactersArray.length; i < l; i++) {
            var to = this.charactersArray[i].userData.holder;

            if (!this.isHiding) {
                if (this.charactersArray[i] == this.selectedCharacter && !this.audioController.audioMute) {
                    to.swing();
                } else {
                    to.idle();
                }
            }
            else to.fix();
        }
        super.render();
    }

    updateSelection(o) {
        this.oldSelectedCharacter = this.selectedCharacter;
        this.selectedCharacter = o;
        var so = o;
        var si = so.userData.index;

        this.audioController.play("random");//this.audioController.expSounds[si]);

        this.ui.update(so.userData.title, so.userData.description, so.userData.tc);
        //this.ui.show();
        this.navController.updateColor(so.userData.tc);
        var direction = (si > this.oldSelectedCharacter.userData.index) ? "right" : "left";
        this.background.update(so.userData.bc, direction);

        // characters update

        this.wordsParticles.updateText(si, so.userData.bc);

        for (var i = 0, l = this.charactersArray.length; i < l; i++) {
            var to = this.charactersArray[i];
            var ti = to.userData.index;

            var diffi = ti - si;
            var delay = (to == so) ? 0 : (this.firstSelection) ? 1 : 0;

            var ts = diffi === 0 ? 1.5 : .9;
            var margin = diffi < 0 ? -300 : diffi > 0 ? 300 : 0;

            var tx = margin + diffi * this.charSpacing * 1;
            tx *= this.scaleMultiplier;
            var tz = to === so ? 400 : -300;
            tz *= this.scaleMultiplier;

            TweenMax.to(to.position, 1, {x: tx, z: tz, delay: delay, ease: Power4.easeOut});
            TweenMax.to(to.scale, 1, {x: ts, y: ts, z: ts, delay: delay, ease: Power4.easeOut});
        }

        var dist = si - this.oldSelectedCharacter.userData.index;
        var camRotAmp = -dist * .01;
        var camRecoilAmp = Math.abs(dist) * 200 * this.scaleMultiplier;
        var camElevationAmp = Math.abs(dist) * 100 * this.scaleMultiplier;
        this.camCycleMove.angle = this.camCycleMove.angle % 3.14;
        //*
        TweenMax.to(this.camCycleMove, 1, {
            angle: 3.14, ease: Power4.easeOut, onUpdate: () => {
                this.camera.position.y = SCENES.camY + Math.sin(this.camCycleMove.angle) * camElevationAmp;
                this.camera.position.z = SCENES.camZ + Math.sin(this.camCycleMove.angle) * camRecoilAmp;
                //this.camera.rotation.z = Math.sin(this.camCycleMove.angle) * camRotAmp;
            }, onComplete: () => {

            }
        });

        this.firstSelection = false;
        //*/
    }


    initCharactersPos() {

        var si = this.selectedCharacter.userData.index;

        for (var i = 0, l = this.charactersArray.length; i < l; i++) {
            var to = this.charactersArray[i];
            var ti = to.userData.index;
            var diffi = ti - si;

            //var ts = diffi === 0 ? 1.5 : .9;
            var margin = diffi < 0 ? -3000 : diffi > 0 ? 3000 : 0;

            var tx = margin + diffi * this.charSpacing * 1;
            tx *= this.scaleMultiplier;

            //var tz = to === so ? 400 : -300;
            //tz *= this.scaleMultiplier;
            to.position.x = tx;
            to.visible = true;
        }
    }

    hideCharacters(callback) {

        var si = this.selectedCharacter.userData.index;
        var callback = callback;

        var highestDiff = Math.max(si + 1, this.charactersArray.length - si - 1);

        var tlHide = new TimelineMax({onComplete: callback});
        tlHide.add("start");

        for (var i = 0, l = this.charactersArray.length; i < l; i++) {
            var to = this.charactersArray[i];
            var ti = to.userData.index;
            var diffi = ti - si;

            //var ts = diffi === 0 ? 1.5 : .9;
            var margin = diffi < 0 ? -3000 : diffi > 0 ? 3000 : 0;

            var tx = margin + diffi * this.charSpacing * 1;
            tx *= this.scaleMultiplier;
            var ts = 1;

            var delay = (highestDiff - Math.abs(diffi)) * .05;
            var tz = 0;//to === so ? 400 : -300;
            //tz *= this.scaleMultiplier;
            tlHide.to(to.position, .5, {x: tx, z: tz, y: 0, delay: delay, ease: Power4.easeIn}, "start");
            tlHide.to(to.scale, .5, {x: ts, y: ts, z: ts, delay: delay, ease: Power4.easeIn}, "start");
        }
        tlHide.to(this.camera.position, .5, {z: SCENES.camZ, y: SCENES.camY, ease: Power4.easeOut}, "start");
    }

    destroy() {
        this.ui.cta.removeEventListener("mousedown", this.goExperience.bind(this));
        clearTimeout(this.toWheel);
        super.destroy();
    }
}

export default HomeWorld;

// TODO destroy all characters;


// WEBPACK FOOTER //
// ./src/assets/scripts/worlds/HomeWorldUI.js