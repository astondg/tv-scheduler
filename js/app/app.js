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