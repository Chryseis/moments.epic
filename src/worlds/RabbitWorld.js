import * as THREE from 'three';
import windefs from '../defs/winDef';
import World from '../worlds/World';
import RabbitCharacter from '../characters/RabbitCharacter';
import WolfCharacter from '../characters/WolfCharacter';
import Hedgehog from '../characters/rabbit/Hedgehog';
import Carrot from '../characters/rabbit/Carrot';
import BonusParticles from '../characters/rabbit/BonusParticles';
import Tree from '../characters/rabbit/Tree';
import SCENES from '../defs/scenesDef';

class RabbitWorld extends World {
    constructor(container, renderer, width, height) {
        super(container, renderer, width, height);
        this.name = "rabbit";
        this.controls.enabled = false;
        //to animate

        this.scene.fog = new THREE.Fog(0xd6eae6, 1600, 3500);
        //this.renderer.setClearColor(this.malusClearColor, this.malusClearAlpha);
    }

    defineVariables() {
        this.speed = 6;
        this.delta = 0;
        this.fogNear = 160;
        this.fogFar = 350;
        ;
        this.floorRadius = 200;
        this.distance = 0;
        this.level = 1;
        this.levelInterval;
        this.levelUpdateFreq = 3000;
        this.initSpeed = 5;
        this.maxSpeed = 48;
        this.initMonsterPos = 1.5;
        this.monsterPos = .7;
        this.monsterPosTarget = .70;
        this.floorRotation = 0;
        this.collisionObstacle = 10;
        this.collisionBonus = 20;
        this.gameStatus = "intro";
        this.cameraPosGame = 160;
        this.cameraPosGameOver = 260;
        this.monsterAcceleration = 0.004;
        this.malusClearColor = 0xb44b39;
        this.malusClearAlpha = 0;
        //this.audioController = new AudioController();
        this.PI = Math.PI;
        this.clock = new THREE.Clock();

        this.fieldDistance = document.getElementsByClassName("top-score")[0];
        this.fieldGameOver = document.getElementsByClassName("gameover-instructions")[0];

        this.defineMaterials();
    }

    createLights() {
        this.globalLight = new THREE.AmbientLight(0xffffff, .9);

        this.shadowLight = new THREE.DirectionalLight(0xffffff, 1);
        this.shadowLight.position.set(-30, 400, 200);
        this.shadowLight.castShadow = true;
        this.shadowLight.shadow.camera.left = -400;
        this.shadowLight.shadow.camera.right = 400;
        this.shadowLight.shadow.camera.top = 400;
        this.shadowLight.shadow.camera.bottom = -400;
        this.shadowLight.shadow.camera.near = 1;
        this.shadowLight.shadow.camera.far = 2000;
        this.shadowLight.shadow.mapSize.width = this.shadowLight.shadow.mapSize.height = 2048;

        this.scene.add(this.globalLight);
        this.scene.add(this.shadowLight);

    }

    mouseDown(mousePos) {
        if (this.gameStatus == "play") this.character.jump(this.speed);
        else if (this.gameStatus == "readyToReplay") {
            this.replay();
        }
    }

    createCharacter() {

        this.character = new RabbitCharacter();
        this.character.init();
        this.character.group.position.set(0, 0, 0);
        this.character.group.scale.set(8, 8, 8);
        this.character.group.visible = false;
        this.character.nod();
        this.scene.add(this.character.group);


        this.monster = new WolfCharacter();
        this.monster.init();
        this.monster.group.position.z = 20;
        this.monster.body.rotation.y = Math.PI / 2;
        this.monster.group.visible = false;
        this.scene.add(this.monster.group);
        this.updateMonsterPosition();

        this.carrot = new Carrot();
        this.scene.add(this.carrot.mesh);


        this.obstacle = new Hedgehog();
        this.obstacle.body.rotation.y = -Math.PI / 2;
        this.obstacle.mesh.scale.set(1.1, 1.1, 1.1);
        this.obstacle.mesh.position.y = this.floorRadius + 4;
        this.obstacle.nod();
        this.scene.add(this.obstacle.mesh);

        this.bonusParticles = new BonusParticles();
        this.bonusParticles.mesh.visible = false;
        this.scene.add(this.bonusParticles.mesh);
    }

