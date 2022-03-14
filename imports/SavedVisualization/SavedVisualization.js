import { Meteor } from "meteor/meteor";
import { EJSON } from "meteor/ejson";
import { Template } from "meteor/templating";

import "/imports/api/methods";
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

Template.savedVisualization.helpers({
    bruh: () => {
        let user = Users.find({username: "test_user"}).fetch()[0];
        let visualizations = Visualizations.find({createdAt: { $in: user.visualizations }}).fetch();

        return visualizations.map((v) => {
            return {
                createdAt: v.createdAt,
                image: v.images[0]
            };
        });
    }
});