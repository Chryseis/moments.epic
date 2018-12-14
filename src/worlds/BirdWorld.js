import * as THREE from 'three';
import {TweenMax, Power4} from 'gsap'
import windefs from '../defs/winDef';
import World from '../worlds/World';
import BirdCharacter from '../characters/BirdCharacter';
import SCENES from '../defs/scenesDef';


class BirdWorld extends World {
    constructor(container, renderer, width, height) {
        super(container, renderer, width, height);
        this.name = "bird";
        this.controls.enabled = false;
    }

    createCharacter() {

        this.character = new BirdCharacter();
        this.character.init();
        this.character.group.position.set(0, 30, 0);
        this.scene.add(this.character.group);

        this.bird1 = new BirdCharacter();
        this.bird1.init();
        this.bird1.group.position.x = -250;
        this.bird1.side = "right";
        this.bird1.group.scale.set(.8, .8, .8);
        this.bird1.group.position.y = 22;
        this.scene.add(this.bird1.group);

        this.bird2 = new BirdCharacter();
        this.bird2.init();
        this.bird2.group.position.x = 250;
        this.bird2.side = "left";
        this.bird2.group.scale.set(.8, .8, .8);
        this.bird2.group.position.y = 22;
        this.scene.add(this.bird2.group);

        this.character.group.visible = false;
        this.bird1.group.visible = false;
        this.bird2.group.visible = false;
    }

    createLights() {
        this.globalLight = new THREE.HemisphereLight(0xffffff, 0x555555, 1);


        this.shadowLight = new THREE.DirectionalLight(0xffffff, .4);
        this.shadowLight.position.set(100, 250, 75);
        this.shadowLight.castShadow = true;
        this.shadowLight.shadow.camera.left = -600;
        this.shadowLight.shadow.camera.right = 600;
        this.shadowLight.shadow.camera.top = 600;
        this.shadowLight.shadow.camera.bottom = -600;
        this.shadowLight.shadow.camera.near = 1;
        this.shadowLight.shadow.camera.far = 600;
        this.shadowLight.shadow.mapSize.width = this.shadowLight.shadow.mapSize.height = 2048;

        this.scene.add(this.globalLight);
        this.scene.add(this.shadowLight);
    }

    render() {
        if (!this.isHiding) {
            var tempHA = windefs.mousePos.cx / 200;
            var tempVA = windefs.mousePos.cy / 200;
            var userHAngle = Math.min(Math.max(tempHA, -Math.PI / 3), Math.PI / 3);
            var userVAngle = Math.min(Math.max(tempVA, -Math.PI / 3), Math.PI / 3);
            this.character.look(userHAngle, userVAngle);

            if (this.character.hAngle < -Math.PI / 5 && !this.bird1.intervalRunning) {
                this.bird1.lookAway(true);
                this.bird1.intervalRunning = true;
                this.bird1.behaviourInterval = setInterval(() => {
                    this.bird1.lookAway(false);
                }, 1500);
            } else if (this.character.hAngle > 0 && this.bird1.intervalRunning) {
                this.bird1.stare();
                clearInterval(this.bird1.behaviourInterval);
                this.bird1.intervalRunning = false;

            } else if (this.character.hAngle > Math.PI / 5 && !this.bird2.intervalRunning) {
                this.bird2.lookAway(true);
                this.bird2.intervalRunning = true;
                this.bird2.behaviourInterval = setInterval(() => {
                    this.bird2.lookAway(false);
                }, 1500);
            } else if (this.character.hAngle < 0 && this.bird2.intervalRunning) {
                this.bird2.stare();
                clearInterval(this.bird2.behaviourInterval);
                this.bird2.intervalRunning = false;
            }

            this.bird1.look(this.bird1.shyAngles.h, this.bird1.shyAngles.v);
            this.bird1.bodyBird.material.color.setRGB(this.bird1.color.r, this.bird1.color.g, this.bird1.color.b);
            this.bird2.look(this.bird2.shyAngles.h, this.bird2.shyAngles.v);
            this.bird2.bodyBird.material.color.setRGB(this.bird2.color.r, this.bird2.color.g, this.bird2.color.b);
        } else {
            this.character.fix();
        }
        super.render();
    }

    show(direction, callback) {
        this.character.group.visible = true;
        this.bird1.group.visible = true;
        this.bird2.group.visible = true;

        if (direction == "none") {
            TweenMax.from(this.bird1.group.position, .8, {x: -3000, ease: Power4.easeOut});
            TweenMax.from(this.bird2.group.position, .8, {x: 3000, ease: Power4.easeOut});
        } else if (direction == "right") {
            TweenMax.from(this.bird1.group.position, .8, {x: 2500, ease: Power4.easeOut});
            TweenMax.from(this.character.group.position, .8, {x: 3000, delay: .1, ease: Power4.easeOut});
            TweenMax.from(this.bird2.group.position, .8, {x: 3500, delay: .2, ease: Power4.easeOut});
        } else {
            TweenMax.from(this.bird1.group.position, .8, {x: -3500, delay: .2, ease: Power4.easeOut});
            TweenMax.from(this.character.group.position, .8, {x: -3000, delay: .1, ease: Power4.easeOut});
            TweenMax.from(this.bird2.group.position, .8, {x: -2500, ease: Power4.easeOut});
        }
        //TweenMax.to(this.vectorLookAt, 1, {y:0})
        TweenMax.to(this.camera.position, 1, {
            z: 1000, y: 300, ease: Power4.easeInOut, onUpdate: () => {
                this.camera.lookAt(this.vectorLookAt);
            }, onComplete: callback
        });
    }

    hide(direction, callback) {
        this.isHiding = true;
        if (direction == "none") {
            TweenMax.to(this.bird1.group.position, .8, {x: -3000, ease: Power4.easeIn});
            TweenMax.to(this.bird2.group.position, .8, {x: 3000, ease: Power4.easeIn});
        } else if (direction == "right") {
            TweenMax.to(this.bird1.group.position, .8, {x: 2500, delay: .2, ease: Power4.easeIn});
            TweenMax.to(this.character.group.position, .8, {x: 3000, delay: .1, ease: Power4.easeIn});
            TweenMax.to(this.bird2.group.position, .8, {x: 3500, ease: Power4.easeIn});
        } else {
            TweenMax.to(this.bird1.group.position, .8, {x: -3500, ease: Power4.easeIn});
            TweenMax.to(this.character.group.position, .8, {x: -3000, delay: .1, ease: Power4.easeIn});
            TweenMax.to(this.bird2.group.position, .8, {x: -2500, delay: .2, ease: Power4.easeIn});
        }

        TweenMax.to(this.camera.position, 1, {
            z: SCENES.camZ, y: SCENES.camY, ease: Power4.easeInOut, onUpdate: () => {
                this.camera.lookAt(this.vectorLookAt);
            }, onComplete: callback
        });
    }
}

export default BirdWorld;


// WEBPACK FOOTER //
// ./src/assets/scripts/worlds/BirdWorld.js