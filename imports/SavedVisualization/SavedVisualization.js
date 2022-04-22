import { Meteor } from "meteor/meteor";
import { EJSON } from "meteor/ejson";
import { Template } from "meteor/templating";

import "/imports/api/methods";
import { Visualizations } from "/imports/api/visualizations";
import { Comms } from "/imports/api/comms";
import { Shares } from "/imports/api/shares";

Meteor.subscribe("visualizations", {
    onReady: (param) => { console.log("subscribe onReady / " + param); },
    onStop:  (param) => { console.log("subscribe onStop / "  + param); }
});

Template.savedVisualization.helpers({
    savedVisualizations: () => {
        let user = Meteor.user();
        if (!user)
            return [];
        let username = user.emails[0].address;
        
        let visualizations = Visualizations.find({createdBy: username}).fetch();
        console.log(visualizations);

        return visualizations.map((v) => {
            return {
                createdAt: v.createdAt,
                createdBy: v.createdBy,
                image: v.images[0],
                name: v.name
            };
        });
    },

    sharedVisualizations: () => {
        let user = Meteor.user();
        if (!user)
            return [];
        let username = user.emails[0].address;

        let shares =  Shares.find({username: username}).fetch()[0];
        console.log(shares.shares);
        let visualizations = [];

        for (let i = 0; i < shares.shares.length; i++) {
            visualizations.push(Visualizations.find({createdAt: shares.shares[i]}).fetch()[0]);
        }

        console.log(visualizations);

        return visualizations.map((v) => {
            return {
                createdAt: v.createdAt,
                createdBy: v.createdBy,
                image: v.images[0],
                name: v.name
            };
        });
    }
});