import { Meteor } from "meteor/meteor";
import { EJSON } from "meteor/ejson";
import { Template } from "meteor/templating";

import { Users } from "/imports/api/users";
import { Visualizations } from "/imports/api/visualizations";

Template.sidebarVisualizationItems.helpers({
    list() { return [...Array(10).keys()]; },
    visualizations: () => {
        let user = Meteor.user();
        if (!user)
            return [];
        let username = user.emails[0].address;

        let visualizations = Visualizations.find({createdBy: username}).fetch();
        console.log(visualizations);
        return visualizations.map(v => v.createdAt);
    }
});

Template.registerHelper("loggedIn", () => {
    return Meteor.user() != null;
});

Template.downloadVisualization.events({
    "click button": (event, instance) => {
        // instance has a data field: this is the data that is passed to the template in the html template
        // here, it is the visualization ID
        window.location.href = "/download/" + instance.data;
    }
});