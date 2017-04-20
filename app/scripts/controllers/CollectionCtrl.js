(function() {
    function CollectionCtrl(Fixtures) {
        this.albums = Fixtures.getCollection(9);
    }

    angular
        .module('Musicology')
        .controller('CollectionCtrl', ['Fixtures', CollectionCtrl]);
})();
