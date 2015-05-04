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