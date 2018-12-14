import * as THREE from 'three';
import Character from './Charater';

class FishCharacter extends Character {
    constructor() {
        super();
        this.isIdeling = false;
        this.idelingPos = {x:0, y:0};
    }

    createGeometry() {

        this.angleFin = 0;
        this.fishFastColor = { r: 255, g: 0, b: 224 };
        this.fishSlowColor = { r: 0, g: 207, b: 255 };

        var fish, bodyFish, tailFish, topFish, rightIris, leftIris, rightEye, leftEye, lipsFish, tooth1, tooth2, tooth3, tooth4, tooth5, sideRightFish, sideLeftFish;

        var halfPI = Math.PI * .5;

        this.group = new THREE.Group();
        this.group.name = "fish";

        // Body
        var bodyGeom = new THREE.BoxGeometry(120, 120, 120);
        var bodyMat = new THREE.MeshPhongMaterial({
            color: 0x80f5fe,
            shading: THREE.FlatShading
        });
        this.bodyFish = new THREE.Mesh(bodyGeom, bodyMat);

        // Tail
        var tailGeom = new THREE.CylinderGeometry(0, 60, 60, 4, false);
        var tailMat = new THREE.MeshPhongMaterial({
            color: 0xff00dc,
            shading: THREE.FlatShading
        });

        this.tailFish = new THREE.Mesh(tailGeom, tailMat);
        this.tailFish.scale.set(.8, 1, .1);
        this.tailFish.position.x = -60;
        this.tailFish.rotation.z = -halfPI;

        // Lips
        var lipsGeom = new THREE.BoxGeometry(25, 10, 120);
        var lipsMat = new THREE.MeshPhongMaterial({
            color: 0x80f5fe,
            shading: THREE.FlatShading
        });
        this.lipsFish = new THREE.Mesh(lipsGeom, lipsMat);
        this.lipsFish.position.x = 65;
        this.lipsFish.position.y = -47;
        this.lipsFish.rotation.z = halfPI;

        // Fins
        this.topFish = new THREE.Mesh(tailGeom, tailMat);
        this.topFish.scale.set(.8, 1, .1);
        this.topFish.position.x = -20;
        this.topFish.position.y = 60;
        this.topFish.rotation.z = -halfPI;

        this.sideRightFish = new THREE.Mesh(tailGeom, tailMat);
        this.sideRightFish.scale.set(.8, 1, .1);
        this.sideRightFish.rotation.x = halfPI;
        this.sideRightFish.rotation.z = -halfPI;
        this.sideRightFish.position.x = 0;
        this.sideRightFish.position.y = -50;
        this.sideRightFish.position.z = -60;

        this.sideLeftFish = new THREE.Mesh(tailGeom, tailMat);
        this.sideLeftFish.scale.set(.8, 1, .1);
        this.sideLeftFish.rotation.x = halfPI;
        this.sideLeftFish.rotation.z = -halfPI;
        this.sideLeftFish.position.x = 0;
        this.sideLeftFish.position.y = -50;
        this.sideLeftFish.position.z = 60;

        // Eyes
        var eyeGeom = new THREE.BoxGeometry(40, 40, 5);
        var eyeMat = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shading: THREE.FlatShading
        });

        this.rightEye = new THREE.Mesh(eyeGeom, eyeMat);
        this.rightEye.position.z = -60;
        this.rightEye.position.x = 25;
        this.rightEye.position.y = -10;

        var irisGeom = new THREE.BoxGeometry(10, 10, 3);
        var irisMat = new THREE.MeshPhongMaterial({
            color: 0x330000,
            shading: THREE.FlatShading
        });

        this.rightIris = new THREE.Mesh(irisGeom, irisMat);
        this.rightIris.position.z = -65;
        this.rightIris.position.x = 35;
        this.rightIris.position.y = -10;

        this.leftEye = new THREE.Mesh(eyeGeom, eyeMat);
        this.leftEye.position.z = 60;
        this.leftEye.position.x = 25;
        this.leftEye.position.y = -10;

        this.leftIris = new THREE.Mesh(irisGeom, irisMat);
        this.leftIris.position.z = 65;
        this.leftIris.position.x = 35;
        this.leftIris.position.y = -10;

        var toothGeom = new THREE.BoxGeometry(20, 4, 20);
        var toothMat = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shading: THREE.FlatShading
        });

        // Teeth
        this.tooth1 = new THREE.Mesh(toothGeom, toothMat);
        this.tooth1.position.x = 65;
        this.tooth1.position.y = -35;
        this.tooth1.position.z = -50;
        this.tooth1.rotation.z = halfPI;
        this.tooth1.rotation.x = -halfPI;

        this.tooth2 = new THREE.Mesh(toothGeom, toothMat);
        this.tooth2.position.x = 65;
        this.tooth2.position.y = -30;
        this.tooth2.position.z = -25;
        this.tooth2.rotation.z = halfPI;
        this.tooth2.rotation.x = -Math.PI / 12;

        this.tooth3 = new THREE.Mesh(toothGeom, toothMat);
        this.tooth3.position.x = 65;
        this.tooth3.position.y = -25;
        this.tooth3.position.z = 0;
        this.tooth3.rotation.z = halfPI;

        this.tooth4 = new THREE.Mesh(toothGeom, toothMat);
        this.tooth4.position.x = 65;
        this.tooth4.position.y = -30;
        this.tooth4.position.z = 25;
        this.tooth4.rotation.z = halfPI;
        this.tooth4.rotation.x = Math.PI / 12;

        this.tooth5 = new THREE.Mesh(toothGeom, toothMat);
        this.tooth5.position.x = 65;
        this.tooth5.position.y = -35;
        this.tooth5.position.z = 50;
        this.tooth5.rotation.z = halfPI;
        this.tooth5.rotation.x = Math.PI / 8;

        this.group.add(this.bodyFish);
        this.group.add(this.tailFish);
        this.group.add(this.topFish);
        this.group.add(this.sideRightFish);
        this.group.add(this.sideLeftFish);
        this.group.add(this.rightEye);
        this.group.add(this.rightIris);
        this.group.add(this.leftEye);
        this.group.add(this.leftIris);
        this.group.add(this.tooth1);
        this.group.add(this.tooth2);
        this.group.add(this.tooth3);
        this.group.add(this.tooth4);
        this.group.add(this.tooth5);
        this.group.add(this.lipsFish);
    }

    swim(speed, smoothing, yRot) {
        this.isSwinging = false;

        var yRot = yRot | 0;
        this.group.rotation.z += ((-speed.y / 50) - this.group.rotation.z) / smoothing;
        this.group.rotation.x += ((-speed.y / 50) - this.group.rotation.x) / smoothing;
        this.group.rotation.y += ((-speed.y / 50) - this.group.rotation.y) / smoothing;
        this.rightEye.rotation.z = this.leftEye.rotation.z = -speed.y / 150;
        this.rightIris.position.x = this.leftIris.position.y = -10 - speed.y / 2;
        this.rightEye.scale.set(1, 1 - (speed.x / 150), 1);
        this.leftEye.scale.set(1, 1 - (speed.x / 150), 1);

        var s2 = speed.x / 100; // used for the wagging speed and color
        var s3 = speed.x / 300; // used for the scale
        this.angleFin += s2;
        var backTailCycle = Math.cos(this.angleFin);
        var sideFinsCycle = Math.sin(this.angleFin / 5);

        this.tailFish.rotation.y = backTailCycle * .5;
        this.topFish.rotation.x = sideFinsCycle * .5;
        this.sideRightFish.rotation.x = Math.PI/2 + sideFinsCycle * .2;
        this.sideLeftFish.rotation.x = Math.PI/2 + sideFinsCycle * .2;

        var rvalue = (this.fishSlowColor.r + (this.fishFastColor.r - this.fishSlowColor.r)*s2)/255;
        var gvalue = (this.fishSlowColor.g + (this.fishFastColor.g - this.fishSlowColor.g)*s2)/255;
        var bvalue = (this.fishSlowColor.b + (this.fishFastColor.b - this.fishSlowColor.b)*s2)/255;
        this.bodyFish.material.color.setRGB(rvalue,gvalue,bvalue);
        this.lipsFish.material.color.setRGB(rvalue,gvalue,bvalue);

        this.group.scale.set(1+s3,1-s3,1-s3);
    }

    idle(){
        this.isSwinging = false;
        TweenMax.killTweensOf(this.group.rotation);

        if (this.isIdeling || Math.random()<.95) return;
        this.isIdeling = true;
        var tx = -Math.PI/6 + Math.random()*Math.PI/3;
        var ty = -Math.PI/6 + Math.random()*Math.PI/3;

        var speed = .5 + Math.random()*2;
        TweenMax.to(this.idelingPos, speed, {x:tx, y:ty, ease:Power4.easeInOut,onUpdate: ()=>{
            this.group.rotation.x = this.idelingPos.x;
            this.group.rotation.y = -Math.PI/2 + this.idelingPos.y;

        }, onComplete:()=>{
            this.isIdeling = false;
        }})
    }

    fix(){
        this.isSwinging = false;
        TweenMax.killTweensOf(this.group.rotation);

        TweenMax.killTweensOf(this.idelingPos);
        this.swim({x:0,y:0}, 10);
    }

    swing(){
        if (this.isSwinging) return;
        this.isSwinging = true;

        TweenMax.to(this.group.rotation, .5, {
            z : -Math.PI/16, y : -Math.PI/2 + Math.PI/16, x:0,
            ease:Power4.easeInOut,
            onComplete: ()=>{
                TweenMax.to(this.group.rotation, 1, {
                    z:Math.PI/16, y: -Math.PI/2 + -Math.PI/16, x:0, ease:Back.easeInOut, yoyo:true, repeat:-1
                });
            }
        });
    }
}

export default FishCharacter;


// WEBPACK FOOTER //
// ./src/assets/scripts/characters/FishCharacter.js