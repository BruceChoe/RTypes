import { Meteor } from 'meteor/meteor';
import '/imports/api/methods';
import { Comms } from '/imports/api/comms';
import { Visualizations } from '/imports/api/visualizations';
import { Shares } from '/imports/api/shares';

import '/server/serverRoutes.js';

// allow the client to access the MongoDB collections used by the application
Meteor.startup(() => {
  Meteor.publish('comms', () => {
    return Comms.find({});
  });

  Meteor.publish('visualizations', () => {
    return Visualizations.find({});
  });

  Meteor.publish('shares', () => {
    return Shares.find({});
  });
});
