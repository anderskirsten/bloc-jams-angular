(function() {
    function LandingCtrl() {
        this.heroTitle = "Turn the music up!";
    }

    angular
        .module('blocJams')
        .controller('LandingCtrl', LandingCtrl);
})();
