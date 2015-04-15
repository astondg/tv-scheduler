angular.module('tvSchedulerApp').directive('programOverview', function () {

    function calculateMinutesInView(programStartTime, programEndTime, viewStartTime, viewEndTime) {

        var startTime = moment.max(programStartTime, viewStartTime),
            endTime = moment.min(programEndTime, viewEndTime);

        return endTime.diff(startTime, 'minutes');

    }

    function link(scope, element) {

        if (scope.viewStartTime && scope.viewEndTime) {

            var totalViewMinutes = scope.viewEndTime.diff(scope.viewStartTime, 'minutes'),
                minutesInView = calculateMinutesInView(scope.program.startTime,
                                                       scope.program.endTime,
                                                       scope.viewStartTime,
                                                       scope.viewEndTime),
                percentageInView = minutesInView / totalViewMinutes * 100;
            element[0].style.width = percentageInView + '%';

        }

        var currentTime = moment();
        if (scope.program.startTime.isBefore(currentTime)
            && scope.program.endTime.isAfter(currentTime)) {

            element.addClass('showing-now');

        }

    }

    return {
        restrict: 'E',
        scope: {
            program: '=model',
            viewStartTime: '=viewStartTime',
            viewEndTime: '=viewEndTime',
            isExpanded: '=isExpanded'
        },
        templateUrl: 'partials/program-overview.html',
        replace: true,
        link: link
    };

});
