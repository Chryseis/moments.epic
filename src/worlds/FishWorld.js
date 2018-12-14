import * as THREE from 'three';
import {TweenMax, Power4} from 'gsap'
import World from '../worlds/World';
import FishCharacter from '../characters/FishCharacter';
import OceanParticle from '../characters/fish/OceanPacticle';
import {rule3, clamp, hexToRgb} from '../utils/utils';
import windefs from '../defs/winDef';
import SCENES from '../defs/scenesDef';

class FishWorld extends World {
    constructor(container, renderer, width, height) {
        super(container, renderer, width, height);
        this.name = "fish";
        this.controls.enabled = false;
        this.isHiding = false;
        this.interval = setInterval(this.flyParticle.bind(this), 70);
    }

    defineVariables() {
        this.xLimit;
        this.yLimit;

        this.colors = ['#dff69e',
            '#00ceff',
            '#002bca',
            '#ff00e0',
            '#3f159f',
            '#71b583',
            '#00a2ff'];

        this.flyingParticles = [];
        this.waitingParticles = [];
        this.maxParticlesZ = 600;
        this.speed = {x: 0, y: 0};
        this.smoothing = 10;
        this.halfPI = Math.PI / 2;
    }

    createFloor() {

    }

    updateSize(w, h) {
        this.ang = (this.camera.fov / 2) * Math.PI / 180;
        this.yLimit = (this.camera.position.z + this.maxParticlesZ) * Math.tan(this.ang);
        this.xLimit = this.yLimit * this.camera.aspect;
        super.updateSize(w, h);
    }

    updateSpeed(pos) {
        this.speed.x += ((pos.x / this.width) * 100 - this.speed.x) / 10;
        this.speed.y += ((pos.y - this.height / 2) / 10 - this.speed.y) / 10;
    }

    createCharacter() {
        this.character = new FishCharacter();
        this.character.init();
        this.character.group.position.y = 100;
        this.character.group.rotation.y = -Math.PI / 2;
        this.character.group.visible = false;
        this.scene.add(this.character.group);
    }

    render() {
        if (!this.isHiding) {
            this.updateSpeed(windefs.mousePos);
            this.character.group.position.x += (((windefs.mousePos.x - this.width / 2)) - this.character.group.position.x) / this.smoothing;
            this.character.group.position.y += ((-this.speed.y * 10) - this.character.group.position.y) / this.smoothing;
            this.character.swim(this.speed, this.smoothing);
        }


        var sp0 = .05;
        var sp1 = (this.isHiding) ? 10 : .2;

        for (var i = 0; i < this.flyingParticles.length; i++) {

            var particle = this.flyingParticles[i];
            particle.mesh.rotation.y += (1 / particle.mesh.scale.x) * sp0;
            particle.mesh.rotation.x += (1 / particle.mesh.scale.x) * sp0;
            particle.mesh.rotation.z += (1 / particle.mesh.scale.x) * sp0;
            particle.mesh.position.x += -10 - (1 / particle.mesh.scale.x) * (this.speed.x + .1) * sp1;
            particle.mesh.position.y += (1 / particle.mesh.scale.x) * (this.speed.y + .1) * sp1;
            if (particle.mesh.position.x < -this.xLimit - 80) {
                this.scene.remove(particle.mesh);
                this.waitingParticles.push(this.flyingParticles.splice(i, 1)[0]); // recycle the particle
                i--;
            }
        }
        super.render();
    }

    getParticle() {
        if (this.waitingParticles.length) {
            return this.waitingParticles.pop();
        } else {
            var col = this.getRandomColor();
            return new OceanParticle(col);
        }
    }

    flyParticle() {
        var particle = this.getParticle();
        particle.mesh.position.x = this.xLimit;
        particle.mesh.position.y = -this.yLimit + Math.random() * this.yLimit * 2;
        particle.mesh.position.z = Math.random() * this.maxParticlesZ;
        var s = .1 + Math.random();
        particle.mesh.scale.set(s, s, s);
        this.flyingParticles.push(particle);
        this.scene.add(particle.mesh);
        //console.log(particle.mesh.position);
    }

    getRandomColor() {
        var col = hexToRgb(this.colors[Math.floor(Math.random() * this.colors.length)]);
        var threecol = new THREE.Color("rgb(" + col.r + "," + col.g + "," + col.b + ")");
        return threecol;
    }

    show(direction, callback) {

        this.character.group.visible = true;
        if (direction == "none") {
            //if (typeof callback === "function") callback();
        } else if (direction == "right") {
            this.character.group.position.x = 3000;
        } else {
            this.character.group.position.x = -3000;
        }
        TweenMax.to(this.character.group.position, 1, {x: 0, y: 0, ease: Power4.easeOut});
        TweenMax.to(this.character.group.rotation, 1, {y: 0, ease: Power4.easeOut});

    }

    hide(direction, callback) {
        this.isHiding = true;


        if (this.interval) clearInterval(this.interval);

        if (direction == "none") {
            TweenMax.to(this.character.group.position, 1, {x: 0, y: 100, ease: Power4.easeIn});
        } else if (direction == "right") {
            TweenMax.to(this.character.group.position, 1, {x: 3000, y: 100, ease: Power4.easeIn});
        } else {
            TweenMax.to(this.character.group.position, 1, {x: -3000, y: 100, ease: Power4.easeIn});
        }

        TweenMax.to(this.speed, .5, {
            x: 0, y: 0, ease: Power4.easeOut, onUpdate: () => {
                this.character.swim(this.speed, 10);
            }
        });
        TweenMax.to(this.character.group.rotation, 1, {
            y: -Math.PI / 2,
            delay: .5,
            ease: Power4.easeOut,
            onComplete: callback
        });
    }

    destroy() {

        if (this.interval) clearInterval(this.interval);

        while (this.waitingParticles.length) {
            var waiting = this.waitingParticles.pop();
            waiting.mesh.geometry.dispose();
            waiting.mesh.material.dispose();
            waiting = null;
        }
        while (this.flyingParticles.length) {
            var flying = this.flyingParticles.pop();
            flying.mesh.geometry.dispose();
            flying.mesh.material.dispose();
            this.scene.remove(flying.mesh);
            flying = null;
        }
        super.destroy();
    }
}

export default FishWorld;


// WEBPACK FOOTER //
// ./src/assets/scripts/worlds/FishWorld.js