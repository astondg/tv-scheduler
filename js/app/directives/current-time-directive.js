angular.module('tvSchedulerApp').directive('currentTime', function ($timeout, dateFilter) {
    var timeoutId;

    function updateTime(element, format) {
        element.text(dateFilter(new Date(), format));
    }

    function updateLater(element, format) {
        timeoutId = $timeout(function () {
            updateTime(element); // update DOM
            updateLater(element, format); // schedule another update
        }, 1000);
    }

    function link(scope, element, attrs) {
        updateTime(element, scope.format);

        // listen on DOM destroy (removal) event, and cancel the next UI update
        // to prevent updating time ofter the DOM element was removed.
        element.bind('$destroy', function () {
            $timeout.cancel(timeoutId);
        });

        updateLater(element, scope.format); // kick off the UI update process.
    };

    return {
        restrict: 'A',
        scope: {
            format: '=currentTime'
        },
        link: link
    };
});