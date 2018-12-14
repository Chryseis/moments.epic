import * as THREE from 'three';
import SCENES from '../defs/scenesDef';
import AudioController from '../AudioController';
import Character from '../characters/Charater';

const OrbitControls = require('three-orbitcontrols');

class World {
    constructor(container, renderer, width, height) {
        this.scene = new THREE.Scene();
        this.width = width;
        this.height = height;
        this.aspectRatio = width / height;
        this.container = container;
        var fieldOfView = 50;
        var nearPlane = 1;
        var farPlane = 20000;
        this.camera = new THREE.PerspectiveCamera(fieldOfView, this.aspectRatio, nearPlane, farPlane);
        this.camera.position.x = SCENES.camX;
        this.camera.position.z = SCENES.camZ;
        this.camera.position.y = SCENES.camY;
        this.vectorLookAt = new THREE.Vector3(0, 0, 0);
        this.camera.lookAt(this.vectorLookAt);

        this.renderer = renderer;

        this.container.appendChild(this.renderer.domElement);
        this.isHiding = false;
        this.isExperiment = true;
        this.audioController = new AudioController();

        //*
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        //*/
        this.defineVariables();
        this.createLights();
        this.createFloor();
        this.createCharacter();
        this.render();
    }

    defineVariables() {
    };

    createLights() {
        this.globalLight = new THREE.HemisphereLight(0xffffff, 0x555555, 1);


        this.shadowLight = new THREE.DirectionalLight(0xffffff, .4);
        this.shadowLight.position.set(200, 500, 150);
        this.shadowLight.castShadow = true;
        this.shadowLight.shadow.camera.left = -4000;
        this.shadowLight.shadow.camera.right = 4000;
        this.shadowLight.shadow.camera.top = 4000;
        this.shadowLight.shadow.camera.bottom = -4000;
        this.shadowLight.shadow.camera.near = 1;
        this.shadowLight.shadow.camera.far = 4000;
        this.shadowLight.shadow.mapSize.width = this.shadowLight.shadow.mapSize.height = 2048;

        this.scene.add(this.globalLight);
        this.scene.add(this.shadowLight);
    }

    createFloor() {
        var floorMat = new THREE.ShadowMaterial();
        floorMat.opacity = 0.1;
        this.floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(4000, 4000), floorMat);
        this.floor.name = "floor";
        this.floor.rotation.x = -Math.PI / 2;
        this.floor.receiveShadow = true;
        //this.floor.opacity = 0.2;
        this.scene.add(this.floor);
    }

    createCharacter() {
        this.character = new Character();
        this.scene.add(this.character.group);
    }

    render() {
        if (this.controls.enabled) this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    updateSize(w, h) {
        this.renderer.setSize(w, h);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    }

    mouseMove(mousePos) {
    }

    mouseDown(mousePos) {
    }

    mouseUp(mousePos) {
    }

    mouseWheel(deltaY) {
    }

    hide(direction, callback) {
        this.isHiding = true;
        if (typeof callback === "function") {
            callback();
        }
    }

    show(direction, callback) {
        if (typeof callback === "function") {
            callback();
        }
    }

    destroy() {
        if (this.controls) {
            // this.controls.destroy();
            this.controls.dispose();
            delete this.controls;
        }

        if (this.camera) this.camera = null;
        if (this.container) this.container = null;
        if (this.scene) {

            while (this.scene.children.length > 0) {
                var o = this.scene.children[0];
                this.scene.remove(o);
                if (o.geometry) o.geometry.dispose();
                if (o.material) o.material.dispose();
                o = null;
            }
            this.scene = null;
        }
    }
};

export default World;


// WEBPACK FOOTER //
// ./src/assets/scripts/worlds/World.js