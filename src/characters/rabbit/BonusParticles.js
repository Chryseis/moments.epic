import * as THREE from 'three';

class BonusParticles {
    constructor() {

        var greenMat = new THREE.MeshPhongMaterial({
            color: 0x7abf8e,
            shininess: 0,
            shading: THREE.FlatShading
        });

        var pinkMat = new THREE.MeshPhongMaterial({
            color: 0xdc5f45,
            shininess: 0,
            shading: THREE.FlatShading
        });

        this.mesh = new THREE.Group();
        var bigParticleGeom = new THREE.CubeGeometry(10, 10, 10, 1);
        var smallParticleGeom = new THREE.CubeGeometry(5, 5, 5, 1);
        this.parts = [];
        for (var i = 0; i < 10; i++) {
            var partPink = new THREE.Mesh(bigParticleGeom, pinkMat);
            var partGreen = new THREE.Mesh(smallParticleGeom, greenMat);
            partGreen.scale.set(.5, .5, .5);
            this.parts.push(partPink);
            this.parts.push(partGreen);
            this.mesh.add(partPink);
            this.mesh.add(partGreen);
        }
    }

    explose() {
        var explosionSpeed = .5;
        for (var i = 0; i < this.parts.length; i++) {
            var tx = -50 + Math.random() * 100;
            var ty = -50 + Math.random() * 100;
            var tz = -50 + Math.random() * 100;
            var p = this.parts[i];
            p.position.set(0, 0, 0);
            p.scale.set(1, 1, 1);
            p.visible = true;
            var s = explosionSpeed + Math.random() * .5;
            TweenMax.to(p.position, s, { x: tx, y: ty, z: tz, ease: Power4.easeOut });
            TweenMax.to(p.scale, s, { x: .01, y: .01, z: .01, ease: Power4.easeOut, onComplete: this.removeParticle.bind(this), onCompleteParams: [p] });
        }
    }

    removeParticle(p) {
        p.visible = false;
    }
}

export default BonusParticles;


// WEBPACK FOOTER //
// ./src/assets/scripts/characters/rabbit/BonusParticles.js