    createFloor() {
        this.floorShadow = new THREE.Mesh(new THREE.SphereGeometry(this.floorRadius, 50, 50), new THREE.MeshPhongMaterial({
            color: 0x7abf8e,
            specular: 0x000000,
            shininess: 1,
            transparent: true,
            opacity: .5
        }));
        this.floorShadow.receiveShadow = true;

        this.floorGrass = new THREE.Mesh(new THREE.SphereGeometry(this.floorRadius - .5, 50, 50), new THREE.MeshBasicMaterial({
            color: 0x7abf8e
        }));
        this.floorGrass.receiveShadow = false;

        this.floor = new THREE.Group();
        this.floor.position.y = -this.floorRadius * 10;

        this.floor.add(this.floorShadow);
        this.floor.add(this.floorGrass);
        this.scene.add(this.floor);

        this.createFirs();
    }

    updateMonsterPosition() {
        this.monster.run(this.speed, this.delta);
        this.monsterPosTarget -= this.delta * this.monsterAcceleration;
        this.monsterPos += (this.monsterPosTarget - this.monsterPos) * this.delta;
        if (this.monsterPos < .56) {
            this.gameOver();
        }

        var angle = Math.PI * this.monsterPos;
        this.monster.group.position.y = -this.floorRadius + Math.sin(angle) * (this.floorRadius + 12);
        this.monster.group.position.x = Math.cos(angle) * (this.floorRadius + 15);
        this.monster.group.rotation.z = -Math.PI / 2 + angle;
    }

    gameOver() {
        this.initMonsterPos = .56;
        TweenMax.set(this.fieldGameOver, {display: "block"});
        TweenMax.to(this.fieldGameOver, 3, {autoAlpha: 1, ease: Power4.easeOut});

        TweenMax.to(this.camera.position, 1, {
            z: this.cameraPosGameOver, ease: Power4.easeInOut, onUpdate: () => {
                this.camera.lookAt(new THREE.Vector3(0, 30, 0));
            }
        });

        this.gameStatus = "gameOver";
        this.monster.sit(() => {
            this.gameStatus = "readyToReplay";
        });
        this.character.hang();
        this.monster.heroHolder.add(this.character.group);
        TweenMax.to(this, 1, {speed: 0});
        TweenMax.to(this, 1, {speed: 0});
        this.carrot.mesh.visible = false;
        this.obstacle.mesh.visible = false;
        clearInterval(this.levelInterval);
    }

    replay() {
        this.gameStatus = "preparingToReplay"

        TweenMax.to(this.fieldGameOver, .5, {autoAlpha: 0, ease: Power4.easeIn});

        TweenMax.killTweensOf(this.monster.pawFL.position);
        TweenMax.killTweensOf(this.monster.pawFR.position);
        TweenMax.killTweensOf(this.monster.pawBL.position);
        TweenMax.killTweensOf(this.monster.pawBR.position);

        TweenMax.killTweensOf(this.monster.pawFL.rotation);
        TweenMax.killTweensOf(this.monster.pawFR.rotation);
        TweenMax.killTweensOf(this.monster.pawBL.rotation);
        TweenMax.killTweensOf(this.monster.pawBR.rotation);

        TweenMax.killTweensOf(this.monster.tail.rotation);
        TweenMax.killTweensOf(this.monster.head.rotation);
        TweenMax.killTweensOf(this.monster.eyeL.scale);
        TweenMax.killTweensOf(this.monster.eyeR.scale);

        //TweenMax.killTweensOf(hero.head.rotation);

        this.monster.tail.rotation.y = 0;

        TweenMax.to(this.camera.position, 3, {z: this.cameraPosGame, x: 0, y: 30, ease: Power4.easeInOut});
        TweenMax.to(this.monster.torso.rotation, 2, {x: 0, ease: Power4.easeInOut});
        TweenMax.to(this.monster.torso.position, 2, {y: 0, ease: Power4.easeInOut});
        TweenMax.to(this.monster.pawFL.rotation, 2, {x: 0, ease: Power4.easeInOut});
        TweenMax.to(this.monster.pawFR.rotation, 2, {x: 0, ease: Power4.easeInOut});
        TweenMax.to(this.monster.mouth.rotation, 2, {x: .5, ease: Power4.easeInOut});


        TweenMax.to(this.monster.head.rotation, 2, {y: 0, x: -.3, ease: Power4.easeInOut});

        TweenMax.to(this.character.group.position, 2, {x: 20, ease: Power4.easeInOut});
        TweenMax.to(this.character.head.rotation, 2, {x: 0, y: 0, ease: Power4.easeInOut});
        TweenMax.to(this.monster.mouth.rotation, 2, {x: .2, ease: Power4.easeInOut});
        TweenMax.to(this.monster.mouth.rotation, 1, {
            x: .4, ease: Power4.easeIn, delay: 1, onComplete: () => {
                this.resetGame();
            }
        });
    }

