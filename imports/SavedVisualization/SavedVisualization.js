import { Meteor } from "meteor/meteor";
import { EJSON } from "meteor/ejson";
import { Template } from "meteor/templating";

import "/imports/api/methods";
import { Visualizations } from "/imports/api/visualizations";
import { Comms } from "/imports/api/comms";

Meteor.subscribe("visualizations", {
    onReady: (param) => { console.log("subscribe onReady / " + param); },
    onStop:  (param) => { console.log("subscribe onStop / "  + param); }
});

Template.savedVisualization.helpers({
    bruh: () => {
        let user = Meteor.user();
        if (!user)
            return [];
        let username = user.emails[0].address;
        
        let visualizations = Visualizations.find({createdBy: username}).fetch();
        console.log(visualizations);

        return visualizations.map((v) => {
            return {
                createdAt: v.createdAt,
                image: v.images[0]
            };
        });
    }
});