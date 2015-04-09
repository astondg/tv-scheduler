/**
* Program.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: false
    },
    description: {
      type: 'string',
      required: false
    },
    startTime: {
      type: 'datetime',
      required: true
    },
    endTime: {
      type: 'datetime',
      required: true
    },
    tunerId: {
      type: 'string',
      required: true
    }
  }
};

