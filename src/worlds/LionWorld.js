import * as THREE from 'three';
import windefs from '../defs/winDef';
import World from '../worlds/World';
import LionCharacter from '../characters/LionCharacter';
import FanCharacter from '../characters/FanCharacter';
import SCENES from '../defs/scenesDef';

class LionWorld extends World {
    constructor(container, renderer, width, height) {
        super(container, renderer, width, height);
        this.name = "lion";
        this.controls.enabled = false;
    }

    createCharacter() {
        this.character = new LionCharacter();
        this.character.init();
        this.character.group.position.set(0, 100, 0);
        this.character.group.visible = false;
        this.scene.add(this.character.group);

        this.fan = new FanCharacter();
        this.fan.init();
        this.fan.group.position.z = 350;
        this.scene.add(this.fan.group);
    }

    createLights() {
        this.globalLight = new THREE.HemisphereLight(0xffffff, 0x555555, 1);


        this.shadowLight = new THREE.DirectionalLight(0xffffff, .4);
        this.shadowLight.position.set(100, 250, 75);
        this.shadowLight.castShadow = true;
        this.shadowLight.shadow.camera.left = -400;
        this.shadowLight.shadow.camera.right = 400;
        this.shadowLight.shadow.camera.top = 400;
        this.shadowLight.shadow.camera.bottom = -400;
        this.shadowLight.shadow.camera.near = 1;
        this.shadowLight.shadow.camera.far = 400;
        this.shadowLight.shadow.mapSize.width = this.shadowLight.shadow.mapSize.height = 2048;

        this.scene.add(this.globalLight);
        this.scene.add(this.shadowLight);
    }

    hide(direction, callback) {
        this.isHiding = true;
        if (direction == "none") {
            //if (typeof callback === "function") callback();
        } else if (direction == "right") {
            TweenMax.to(this.character.group.position, 1, {x: 3000, ease: Power4.easeIn});
        } else {
            TweenMax.to(this.character.group.position, 1, {x: -3000, ease: Power4.easeIn});
        }
        TweenMax.to(this.camera.position, 1, {
            z: SCENES.camZ,
            y: SCENES.camY,
            ease: Power4.easeInOut,
            onComplete: callback
        });

    }

    show(direction, callback) {
        this.character.group.visible = true;
        if (direction == "none") {
            //if (typeof callback === "function") callback();
        } else if (direction == "right") {
            TweenMax.from(this.character.group.position, 1, {x: 3000, ease: Power4.easeOut});
        } else {
            TweenMax.from(this.character.group.position, 1, {x: -3000, ease: Power4.easeOut});
        }
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        TweenMax.to(this.camera.position, 1, {
            z: 1000, y: 250, ease: Power4.easeInOut, onUpdate: () => {

            }, onComplete: callback
        });
    }

    mouseMove(mp) {
    }

    mouseDown(mp) {
        this.fan.isBlowing = true;
    }

    mouseUp(mp) {
        this.fan.isBlowing = false;
    }

    render() {
        this.fan.update(windefs.mousePos.cx, windefs.mousePos.cy);
        if (this.isHiding) {
            this.character.fix();
        } else if (this.fan.isBlowing) {
            this.character.cool(windefs.mousePos.cx, windefs.mousePos.cy);
        } else {
            this.character.look(windefs.mousePos.cx, windefs.mousePos.cy);
        }
        super.render();
    }
}

export default LionWorld;


// WEBPACK FOOTER //
// ./src/assets/scripts/worlds/LionWorld.js