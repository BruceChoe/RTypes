import { Meteor } from "meteor/meteor";
import { EJSON } from "meteor/ejson";
import { Template } from "meteor/templating";

import { Users } from "/imports/api/users";
import { Visualizations } from "/imports/api/visualizations";
import { Comms } from "/imports/api/comms";

Meteor.subscribe("users", {
    onReady: (param) => { console.log("subscribe onReady / " + param); },
    onStop:  (param) => { console.log("subscribe onStop / "  + param); }
});

Meteor.subscribe("visualizations", {
    onReady: (param) => { console.log("subscribe onReady / " + param); },
    onStop:  (param) => { console.log("subscribe onStop / "  + param); }
});

Template.viewVisualization.helpers({
    getImages: (visualizationId) => {
        let user = Users.find({username: "test_user"}).fetch()[0];
        if (!user.visualizations.includes(visualizationId)) {
            return `Visualization id ${visualizationId} is not valid for user ${"test_user"}.`;
        }

        let visualizations = Visualizations.find({createdAt: visualizationId}).fetch()[0];
        return (visualizations.images);
    }
});