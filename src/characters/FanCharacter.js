import * as THREE from 'three';
import Character from './Charater';
import { rule3, clamp, hexToRgb } from '../utils/utils';

class FanCharacter extends Character {
    constructor() {
        super();
        this.isBlowing = false;
        this.speed = 0;
        this.acc = 0;
        this.targetSpeed = 0;
    }

    createGeometry() {
        this.redMat = new THREE.MeshPhongMaterial({
            color: 0xad3525,
            shading: THREE.FlatShading
        });
        this.greyMat = new THREE.MeshPhongMaterial({
            color: 0x653f4c,
            shading: THREE.FlatShading
        });

        this.yellowMat = new THREE.MeshPhongMaterial({
            color: 0xfdd276,
            shading: THREE.FlatShading
        });

        var coreGeom = new THREE.BoxGeometry(10, 10, 20);
        var sphereGeom = new THREE.BoxGeometry(10, 10, 3);
        var propGeom = new THREE.BoxGeometry(10, 30, 2);
        propGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 25, 0));

        this.core = new THREE.Mesh(coreGeom, this.greyMat);

        // propellers
        var prop1 = new THREE.Mesh(propGeom, this.redMat);
        prop1.position.z = 15;
        var prop2 = prop1.clone();
        prop2.rotation.z = Math.PI / 2;
        var prop3 = prop1.clone();
        prop3.rotation.z = Math.PI;
        var prop4 = prop1.clone();
        prop4.rotation.z = -Math.PI / 2;

        this.sphere = new THREE.Mesh(sphereGeom, this.yellowMat);
        this.sphere.position.z = 15;

        this.propeller = new THREE.Group();
        this.propeller.add(prop1);
        this.propeller.add(prop2);
        this.propeller.add(prop3);
        this.propeller.add(prop4);

        this.group = new THREE.Group();
        this.group.name = "fan";
        this.group.add(this.core);
        this.group.add(this.propeller);
        this.group.add(this.sphere);
    }

    update(xTarget, yTarget){
        this.group.lookAt(new THREE.Vector3(0,80,60));
        this.tPosX = rule3(xTarget, -200, 200, -250, 250);
        this.tPosY = rule3(yTarget, -200, 200, 350, -150);

        this.group.position.x += (this.tPosX - this.group.position.x) /10;
        this.group.position.y += (this.tPosY - this.group.position.y) /10;

        //this.targetSpeed = (this.isBlowing) ? .3 : .01;
        if (this.isBlowing && this.speed < .4){
            this.acc +=.001;
            this.speed += this.acc;
        }else if (!this.isBlowing){
            this.acc = 0;
            this.speed *= .98;
        }
        this.propeller.rotation.z += this.speed;
    }
}

export default FanCharacter;


// WEBPACK FOOTER //
// ./src/assets/scripts/characters/FanCharacter.js