module.exports = () => {
    return new function () {
        this.resolve = null;
        this.reject = null;

        this.promise = new Promise(function (resolve, reject) {
            this.resolve = resolve;
            this.reject = reject;
        }.bind(this));
    };
};


// WEBPACK FOOTER //
// ./src/assets/scripts/utils/deferred.js