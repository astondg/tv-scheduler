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