    createFirs() {
        var nTrees = 100;
        for (var i = 0; i < nTrees; i++) {
            var phi = i * (Math.PI * 2) / nTrees;
            var theta = Math.PI / 2;
            //theta += .25 + Math.random()*.3;
            theta += (Math.random() > .05) ? .25 + Math.random() * .3 : -.35 - Math.random() * .1;

            var fir = new Tree(this.mats);
            fir.mesh.position.x = Math.sin(theta) * Math.cos(phi) * this.floorRadius;
            fir.mesh.position.y = Math.sin(theta) * Math.sin(phi) * (this.floorRadius - 10);
            fir.mesh.position.z = Math.cos(theta) * this.floorRadius;

            var vec = fir.mesh.position.clone();
            var axis = new THREE.Vector3(0, 1, 0);
            fir.mesh.quaternion.setFromUnitVectors(axis, vec.clone().normalize());
            this.floor.add(fir.mesh);
        }
    }

    updateCarrotPosition() {
        this.carrot.mesh.rotation.y += this.delta * 6;
        this.carrot.mesh.rotation.z = Math.PI / 2 - (this.floorRotation + this.carrot.angle);
        this.carrot.mesh.position.y = -this.floorRadius + Math.sin(this.floorRotation + this.carrot.angle) * (this.floorRadius + 50);
        this.carrot.mesh.position.x = Math.cos(this.floorRotation + this.carrot.angle) * (this.floorRadius + 50);
    }

    updateObstaclePosition() {
        if (this.obstacle.status == "flying") return;

        // TODO fix this,
        if (this.floorRotation + this.obstacle.angle > 2.5) {
            this.obstacle.angle = -this.floorRotation + Math.random() * .3;
            this.obstacle.body.rotation.y = Math.random() * Math.PI * 2;
        }
        this.obstacle.mesh.rotation.z = this.floorRotation + this.obstacle.angle - Math.PI / 2;
        this.obstacle.mesh.position.y = -this.floorRadius + Math.sin(this.floorRotation + this.obstacle.angle) * (this.floorRadius + 3);
        this.obstacle.mesh.position.x = Math.cos(this.floorRotation + this.obstacle.angle) * (this.floorRadius + 3);
    }

    updateFloorRotation() {
        this.floorRotation += this.delta * .03 * this.speed;
        this.floorRotation = this.floorRotation % (Math.PI * 2);
        this.floor.rotation.z = this.floorRotation;
    }

    checkCollision() {
        var db = this.character.group.position.clone().sub(this.carrot.mesh.position.clone());
        var dm = this.character.group.position.clone().sub(this.obstacle.mesh.position.clone());

        if (db.length() < this.collisionBonus) {
            this.getBonus();
        }

        if (dm.length() < this.collisionObstacle && this.obstacle.status != "flying") {
            this.getMalus();
        }
    }

    getBonus() {
        this.bonusParticles.mesh.position.copy(this.carrot.mesh.position);
        this.bonusParticles.mesh.visible = true;
        this.bonusParticles.explose();
        this.carrot.angle += Math.PI / 2;
        //speed*=.95;
        this.monsterPosTarget += .025;

    }

