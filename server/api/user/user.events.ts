/**



'use strict';

import {EventEmitter} from 'events';
let sqldb = require('../../sqldb');
let User = sqldb.User;
var UserEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  User.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    UserEvents.emit(event + ':' + doc._id, doc);
    UserEvents.emit(event, doc);
    done(null);
  }
}

export default UserEvents;

*/
