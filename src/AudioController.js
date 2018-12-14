import NavigationUi from './ui/NavigationUi';

let audioControllerInstance = null;

class AudioController {
    constructor() {
        if (audioControllerInstance) {
            return audioControllerInstance;
        }

        this.expSounds = [
            '/assets/music/mp3/00.mp3',
            '/assets/music/mp3/01.mp3',
            '/assets/music/mp3/02.mp3',
            '/assets/music/mp3/03.mp3',
            '/assets/music/mp3/04.mp3',
            '/assets/music/mp3/05.mp3',
            '/assets/music/mp3/06.mp3',
            '/assets/music/mp3/07.mp3',
            '/assets/music/mp3/08.mp3',
            '/assets/music/mp3/09.mp3'
        ];

        this.goExpFile = '/assets/music/mp3/09.mp3';
        this.bgrSound = '/assets/music/mp3/60s.mp3';
        this.navUi = new NavigationUi();
        this.speaker = document.getElementsByClassName("speakerIcon")[0];
        this.speakerWaves = document.getElementsByClassName("speakerWaves")[0];

        this.targetVolume = .2;
        this.volume = this.targetVolume;
        this.audioMute = false;
        this.currentFile = "";
        this.speaker.addEventListener("mousedown", this.switchSound.bind(this), false);

        audioControllerInstance = this;
    }

    playBackground() {
        this.audioBgr = new Audio(this.bgrSound);
        this.audioBgr.addEventListener("ended", this.replayBackground.bind(this), false);
        this.replayBackground();
    }

    replayBackground() {
        this.audioBgr.volume = this.volume;
        this.audioBgr.play();
    }

    switchSound() {
        if (this.audioMute) this.unmute();
        else this.mute();
    }

    play(file) {
        if (file == "random") {
            var rnd = Math.floor(Math.random() * this.expSounds.length);
            this.currentFile = this.expSounds[rnd];
        } else {
            this.currentFile = file;
        }
        this.audioFx = new Audio(this.currentFile);
        this.audioFx.volume = this.volume;
        this.audioFx.play();
    }

    kill() {
        if (!this.audioFx) return;
        this.audioFx.pause();
        this.audioFx = new Audio("");
    }

    mute() {
        this.audioMute = true;
        TweenMax.to(this, 1, {
            volume: 0, onUpdate: () => {
                if (this.audioFx) this.audioFx.volume = this.volume;
                if (this.audioBgr) this.audioBgr.volume = this.volume;

            }
        });
        if (this.audioBgr) {
            this.audioBgr.removeEventListener("ended", this.replayBackground.bind(this), false);
            this.audioBgr.pause();
        }

        TweenMax.to(this.speakerWaves, .5, {autoAlpha: 0});
    }

    unmute() {
        this.audioMute = false;
        TweenMax.to(this, 1, {
            volume: this.targetVolume, onUpdate: () => {
                if (this.audioFx) this.audioFx.volume = this.volume;
                if (this.audioBgr) this.audioBgr.volume = this.volume;
            }
        });
        if (this.audioBgr) {
            this.audioBgr.removeEventListener("ended", this.replayBackground.bind(this), false);
            this.audioBgr.play();
        }
        TweenMax.to(this.speakerWaves, .5, {autoAlpha: 1});
    }
}

export default AudioController;


// WEBPACK FOOTER //
// ./src/assets/scripts/AudioController.js