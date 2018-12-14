import * as THREE from 'three';
import ShaderLoader from '../vendor/ShaderLoader';
import FBO from '../vendor/fbo';

const Deferred = require('../utils/deferred');
const WebFont = require('webfontloader');

let wordsInstance = null;
let textCreated = false;

class WordsParticles{

    constructor(renderer){
        if(wordsInstance){
            return wordsInstance;
        }
        this.bgr1 = document.getElementsByClassName("bgr1")[0];
        this.bgr2 = document.getElementsByClassName("bgr2")[0];
        this.bgrBack = this.bgr1;
        this.bgrFront = this.bgr2;
        this.renderer = renderer;
        this.index = this.oldIndex = 0;
        this.color = this.oldColor = 0x000000;
        this.timer = 0;
        this.isVisible = false;
        wordsInstance = this;
    }

    get fontReady() {
        const dfd = new Deferred();

        try {
            WebFont.load({
                custom: {
                    families: ['YesevaOne'],
                },
                loading: function () { },
                active: function () {
                    dfd.resolve();
                },
                inactive: function () {
                    dfd.resolve();
                },
            });
        } catch (e) {
            dfd.resolve();
        }

        return dfd.promise;
    }

    init(callback) {
        if (textCreated) {
            callback();
            return;
        }

        this.callback = callback;
        // var myFont = new FontFace('Yeseva', 'url(/assets/fonts/YesevaOne-Regular.ttf)');
        // myFont.load().then(() => {
        this.fontReady.then(() => {
            this.createTexts();
    });
    }

    createTexts() {
        this.texts = ["Chilliness", "Petting", "Relief", "Paranoia", "Hope", "Truth"];
        this.timer = 0;
        this.particlesColumns = 2048;
        this.particlesRows = 190;
        this.particlesCount = this.particlesColumns * this.particlesRows;
        // this.titleCanvas = document.getElementById("mycanvas");
        this.titleCanvas = document.createElement('canvas');

        this.ctx = this.titleCanvas.getContext("2d");
        this.ctx.scale(2, 2);
        this.titleCanvas.width = this.particlesColumns;
        this.titleCanvas.height = this.particlesColumns;

        this.ctx.textAlign = "center";
        this.ctx.font = "240px 'Yeseva'";
        var posY = 0;

        for (var i = 0, l = this.texts.length; i < l; i++) {
            posY += 180;
            var t = this.texts[i].toUpperCase();
            t = t.split("").join("");
            this.ctx.fillText(t, this.titleCanvas.width / 2, posY);
            posY += 10;
        }

        this.tex = new THREE.CanvasTexture(this.titleCanvas);
        var sl = new ShaderLoader();
        sl.loadShaders({
            simulation_vs: "",
            simulation_fs: "",
            render_vs: "",
            render_fs: ""
        }, "./glsl/titlePoints/", this.createPoints.bind(this));

        textCreated = true;
    }

    createPoints() {
        this.simulationShader = new THREE.ShaderMaterial({
            uniforms: {
                timer: { type: "f", value: this.timer },
                currentPosition: { type: "f", value: 0 },
                newPosition: { type: "f", value: 0 },
                texture: { type: "t", value: this.tex },
                texSize: { type: "f", value: this.particlesColumns },
                texStep: { type: "f", value: this.particlesRows },
                depth: { type: "f", value: 300 },
                scale: { type: "f", value: 7000 },
                animRatio: { type: "f", value: 0 },
                hideRatio: { type: "f", value:2}
            },
            vertexShader: ShaderLoader.get("simulation_vs"),
            fragmentShader: ShaderLoader.get("simulation_fs"),
            transparent: true,
            //blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });

        this.renderShader = new THREE.ShaderMaterial({
            uniforms: {
                positions: { type: "t", value: null },
                currentCol: { type: "v3", value: new THREE.Vector3(1, 1, 1) },
                newCol: { type: "v3", value: new THREE.Vector3(1, 1, 1) },
                pointSize: { type: "f", value: 1 },
                animRatio: { type: "f", value: 0 },
            },
            vertexShader: ShaderLoader.get("render_vs"),
            fragmentShader: ShaderLoader.get("render_fs"),
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });

        //*
        FBO.init(this.particlesColumns, this.particlesRows, this.renderer, this.simulationShader, this.renderShader);
        this.particles = FBO.particles;
        this.particles.position.z = -4000;
        this.particles.position.y = 200;

        this.callback();

    }

    updateText(indx, color){

        this.index = indx;
        this.color = color;
        // texture swap
        this.simulationShader.uniforms.currentPosition.value = this.oldIndex;
        this.simulationShader.uniforms.newPosition.value = this.index;

        // color particles
        this.renderShader.uniforms.animRatio.value = 0;
        this.renderShader.uniforms.currentCol.value = new THREE.Color(this.oldColor);
        this.renderShader.uniforms.newCol.value = new THREE.Color(this.color);
        TweenMax.to(this.renderShader.uniforms.animRatio, .5, { value: 2, ease: Linear.easeNone });

        // position particles
        this.simulationShader.uniforms.animRatio.value = 0;
        TweenMax.to(this.simulationShader.uniforms.animRatio, 1.5, { value: 2, ease: Linear.easeNone });

        this.oldIndex = indx;
        this.oldColor = color;

        this.show();

    }

    hide(callback){
        this.isVisible = false;
        TweenMax.to(this.simulationShader.uniforms.hideRatio, 1, {
            value: 2,
            ease: Linear.easeNone,
            onComplete:callback
        });
    }

    show(){
        if (this.isVisible) return;
        this.isVisible = true;
        this.simulationShader.uniforms.hideRatio.value = 2;
        TweenMax.to(this.simulationShader.uniforms.hideRatio, 2, { value: 0, ease: Linear.easeNone });
    }

    updateRender(){
        this.timer++;
        this.simulationShader.uniforms.timer.value = this.timer;
        FBO.update();
    }
}

export default WordsParticles;


// WEBPACK FOOTER //
// ./src/assets/scripts/worlds/WordsParticles.js