    getMalus() {
        this.obstacle.status = "flying";
        var tx = (Math.random() > .5) ? -20 - Math.random() * 10 : 20 + Math.random() * 5;
        TweenMax.to(this.obstacle.mesh.position, 4, {x: tx, y: Math.random() * 50, z: 350, ease: Power4.easeOut});
        TweenMax.to(this.obstacle.mesh.rotation, 4, {
            x: Math.PI * 3, z: Math.PI * 3, y: Math.PI * 6, ease: Power4.easeOut, onComplete: () => {
                this.obstacle.status = "ready";
                this.obstacle.body.rotation.y = Math.random() * Math.PI * 2;
                this.obstacle.angle = -this.floorRotation - Math.random() * .4;

                this.obstacle.angle = this.obstacle.angle % (Math.PI * 2);
                this.obstacle.mesh.rotation.x = 0;
                this.obstacle.mesh.rotation.y = 0;
                this.obstacle.mesh.rotation.z = 0;
                this.obstacle.mesh.position.z = 0;

            }
        });
        //
        this.monsterPosTarget -= .04;
        TweenMax.from(this, .5, {
            malusClearAlpha: .5, onUpdate: () => {
                this.renderer.setClearColor(this.malusClearColor, this.malusClearAlpha);
            }
        })
    }

    updateDistance() {
        this.distance += this.delta * this.speed;
        var d = this.distance / 2;
        this.fieldDistance.innerHTML = Math.floor(d);
    }

    updateLevel() {
        if (this.speed >= this.maxSpeed) return;
        this.level++;
        this.speed += 2;
    }

    render() {
        if (this.clock) this.delta = this.clock.getDelta();
        this.updateFloorRotation();

        if (this.gameStatus == "outro") {
            this.character.fix();
        }

        if (this.gameStatus == "play" || this.gameStatus == "intro") {

            if (this.character.status == "running") {
                this.character.run(this.delta, this.speed);
            }
            this.updateDistance();
            this.updateMonsterPosition();
            this.updateCarrotPosition();
            this.updateObstaclePosition();
            this.checkCollision();
        }
        super.render();
    }

    resetGame() {
        this.scene.add(this.character.group);
        this.character.group.rotation.y = Math.PI / 2;
        this.character.group.position.y = 0;
        this.character.group.position.z = 0;
        this.character.group.position.x = 0;
        this.monsterPos = this.initMonsterPos;
        this.monsterPosTarget = .65;
        this.speed = this.initSpeed;
        this.level = 0;
        this.distance = 0;
        this.carrot.mesh.visible = true;
        this.obstacle.mesh.visible = true;
        this.gameStatus = "play";
        this.character.status = "running";
        this.character.nod();
        //this.audioController.play(this.audioController.rabbitFile);
        this.updateLevel();
        this.levelInterval = setInterval(this.updateLevel.bind(this), this.levelUpdateFreq);
    }

    defineMaterials() {
        this.blackMat = new THREE.MeshPhongMaterial({
            color: 0x100707,
            shading: THREE.FlatShading,
        });

        this.brownMat = new THREE.MeshPhongMaterial({
            color: 0xb44b39,
            shininess: 0,
            shading: THREE.FlatShading,
        });

        this.greenMat = new THREE.MeshPhongMaterial({
            color: 0x7abf8e,
            shininess: 0,
            shading: THREE.FlatShading,
        });

        this.pinkMat = new THREE.MeshPhongMaterial({
            color: 0xdc5f45,//0xb43b29,//0xff5b49,
            shininess: 0,
            shading: THREE.FlatShading,
        });

        this.lightBrownMat = new THREE.MeshPhongMaterial({
            color: 0xe07a57,
            shading: THREE.FlatShading,
        });

        this.whiteMat = new THREE.MeshPhongMaterial({
            color: 0xa49789,
            shading: THREE.FlatShading,
        });

        this.skinMat = new THREE.MeshPhongMaterial({
            color: 0xff9ea5,
            shading: THREE.FlatShading
        });

        this.mats = [this.blackMat, this.brownMat, this.pinkMat, this.whiteMat, this.greenMat, this.lightBrownMat, this.pinkMat];
    }

