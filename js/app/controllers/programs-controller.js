angular.module('tvSchedulerApp').controller('programsController', ['$scope', 'programService', function ($scope, programService) {

    $scope.viewStartTime = moment();
    $scope.viewEndTime = moment().add(3, 'hours');
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