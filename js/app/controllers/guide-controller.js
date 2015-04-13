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
