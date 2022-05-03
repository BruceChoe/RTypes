import { Meteor } from "meteor/meteor";
import { EJSON } from "meteor/ejson";
import { Template } from "meteor/templating";

import { Visualizations } from "/imports/api/visualizations";
import { Shares } from "/imports/api/shares";

Template.sidebarVisualizationItems.helpers({
    // lists all visualizations available to the user
    visualizations: () => {
        let user = Meteor.user();
        if (!user)
            return [];
        let username = user.emails[0].address;

        let visualizations = Visualizations.find({createdBy: username}).fetch();
        console.log(visualizations);
        return visualizations.map(v => {return {createdAt: v.createdAt, name: v.name};});
    }
});

Template.sidebarSharedWithMe.helpers({
    // lists all visualizations shared with the user
    sharedVisualizations: () => {
        console.log("asdfasd");
        let user = Meteor.user();
        if (!user)
            return [];
        let username = user.emails[0].address;

        let sharedVisualizations = Shares.find({username: username}).fetch();
        if (!sharedVisualizations[0]) return [];
        console.log(sharedVisualizations[0].shares);

        let visualizations = [];
        for (let i = 0; i < sharedVisualizations[0].shares.length; i++)
        {
            visualizations.push(Visualizations.find({createdAt: sharedVisualizations[0].shares[i]}).fetch()[0]);
        }
        console.log(visualizations);

        return visualizations.map(v => {return {createdAt: v.createdAt, name: v.name};});
    }
});

// common helper used to determine if a user is logged in
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