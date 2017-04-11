(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};

        /**
        * @desc current album info
        * @type {Object}
        */
        var currentAlbum = Fixtures.getAlbum();

        /**
        * @desc Buzz object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;

        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                stopSong(song);
            }

            currentBuzzObject = new buzz.sound(song.audioURL, {
                formats: ['mp3'],
                preload: true
            });

            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });

            SongPlayer.currentSong = song;
        }

        /**
        * @function playSong
        * @desc Starts currently playing song and sets condition of `song.playing` to true
        * @param {Object} song
        */
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        };

        /**
        * @function stopSong
        * @desc Stops currently playing song and sets condition of `song.playing` to null
        * @param {Object} song
        */
        var stopSong = function(song) {
            currentBuzzObject.stop();
            SongPlayer.currentSong.playing = null;
        };

        /**
        * @function getSongIndex
        * @desc provides index number of currently playing song
        * @param {Object} song
        */
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };

        /**
        * @desc **PUBLIC** active song object from list of songs
        * @type {Object}
        */
        SongPlayer.currentSong = null;

        /**
        * @desc **PUBLIC** Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;

        /**
        * @method SongPlayer.play
        * @desc **PUBLIC** Evaluates current condition of play to start the selected song _uses `setSong` & `playSong` as helpers_
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
             if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);

             } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    currentBuzzObject.play();
                }
             }
        };

        /**
        * @method SongPlayer.pause
        * @desc **PUBLIC** Evaluates current condition of play to stop the selected song & sets condition of `song.playing` to false
        * @param {Object} song
        */
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = null;
        };

        /**
        * @method SongPlayer.previous
        * @desc **PUBLIC**
        1. uses getSongIndex function to retrieve current song's index number, then decrement the index number by one so it matches the visible song number
        2. evaluates if current song is at index zero - if yes, stops playing current song & sets `SongPlayer.currentSong.playing` to null
        3. if no, sets value of `song` to the current song index from the current album, then uses `setSong` function to stop playing the currentBuzzObject & set currently playing song to null & finally uses the `playSong` function to start playing the newly selected (aka previous) song in the song list
        * @param N/A
        */
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if (currentSongIndex < 0) {
                stopSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        /**
        * @method SongPlayer.next
        * @desc **PUBLIC**
        1. uses getSongIndex function to retrieve current song's index number, then increment the index number by one so it matches the visible song number
        2. evaluates if current song is the last song in the list - if yes, stops playing current song & sets `SongPlayer.currentSong.playing` to null
        3. if no, sets value of `song` to the current song index from the current album, then uses `setSong` function to stop playing the currentBuzzObject & set currently playing song to null & finally uses the `playSong` function to start playing the newly selected (aka next) song in the song list
        * @param N/A
        */
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;

            if (currentSongIndex === currentAlbum.songs.length) {
                stopSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        /**
        * @method setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };


        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
