﻿angular.module('tvSchedulerApp').factory('programService', ['$q', '$resource', function ($q, $resource) {

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