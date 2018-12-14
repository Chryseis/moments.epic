import * as THREE from 'three';
import {TweenMax, Power4} from 'gsap'
import windefs from '../defs/winDef';
import World from '../worlds/World';
import CatCharacter from '../characters/CatCharacter';
import YarnCharacter from '../characters/YarnCharacter';
import SCENES from '../defs/scenesDef';

class CatWorld extends World {
    constructor(container, renderer, width, height) {
        super(container, renderer, width, height);
        this.name = "cat";
        this.controls.enabled = false;
        this.isInteracting = false;
    }

    createCharacter() {

        this.ballWallDepth = 28;
        this.time = 0;

        this.character = new CatCharacter();
        this.character.init();
        this.character.group.position.set(0, 0, 0);
        this.character.group.scale.set(2.3, 2.3, 2.3);
        //this.character.group.visible = false;
        this.scene.add(this.character.group);
        this.ball = new YarnCharacter();
        this.ball.init();
        this.scene.add(this.ball.group);

        this.character.group.visible = false;

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


    getBallPos() {
        var vector = new THREE.Vector3();

        vector.set(
            (windefs.mousePos.x / window.innerWidth) * 2 - 1,
            - (windefs.mousePos.y / window.innerHeight) * 2 + 1,
            0.1);

        vector.unproject(this.camera);
        var dir = vector.sub(this.camera.position).normalize();
        var distance = (this.ballWallDepth - this.camera.position.z) / dir.z;
        var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
        return pos;
    }

    render() {
        this.time += .05;
        this.character.updateTail(this.time);
        if (this.isInteracting){
            var ballPos = this.getBallPos();
            this.ball.update(ballPos.x, ballPos.y, ballPos.z);
            this.ball.receivePower(this.character.transferPower);
            this.character.interactWithBall(this.ball.body.position);
        }else{
            this.character.fix();
        }

        super.render();
    }

    show(direction, callback) {
        this.character.group.visible = true;
        if (direction == "none") {
            //if (typeof callback === "function") callback();
        } else if (direction == "right") {
            TweenMax.from(this.character.group.position, 1, { x: 3000, ease: Power4.easeOut });
        } else {
            TweenMax.from(this.character.group.position, 1, { x: -3000, ease: Power4.easeOut });
        }
        //TweenMax.to(this.vectorLookAt, 1, {y:0})
        TweenMax.to(this.character.group.scale, 1, { x: 1, y: 1, z: 1, ease: Power4.easeInOut });
        TweenMax.to(this.camera.position, 1, {
            z: 350, y: 250, ease: Power4.easeInOut, onUpdate: () => {
                this.camera.lookAt(this.vectorLookAt);
            }, onComplete: ()=>{
                this.isInteracting = true;
                if (typeof callback === "function") {
                    callback();
                }
            }
        });
    }

    hide(direction, callback) {
        this.isInteracting = false;
        if (direction == "none") {
            //if (typeof callback === "function") callback();
        } else if (direction == "right") {
            TweenMax.to(this.character.group.position, 1, { x: 3000, ease: Power4.easeIn });
        } else {
            TweenMax.to(this.character.group.position, 1, { x: -3000, ease: Power4.easeIn });
        }
        TweenMax.to(this.character.group.scale, 1, { x: 2.3, y: 2.3, z: 2.3, ease: Power4.easeInOut });
        TweenMax.to(this.camera.position, 1, {
            z: SCENES.camZ, y: SCENES.camY, ease: Power4.easeInOut, onUpdate: () => {
                this.camera.lookAt(this.vectorLookAt);
            }, onComplete: callback
        });
    }
}

export default CatWorld;


// WEBPACK FOOTER //
// ./src/assets/scripts/worlds/CatWorld.js