    show(direction, callback) {

        this.initMonsterPos = 1.5;

        this.character.group.visible = true;

        this.tlShow = new TimelineMax({
            onComplete: () => {
                this.resetGame();
                this.monster.group.visible = true;
            }
        });

        this.tlShow.add("start");
        this.tlShow.set(this.fieldDistance, {display: "block"});
        this.tlShow.to(this.fieldDistance, 2, {autoAlpha: 1}, "start");


        if (direction == "none") {
            //if (typeof callback === "function") callback();
        } else if (direction == "right") {
            this.character.group.position.x = 3000;
        } else {
            this.character.group.position.x = -3000;
        }
        this.tlShow.to(this.character.group.position, 2, {x: 0, y: 0, ease: Power4.easeOut}, "start");

        this.tlShow.to(this.character.group.rotation, 1, {y: Math.PI / 2, ease: Power4.easeOut}, "start+=.5");
        this.tlShow.to(this.character.group.scale, 2, {x: 1, y: 1, z: 1, ease: Power4.easeOut}, "start");

        this.tlShow.to(this.camera.position, 2, {
            x: 0, y: 30, z: this.cameraPosGame, ease: Power4.easeOut, onUpdate: () => {
                this.camera.lookAt(new THREE.Vector3(0, 30, 0));
            }
        }, "start");

        this.tlShow.to(this.scene.fog, 1, {near: this.fogNear, far: this.fogFar, ease: Power4.easeOut}, "start+=.5");
        this.tlShow.to(this.floor.position, 1, {y: -this.floorRadius, ease: Power4.easeOut}, "start+=.5");

    }

    hide(direction, callback) {
        this.gameStatus = "outro";
        this.monster.group.visible = false;
        this.obstacle.mesh.visible = false;
        this.carrot.mesh.visible = false;
        this.bonusParticles.mesh.visible = false;

        this.tlHide = new TimelineMax({onComplete: callback});
        this.tlHide.add("start");

        this.tlHide.to(this.shadowLight.position, 2, {
            x: SCENES.shadowLightX,
            y: SCENES.shadowLightY,
            z: SCENES.shadowLightZ,
            intensity: SCENES.shadowLightIntensity
        }),

            this.tlHide.to(this.fieldDistance, 1, {
                autoAlpha: 0, onComplete: () => {
                    TweenMax.set(this.fieldDistance, {display: "none"});
                }
            }, "start");

        this.tlHide.to(this.fieldGameOver, 1, {
            autoAlpha: 0, onComplete: () => {
                TweenMax.set(this.fieldGameOver, {display: "none"});
            }
        }, "start");

        this.tlHide.to(this.character.group.rotation, 2, {y: 0, ease: Power4.easeOut}, "start");
        this.tlHide.to(this.character.group.scale, 2, {x: 8, y: 8, z: 8, ease: Power4.easeOut}, "start");

        if (direction == "none") {
            this.tlHide.to(this.character.group.position, 2, {x: 0, y: 0, ease: Power4.easeIn}, "start");
        } else if (direction == "right") {
            this.tlHide.to(this.character.group.position, 2, {x: 3000, y: 0, ease: Power4.easeIn}, "start");
        } else {
            this.tlHide.to(this.character.group.position, 2, {x: -3000, y: 0, ease: Power4.easeIn}, "start");
        }


        this.tlHide.to(this.camera.position, 2, {
            z: SCENES.camZ, y: SCENES.camY, ease: Power4.easeOut, onUpdate: () => {
                this.camera.lookAt(new THREE.Vector3(0, 30, 0));
            }
        }, "start");

        this.tlHide.to(this.scene.fog, 2, {
            near: this.fogNear * 10,
            far: this.fogFar * 10,
            ease: Power4.easeOut
        }, "start");
        this.tlHide.to(this.floor.position, 2, {y: -this.floorRadius * 10, ease: Power4.easeOut}, "start");
    }

}

export default RabbitWorld;


// WEBPACK FOOTER //
// ./src/assets/scripts/worlds/RabbitWorld.js