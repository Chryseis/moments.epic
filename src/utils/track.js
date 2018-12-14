class Track {
    constructor() {
        this.gaAvailable = typeof ga === 'function';
    }

    event(category, action, label, value) {
        console.log('send event analytics!', category, action, label, value);

        if (!this.gaAvailable) {
            return;
        }

        ga('send', 'event', category, action, label, value)
    }

    sendPage() {
        console.log('send to ga', location.pathname + location.search + location.hash);

        if (!this.gaAvailable) {
            return;
        }

        ga('send', 'pageview', {
            'page': location.pathname + location.search + location.hash
        });
    }
}

export default new Track();


// WEBPACK FOOTER //
// ./src/assets/scripts/utils/track.js