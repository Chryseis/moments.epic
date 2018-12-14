import * as THREE from 'three';

class Carrot {
    constructor() {
        this.angle = 0;
        this.mesh = new THREE.Group();

        var bodyGeom = new THREE.CylinderGeometry(5, 3, 10, 4, 1);
        bodyGeom.vertices[8].y += 2;
        bodyGeom.vertices[9].y -= 3;

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

        this.body = new THREE.Mesh(bodyGeom, pinkMat);

        var leafGeom = new THREE.CubeGeometry(5, 10, 1, 1);
        leafGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 5, 0));
        leafGeom.vertices[2].x -= 1;
        leafGeom.vertices[3].x -= 1;
        leafGeom.vertices[6].x += 1;
        leafGeom.vertices[7].x += 1;

        this.leaf1 = new THREE.Mesh(leafGeom, greenMat);
        this.leaf1.position.y = 7;
        this.leaf1.rotation.z = .3;
        this.leaf1.rotation.x = .2;

        this.leaf2 = this.leaf1.clone();
        this.leaf2.scale.set(1, 1.3, 1);
        this.leaf2.position.y = 7;
        this.leaf2.rotation.z = -.3;
        this.leaf2.rotation.x = -.2;

        this.mesh.add(this.body);
        this.mesh.add(this.leaf1);
        this.mesh.add(this.leaf2);

        this.body.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
    }
}
export default Carrot;


// WEBPACK FOOTER //
// ./src/assets/scripts/characters/rabbit/Carrot.js