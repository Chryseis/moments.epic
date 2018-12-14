import * as THREE from 'three';
import Character from './Charater';

class BirdCharacter extends Character {
    constructor() {
        super();
        this.idelingPos = new THREE.Vector2(0, 0);
        this.isFixing = false;
    }

    createGeometry() {
        this.rSegments = 4;
        this.hSegments = 5;
        this.cylRay = 120;
        this.bodyBirdInitPositions = [];
        this.vAngle = this.hAngle = 0;
        this.normalSkin = {r: 255 / 255, g: 222 / 255, b: 121 / 255};
        this.shySkin = {r: 255 / 255, g: 157 / 255, b: 101 / 255};
        this.color = {r: this.normalSkin.r, g: this.normalSkin.g, b: this.normalSkin.b};
        this.side = "left";

        this.shyAngles = {h: 0, v: 0};
        this.behaviourInterval;
        this.intervalRunning = false;

        this.group = new THREE.Group();
        this.group.name = "bird";

        // materials
        this.yellowMat = new THREE.MeshPhongMaterial({
            color: 0xffde79,
            shininess: 0,
            //shading: THREE.FlatShading
        });
        this.whiteMat = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: 0,
            // shading: THREE.FlatShading
        });
        this.blackMat = new THREE.MeshPhongMaterial({
            color: 0x000000,
            shininess: 0,
            // shading: THREE.FlatShading
        });
        this.orangeMat = new THREE.MeshPhongMaterial({
            color: 0xff5535,
            shininess: 0,
            // shading: THREE.FlatShading
        });

        //WINGS

        this.wingLeftGroup = new THREE.Group();
        this.wingRightGroup = new THREE.Group();

        var wingGeom = new THREE.BoxGeometry(60, 60, 5);
        var wingLeft = new THREE.Mesh(wingGeom, this.yellowMat);
        this.wingLeftGroup.add(wingLeft);
        this.wingLeftGroup.position.x = 70;
        this.wingLeftGroup.position.z = 0;
        this.wingLeftGroup.rotation.y = Math.PI / 2;
        wingLeft.rotation.x = -Math.PI / 4;
        var wingRight = new THREE.Mesh(wingGeom, this.yellowMat);
        this.wingRightGroup.add(wingRight);
        this.wingRightGroup.position.x = -70;
        this.wingRightGroup.position.z = 0;
        this.wingRightGroup.rotation.y = -Math.PI / 2;
        wingRight.rotation.x = -Math.PI / 4;

        //BODY

        var bodyGeom = new THREE.CylinderGeometry(40, 70, 200, this.rSegments, this.hSegments);
        this.bodyBird = new THREE.Mesh(bodyGeom, this.yellowMat);
        this.bodyBird.position.y = 70;

        this.bodyVerticesLength = (this.rSegments + 1) * this.hSegments;
        for (var i = 0; i < this.bodyVerticesLength; i++) {
            var tv = this.bodyBird.geometry.vertices[i];
            this.bodyBirdInitPositions.push({x: tv.x, y: tv.y, z: tv.z});
        }

        this.group.add(this.bodyBird);
        this.group.add(this.wingLeftGroup);
        this.group.add(this.wingRightGroup);

        // EYES

        this.face = new THREE.Group();
        var eyeGeom = new THREE.BoxGeometry(60, 60, 10);
        var irisGeom = new THREE.BoxGeometry(10, 10, 10);

        this.leftEye = new THREE.Mesh(eyeGeom, this.whiteMat);
        this.leftEye.position.x = -30;
        this.leftEye.position.y = 120;
        this.leftEye.position.z = 35;
        this.leftEye.rotation.y = -Math.PI / 4;

        this.leftIris = new THREE.Mesh(irisGeom, this.blackMat);
        this.leftIris.position.x = -30;
        this.leftIris.position.y = 120;
        this.leftIris.position.z = 40;
        this.leftIris.rotation.y = -Math.PI / 4;

        this.rightEye = new THREE.Mesh(eyeGeom, this.whiteMat);
        this.rightEye.position.x = 30;
        this.rightEye.position.y = 120;
        this.rightEye.position.z = 35;
        this.rightEye.rotation.y = Math.PI / 4;

        this.rightIris = new THREE.Mesh(irisGeom, this.blackMat);
        this.rightIris.position.x = 30;
        this.rightIris.position.y = 120;
        this.rightIris.position.z = 40;
        this.rightIris.rotation.y = Math.PI / 4;

        // BEAK

        var beakGeom = new THREE.CylinderGeometry(0, 20, 20, 4, 1);
        this.beak = new THREE.Mesh(beakGeom, this.orangeMat);
        this.beak.position.z = 65;
        this.beak.position.y = 70;
        this.beak.rotation.x = Math.PI / 2;

        this.face.add(this.rightEye);
        this.face.add(this.rightIris);
        this.face.add(this.leftEye);
        this.face.add(this.leftIris);
        this.face.add(this.beak);

        //FEATHERS

        var featherGeom = new THREE.BoxGeometry(10, 20, 5);
        this.feather1 = new THREE.Mesh(featherGeom, this.yellowMat);
        this.feather1.position.z = 55;
        this.feather1.position.y = 185;
        this.feather1.rotation.x = Math.PI / 4;
        this.feather1.scale.set(1.5, 1.5, 1);

        this.feather2 = new THREE.Mesh(featherGeom, this.yellowMat);
        this.feather2.position.z = 50;
        this.feather2.position.y = 180;
        this.feather2.position.x = 20;
        this.feather2.rotation.x = Math.PI / 4;
        this.feather2.rotation.z = -Math.PI / 8;

        this.feather3 = new THREE.Mesh(featherGeom, this.yellowMat);
        this.feather3.position.z = 50;
        this.feather3.position.y = 180;
        this.feather3.position.x = -20;
        this.feather3.rotation.x = Math.PI / 4;
        this.feather3.rotation.z = Math.PI / 8;

        this.face.add(this.feather1);
        this.face.add(this.feather2);
        this.face.add(this.feather3);
        this.group.add(this.face);
    }

    look(hAngle, vAngle) {
        this.hAngle = hAngle;
        this.vAngle = vAngle;

        this.leftIris.position.y = 120 - this.vAngle * 30;
        this.leftIris.position.x = -30 + this.hAngle * 10;
        this.leftIris.position.z = 40 + this.hAngle * 10;

        this.rightIris.position.y = 120 - this.vAngle * 30;
        this.rightIris.position.x = 30 + this.hAngle * 10;
        this.rightIris.position.z = 40 - this.hAngle * 10;

        this.leftEye.position.y = this.rightEye.position.y = 120 - this.vAngle * 10;

        this.beak.position.y = 70 - this.vAngle * 20;
        this.beak.rotation.x = Math.PI / 2 + this.vAngle / 3;

        this.feather1.rotation.x = (Math.PI / 4) + (this.vAngle / 2);
        this.feather1.position.y = 185 - this.vAngle * 10;
        this.feather1.position.z = 55 + this.vAngle * 10;

        this.feather2.rotation.x = (Math.PI / 4) + (this.vAngle / 2);
        this.feather2.position.y = 180 - this.vAngle * 10;
        this.feather2.position.z = 50 + this.vAngle * 10;

        this.feather3.rotation.x = (Math.PI / 4) + (this.vAngle / 2);
        this.feather3.position.y = 180 - this.vAngle * 10;
        this.feather3.position.z = 50 + this.vAngle * 10;


        for (var i = 0; i < this.bodyVerticesLength; i++) {
            var line = Math.floor(i / (this.rSegments + 1));
            var tv = this.bodyBird.geometry.vertices[i];
            var tvInitPos = this.bodyBirdInitPositions[i];
            var a, dy;
            if (line >= this.hSegments - 1) {
                a = 0;
            } else {
                a = this.hAngle / (line + 1);
            }
            var tx = tvInitPos.x * Math.cos(a) + tvInitPos.z * Math.sin(a);
            var tz = -tvInitPos.x * Math.sin(a) + tvInitPos.z * Math.cos(a);
            tv.x = tx;
            tv.z = tz;
        }
        this.face.rotation.y = this.hAngle;
        this.bodyBird.geometry.verticesNeedUpdate = true;
    }

    lookAway(fastMove) {
        var speed = fastMove ? .4 : 2;
        var ease = fastMove ? Strong.easeOut : Strong.easeInOut;
        var delay = fastMove ? .2 : 0;
        var col = fastMove ? this.shySkin : this.normalSkin;
        var tv = (-1 + Math.random() * 2) * Math.PI / 3;
        var beakScaleX = .75 + Math.random() * .25;
        var beakScaleZ = .5 + Math.random() * .5;

        if (this.side == "right") {
            var th = (-1 + Math.random()) * Math.PI / 4;
        } else {
            var th = Math.random() * Math.PI / 4;
        }
        TweenMax.killTweensOf(this.shyAngles);
        TweenMax.to(this.shyAngles, speed, {v: tv, h: th, ease: ease, delay: delay});
        TweenMax.to(this.color, speed, {r: col.r, g: col.g, b: col.b, ease: ease, delay: delay});
        TweenMax.to(this.beak.scale, speed, {z: beakScaleZ, x: beakScaleX, ease: ease, delay: delay});
    }

    stare() {
        var col = this.normalSkin;
        if (this.side == "right") {
            var th = Math.PI / 3;
        } else {
            var th = -Math.PI / 3;
        }
        TweenMax.to(this.shyAngles, 2, {v: -.5, h: th, ease: Strong.easeInOut});
        TweenMax.to(this.color, 2, {r: col.r, g: col.g, b: col.b, ease: Strong.easeInOut});
        TweenMax.to(this.beak.scale, 2, {z: .8, x: 1.5, ease: Strong.easeInOut});
    }

    fix() {
        if (this.isFixing) return;
        this.isFixing = true;
        TweenMax.to(this, .5, {
            vAngle: 0, hAngle: 0, onUpdate: () => {
                this.look(this.vAngle, this.hAngle);
            }, onComplete: () => {
                this.isFixing = false;
            }
        });

    }

    idle() {
        if (this.isIdeling || Math.random() < .95) return;
        this.isIdeling = true;
        var th = -Math.PI / 4 + Math.random() * Math.PI / 2;
        var tv = -Math.PI / 4 + Math.random() * Math.PI / 2;

        var speed = .5 + Math.random();
        TweenMax.to(this.idelingPos, speed, {
            x: th, y: tv, ease: Power4.easeOut, onUpdate: () => {
                this.look(this.idelingPos.x, this.idelingPos.y);
            }, onComplete: () => {
                this.isIdeling = false;
            }
        })
    }
}

export default BirdCharacter;


// WEBPACK FOOTER //
// ./src/assets/scripts/characters/BirdCharacter.js