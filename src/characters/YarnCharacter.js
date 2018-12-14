import * as THREE from 'three';
import Character from './Charater';
import WoolVert from './cat/WooVert';

class YarnCharacter extends Character {
    constructor() {
        super();
        this.woolNodes = 10;
        this.gravity = -.8,
            this.accuracy = 1;
        this.woolSegLength = 2;
    }

    createGeometry() {

        var redMat = new THREE.MeshPhongMaterial({
            color: 0x630d15,
            shading: THREE.FlatShading
        });

        var stringMat = new THREE.LineBasicMaterial({
            color: 0x630d15,
            linewidth: 3
        });

        this.group = new THREE.Group();
        this.ballRay = 8;

        this.verts = [];

        // string
        var stringGeom = new THREE.Geometry();

        for (var i = 0; i < this.woolNodes; i++) {
            var v = new THREE.Vector3(0, -i * this.woolSegLength, 0);
            stringGeom.vertices.push(v);

            var woolV = new WoolVert();
            woolV.x = woolV.oldx = v.x;
            woolV.y = woolV.oldy = v.y;
            woolV.z = 0;
            woolV.fx = woolV.fy = 0;
            woolV.isRootNode = (i == 0);
            woolV.vertex = v;
            if (i > 0) woolV.attach(this.verts[(i - 1)], this.woolSegLength);
            this.verts.push(woolV);

        }
        this.string = new THREE.Line(stringGeom, stringMat);

        // body
        var bodyGeom = new THREE.SphereGeometry(this.ballRay, 5, 4);
        this.body = new THREE.Mesh(bodyGeom, redMat);
        this.body.position.y = -this.woolSegLength * this.woolNodes;

        var wireGeom = new THREE.TorusGeometry(this.ballRay, .5, 3, 10, Math.PI * 2);
        this.wire1 = new THREE.Mesh(wireGeom, redMat);
        this.wire1.position.x = 1;
        this.wire1.rotation.x = -Math.PI / 4;

        this.wire2 = this.wire1.clone();
        this.wire2.position.y = 1;
        this.wire2.position.x = -1;
        this.wire1.rotation.x = -Math.PI / 4 + .5;
        this.wire1.rotation.y = -Math.PI / 6;

        this.wire3 = this.wire1.clone();
        this.wire3.rotation.x = -Math.PI / 2 + .3;

        this.wire4 = this.wire1.clone();
        this.wire4.position.x = -1;
        this.wire4.rotation.x = -Math.PI / 2 + .7;

        this.wire5 = this.wire1.clone();
        this.wire5.position.x = 2;
        this.wire5.rotation.x = -Math.PI / 2 + 1;

        this.wire6 = this.wire1.clone();
        this.wire6.position.x = 2;
        this.wire6.position.z = 1;
        this.wire6.rotation.x = 1;

        this.wire7 = this.wire1.clone();
        this.wire7.position.x = 1.5;
        this.wire7.rotation.x = 1.1;

        this.wire8 = this.wire1.clone();
        this.wire8.position.x = 1;
        this.wire8.rotation.x = 1.3;

        this.wire9 = this.wire1.clone();
        this.wire9.scale.set(1.2, 1.1, 1.1);
        this.wire9.rotation.z = Math.PI / 2;
        this.wire9.rotation.y = Math.PI / 2;
        this.wire9.position.y = 1;

        this.body.add(this.wire1);
        this.body.add(this.wire2);
        this.body.add(this.wire3);
        this.body.add(this.wire4);
        this.body.add(this.wire5);
        this.body.add(this.wire6);
        this.body.add(this.wire7);
        this.body.add(this.wire8);
        this.body.add(this.wire9);

        this.group.add(this.string);
        this.group.add(this.body);
    }

    update(posX, posY, posZ) {
        var i = this.accuracy;

        while (i--) {

            var nodesCount = this.woolNodes;

            while (nodesCount--) {

                var v = this.verts[nodesCount];

                if (v.isRootNode) {
                    v.x = posX;
                    v.y = posY;
                    v.z = posZ;
                }

                else {

                    var constraintsCount = v.constraints.length;

                    while (constraintsCount--) {

                        var c = v.constraints[constraintsCount];

                        var diff_x = c.p1.x - c.p2.x,
                            diff_y = c.p1.y - c.p2.y,
                            dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y),
                            diff = (c.length - dist) / dist;

                        var px = diff_x * diff * .5;
                        var py = diff_y * diff * .5;

                        c.p1.x += px;
                        c.p1.y += py;
                        c.p2.x -= px;
                        c.p2.y -= py;
                        c.p1.z = c.p2.z = posZ;
                    }

                    if (nodesCount == this.woolNodes - 1) {
                        this.body.position.x = this.verts[nodesCount].x;
                        this.body.position.y = this.verts[nodesCount].y;
                        this.body.position.z = this.verts[nodesCount].z;

                        this.body.rotation.z += (v.y <= this.ballRay) ? (v.oldx - v.x) / 10 : Math.min(Math.max(diff_x / 2, -.1), .1);
                    }
                }

                if (v.y < this.ballRay) {
                    v.y = this.ballRay;
                }
            }

            nodesCount = this.woolNodes;
            while (nodesCount--) this.verts[nodesCount].update(this.gravity);

            this.string.geometry.verticesNeedUpdate = true;
        }
    }

    receivePower(tp) {
        this.verts[this.woolNodes - 1].add_force(tp.x, tp.y);
    }
}

export default YarnCharacter;


// WEBPACK FOOTER //
// ./src/assets/scripts/characters/YarnCharacter.js