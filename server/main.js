import { Meteor } from 'meteor/meteor';
import '/imports/api/methods';
import { Users } from '/imports/api/users';
import { Comms } from '/imports/api/comms';

Meteor.startup(() => {
  if (Users.find({}).count() === 0) {
    Users.insert({
      username: "test_user",
      password: "test_password",
      visualizations: []
    });
  }
});
