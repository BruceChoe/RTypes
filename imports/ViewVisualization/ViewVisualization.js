import { Meteor } from "meteor/meteor";
import { EJSON } from "meteor/ejson";
import { Template } from "meteor/templating";

import { Visualizations } from "/imports/api/visualizations";
import { Comms } from "/imports/api/comms";

Meteor.subscribe("visualizations", {
    onReady: (param) => { console.log("subscribe onReady / " + param); },
    onStop:  (param) => { console.log("subscribe onStop / "  + param); }
});

Template.viewVisualization.helpers({
    getImages: (visualizationId) => {
        let user = Meteor.user();
        if (!user)
            return [];
        let username = user.emails[0].address;
        
        // this should only be one visualization here
        let visualization = Visualizations.find({createdAt: visualizationId}).fetch()[0];

        if (username != visualization.createdBy)
            return [];

        return visualization.images;
    }
});