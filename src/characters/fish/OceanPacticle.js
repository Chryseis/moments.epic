import * as THREE from 'three';

class OceanParticle {
    constructor(col) {
        this.col = col;
        this.create();
    }

    create() {
        var rnd = Math.random();
        var geometryCore, ray, w, h, d, sh, sv;

        if (rnd < .33) {
            w = 10 + Math.random() * 30;
            h = 10 + Math.random() * 30;
            d = 10 + Math.random() * 30;
            geometryCore = new THREE.BoxGeometry(w, h, d);
        }

        else if (rnd < .66) {
            ray = 10 + Math.random() * 20;
            geometryCore = new THREE.TetrahedronGeometry(ray);
        }

        else {
            ray = 5 + Math.random() * 30;
            sh = 2 + Math.floor(Math.random() * 2);
            sv = 2 + Math.floor(Math.random() * 2);
            geometryCore = new THREE.SphereGeometry(ray, sh, sv);
        }

        var materialCore = new THREE.MeshPhongMaterial({
            color: this.col,
            shading: THREE.FlatShading
        });

        this.mesh = new THREE.Mesh(geometryCore, materialCore);
    }
}

export default OceanParticle;


// WEBPACK FOOTER //
// ./src/assets/scripts/characters/fish/OceanParticle.js