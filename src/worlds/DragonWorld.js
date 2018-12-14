import * as THREE from 'three';
import {TweenMax, Power4} from 'gsap'
import windefs from '../defs/winDef';
import World from '../worlds/World';
import DragonCharacter from '../characters/DragonCharacter';
import SmokeParticle from '../characters/dragon/SmokeParticle';
import { rule3, clamp, hexToRgb } from '../utils/utils';
import SCENES from '../defs/scenesDef';

class DragonWorld extends World {
    constructor(container, renderer, width, height) {
        super(container, renderer, width, height);
        this.name = "dragon";
        this.controls.enabled = false;
        this.awaitingSmokeParticles = [];
        this.sneezeDelay = 500;
        this.scene.fog = new THREE.Fog(0x652e37, 2000, 2100);
        this.score = document.getElementsByClassName("dragon-score")[0];

    }

    createCharacter() {

        this.camTargetPos = new THREE.Vector3(-500,100,300);

        this.character = new DragonCharacter();
        this.character.init();
        this.character.group.position.set(0, 70, 0);
        this.character.group.scale.set(2, 2, 2);
        this.character.group.visible = false;
        this.scene.add(this.character.group);
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

    getSmokeParticle() {
        var p;
        if (!this.awaitingSmokeParticles.length) {
            p = new SmokeParticle(this.awaitingSmokeParticles);
        }
        p = this.awaitingSmokeParticles.pop();
        return p;
    }

    sneeze() {
        this.character.sneeze();
        this.score.innerHTML = "00";
    }

    mouseUp() {
        if (this.sneezeTimeout) clearTimeout(this.sneezeTimeout);
        this.character.sneezingRate += (this.character.maxSneezingRate - this.character.sneezingRate) / 20;
        this.score.innerHTML = parseInt(this.character.sneezingRate * 100 / this.character.maxSneezingRate);
        this.character.prepareToSneeze();
        this.sneezeTimeout = setTimeout(this.sneeze.bind(this), this.sneezeDelay);
        this.character.isSneezing = true;
    }

    mouseMove(mousePos) {
        if (this.isHiding) return;
        var camAngle = Math.PI/2 + rule3(mousePos.px, -1, 1, Math.PI/2, -Math.PI/2);
        var camHeight = 160 + rule3(mousePos.py, -1, 1, 100, -100);
        this.camTargetPos.x = Math.cos(camAngle)*500;
        this.camTargetPos.y = camHeight;
        this.camTargetPos.z = Math.sin(camAngle)*700;
    }

    render() {
        if (!this.isHiding){
            this.camera.position.x += (this.camTargetPos.x - this.camera.position.x) / 20;
            this.camera.position.y += (this.camTargetPos.y - this.camera.position.y) / 20;
            this.camera.position.z += (this.camTargetPos.z - this.camera.position.z) / 20;
            this.camera.lookAt(this.vectorLookAt);
        }


        if (!this.character.isSneezing) {
            this.character.update();
        }

        if (this.character.timeSmoke > 0) {
            var noseTarget = (Math.random() > .5) ? this.character.noseL : this.character.noseR;
            var p = this.getSmokeParticle();
            var pos = noseTarget.localToWorld(new THREE.Vector3(0, 0, 2));

            p.mesh.position.x = pos.x;
            p.mesh.position.y = pos.y;
            p.mesh.position.z = pos.z;
            p.mesh.material.color.setHex(0x555555);
            p.mesh.material.opacity = .2;

            this.scene.add(p.mesh);
            p.fly();
            this.character.timeSmoke--;
        }
        if (this.character.timeFire > 0) {

            var noseTarget = (Math.random() > .5) ? this.character.noseL : this.character.noseR;
            var colTarget = (Math.random() > .5) ? 0xfdde8c : 0xcb3e4c;
            var f = this.getSmokeParticle();
            var posF = noseTarget.localToWorld(new THREE.Vector3(0, 0, 2));

            f.mesh.position.x = posF.x;
            f.mesh.position.y = posF.y;
            f.mesh.position.z = posF.z;
            f.color = {
                r: 255 / 255,
                g: 205 / 255,
                b: 74 / 255
            };
            f.mesh.material.color.setRGB(f.color.r, f.color.g, f.color.b);
            f.mesh.material.opacity = 1;

            this.scene.add(f.mesh);
            f.fire(this.character.fireRate, this.character.maxSneezingRate);
            this.character.timeFire--;
        }
        super.render();
    }

    show(direction, callback) {

        TweenMax.set(this.score, {display:"block"});

        this.character.group.visible = true;

        if (direction == "none") {
            //if (typeof callback === "function") callback();
        } else if (direction == "right") {
            this.character.group.position.x = 3000;
        } else {
            this.character.group.position.x = -3000;
        }
        //TweenMax.to(this.vectorLookAt, 1, {y:0})
        TweenMax.killTweensOf([this.character.group.scale, this.character.group.position, this.scene.fog, this.score ]);

        TweenMax.to(this.character.group.scale, 1, { x: 1, y: 1, z: 1, ease: Power4.easeInOut });
        TweenMax.to(this.character.group.position, 1, { x: 0, y:35, ease: Power4.easeOut });
        TweenMax.to(this.scene.fog, 1, {near:300, far:1000, delay:1, ease: Power4.easeOut});
        TweenMax.to(this.score, 1, {autoAlpha:1, delay:2, ease: Power4.easeOut});
    }

    hide(direction, callback) {
        this.isHiding = true;

        TweenMax.killTweensOf([this.character.group.scale, this.character.group.position, this.scene.fog, this.score, this.camera.position ]);

        if (direction == "none") {
            TweenMax.to(this.character.group.position, 1, { y:70, ease: Power4.easeIn });
        } else if (direction == "right") {
            TweenMax.to(this.character.group.position, 1, { x: 3000, y:70, ease: Power4.easeIn });
        } else {
            TweenMax.to(this.character.group.position, 1, { x: -3000, y:70, ease: Power4.easeIn });
        }
        //TweenMax.to(this.vectorLookAt, 1, {y:0})
        TweenMax.to(this.character.group.scale, 1, { x: 2, y: 2, z: 2, ease: Power4.easeInOut });
        TweenMax.to(this.camera.position, 1, {
            x:0, z: SCENES.camZ, y: SCENES.camY, ease: Power4.easeInOut, onUpdate: () => {
                this.camera.lookAt(this.vectorLookAt);
            }, onComplete: callback
        });
        TweenMax.to(this.scene.fog, .2, {near:2000, far:2100, ease: Power4.easeOut});
        TweenMax.to(this.score, .5, {autoAlpha:0, ease: Power4.easeOut});
    }
}

export default DragonWorld;


// WEBPACK FOOTER //
// ./src/assets/scripts/worlds/DragonWorld.js