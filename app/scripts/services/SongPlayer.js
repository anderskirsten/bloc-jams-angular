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
        };

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
        * @function songOver
        * @desc Use Buzz .bind method to keep track of currently playing song in real time, acquire and store index of currently playing song, watch for when the song ends, then play the next song on the album list
        * @param {Object} song
        */
        var songOver = function(song) {
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });

                var songIndex = getSongIndex(currentBuzzObject);

                if (currentBuzzObject.isEnded()) {
                    SongPlayer.next();
                }
            });
        };

        /**
        * @function shuffledSongOver
        * @desc Use Buzz .bind method to keep track of currently playing song in real time, acquire and store index of currently playing song, watch for when the song ends, then play the next song on playlist
        * @param {Object} song
        */
        var shuffledSongOver = function (playlist) {
            var songIndex = playlist.indexOf(SongPlayer.currentSong);
            console.log(songIndex);

            currentBuzzObject.bind('timeupdate', function() {
                  $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                  });

                  if (currentBuzzObject.isEnded()) {

                    if (songIndex === playlist.length - 1) {
                      song.playing = false;

                    } else {
                    song = playlist[songIndex + 1];
                    setSong(song);
                    playSong(song);
                    shuffledSongOver(playlist);
                    }
                  }
              });
            };

            /**
            * @function shuffleSongList
            * @desc Push all songs from currentAlbum into songArray, loop through songArray & use Math.random() to select song by index number and push into new song list array
            * @returns [Array]
            */
            var shuffleSongList = function() {
              var songArray = [];
              var shuffledList = [];
              for (i = 0; i < currentAlbum.songs.length; i++) {
                songArray.push(currentAlbum.songs[i]);
              }

              while (shuffledList.length < songArray.length) {
                var song = songArray[Math.floor(songArray.length * Math.random())];
                if (shuffledList.includes(song)) {

                } else {
                shuffledList.push(song);
                }
              }
              return shuffledList;
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
        * @desc **PUBLIC** Current volume (scale 0-100)
        * @type {Number}
        */
        SongPlayer.volume = 60;

        /**
        * @method play
        * @desc **PUBLIC** Evaluates current condition of play to start the selected song _uses `setSong` & `playSong` as helpers_
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            if (currentBuzzObject === null) {
                song = currentAlbum.songs[0];
            } else {
            song = song || SongPlayer.currentSong;
            };

            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
                songOver(song);

            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                  playSong(song);
                  songOver(song);
                };
            };
        };

        /**
        * @method pause
        * @desc **PUBLIC** Evaluates current condition of play to stop the selected song & sets condition of `song.playing` to false
        * @param {Object} song
        */
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = null;
        };

        /**
        * @method previous
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
                songOver(song);
            }
        };

        /**
        * @method next
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
                songOver(song);
            }
        };

        /**
        * @method shuffle
        * @desc **PUBLIC** Use `shuffleSongList` function to get a new song array with a random order, check if a song is currently playing, if yes, stop it. Then, use setSong(), playSong() & shuffledSongOver() methods to progress playlist
        * @param N/A
        */
        SongPlayer.shuffle = function() {
          var shuffledList = shuffleSongList();

          if (currentBuzzObject) {
            currentBuzzObject.stop()
          };

          var song = shuffledList[0];

          setSong(song);
          playSong(song);
          shuffledSongOver(shuffledList);
        };

        /**
        * @method setCurrentTime
        * @desc **PUBLIC** Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };

        /**
        * @method setVolume
        * @desc **PUBLIC** Set current volume of playing song
        * @param {Number} volume
        */
        SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
            }
        };


        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
