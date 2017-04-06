(function() {
    function AlbumCtrl(Fixtures) {
        this.albumData = Fixtures.getAlbum();
        this.songs = [];
        for(i = 0; i < this.albumData.songs.length; i++){
            this.songs.push(this.albumData.songs[i]);
        }
     }

    angular
        .module('blocJams')
        .controller('AlbumCtrl', ['Fixtures', AlbumCtrl]);
})();
