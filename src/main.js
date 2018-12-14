import './vendor/modernizr';
import './vendor/detectizr';
import 'gsap';
import CSSRulePlugin from 'gsap/CSSRulePlugin';
import windefs from './defs/winDef';
import Moh from './Moh';
import NavigationUi from './ui/NavigationUi';
import './common'

var moh;
var disclaimer;
var navUI;

if (Modernizr.mobile) {
    showPage();
} else {
    document.addEventListener("DOMContentLoaded", domIsReady);
}

function showPage() {
    document.documentElement.classList.remove('not-ready');
}

function domIsReady() {
    showPage();
    moh = new Moh();
    var targetWorld = location.hash.substring(1);
    window.addEventListener('resize', handleWindowResize, false);
    document.addEventListener("mousemove", handleMouseMove, false);
    document.addEventListener("mousedown", handleMouseDown, false);
    document.addEventListener("mouseup", handleMouseUp, false);
    window.addEventListener('mousewheel', handleMouseWheel, false);
    document.addEventListener('keyup', handleKeyUp, false);

    disclaimer = document.getElementsByClassName("size-disclaimer")[0];
    navUI = new NavigationUi();
    handleWindowResize();
    moh.switchWorld(targetWorld);
    moh.loop();
}

function handleWindowResize() {
    windefs.winHeight = window.innerHeight;
    windefs.winWidth = window.innerWidth;
    if (windefs.winWidth < 600) {
        windefs.allowExperience = false;
        showDisclaimer();
    }else{
        windefs.allowExperience = true;
        hideDisclaimer();
        moh.updateSize();
    }
}

function showDisclaimer(){
    TweenMax.set(disclaimer, {visibility:"visible"});
    navUI.updateColor(0xAA6D80);
}

function hideDisclaimer(){
    TweenMax.set(disclaimer, {visibility:"hidden"});
}

function handleMouseMove(e) {
    windefs.mousePos.x = e.clientX;
    windefs.mousePos.y = e.clientY;
    windefs.mousePos.px = windefs.mousePos.x / windefs.winWidth * 2 - 1;
    windefs.mousePos.py = windefs.mousePos.y / windefs.winHeight * 2 - 1;
    windefs.mousePos.cx = windefs.mousePos.x - windefs.winWidth / 2;
    windefs.mousePos.cy = windefs.mousePos.y - windefs.winHeight / 2;
    moh.mouseMove(windefs.mousePos);
}

function handleMouseDown(e) {
    moh.mouseDown(windefs.mousePos);
}
function handleMouseUp(e) {
    moh.mouseUp(windefs.mousePos);
}

function handleMouseWheel(e) {
    moh.mouseWheel(e.wheelDeltaY);
}

function handleKeyUp(e) {
    moh.keyUp(e.keyCode);
}

console.info('Ready main 🚀');



// WEBPACK FOOTER //
// ./src/assets/scripts/main.js