import * as THREE from 'three';

class SmokeParticle {
    constructor(pool) {
        this.pool = pool;
        this.color = {
            r: 0,
            g: 0,
            b: 0
        };
        var particleMat = new THREE.MeshPhongMaterial({
            transparent: true,
            opacity: .5,
            shading: THREE.FlatShading
        });
        this.mesh = this.makeCube(particleMat, 4, 4, 4, 0, 0, 0, 0, 0, 0);
        this.pool.push(this);
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

    initialize() {
        this.mesh.rotation.x = 0;
        this.mesh.rotation.y = 0;
        this.mesh.rotation.z = 0;

        this.mesh.position.x = 0;
        this.mesh.position.y = 0;
        this.mesh.position.z = 0;

        this.mesh.scale.x = 1;
        this.mesh.scale.y = 1;
        this.mesh.scale.z = 1;

        this.mesh.material.opacity = .5;
        this.pool.push(this);
    }

    updateColor() {
        this.mesh.material.color.setRGB(this.color.r, this.color.g, this.color.b);
    }

    fly() {
        var speed = 10;
        var ease = Strong.easeOut;
        var initX = this.mesh.position.x;
        var initY = this.mesh.position.y;
        var initZ = this.mesh.position.z;
        var bezier = {
            type: "cubic",
            values: [{
                x: initX,
                y: initY,
                z: initZ
            }, {
                x: initX + 30 - Math.random() * 10,
                y: initY + 20 + Math.random() * 2,
                z: initZ + 20
            }, {
                x: initX + 10 + Math.random() * 20,
                y: initY + 40 + Math.random() * 5,
                z: initZ - 30
            }, {
                x: initX + 50 - Math.random() * 20,
                y: initY + 70 + Math.random() * 10,
                z: initZ + 20
            }]
        };
        TweenMax.to(this.mesh.position, speed, {
            bezier: bezier,
            ease: ease
        });
        TweenMax.to(this.mesh.rotation, speed, {
            x: Math.random() * Math.PI * 3,
            y: Math.random() * Math.PI * 3,
            ease: ease
        });
        TweenMax.to(this.mesh.scale, speed, {
            x: 5 + Math.random() * 5,
            y: 5 + Math.random() * 5,
            z: 5 + Math.random() * 5,
            ease: ease
        });

        TweenMax.to(this.mesh.material, speed, {
            opacity: 0,
            ease: ease,
            onComplete: this.initialize.bind(this)
        });
    }

    fire(f, maxSneezingRate) {
        var speed = 1;
        var ease = Strong.easeOut;
        var initX = this.mesh.position.x;
        var initY = this.mesh.position.y;
        var initZ = this.mesh.position.z;

        TweenMax.to(this.mesh.position, speed, {
            x: 0,
            y: initY - 2 * f,
            z: Math.max(initZ + 15 * f, initZ + 40),
            ease: ease
        });
        TweenMax.to(this.mesh.rotation, speed, {
            x: Math.random() * Math.PI * 3,
            y: Math.random() * Math.PI * 3,
            ease: ease
        });

        var bezierScale = [{
            x: 1,
            y: 1,
            z: 1
        }, {
            x: f / maxSneezingRate + Math.random() * .3,
            y: f / maxSneezingRate + Math.random() * .3,
            z: f * 2 / maxSneezingRate + Math.random() * .3
        }, {
            x: f / maxSneezingRate + Math.random() * .5,
            y: f / maxSneezingRate + Math.random() * .5,
            z: f * 2 / maxSneezingRate + Math.random() * .5
        }, {
            x: f * 2 / maxSneezingRate + Math.random() * .5,
            y: f * 2 / maxSneezingRate + Math.random() * .5,
            z: f * 4 / maxSneezingRate + Math.random() * .5
        }, {
            x: f * 2 + Math.random() * 5,
            y: f * 2 + Math.random() * 5,
            z: f * 2 + Math.random() * 5
        }];

        TweenMax.to(this.mesh.scale, speed * 2, {
            bezier: bezierScale,
            ease: ease,
            onComplete: this.initialize.bind(this)
        });

        TweenMax.to(this.mesh.material, speed, {
            opacity: 0,
            ease: ease
        });

        var bezierColor = [{
            r: 255 / 255,
            g: 205 / 255,
            b: 74 / 255
        }, {
            r: 255 / 255,
            g: 205 / 255,
            b: 74 / 255
        }, {
            r: 255 / 255,
            g: 205 / 255,
            b: 74 / 255
        }, {
            r: 247 / 255,
            g: 34 / 255,
            b: 50 / 255
        }, {
            r: 0 / 255,
            g: 0 / 255,
            b: 0 / 255
        }];


        TweenMax.to(this.color, speed, {
            bezier: bezierColor,
            ease: Strong.easeOut,
            onUpdate: this.updateColor.bind(this)
        });

    }
}

export default SmokeParticle;


// WEBPACK FOOTER //
// ./src/assets/scripts/characters/dragon/SmokeParticle.js