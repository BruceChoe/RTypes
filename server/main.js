import { Meteor } from 'meteor/meteor';
import '/imports/api/methods';
import { Users } from '/imports/api/users';
import { Comms } from '/imports/api/comms';
import { Visualizations } from '/imports/api/visualizations';

import '/server/serverRoutes.js';

Meteor.startup(() => {
// if (Users.find({}).count() === 0) {
//    Users.insert({
//      username: "test_user",
//      password: "test_password",
//      visualizations: [ ]
//   });
// }

 // Meteor.publish('users', () => {
  //  return Users.find({});
  //})
  Meteor.publish('comms', () => {
    return Comms.find({});
  });

  Meteor.publish('visualizations', () => {
    return Visualizations.find({});
  });
});
