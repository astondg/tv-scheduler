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