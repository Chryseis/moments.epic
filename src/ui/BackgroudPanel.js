import winDef from '../defs/winDef';
import {TweenMax, Power4} from 'gsap'

let backgroundPanelInstance = null;

class BackgroundPanel{

    constructor(){
        if(backgroundPanelInstance){
            return backgroundPanelInstance;
        }
        this.bgr1 = document.getElementsByClassName("bgr1")[0];
        this.bgr2 = document.getElementsByClassName("bgr2")[0];
        this.bgrBack = this.bgr1;
        this.bgrFront = this.bgr2;

        backgroundPanelInstance = this;
    }

    update(color, direction, callback){

        TweenMax.set(this.bgrFront, { backgroundColor: color });
        if (direction == "right") {
            TweenMax.set(this.bgrFront, { x: winDef.winWidth });
        } else {
            TweenMax.set(this.bgrFront, { x: 0 });
        }

        TweenMax.to(this.bgrFront, 1, {
            x: 0, width: "100%", ease: Power4.easeInOut, onComplete: () => {
                if (this.bgrFront == this.bgr2) {
                    this.bgrFront = this.bgr1;
                    this.bgrBack = this.bgr2;
                } else {
                    this.bgrFront = this.bgr2;
                    this.bgrBack = this.bgr1;
                }

                TweenMax.set(this.bgrBack, { zIndex: 0 });
                TweenMax.set(this.bgrFront, { zIndex: 1, width: "0%" });

                if (typeof callback === "function") callback();
            }
        });
    }
}

export default BackgroundPanel;


// WEBPACK FOOTER //
// ./src/assets/scripts/ui/BackgroundPanel.js