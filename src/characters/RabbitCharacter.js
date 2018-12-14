import * as THREE from 'three';
import Character from './Charater';

class RabbitCharacter extends Character {
    constructor() {
        super();
        this.maxSpeed = 48;
        this.idelingPos = {x: 0, y: 0, eLx: 0, eRx: 0};
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

        this.status = "running";
        this.runningCycle = 0;
        this.group = new THREE.Group();
        this.group.name = "rabbit";
        this.body = new THREE.Group();
        this.group.add(this.body);

        var torsoGeom = new THREE.CubeGeometry(7, 7, 10, 1);

        this.torso = new THREE.Mesh(torsoGeom, brownMat);
        this.torso.position.z = 0;
        this.torso.position.y = 7;
        this.torso.castShadow = true;
        this.body.add(this.torso);

        var pantsGeom = new THREE.CubeGeometry(9, 9, 5, 1);
        this.pants = new THREE.Mesh(pantsGeom, whiteMat);
        this.pants.position.z = -3;
        this.pants.position.y = 0;
        this.pants.castShadow = true;
        this.torso.add(this.pants);

        var tailGeom = new THREE.CubeGeometry(3, 3, 3, 1);
        tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -2));
        this.tail = new THREE.Mesh(tailGeom, lightBrownMat);
        this.tail.position.z = -4;
        this.tail.position.y = 5;
        this.tail.castShadow = true;
        this.torso.add(this.tail);

        this.torso.rotation.x = -Math.PI / 8;

        var headGeom = new THREE.CubeGeometry(10, 10, 13, 1);

        headGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 7.5));
        this.head = new THREE.Mesh(headGeom, brownMat);
        this.head.position.z = 2;
        this.head.position.y = 11;
        this.head.castShadow = true;
        this.body.add(this.head);

        var cheekGeom = new THREE.CubeGeometry(1, 4, 4, 1);
        this.cheekR = new THREE.Mesh(cheekGeom, pinkMat);
        this.cheekR.position.x = -5;
        this.cheekR.position.z = 7;
        this.cheekR.position.y = -2.5;
        this.cheekR.castShadow = true;
        this.head.add(this.cheekR);

        this.cheekL = this.cheekR.clone();
        this.cheekL.position.x = -this.cheekR.position.x;
        this.head.add(this.cheekL);

        var noseGeom = new THREE.CubeGeometry(6, 6, 3, 1);
        this.nose = new THREE.Mesh(noseGeom, lightBrownMat);
        this.nose.position.z = 13.5;
        this.nose.position.y = 2.6;
        this.nose.castShadow = true;
        this.head.add(this.nose);

        var mouthGeom = new THREE.CubeGeometry(4, 2, 4, 1);
        mouthGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 3));
        mouthGeom.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 12));
        this.mouth = new THREE.Mesh(mouthGeom, brownMat);
        this.mouth.position.z = 8;
        this.mouth.position.y = -4;
        this.mouth.castShadow = true;
        this.head.add(this.mouth);

        var pawFGeom = new THREE.CubeGeometry(3, 3, 3, 1);
        this.pawFR = new THREE.Mesh(pawFGeom, lightBrownMat);
        this.pawFR.position.x = -2;
        this.pawFR.position.z = 6;
        this.pawFR.position.y = 1.5;
        this.pawFR.castShadow = true;
        this.body.add(this.pawFR);

        this.pawFL = this.pawFR.clone();
        this.pawFL.position.x = -this.pawFR.position.x;
        this.pawFL.castShadow = true;
        this.body.add(this.pawFL);

        var pawBGeom = new THREE.CubeGeometry(3, 3, 6, 1);
        this.pawBL = new THREE.Mesh(pawBGeom, lightBrownMat);
        this.pawBL.position.y = 1.5;
        this.pawBL.position.z = 0;
        this.pawBL.position.x = 5;
        this.pawBL.castShadow = true;
        this.body.add(this.pawBL);

        this.pawBR = this.pawBL.clone();
        this.pawBR.position.x = -this.pawBL.position.x;
        this.pawBR.castShadow = true;
        this.body.add(this.pawBR);

        var earGeom = new THREE.CubeGeometry(7, 18, 2, 1);
        earGeom.vertices[6].x += 2;
        earGeom.vertices[6].z += .5;

        earGeom.vertices[7].x += 2;
        earGeom.vertices[7].z -= .5;

        earGeom.vertices[2].x -= 2;
        earGeom.vertices[2].z -= .5;

        earGeom.vertices[3].x -= 2;
        earGeom.vertices[3].z += .5;
        earGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 9, 0));

        this.earL = new THREE.Mesh(earGeom, brownMat);
        this.earL.position.x = 2;
        this.earL.position.z = 2.5;
        this.earL.position.y = 5;
        this.earL.rotation.z = -Math.PI / 12;
        this.earL.castShadow = true;
        this.head.add(this.earL);

        this.earR = this.earL.clone();
        this.earR.position.x = -this.earL.position.x;
        this.earR.rotation.z = -this.earL.rotation.z;
        this.earR.castShadow = true;
        this.head.add(this.earR);

        var eyeGeom = new THREE.CubeGeometry(2, 4, 4);

        this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
        this.eyeL.position.x = 5;
        this.eyeL.position.z = 5.5;
        this.eyeL.position.y = 2.9;
        this.eyeL.castShadow = true;
        this.head.add(this.eyeL);

        var irisGeom = new THREE.CubeGeometry(.6, 2, 2);

        this.iris = new THREE.Mesh(irisGeom, blackMat);
        this.iris.position.x = 1.2;
        this.iris.position.y = 1;
        this.iris.position.z = 1;
        this.eyeL.add(this.iris);

        this.eyeR = this.eyeL.clone();
        this.eyeR.children[0].position.x = -this.iris.position.x;

        this.eyeR.position.x = -this.eyeL.position.x;
        this.head.add(this.eyeR);
    }

    fix() {

        this.isSwinging = false;

        TweenMax.killTweensOf(this.eyeL.scale);
        TweenMax.killTweensOf(this.eyeR.scale);
        TweenMax.killTweensOf(this.head.position);
        TweenMax.killTweensOf(this.head.rotation);
        TweenMax.killTweensOf(this.torso.rotation);
        TweenMax.killTweensOf(this.torso.position);
        TweenMax.killTweensOf(this.pants.position);
        TweenMax.killTweensOf(this.pants.rotation);
        TweenMax.killTweensOf(this.tail.position);
        TweenMax.killTweensOf(this.tail.rotation);
        TweenMax.killTweensOf(this.cheekR.rotation);
        TweenMax.killTweensOf(this.cheekR.position);
        TweenMax.killTweensOf(this.cheekL.position);
        TweenMax.killTweensOf(this.cheekL.rotation);
        TweenMax.killTweensOf(this.mouth.rotation);
        TweenMax.killTweensOf(this.mouth.position);
        TweenMax.killTweensOf(this.pawFR.position);
        TweenMax.killTweensOf(this.pawFR.rotation);
        TweenMax.killTweensOf(this.pawFL.position);
        TweenMax.killTweensOf(this.pawFL.rotation);
        TweenMax.killTweensOf(this.pawBR.position);
        TweenMax.killTweensOf(this.pawBR.rotation);
        TweenMax.killTweensOf(this.pawBL.position);
        TweenMax.killTweensOf(this.pawBL.rotation);
        TweenMax.killTweensOf(this.earL.rotation);
        TweenMax.killTweensOf(this.earL.position);
        TweenMax.killTweensOf(this.earR.rotation);
        TweenMax.killTweensOf(this.earR.position);
        TweenMax.killTweensOf(this.iris.rotation);
        TweenMax.killTweensOf(this.iris.position);
        TweenMax.killTweensOf(this.eyeR.children[0].position);
        TweenMax.killTweensOf(this.eyeR.children[0].rotation);
        TweenMax.killTweensOf(this.idelingPos);

        this.status = "sitting";

        this.body.position.y = 0;
        this.body.rotation.x = 0;

        this.torso.position.z = 0;
        this.torso.position.y = 7;
        this.torso.rotation.x = 0;

        this.pants.position.z = -3;
        this.pants.position.y = 0;
        this.tail.position.z = -4;
        this.tail.position.y = 5;

        this.head.position.z += (2 - this.head.position.z) / 2;
        this.head.position.y += (11 - this.head.position.y) / 2;
        this.head.rotation.x += (0 - this.head.rotation.x) / 2;
        this.head.rotation.y += (0 - this.head.rotation.y) / 2;

        this.cheekR.position.x = -5;
        this.cheekR.position.z = 7;
        this.cheekR.position.y = -2.5;
        this.cheekL.position.x = -this.cheekR.position.x;
        this.nose.position.z = 13.5;
        this.nose.position.y = 2.6;

        this.mouth.position.z = 8;
        this.mouth.position.y = -4;
        this.mouth.rotation.x = 0;

        this.pawFR.rotation.x += ( 0 - this.pawFR.rotation.x ) / 2;
        this.pawFR.position.x += ( -2 - this.pawFR.position.x ) / 2;
        this.pawFR.position.z += ( 6 - this.pawFR.position.z ) / 2;
        this.pawFR.position.y += ( 1.5 - this.pawFR.position.y ) / 2;

        this.pawFL.position.x += (2 - this.pawFL.position.x) / 2;
        this.pawFL.rotation.x += (0 - this.pawFL.rotation.x) / 2;
        this.pawFL.position.z += (6 - this.pawFL.position.z) / 2;
        this.pawFL.position.y += (1.5 - this.pawFL.position.y) / 2;

        this.pawBL.position.y += ( 1.5 - this.pawBL.position.y ) / 2;
        this.pawBL.position.z += ( 0 - this.pawBL.position.z ) / 2;
        this.pawBL.position.x += ( 5 - this.pawBL.position.x ) / 2;
        this.pawBL.rotation.x += ( 0 - this.pawBL.rotation.x ) / 2;

        this.pawBR.position.x += ( -5 - this.pawBR.position.x ) / 2;
        this.pawBR.position.y += ( 1.5 - this.pawBR.position.y ) / 2;
        this.pawBR.rotation.x += ( 0 - this.pawBR.rotation.x ) / 2;
        this.pawBR.position.z += ( 0 - this.pawBR.position.z ) / 2;

        this.eyeR.scale.y = this.eyeL.scale.y = 1;

        this.earL.position.x += ( 2 - this.earL.position.x) / 2;
        this.earL.position.z += ( 2.5 - this.earL.position.z) / 2;
        this.earL.position.y += ( 5 - this.earL.position.y) / 2;
        this.earL.rotation.z += ( -Math.PI / 12 - this.earL.rotation.z) / 2;
        this.earL.rotation.x += ( 0 - this.earL.rotation.x) / 2;

        this.earR.position.x += ( -2 - this.earR.position.x) / 2;
        this.earR.rotation.z += ( Math.PI / 12 - this.earR.rotation.z) / 2;
        this.earR.rotation.x += ( 0 - this.earR.rotation.x) / 2;

        this.eyeL.position.x = 5;
        this.eyeL.position.z = 5.5;
        this.eyeL.position.y = 2.9;
        this.iris.position.x = 1.2;
        this.iris.position.y = 1;
        this.iris.position.z = 1;
        this.eyeR.children[0].position.x = -this.iris.position.x;
        this.eyeR.position.x = -this.eyeL.position.x;
    }

    run(delta, speed) {
        this.status = "running";

        var s = Math.min(speed, this.maxSpeed);

        this.runningCycle += delta * s * .7;
        this.runningCycle = this.runningCycle % (Math.PI * 2);
        var t = this.runningCycle;

        var amp = 4;
        var disp = .2;

        // BODY

        this.body.position.y = 6 + Math.sin(t - Math.PI / 2) * amp;
        this.body.rotation.x = .2 + Math.sin(t - Math.PI / 2) * amp * .1;

        this.torso.rotation.x = Math.sin(t - Math.PI / 2) * amp * .1;
        this.torso.position.y = 7 + Math.sin(t - Math.PI / 2) * amp * .5;

        // MOUTH
        this.mouth.rotation.x = Math.PI / 16 + Math.cos(t) * amp * .05;

        // HEAD
        this.head.position.z = 2 + Math.sin(t - Math.PI / 2) * amp * .5;
        this.head.position.y = 8 + Math.cos(t - Math.PI / 2) * amp * .7;
        this.head.rotation.x = -.2 + Math.sin(t + Math.PI) * amp * .1;

        // EARS
        this.earL.rotation.x = Math.cos(-Math.PI / 2 + t) * (amp * .2);
        this.earR.rotation.x = Math.cos(-Math.PI / 2 + .2 + t) * (amp * .3);

        // EYES
        this.eyeR.scale.y = this.eyeL.scale.y = .7 + Math.abs(Math.cos(-Math.PI / 4 + t * .5)) * .6;

        // TAIL
        this.tail.rotation.x = Math.cos(Math.PI / 2 + t) * amp * .3;

        // FRONT RIGHT PAW
        this.pawFR.position.y = 1.5 + Math.sin(t) * amp;
        this.pawFR.rotation.x = Math.cos(t) * Math.PI / 4;


        this.pawFR.position.z = 6 - Math.cos(t) * amp * 2;

        // FRONT LEFT PAW

        this.pawFL.position.y = 1.5 + Math.sin(disp + t) * amp;
        this.pawFL.rotation.x = Math.cos(t) * Math.PI / 4;


        this.pawFL.position.z = 6 - Math.cos(disp + t) * amp * 2;

        // BACK RIGHT PAW
        this.pawBR.position.y = 1.5 + Math.sin(Math.PI + t) * amp;
        this.pawBR.rotation.x = Math.cos(t + Math.PI * 1.5) * Math.PI / 3;


        this.pawBR.position.z = -Math.cos(Math.PI + t) * amp;

        // BACK LEFT PAW
        this.pawBL.position.y = 1.5 + Math.sin(Math.PI + t) * amp;
        this.pawBL.rotation.x = Math.cos(t + Math.PI * 1.5) * Math.PI / 3;


        this.pawBL.position.z = -Math.cos(Math.PI + t) * amp;
    }

    jump(speed) {
        if (this.status == "jumping") return;
        this.status = "jumping";
        var totalSpeed = 10 / speed;
        var jumpHeight = 45;

        TweenMax.to(this.earL.rotation, totalSpeed, {x: "+=.3", ease: Back.easeOut});
        TweenMax.to(this.earR.rotation, totalSpeed, {x: "-=.3", ease: Back.easeOut});

        TweenMax.to(this.pawFL.rotation, totalSpeed, {x: "+=.7", ease: Back.easeOut});
        TweenMax.to(this.pawFR.rotation, totalSpeed, {x: "-=.7", ease: Back.easeOut});
        TweenMax.to(this.pawBL.rotation, totalSpeed, {x: "+=.7", ease: Back.easeOut});
        TweenMax.to(this.pawBR.rotation, totalSpeed, {x: "-=.7", ease: Back.easeOut});

        TweenMax.to(this.tail.rotation, totalSpeed, {x: "+=1", ease: Back.easeOut});

        TweenMax.to(this.mouth.rotation, totalSpeed, {x: .5, ease: Back.easeOut});

        TweenMax.to(this.group.position, totalSpeed / 2, {y: jumpHeight, ease: Power2.easeOut});
        TweenMax.to(this.group.position, totalSpeed / 2, {
            y: 0, ease: Power4.easeIn, delay: totalSpeed / 2, onComplete: () => {
                this.status = "running";
            }
        });
    }

    nod() {
        var sp = .5 + Math.random();

        // HEAD
        var tHeadRotY = -Math.PI / 6 + Math.random() * Math.PI / 3;
        TweenMax.to(this.head.rotation, sp, {
            y: tHeadRotY, ease: Power4.easeInOut, onComplete: () => {
                this.nod()
            }
        });

        // EARS
        var tEarLRotX = Math.PI / 4 + Math.random() * Math.PI / 6;
        var tEarRRotX = Math.PI / 4 + Math.random() * Math.PI / 6;

        TweenMax.to(this.earL.rotation, sp, {x: tEarLRotX, ease: Power4.easeInOut});
        TweenMax.to(this.earR.rotation, sp, {x: tEarRRotX, ease: Power4.easeInOut});


        // PAWS BACK LEFT

        var tPawBLRot = Math.random() * Math.PI / 2;
        var tPawBLY = -4 + Math.random() * 8;

        TweenMax.to(this.pawBL.rotation, sp / 2, {x: tPawBLRot, ease: Power1.easeInOut, yoyo: true, repeat: 2});
        TweenMax.to(this.pawBL.position, sp / 2, {y: tPawBLY, ease: Power1.easeInOut, yoyo: true, repeat: 2});


        // PAWS BACK RIGHT

        var tPawBRRot = Math.random() * Math.PI / 2;
        var tPawBRY = -4 + Math.random() * 8;
        TweenMax.to(this.pawBR.rotation, sp / 2, {x: tPawBRRot, ease: Power1.easeInOut, yoyo: true, repeat: 2});
        TweenMax.to(this.pawBR.position, sp / 2, {y: tPawBRY, ease: Power1.easeInOut, yoyo: true, repeat: 2});

        // PAWS FRONT LEFT

        var tPawFLRot = Math.random() * Math.PI / 2;
        var tPawFLY = -4 + Math.random() * 8;

        TweenMax.to(this.pawFL.rotation, sp / 2, {x: tPawFLRot, ease: Power1.easeInOut, yoyo: true, repeat: 2});

        TweenMax.to(this.pawFL.position, sp / 2, {y: tPawFLY, ease: Power1.easeInOut, yoyo: true, repeat: 2});

        // PAWS FRONT RIGHT

        var tPawFRRot = Math.random() * Math.PI / 2;
        var tPawFRY = -4 + Math.random() * 8;

        TweenMax.to(this.pawFR.rotation, sp / 2, {x: tPawFRRot, ease: Power1.easeInOut, yoyo: true, repeat: 2});

        TweenMax.to(this.pawFR.position, sp / 2, {y: tPawFRY, ease: Power1.easeInOut, yoyo: true, repeat: 2});

        // MOUTH
        var tMouthRot = Math.random() * Math.PI / 8;
        TweenMax.to(this.mouth.rotation, sp, {x: tMouthRot, ease: Power1.easeInOut});
        // IRIS
        var tIrisY = -1 + Math.random() * 2;
        var tIrisZ = -1 + Math.random() * 2;
        var iris1 = this.iris;
        var iris2 = this.eyeR.children[0];
        TweenMax.to([iris1.position, iris2.position], sp, {y: tIrisY, z: tIrisZ, ease: Power1.easeInOut});

        //EYES
        if (Math.random() > .2) TweenMax.to([this.eyeR.scale, this.eyeL.scale], sp / 8, {
            y: 0,
            ease: Power1.easeInOut,
            yoyo: true,
            repeat: 1
        });
    }

    hang() {
        var sp = 1;
        var ease = Power4.easeOut;

        TweenMax.killTweensOf(this.eyeL.scale);
        TweenMax.killTweensOf(this.eyeR.scale);

        this.body.rotation.x = 0;
        this.torso.rotation.x = 0;
        this.body.position.y = 0;
        this.torso.position.y = 7;

        TweenMax.to(this.group.rotation, sp, {y: 0, ease: ease});
        TweenMax.to(this.group.position, sp, {y: -7, z: 6, ease: ease});
        TweenMax.to(this.head.rotation, sp, {
            x: Math.PI / 6, ease: ease, onComplete: () => {
                this.nod();
            }
        });

        TweenMax.to(this.earL.rotation, sp, {x: Math.PI / 3, ease: ease});
        TweenMax.to(this.earR.rotation, sp, {x: Math.PI / 3, ease: ease});

        TweenMax.to(this.pawFL.position, sp, {y: -1, z: 3, ease: ease});
        TweenMax.to(this.pawFR.position, sp, {y: -1, z: 3, ease: ease});
        TweenMax.to(this.pawBL.position, sp, {y: -2, z: -3, ease: ease});
        TweenMax.to(this.pawBR.position, sp, {y: -2, z: -3, ease: ease});

        TweenMax.to(this.eyeL.scale, sp, {y: 1, ease: ease});
        TweenMax.to(this.eyeR.scale, sp, {y: 1, ease: ease});
    }

    look(xTarget, yTarget, xEarLTarget, xEarRTarget) {

        this.isSwinging = false;
        TweenMax.killTweensOf(this.head.rotation);

        this.head.rotation.x = xTarget;
        this.head.rotation.y = yTarget;
        this.earL.rotation.x = xEarLTarget;
        this.earL.rotation.y = xEarRTarget;

        this.earR.rotation.x = -.2 + xTarget * .5;
        this.earR.rotation.y = -.1 + yTarget * .4;
    }

    idle() {

        this.isSwinging = false;
        TweenMax.killTweensOf(this.head.rotation);

        if (this.isIdeling || Math.random() < .99) return;
        this.isIdeling = true;
        var tx = -Math.PI / 6 + Math.random() * Math.PI / 3;
        var ty = -Math.PI / 6 + Math.random() * Math.PI / 3;
        var tEarLx = -Math.PI / 6 + Math.random() * Math.PI / 3;
        var tEarRx = -Math.PI / 6 + Math.random() * Math.PI / 3;

        var speed = .5 + Math.random() * 2;
        TweenMax.to(this.idelingPos, speed, {
            x: tx, y: ty, eRx: tEarLx, eLx: tEarRx, ease: Power4.easeInOut, onUpdate: () => {
                this.look(this.idelingPos.x, this.idelingPos.y, this.idelingPos.eLx, this.idelingPos.eRx);
            }, onComplete: () => {
                this.isIdeling = false;
            }
        })

    }

    swing() {
        if (this.isSwinging) return;
        this.isSwinging = true;


        TweenMax.to(this.head.rotation, .5, {
            z: -Math.PI / 16, y: Math.PI / 16, x: 0,
            ease: Power4.easeInOut,
            onComplete: () => {
                TweenMax.to(this.head.rotation, 1, {
                    z: Math.PI / 16, y: -Math.PI / 16, x: 0, ease: Back.easeInOut, yoyo: true, repeat: -1
                });
            }
        });
    }

}

export default RabbitCharacter;


// WEBPACK FOOTER //
// ./src/assets/scripts/characters/RabbitCharacter.js