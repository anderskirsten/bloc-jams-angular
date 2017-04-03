(function() {
    function AlbumCtrl() {
        this.albumData = albumPicasso;
        this.songs = [];
        for(i = 0; i < this.albumData.songs.length; i++){
          this.songs.push(this.albumData.songs[i]);
        }
        console.log(this.albumData.artist);
     }

    angular
        .module('blocJams')
        .controller('AlbumCtrl', AlbumCtrl);
})();
