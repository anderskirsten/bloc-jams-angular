(function() {
    function LandingCtrl() {
        this.heroTitle = "Turn the music up!";
    }

    angular
        .module('Musicology')
        .controller('LandingCtrl', LandingCtrl);
})();
