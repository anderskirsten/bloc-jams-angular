(function() {
    function seekBar($document) {

        /**
        * @function calculatePercent
        * @desc calculates the horizontal percent along the seek bar where the event occurred
        * @params seekBar, $event (point on view that user clicked)
        * @returns number
        */
        var calculatePercent = function(seekBar, event) {
            var offsetX = event.pageX - seekBar.offset().left;
            var seekBarWidth = seekBar.width();
            var offsetXPercent = offsetX / seekBarWidth;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(1, offsetXPercent);
            return offsetXPercent;
        };

        return {
            templateUrl: '/templates/directives/seek_bar.html',
            replace: true,
            restrict: 'E',
            scope: { },
            scope: {
                onChange: '&'
            },
            link: function(scope, element, attributes) {

                /**
                * @desc holds value of seek bar, i.e. currently playing song time or current volume
                * @type {Object.key.value}
                */
                scope.value = 0;

                /**
                * @desc holds max value for song and volume seek bars; default is 100
                * @type {Object.key.value}
                */
                scope.max = 100;

                /**
                * @desc holds the element that matches the directive `<seek-bar>` as a jQuery object so we can call jQuery methods on it
                * @type {Object}
                */
                var seekBar = $(element);

                /**
                * @method attributes.$observe
                * @desc uses ang method `$observe` to note changes in the scope and assign a new value to the `value` & `max` variables
                * @params newValue
                */
                attributes.$observe('value', function(newValue) {
                    scope.value = newValue;
                });

                attributes.$observe('max', function(newValue) {
                    scope.max = newValue;
                });

                /**
                * @function percentString
                * @desc calculates a percent based on the `value` & `max` value of a seek bar
                * @returns number + string
                */
                var percentString = function() {
                    var value = scope.value;
                    var max = scope.max;
                    var percent = value / max * 100;
                    return percent + "%";
                };

                /**
                * @method scope.fillStyle
                * @desc uses `percentString` function to assign value to seek bar fill element's width
                * @returns number + string as width of seek bar fill element
                */
                scope.fillStyle = function() {
                    return {width: percentString()};
                };

                /**
                * @method scope.thumbStyle
                * @desc uses `percentString` function to assign value to seek bar thumb element's width
                * @returns number + string as width of seek bar thumb element
                */
                scope.thumbStyle = function() {
                    return {left: percentString()};
                };

                /**
                * @method scope.onClickSeekBar
                * @desc updates seek bar value based on seek bar's width & location of user's click on seek bar
                * @params $event
                */
                scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                    notifyOnChange(scope.value);
                };

                /**
                * @method scope.trackThumb
                * @desc similar to scope.onClickSeekBar, but uses $apply to constantly update the value of scope.value as the user drags the seek bar thumb
                * @params **internal** $event
                */
                scope.trackThumb = function() {
                    $document.bind('mousemove.thumb', function(event) {
                        var percent = calculatePercent(seekBar, event);
                        scope.$apply(function() {
                            scope.value = percent * scope.max;
                            notifyOnChange(scope.value);
                        });
                    });

                    $document.bind('mouseup.thumb', function() {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                };

                /**
                * @function notifyOnChange
                * @desc Tests to ensure `scope.onChange` is a function, passes full function call to the `on-change` html attribute, specifies value of params `value` as the `newValue` variable, which is passed into the `SongPlayer.setCurrentTime()` function
                * @returns number
                */
                var notifyOnChange = function(newValue) {
                    if (typeof scope.onChange === 'function') {
                        scope.onChange({value: newValue});
                    }
                };
            }
        };
    }

    angular
        .module('blocJams')
        .directive('seekBar', ['$document', seekBar]);
})();
