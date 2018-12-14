import * as THREE from 'three';
import Trunc from './Trunc';

class Tree {
    constructor(materials) {
        this.materials = materials;
        this.mesh = new THREE.Object3D();
        this.trunc = new Trunc(this.materials);
        this.mesh.add(this.trunc.mesh);
    }
}
export default Tree;


// WEBPACK FOOTER //
// ./src/assets/scripts/characters/rabbit/Tree.js