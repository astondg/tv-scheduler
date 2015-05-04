/*
Concatinated JS file 
Author: Aston Gilliland 
Created Date: 2015-05-04
 */ 
angular.module('tvSchedulerApp', ['ngRoute', 'ngResource'])
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
                   ['$scope', 'channelService', 'programService', 'guideConfigurationService', function ($scope, channelService, programService, guideConfigurationService) {

                       channelService.getAllChannels()
                                     .then(function (result) {

                                         $scope.channels = result;

                                     });

                       $scope.viewStartTime = guideConfigurationService.viewStartTime;
                       $scope.viewEndTime = guideConfigurationService.viewEndTime;

                       programService.getProgramsInTimeRange($scope.viewStartTime, $scope.viewEndTime)
                                     .then(function (result) {

                                         $scope.programsInView = result;

                                     });

                       $scope.hoursInView = guideConfigurationService.getHoursInView();

                   }]);

angular.module('tvSchedulerApp').controller('programsController', ['$scope', 'programService', 'guideConfigurationService', function ($scope, programService, guideConfigurationService) {

    $scope.viewStartTime = guideConfigurationService.viewStartTime;
    $scope.viewEndTime = guideConfigurationService.viewEndTime;
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

angular.module('tvSchedulerApp').factory('channelService', ['$q', '$resource', function ($q, $resource) {

    var channelResource = $resource('/api/channel/:id');

    var channelService = {
        getAllChannels: function () {
            return $q(function (resolve) {
                //channelResource.get(function (result) {
                //    resolve(result);
                //});

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
angular.module('tvSchedulerApp').factory('guideConfigurationService', ['$window', function ($window) {
    
    var isWideView = $('#regularWidth').is(':hidden');
    var numberOfHoursInView = function() {
        return isWideView ? 4 : 3;
    };

    var guideConfigurationService = {
        isWideView: isWideView,
        viewStartTime: moment(),
        viewEndTime: moment().add(numberOfHoursInView(), 'hours'),
        numberOfHoursInView: numberOfHoursInView,
        getHoursInView: function () {
            var numberOfHoursInView = isWideView ? 4 : 3;
            var hoursInView = [];

            for (var i = 0; i < numberOfHoursInView; i++) {
                hoursInView.push(moment(this.viewStartTime).add(1, 'hours'));
            }

            return hoursInView;
        }
    };

    // Use property setters to keep start & end time hours in sync
    guideConfigurationService.prototype = {        
        get viewStartTime() {
            return this._viewStartTime;
        },
        set viewStartTime(val) {
            this._viewStartTime = val;
            this.__viewEndTime = moment(val).add(this.numberOfHoursInView(), 'hours');
        },
        get viewEndTime() {
            return this._viewEndTime;
        },
        set viewEndTime(val) {
            this._viewEndTime = val;
            this._viewStartTime = moment(val).subtract(this.numberOfHoursInView(), 'hours');
        }
    };

    $window.addEventListener('resize', function () {
        guideConfigurationService.isWideView = $('#regularWidth').is(':hidden');
    });

    return guideConfigurationService;
}]);
angular.module('tvSchedulerApp').factory('programService', ['$q', '$resource', function ($q, $resource) {

    var programResource = $resource('/api/program/:id');

    var programService = {
        getProgramsInTimeRange: function (startTime, endTime) {
            return $q(function (resolve) {
                //programResource.get({ startTime: startTime, endTime: endTime }, function (result) {
                //    resolve(result);
                //});

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
                        endTime: moment().add(60, 'minutes'),
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