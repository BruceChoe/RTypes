import { Meteor } from "meteor/meteor";
import { EJSON } from "meteor/ejson";
import { Template } from "meteor/templating";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import { Visualizations } from "/imports/api/visualizations";
import { Shares } from "/imports/api/shares";

Meteor.subscribe("visualizations", {
    onReady: (param) => { console.log("subscribe onReady / " + param); },
    onStop:  (param) => { console.log("subscribe onStop / "  + param); }
});

Meteor.subscribe("shares", {
    onReady: (param) => { console.log("subscribe onReady / " + param); },
    onStop:  (param) => { console.log("subscribe onStop / "  + param); }
});

Template.viewVisualization.helpers({
    getData: (visualizationId, key) => {
        let user = Meteor.user();
        if (!user) return [];

        let visualization = Visualizations.find({createdAt: visualizationId}).fetch()[0];
        let value = visualization[`${key}`];

        if (value)
            return value;
        else
            return [];
    },

    canView: (visualizationId) => {
        let user = Meteor.user();
        if (!user) return false;

        let username = user.emails[0].address;

        let visualization = Visualizations.find({createdAt: visualizationId}).fetch()[0];
        if (username === visualization.createdBy) return true;

        let shares = Shares.find({username: username}).fetch()[0];
        if (shares.shares.includes(visualizationId)) return true;

        return false;
    }
});

Template.shareVisualization.events({
    "click button": (event, instance) => {
        let user = Meteor.user();
        if (!user)
        {
            console.log("Not currently logged in (how?). Cannot share.");
            return;
        }

        let emailField = document.getElementById("emailField");
        let username = emailField.value;
        
        Meteor.call("userExists", username, (_, res) => {
            let userExists = res;
            let feedback = document.getElementById("emailFeedback");
            if (!userExists) {
                console.log();
                
                feedback.textContent = "User " + username + " does not exist, cannot share.";
                feedback.setAttribute("style", "color: red;");
                return;
            }

            Meteor.call("shareVisualization", username, instance.data);
            feedback.textContent = "Visualization shared with user " + username + ".";
            feedback.setAttribute("style", "");
        });
        return;
    }
});

Template.deleteVisualization.helpers({
    isCurrentUserAuthor: (visualizationId) => {
        let visualization = Visualizations.find({createdAt: visualizationId}).fetch()[0];
        let user = Meteor.user();
        let username = user.emails[0].address;

        console.log(username);
        console.log(visualizationId);
        console.log(visualization.createdBy);

        console.log(username === visualization.createdBy);

        return username === visualization.createdBy;
    }
});

Template.deleteVisualization.events({
    "click button": (event, instance) => {
        console.log(instance.data);
        Meteor.call("deleteVisualization", instance.data);
        FlowRouter.go("/saved");
    }
});