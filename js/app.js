/*
Concatinated JS file 
Author: Aston Gilliland 
Created Date: 2015-04-15
 */ 
angular.module('tvSchedulerApp', ['ngRoute'])
       .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
           $routeProvider
               .when('/guide', {
                   controller: 'guideController',
                   templateUrl: 'views/guide.html'
               })
               .when('/programs', {
                   controller: 'programsController',
                   templateUrl: 'views/programs.html'
               })
               .when('/schedule', {
                   controller: 'scheduleController',
                   templateUrl: 'views/schedule.html'
               })
               .otherwise({
                   redirectTo: '/guide'
               });

           $locationProvider.html5Mode(true);
       }]);
angular.module('tvSchedulerApp')
       .controller('guideController',
                   ['$scope', 'channelService', 'programService', function ($scope, channelService, programService) {

                       channelService.getAllChannels()
                                     .then(function (result) {

                                         $scope.channels = result;

                                     });

                       $scope.viewStartTime = moment();
                       $scope.viewEndTime = moment().add(3, 'hours');

                       programService.getProgramsInTimeRange($scope.viewStartTime, $scope.viewEndTime)
                                     .then(function (result) {

                                         $scope.programsInView = result;

                                     });

                       $scope.hoursInView = [
                           '1:00pm',
                           '2:00pm',
                           '3:00pm'
                       ];

                   }]);

angular.module('tvSchedulerApp').controller('programsController', ['$scope', 'programService', function ($scope, programService) {

    $scope.viewStartTime = moment();
    $scope.viewEndTime = moment().add(6, 'hours');
    $scope.programsByRelativeTime = [];

    programService.getProgramsInTimeRange($scope.viewStartTime, $scope.viewEndTime)
                  .then(function (programs) {

                      var programsByChannel = _.values(_.groupBy(programs, 'channelId'));

                      // Now
                      var programsShowingNow = _.map(programsByChannel, function (programGroup) {

                          return programGroup[0];

                      });

                      $scope.programsByRelativeTime.push({
                          title: 'now',
                          startTime: _.min(programsShowingNow, 'startTime'),
                          showingNow: true,
                          programs: programsShowingNow
                      });

                      // Next
                      var programsShowingNext = _.map(programsByChannel, function (programGroup) {

                          return programGroup[1];

                      });

                      $scope.programsByRelativeTime.push({
                          title: 'next',
                          startTime: _.min(programsShowingNext, 'startTime'),
                          programs: programsShowingNext
                      });

                      // Later
                      var programsShowingLater = _.reduce(programsByChannel, function (value, memo) {

                          if (value.programs) {

                              memo.push.apply(value.programs.slice(2));

                          }

                          return memo;

                      }, []);

                      $scope.programsByRelativeTime.push({
                          title: 'later',
                          startTime: _.min(programsShowingLater, 'startTime'),
                          programs: programsShowingLater
                      });

                  });

    $scope.dateHeader = function (programGroup) {

        if (programGroup.showingNow) {
            return 'now';
        }
        if (programGroup.showingNext) {
            return 'next';
        }
        return 'later';

    }

}]);

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

angular.module('tvSchedulerApp').factory('channelService', ['$q', function ($q) {

    //var channelResource = $resource('/api/channel/:id');

    var channelService = {

        getAllChannels: function () {

            //channelResource.query(function (result) {
            //});

            return $q(function (resolve) {
                resolve([
                    {
                        id: 1,
                        name: 'One HD',
                        number: 1,
                        iconPath: 'img/250px-Channel_seven.jpg',
                        tunerId: '111AAA'
                    },
                    {
                        id: 2,
                        name: 'ABC',
                        number: 2,
                        iconPath: 'img/250px-Channel_seven.jpg',
                        tunerId: '222BBB'
                    },
                    {
                        id: 3,
                        name: 'SBSONE',
                        number: 3,
                        iconPath: 'img/250px-Channel_seven.jpg',
                        tunerId: '333CCC'
                    },
                    {
                        id: 4,
                        name: 'Seven',
                        number: 7,
                        iconPath: 'img/250px-Channel_seven.jpg',
                        tunerId: '444DDD'
                    },
                    {
                        id: 5,
                        name: 'Nine',
                        number: 9,
                        iconPath: 'img/250px-Channel_seven.jpg',
                        tunerId: '555EEE'
                    }
                ]);
            });
        }
    };

    return channelService;
}]);
angular.module('tvSchedulerApp').factory('programService', ['$q', function ($q) {

    //var programResource = $resource('/api/program/:id');

    var programService = {

        getProgramsInTimeRange: function (startTime, endTime) {

            //programResource.get({ startTime: startTime, endTime: endTime }, function (result) {
            //});

            return $q(function (resolve) {
                resolve([
                    {
                        name: 'test program 1',
                        description: 'bla bla bla this is a description of a program that is showing at a time on a channel',
                        startTime: moment(),
                        endTime: moment().add(60, 'minutes'),
                        channelId: 1
                    },
                    {
                        name: 'test program 2',
                        description: '',
                        startTime: moment().add(60, 'minutes'),
                        endTime: moment().add(100, 'minutes'),
                        channelId: 1
                    },
                    {
                        name: 'test program 3',
                        description: '',
                        startTime: moment().add(100, 'minutes'),
                        endTime: moment().add(125, 'minutes'),
                        channelId: 1
                    },
                    {
                        name: 'test program 4',
                        description: '',
                        startTime: moment(),
                        endTime: moment().add(15, 'minutes'),
                        channelId: 2
                    },
                    {
                        name: 'test program 5',
                        description: '',
                        startTime: moment().add(15, 'minutes'),
                        endTime: moment().add(70, 'minutes'),
                        channelId: 2
                    },
                    {
                        name: 'test program 6',
                        description: '',
                        startTime: moment().add(70, 'minutes'),
                        endTime: moment().add(160, 'minutes'),
                        channelId: 2
                    },
                    {
                        name: 'test program 7',
                        description: '',
                        startTime: moment().add(-20, 'minutes'),
                        endTime: moment().add(100, 'minutes'),
                        channelId: 3
                    },
                    {
                        name: 'test program 8',
                        description: '',
                        startTime: moment().add(100, 'minutes'),
                        endTime: moment().add(180, 'minutes'),
                        channelId: 3
                    },

                    {
                        name: 'test program 9',
                        description: '',
                        startTime: moment(),
                        endTime: moment().add(30, 'minutes'),
                        channelId: 5
                    },
                    {
                        name: 'test program 10',
                        description: '',
                        startTime: moment().add(30, 'minutes'),
                        endTime: moment().add(60,'minutes'),
                        channelId: 5
                    },
                    {
                        name: 'test program 11',
                        description: '',
                        startTime: moment().add(60, 'minutes'),
                        endTime: moment().add(100, 'minutes'),
                        channelId: 5
                    },
                    {
                        name: 'test program 12',
                        description: '',
                        startTime: moment().add(100, 'minutes'),
                        endTime: moment().add(120, 'minutes'),
                        channelId: 5
                    },
                ]);
            });
        }
    };

    return programService;
}]);