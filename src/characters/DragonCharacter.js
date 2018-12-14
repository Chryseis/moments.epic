import * as THREE from 'three';
import Character from './Charater';

class DragonCharacter extends Character {
    constructor() {
        super();
        this.idelingPos = new THREE.Vector3(0,80,100);
        this.isFixing = false;
    }

    createGeometry() {
        this.tailAmplitude = 3;
        this.tailAngle = 0;
        this.tailSpeed = .07;

        this.wingAmplitude = Math.PI / 8;
        this.wingAngle = 0;
        this.wingSpeed = 0.1;
        this.isSneezing = false;
        this.maxSneezingRate = 8;
        this.sneezingRate = 0;

        this.timeSmoke = 0;
        this.timeFire = 0;
        this.fireRate = 0;


        this.group = new THREE.Group(); // this is a sort of container that will hold all the meshes and will be added to the scene;
        this.group.name = "dragon";

        // Materials
        var greenMat = new THREE.MeshPhongMaterial({
            color: 0x5da683,
            shading: THREE.FlatShading
        });
        var lightGreenMat = new THREE.MeshPhongMaterial({
            color: 0x95c088,
            shading: THREE.FlatShading
        });

        var yellowMat = new THREE.MeshPhongMaterial({
            color: 0xfdde8c,
            shading: THREE.FlatShading
        });

        var redMat = new THREE.MeshPhongMaterial({
            color: 0xcb3e4c,
            shading: THREE.FlatShading
        });

        var whiteMat = new THREE.MeshPhongMaterial({
            color: 0xfaf3d7,
            shading: THREE.FlatShading
        });

        var brownMat = new THREE.MeshPhongMaterial({
            color: 0x874a5c,
            shading: THREE.FlatShading
        });

        var blackMat = new THREE.MeshPhongMaterial({
            color: 0x403133,
            shading: THREE.FlatShading
        });
        var pinkMat = new THREE.MeshPhongMaterial({
            color: 0xd0838e,
            shading: THREE.FlatShading
        });

        // body
        this.body = new THREE.Group();
        this.belly = this.makeCube(greenMat, 30, 30, 40, 0, 0, 0, 0, 0, Math.PI / 4);

        // Wings
        this.wingL = this.makeCube(yellowMat, 5, 30, 20, 15, 15, 0, -Math.PI / 4, 0, -Math.PI / 4);
        this.wingL.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 15, 10));
        this.wingR = this.wingL.clone();
        this.wingR.position.x = -this.wingL.position.x;
        this.wingR.rotation.z = -this.wingL.rotation.z;

        // pike body
        var pikeBodyGeom = new THREE.CylinderGeometry(0, 10, 10, 4, 1);
        this.pikeBody1 = new THREE.Mesh(pikeBodyGeom, greenMat);
        this.pikeBody1.scale.set(.2, 1, 1);
        this.pikeBody1.position.z = 10;
        this.pikeBody1.position.y = 26;

        this.pikeBody2 = this.pikeBody1.clone();
        this.pikeBody2.position.z = 0;
        this.pikeBody3 = this.pikeBody1.clone();
        this.pikeBody3.position.z = -10;

        // tail
        this.tail = new THREE.Group();
        this.tail.position.z = -20;
        this.tail.position.y = 10;

        var tailMat = new THREE.LineBasicMaterial({
            color: 0x5da683,
            linewidth: 5
        });

        var tailGeom = new THREE.Geometry();
        tailGeom.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 5, -10), new THREE.Vector3(0, -5, -20), new THREE.Vector3(0, 0, -30));

        this.tailLine = new THREE.Line(tailGeom, tailMat);

        // pike
        var pikeGeom = new THREE.CylinderGeometry(0, 10, 10, 4, 1);
        pikeGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        this.tailPike = new THREE.Mesh(pikeGeom, yellowMat);
        this.tailPike.scale.set(.2, 1, 1);
        this.tailPike.position.z = -35;
        this.tailPike.position.y = 0;

        this.tail.add(this.tailLine);
        this.tail.add(this.tailPike);

        this.body.add(this.belly);
        this.body.add(this.wingL);
        this.body.add(this.wingR);
        this.body.add(this.tail);
        this.body.add(this.pikeBody1);
        this.body.add(this.pikeBody2);
        this.body.add(this.pikeBody3);

        // head
        this.head = new THREE.Group();

        // head face
        this.face = this.makeCube(greenMat, 60, 50, 80, 0, 25, 40, 0, 0, 0);

        // head horn
        var hornGeom = new THREE.CylinderGeometry(0, 6, 10, 4, 1);
        this.hornL = new THREE.Mesh(hornGeom, yellowMat);
        this.hornL.position.y = 55;
        this.hornL.position.z = 10;
        this.hornL.position.x = 10;

        this.hornR = this.hornL.clone();
        this.hornR.position.x = -10;

        // head ears
        this.earL = this.makeCube(greenMat, 5, 10, 20, 32, 42, 2, 0, 0, 0);
        this.earL.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 5, -10));
        this.earL.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 4));
        this.earL.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI / 4));

        this.earR = this.makeCube(greenMat, 5, 10, 20, -32, 42, 2, 0, 0, 0);
        this.earR.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 5, -10));
        this.earR.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 4));
        this.earR.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI / 4));

        // head mouth
        this.mouth = new THREE.Group();
        this.mouth.position.z = 50;
        this.mouth.position.y = 3;
        this.mouth.rotation.x = 0; //Math.PI / 8;

        // head mouth jaw
        this.jaw = this.makeCube(greenMat, 30, 10, 30, 0, -5, 15, 0, 0, 0);
        this.mouth.add(this.jaw);

        // head mouth tongue
        this.tongue = this.makeCube(redMat, 20, 10, 20, 0, -3, 15, 0, 0, 0);
        this.mouth.add(this.tongue);

        // head smile
        var smileGeom = new THREE.TorusGeometry(6, 2, 2, 10, Math.PI);
        this.smile = new THREE.Mesh(smileGeom, blackMat);
        this.smile.position.z = 82;
        this.smile.position.y = 5;
        this.smile.rotation.z = -Math.PI;

        // head cheek
        this.cheekL = this.makeCube(lightGreenMat, 4, 20, 20, 30, 18, 55, 0, 0, 0);
        this.cheekR = this.cheekL.clone();
        this.cheekR.position.x = -this.cheekL.position.x;

        //head spots
        this.spot1 = this.makeCube(lightGreenMat, 2, 2, 2, 20, 16, 80, 0, 0, 0);

        this.spot2 = this.spot1.clone();
        this.spot2.position.x = 15;
        this.spot2.position.y = 14;

        this.spot3 = this.spot1.clone();
        this.spot3.position.x = 16;
        this.spot3.position.y = 20;

        this.spot4 = this.spot1.clone();
        this.spot4.position.x = 12;
        this.spot4.position.y = 18;

        this.spot5 = this.spot1.clone();
        this.spot5.position.x = -15;
        this.spot5.position.y = 14;

        this.spot6 = this.spot1.clone();
        this.spot6.position.x = -14;
        this.spot6.position.y = 20;

        this.spot7 = this.spot1.clone();
        this.spot7.position.x = -19;
        this.spot7.position.y = 17;

        this.spot8 = this.spot1.clone();
        this.spot8.position.x = -11;
        this.spot8.position.y = 17;

        // head eye
        this.eyeL = this.makeCube(whiteMat, 10, 22, 22, 27, 34, 18, 0, 0, 0);
        this.eyeR = this.eyeL.clone();
        this.eyeR.position.x = -27;

        // head iris
        this.irisL = this.makeCube(brownMat, 10, 12, 12, 28, 30, 24, 0, 0, 0);
        this.irisR = this.irisL.clone();
        this.irisR.position.x = -this.irisL.position.x;

        // head nose
        this.noseL = this.makeCube(blackMat, 5, 5, 8, 5, 40, 77, 0, 0, 0);
        this.noseR = this.noseL.clone();
        this.noseR.position.x = -this.noseL.position.x;

        this.head.position.z = 30;
        this.head.add(this.face);
        this.head.add(this.hornL);
        this.head.add(this.hornR);
        this.head.add(this.earL);
        this.head.add(this.earR);
        this.head.add(this.mouth);
        this.head.add(this.eyeL);
        this.head.add(this.eyeR);
        this.head.add(this.irisL);
        this.head.add(this.irisR);
        this.head.add(this.noseL);
        this.head.add(this.noseR);
        this.head.add(this.cheekL);
        this.head.add(this.cheekR);
        this.head.add(this.smile);
        /*
        this.head.add(this.spot1);
        this.head.add(this.spot2);
        this.head.add(this.spot3);
        this.head.add(this.spot4);
        this.head.add(this.spot5);
        this.head.add(this.spot6);
        this.head.add(this.spot7);
        this.head.add(this.spot8);
        */
        // legs
        this.legFL = this.makeCube(greenMat, 20, 10, 20, 20, -30, 15, 0, 0, 0);
        this.legFR = this.legFL.clone();
        this.legFR.position.x = -30;
        this.legBL = this.legFL.clone();
        this.legBL.position.z = -15;
        this.legBR = this.legBL.clone();
        this.legBR.position.x = -30;

        this.group.add(this.body);
        this.group.add(this.head);
        this.group.add(this.legFL);
        this.group.add(this.legFR);
        this.group.add(this.legBL);
        this.group.add(this.legBR);
        //this.group.add(this.pike);
    }

    update() {

        this.tailAngle += this.tailSpeed;
        this.wingAngle += this.wingSpeed;
        for (var i = 0; i < this.tailLine.geometry.vertices.length; i++) {
            var v = this.tailLine.geometry.vertices[i];
            v.y = Math.sin(this.tailAngle - (Math.PI / 3) * i) * this.tailAmplitude * i * i;
            v.x = Math.cos(this.tailAngle / 2 + (Math.PI / 10) * i) * this.tailAmplitude * i * i;
            if (i == this.tailLine.geometry.vertices.length - 1) {
                this.tailPike.position.x = v.x;
                this.tailPike.position.y = v.y;
                this.tailPike.rotation.x = (v.y / 30);
            }
        }
        this.tailLine.geometry.verticesNeedUpdate = true;
        this.wingL.rotation.z = -Math.PI / 4 + Math.cos(this.wingAngle) * this.wingAmplitude;
        this.wingR.rotation.z = Math.PI / 4 - Math.cos(this.wingAngle) * this.wingAmplitude;
    }

    prepareToSneeze() {
        var speed = .7;
        TweenLite.to(this.head.rotation, speed, {
            x: -this.sneezingRate * .12,
            ease: Back.easeOut
        });
        TweenLite.to(this.head.position, speed, {
            z: 30 - this.sneezingRate * 2.2,
            y: this.sneezingRate * 2.2,
            ease: Back.easeOut
        });
        TweenLite.to(this.mouth.rotation, speed, {
            x: this.sneezingRate * .18,
            ease: Back.easeOut
        });

        TweenLite.to(this.smile.position, speed / 2, {
            z: 75,
            y: 10,
            ease: Back.easeOut
        });
        TweenLite.to(this.smile.scale, speed / 2, {
            x: 0.1, y: 0.1,
            ease: Back.easeOut
        });

        TweenMax.to(this.noseL.scale, speed, {
            x: 1 + this.sneezingRate * .1,
            y: 1 + this.sneezingRate * .1,
            ease: Back.easeOut
        });
        TweenMax.to(this.noseR.scale, speed, {
            x: 1 + this.sneezingRate * .1,
            y: 1 + this.sneezingRate * .1,
            ease: Back.easeOut
        });
        TweenMax.to(this.eyeL.scale, speed, {
            y: 1 + this.sneezingRate * .01,
            ease: Back.easeOut
        });
        TweenMax.to(this.eyeR.scale, speed, {
            y: 1 + this.sneezingRate * .01,
            ease: Back.easeOut
        });
        TweenMax.to(this.irisL.scale, speed, {
            y: 1 + this.sneezingRate * .05,
            z: 1 + this.sneezingRate * .05,
            ease: Back.easeOut
        });
        TweenMax.to(this.irisR.scale, speed, {
            y: 1 + this.sneezingRate * .05,
            z: 1 + this.sneezingRate * .05,
            ease: Back.easeOut
        });
        TweenMax.to(this.irisL.position, speed, {
            y: 30 + this.sneezingRate * .8,
            z: 24 - this.sneezingRate * .4,
            ease: Back.easeOut
        });
        TweenMax.to(this.irisR.position, speed, {
            y: 30 + this.sneezingRate * .8,
            z: 24 - this.sneezingRate * .4,
            ease: Back.easeOut
        });
        TweenMax.to(this.earL.rotation, speed, {
            x: -this.sneezingRate * .1,
            y: -this.sneezingRate * .1,
            ease: Back.easeOut
        });
        TweenMax.to(this.earR.rotation, speed, {
            x: -this.sneezingRate * .1,
            y: this.sneezingRate * .1,
            ease: Back.easeOut
        });
        TweenMax.to(this.wingL.rotation, speed, {
            z: -Math.PI / 4 - this.sneezingRate * .1,
            ease: Back.easeOut
        });
        TweenMax.to(this.wingR.rotation, speed, {
            z: Math.PI / 4 + this.sneezingRate * .1,
            ease: Back.easeOut
        });
        TweenMax.to(this.body.rotation, speed, {
            x: -this.sneezingRate * .05,
            ease: Back.easeOut
        });
        TweenMax.to(this.body.scale, speed, {
            y: 1 + this.sneezingRate * .01,
            ease: Back.easeOut
        });
        TweenMax.to(this.body.position, speed, {
            z: -this.sneezingRate * 2,
            ease: Back.easeOut
        });

        TweenMax.to(this.tail.rotation, speed, {
            x: this.sneezingRate * 0.1,
            ease: Back.easeOut
        });
    }

    sneeze() {

        var sneezeEffect = 1 - (this.sneezingRate / this.maxSneezingRate);
        var speed = .1;
        this.timeFire = Math.round(this.sneezingRate * 10);

        TweenLite.to(this.head.rotation, speed, {
            x: this.sneezingRate * .05,
            ease: Back.easeOut
        });
        TweenLite.to(this.head.position, speed, {
            z: 30 + this.sneezingRate * 2.4,
            y: -this.sneezingRate * .4,
            ease: Back.easeOut
        });

        TweenLite.to(this.mouth.rotation, speed, {
            x: 0,
            ease: Strong.easeOut
        });

        TweenLite.to(this.smile.position, speed * 2, {
            z: 82,
            y: 5,
            ease: Strong.easeIn
        });

        TweenLite.to(this.smile.scale, speed * 2, {
            x: 1,
            y: 1,
            ease: Strong.easeIn
        });

        TweenMax.to(this.noseL.scale, speed, {
            y: .1 + sneezeEffect,
            ease: Strong.easeOut
        });
        TweenMax.to(this.noseR.scale, speed, {
            y: .1 + sneezeEffect,
            ease: Strong.easeOut
        });
        TweenMax.to(this.noseL.position, speed, {
            y: 40, // - (sneezeEffect * 5),
            ease: Strong.easeOut
        });
        TweenMax.to(this.noseR.position, speed, {
            y: 40, // - (sneezeEffect * 5),
            ease: Strong.easeOut
        });
        TweenMax.to(this.irisL.scale, speed, {
            y: .1 + (sneezeEffect / 2),
            z: 1,
            ease: Strong.easeOut
        });
        TweenMax.to(this.irisR.scale, speed, {
            y: .1 + (sneezeEffect / 2),
            z: 1,
            ease: Strong.easeOut
        });
        TweenMax.to(this.eyeL.scale, speed, {
            y: .1 + (sneezeEffect / 2),
            ease: Back.easeOut
        });


        TweenMax.to(this.eyeR.scale, speed, {
            y: .1 + (sneezeEffect / 2),
            ease: Back.easeOut
        });

        TweenMax.to(this.wingL.rotation, speed, {
            z: -Math.PI / 4 + this.sneezingRate * .15,
            ease: Back.easeOut
        });
        TweenMax.to(this.wingR.rotation, speed, {
            z: Math.PI / 4 - this.sneezingRate * .15,
            ease: Back.easeOut
        });

        TweenMax.to(this.body.rotation, speed, {
            x: this.sneezingRate * 0.02,
            ease: Back.easeOut
        });
        TweenMax.to(this.body.scale, speed, {
            y: 1 - this.sneezingRate * .03,
            ease: Back.easeOut
        });
        TweenMax.to(this.body.position, speed, {
            z: this.sneezingRate * 2,
            ease: Back.easeOut
        });

        TweenMax.to(this.irisL.position, speed * 7, {
            y: 35,
            ease: Back.easeOut
        });
        TweenMax.to(this.irisR.position, speed * 7, {
            y: 35,
            ease: Back.easeOut
        });
        TweenMax.to(this.earR.rotation, speed * 3, {
            x: this.sneezingRate * .20,
            y: this.sneezingRate * .20,
            ease: Back.easeOut
        });
        TweenMax.to(this.earL.rotation, speed * 3, {
            x: this.sneezingRate * .20,
            y: -this.sneezingRate * .20,
            ease: Back.easeOut,
            onComplete: () => {
                this.backToNormal();
                this.fireRate = this.sneezingRate;
            }
        });

        TweenMax.to(this.tail.rotation, speed * 3, {
            x: -this.sneezingRate * 0.1,
            ease: Back.easeOut
        });
    }

    backToNormal() {
        var speed = 1;
        TweenLite.to(this.head.rotation, speed, {
            x: 0,
            ease: Strong.easeInOut
        });
        TweenLite.to(this.head.position, speed, {
            z: 30,
            y: 0,
            ease: Back.easeOut
        });
        TweenMax.to(this.noseL.scale, speed, {
            x: 1,
            y: 1,
            ease: Strong.easeInOut
        });
        TweenMax.to(this.noseR.scale, speed, {
            x: 1,
            y: 1,
            ease: Strong.easeInOut
        });
        TweenMax.to(this.noseL.position, speed, {
            y: 40,
            ease: Strong.easeInOut
        });
        TweenMax.to(this.noseR.position, speed, {
            y: 40,
            ease: Strong.easeInOut
        });
        TweenMax.to(this.irisL.scale, speed, {
            y: 1,
            z: 1,
            ease: Back.easeOut
        });
        TweenMax.to(this.irisR.scale, speed, {
            y: 1,
            z: 1,
            ease: Back.easeOut
        });
        TweenMax.to(this.irisL.position, speed * .7, {
            y: 30,
            ease: Back.easeOut
        });
        TweenMax.to(this.irisR.position, speed * .7, {
            y: 30,
            ease: Back.easeOut
        });
        TweenMax.to(this.eyeL.scale, speed, {
            y: 1,
            ease: Strong.easeOut
        });
        TweenMax.to(this.eyeR.scale, speed, {
            y: 1,
            ease: Strong.easeOut
        });
        TweenMax.to(this.body.rotation, speed, {
            x: 0,
            ease: Back.easeOut
        });
        TweenMax.to(this.body.scale, speed, {
            y: 1,
            ease: Back.easeOut
        });
        TweenMax.to(this.body.position, speed, {
            z: 0,
            ease: Back.easeOut
        });

        TweenMax.to(this.wingL.rotation, speed * 1.3, {
            z: -Math.PI / 4,
            ease: Back.easeInOut
        });
        TweenMax.to(this.wingR.rotation, speed * 1.3, {
            z: Math.PI / 4,
            ease: Back.easeInOut
        });

        TweenMax.to(this.earL.rotation, speed * 1.3, {
            x: 0,
            y: 0,
            ease: Back.easeInOut
        });
        TweenMax.to(this.earR.rotation, speed * 1.3, {
            x: 0,
            y: 0,
            ease: Back.easeInOut,
            onComplete: () => {
                this.isSneezing = false;
                this.timeSmoke = Math.round(this.sneezingRate * 5);
                this.sneezingRate = 0;
            }
        });
        TweenMax.to(this.tail.rotation, speed * 1.3, {
            x: 0,
            ease: Back.easeOut
        });
    }

    lookAt(v) {
        this.isSwinging = false;
        TweenMax.killTweensOf(this.head.rotation);

        this.head.lookAt(v);
    }

    idle(){
        this.isSwinging = false;
        TweenMax.killTweensOf(this.head.rotation);

        this.update();
        if (this.isIdeling || Math.random()<.98) return;
        this.isIdeling = true;
        var tx = -200 + Math.random() * 400;
        var ty =  Math.random() * 200;
        var tz = 500;
        var speed = .5 + Math.random()*2;
        TweenMax.to(this.idelingPos, speed, {
            x: tx, y: ty, z:tz, ease: Power4.easeOut, onUpdate: () => {
                this.lookAt(this.idelingPos);
            }, onComplete: () => {
                this.isIdeling = false;
            }
        })
    }

    fix(){
        this.isSwinging = false;
        TweenMax.killTweensOf(this.head.rotation);

        if (this.isFixing) return;
        var tx = 0;
        var ty = 80;
        var tz = 1000;
        TweenMax.to(this.idelingPos, .5, {
            x: tx, y: ty, z:tz, ease: Power4.easeOut, onUpdate: () => {
                this.lookAt(this.idelingPos);
            }, onComplete:()=>{
                this.isFixing = false;
            }
        })
    }

    swing(){
        if (this.isSwinging) return;
        this.isSwinging = true;

        TweenMax.to(this.head.rotation, .5, {
            z : -Math.PI/16, y : Math.PI/16, x:0,
            ease:Power4.easeInOut,
            onComplete: ()=>{
                TweenMax.to(this.head.rotation, 1, {
                    z:Math.PI/16, y:-Math.PI/16, x:0, ease:Back.easeInOut, yoyo:true, repeat:-1
                });
            }
        });
    }

    makeCube(mat, w, h, d, posX, posY, posZ, rotX, rotY, rotZ) {
        var geom = new THREE.BoxGeometry(w, h, d);
        var mesh = new THREE.Mesh(geom, mat);
        mesh.position.x = posX;
        mesh.position.y = posY;
        mesh.position.z = posZ;
        mesh.rotation.x = rotX;
        mesh.rotation.y = rotY;
        mesh.rotation.z = rotZ;
        return mesh;
    }
}

export default DragonCharacter;


// WEBPACK FOOTER //
// ./src/assets/scripts/characters/DragonCharacter.js