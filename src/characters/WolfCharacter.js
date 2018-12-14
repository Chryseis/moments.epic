import * as THREE from 'three';
import Character from './Charater';

class WolfCharacter extends Character {

    constructor() {
        super();
        this.maxSpeed = 48;
    }

    createGeometry() {

        var blackMat = new THREE.MeshPhongMaterial({
            color: 0x100707,
            shading: THREE.FlatShading
        });

        var brownMat = new THREE.MeshPhongMaterial({
            color: 0xb44b39,
            shininess: 0,
            shading: THREE.FlatShading
        });

        var greenMat = new THREE.MeshPhongMaterial({
            color: 0x7abf8e,
            shininess: 0,
            shading: THREE.FlatShading
        });

        var pinkMat = new THREE.MeshPhongMaterial({
            color: 0xdc5f45, //0xb43b29,//0xff5b49,
            shininess: 0,
            shading: THREE.FlatShading
        });

        var lightBrownMat = new THREE.MeshPhongMaterial({
            color: 0xe07a57,
            shading: THREE.FlatShading
        });

        var whiteMat = new THREE.MeshPhongMaterial({
            color: 0xa49789,
            shading: THREE.FlatShading
        });
        var skinMat = new THREE.MeshPhongMaterial({
            color: 0xff9ea5,
            shading: THREE.FlatShading
        });

        this.runningCycle = 0;

        this.group = new THREE.Group();
        this.group.name = "wolf";
        this.body = new THREE.Group();

        var torsoGeom = new THREE.CubeGeometry(15, 15, 20, 1);
        this.torso = new THREE.Mesh(torsoGeom, blackMat);

        var headGeom = new THREE.CubeGeometry(20, 20, 40, 1);
        headGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 20));
        this.head = new THREE.Mesh(headGeom, blackMat);
        this.head.position.z = 12;
        this.head.position.y = 2;

        var mouthGeom = new THREE.CubeGeometry(10, 4, 20, 1);
        mouthGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, -2, 10));
        this.mouth = new THREE.Mesh(mouthGeom, blackMat);
        this.mouth.position.y = -8;
        this.mouth.rotation.x = .4;
        this.mouth.position.z = 4;

        this.heroHolder = new THREE.Group();
        this.heroHolder.position.z = 20;
        this.mouth.add(this.heroHolder);

        var toothGeom = new THREE.CubeGeometry(2, 2, 1, 1);

        toothGeom.vertices[1].x -= 1;
        toothGeom.vertices[4].x += 1;
        toothGeom.vertices[5].x += 1;
        toothGeom.vertices[0].x -= 1;

        for (var i = 0; i < 3; i++) {
            var toothf = new THREE.Mesh(toothGeom, whiteMat);
            toothf.position.x = -2.8 + i * 2.5;
            toothf.position.y = 1;
            toothf.position.z = 19;

            var toothl = new THREE.Mesh(toothGeom, whiteMat);
            toothl.rotation.y = Math.PI / 2;
            toothl.position.z = 12 + i * 2.5;
            toothl.position.y = 1;
            toothl.position.x = 4;

            var toothr = toothl.clone();
            toothl.position.x = -4;

            this.mouth.add(toothf);
            this.mouth.add(toothl);
            this.mouth.add(toothr);
        }

        var tongueGeometry = new THREE.CubeGeometry(6, 1, 14);
        tongueGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 7));

        this.tongue = new THREE.Mesh(tongueGeometry, pinkMat);
        this.tongue.position.z = 2;
        this.tongue.rotation.x = -.2;
        this.mouth.add(this.tongue);

        var noseGeom = new THREE.CubeGeometry(4, 4, 4, 1);
        this.nose = new THREE.Mesh(noseGeom, pinkMat);
        this.nose.position.z = 39.5;
        this.nose.position.y = 9;
        this.head.add(this.nose);

        this.head.add(this.mouth);

        var eyeGeom = new THREE.CubeGeometry(2, 3, 3);

        this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
        this.eyeL.position.x = 10;
        this.eyeL.position.z = 5;
        this.eyeL.position.y = 5;
        this.eyeL.castShadow = true;
        this.head.add(this.eyeL);

        var irisGeom = new THREE.CubeGeometry(.6, 1, 1);

        this.iris = new THREE.Mesh(irisGeom, blackMat);
        this.iris.position.x = 1.2;
        this.iris.position.y = -1;
        this.iris.position.z = 1;
        this.eyeL.add(this.iris);

        this.eyeR = this.eyeL.clone();
        this.eyeR.children[0].position.x = -this.iris.position.x;
        this.eyeR.position.x = -this.eyeL.position.x;
        this.head.add(this.eyeR);

        var earGeom = new THREE.CubeGeometry(8, 6, 2, 1);
        earGeom.vertices[1].x -= 4;
        earGeom.vertices[4].x += 4;
        earGeom.vertices[5].x += 4;
        earGeom.vertices[5].z -= 2;
        earGeom.vertices[0].x -= 4;
        earGeom.vertices[0].z -= 2;

        earGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 3, 0));

        this.earL = new THREE.Mesh(earGeom, blackMat);
        this.earL.position.x = 6;
        this.earL.position.z = 1;
        this.earL.position.y = 10;
        this.earL.castShadow = true;
        this.head.add(this.earL);

        this.earR = this.earL.clone();
        this.earR.position.x = -this.earL.position.x;
        this.earR.rotation.z = -this.earL.rotation.z;
        this.head.add(this.earR);

        var eyeGeom = new THREE.CubeGeometry(2, 4, 4);

        var tailGeom = new THREE.CylinderGeometry(5, 2, 20, 4, 1);
        tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 10, 0));
        tailGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        tailGeom.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / 4));

        this.tail = new THREE.Mesh(tailGeom, blackMat);
        this.tail.position.z = -10;
        this.tail.position.y = 4;
        this.torso.add(this.tail);

        var pawGeom = new THREE.CylinderGeometry(1.5, 0, 10);
        pawGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, -5, 0));
        this.pawFL = new THREE.Mesh(pawGeom, blackMat);
        this.pawFL.position.y = -7.5;
        this.pawFL.position.z = 8.5;
        this.pawFL.position.x = 5.5;
        this.torso.add(this.pawFL);

        this.pawFR = this.pawFL.clone();
        this.pawFR.position.x = -this.pawFL.position.x;
        this.torso.add(this.pawFR);

        this.pawBR = this.pawFR.clone();
        this.pawBR.position.z = -this.pawFL.position.z;
        this.torso.add(this.pawBR);

        this.pawBL = this.pawBR.clone();
        this.pawBL.position.x = this.pawFL.position.x;
        this.torso.add(this.pawBL);

        this.group.add(this.body);
        this.torso.add(this.head);
        this.body.add(this.torso);

        this.torso.castShadow = true;
        this.head.castShadow = true;
        this.pawFL.castShadow = true;
        this.pawFR.castShadow = true;
        this.pawBL.castShadow = true;
        this.pawBR.castShadow = true;

        //this.body.rotation.y = Math.PI / 2;
    }

    run(speed, delta) {
        var s = Math.min(speed, this.maxSpeed);
        this.runningCycle += delta * s * .7;
        this.runningCycle = this.runningCycle % (Math.PI * 2);
        var t = this.runningCycle;

        this.pawFR.rotation.x = Math.sin(t) * Math.PI / 4;
        this.pawFR.position.y = -5.5 - Math.sin(t);
        this.pawFR.position.z = 7.5 + Math.cos(t);

        this.pawFL.rotation.x = Math.sin(t + .4) * Math.PI / 4;
        this.pawFL.position.y = -5.5 - Math.sin(t + .4);
        this.pawFL.position.z = 7.5 + Math.cos(t + .4);

        this.pawBL.rotation.x = Math.sin(t + 2) * Math.PI / 4;
        this.pawBL.position.y = -5.5 - Math.sin(t + 3.8);
        this.pawBL.position.z = -7.5 + Math.cos(t + 3.8);

        this.pawBR.rotation.x = Math.sin(t + 2.4) * Math.PI / 4;
        this.pawBR.position.y = -5.5 - Math.sin(t + 3.4);
        this.pawBR.position.z = -7.5 + Math.cos(t + 3.4);

        this.torso.rotation.x = Math.sin(t) * Math.PI / 8;
        this.torso.position.y = 3 - Math.sin(t + Math.PI / 2) * 3;

        //this.head.position.y = 5-Math.sin(t+Math.PI/2)*2;
        this.head.rotation.x = -.1 + Math.sin(-t - 1) * .4;
        this.mouth.rotation.x = .2 + Math.sin(t + Math.PI + .3) * .4;

        this.tail.rotation.x = .2 + Math.sin(t - Math.PI / 2);

        this.eyeR.scale.y = .5 + Math.sin(t + Math.PI) * .5;
    }

    nod() {
        var sp = 1 + Math.random() * 2;

        // HEAD
        var tHeadRotY = -Math.PI / 3 + Math.random() * .5;
        var tHeadRotX = Math.PI / 3 - .2 + Math.random() * .4;
        TweenMax.to(this.head.rotation, sp, { x: tHeadRotX, y: tHeadRotY, ease: Power4.easeInOut, onComplete: () => { this.nod() } });

        // TAIL
        var tTailRotY = -Math.PI / 4;
        TweenMax.to(this.tail.rotation, sp / 8, { y: tTailRotY, ease: Power1.easeInOut, yoyo: true, repeat: 8 });

        // EYES
        TweenMax.to([this.eyeR.scale, this.eyeL.scale], sp / 20, { y: 0, ease: Power1.easeInOut, yoyo: true, repeat: 1 });
    }

    sit(callback) {
        var sp = 1.2;
        var ease = Power4.easeOut;
        TweenMax.to(this.torso.rotation, sp, { x: -1.3, ease: ease });
        TweenMax.to(this.torso.position, sp, {
            y: -5, ease: ease, onComplete: () => {
                this.nod();
                if (typeof callback === "function") callback();
            }
        });

        TweenMax.to(this.head.rotation, sp, { x: Math.PI / 3, y: -Math.PI / 3, ease: ease });
        TweenMax.to(this.tail.rotation, sp, { x: 2, y: Math.PI / 4, ease: ease });
        TweenMax.to(this.pawBL.rotation, sp, { x: -.1, ease: ease });
        TweenMax.to(this.pawBR.rotation, sp, { x: -.1, ease: ease });
        TweenMax.to(this.pawFL.rotation, sp, { x: 1, ease: ease });
        TweenMax.to(this.pawFR.rotation, sp, { x: 1, ease: ease });
        TweenMax.to(this.mouth.rotation, sp, { x: .3, ease: ease });
        TweenMax.to(this.eyeL.scale, sp, { y: 1, ease: ease });
        TweenMax.to(this.eyeR.scale, sp, { y: 1, ease: ease });

        //TweenMax.to(this.body.rotation, sp, {y:Math.PI/4});
    }
}

export default WolfCharacter;


// WEBPACK FOOTER //
// ./src/assets/scripts/characters/WolfCharacter.js