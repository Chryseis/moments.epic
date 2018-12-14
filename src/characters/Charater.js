import * as THREE from 'three';
class Character {
    constructor() {
        this.group = new THREE.Group();
        this.isCollidable = true;
        this.isIdeling = false;
        this.isSwinging = false;
    }

    init() {
        this.createGeometry();
        this.createCollider();
        this.applyShadow();
    }
    createGeometry() {
        var mat = new THREE.MeshLambertMaterial({
            color: 0x100707
        });

        var geom = new THREE.CylinderGeometry(10, 10, 20, 4);
        var mat = new THREE.MeshPhongMaterial({ color: 0x302010 });
        this.body = new THREE.Mesh(geom, mat);
        this.group.add(this.body);
    }
    applyShadow() {
        this.group.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
    }
    createCollider() {
        if (!this.isCollidable) return;
        var box = new THREE.Box3().setFromObject(this.group);
        box.w = box.max.x - box.min.x + 2;
        box.d = box.max.z - box.min.z + 2;
        box.h = box.max.y - box.min.y + 2;

        box.x = box.min.x + box.w / 2;
        box.y = box.min.y + box.h / 2;
        box.z = box.min.z + box.d / 2;

        var colliderGeom = new THREE.CubeGeometry(box.w, box.h, box.d, 1);
        var colliderMat = new THREE.MeshBasicMaterial({ color: 0x302010, visible: false });
        this.collider = new THREE.Mesh(colliderGeom, colliderMat);
        this.collider.position.set(box.x, box.y, box.z);
        this.group.add(this.collider);
    }
    idle(){};
    fix(){};
    swing(){
        this.idle();
    };
}

export default Character;


// WEBPACK FOOTER //
// ./src/assets/scripts/characters/Character.js