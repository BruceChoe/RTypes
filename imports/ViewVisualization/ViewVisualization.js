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

let showConfirmButton = new ReactiveVar(null);
let visualizationInfo = new ReactiveVar(null);
let visualizationToDelete = new ReactiveVar(null);
let shouldDelete = new ReactiveVar(null);

let resetReactives = () => {
    showConfirmButton.set(false);
    visualizationInfo.set(null);
    visualizationToDelete.set(null);
    shouldDelete.set(false);
};

Template.viewVisualization.onCreated(() => {
    // ensure default values are set
    resetReactives();
});

Template.viewVisualization.onDestroyed(() => {
    // if we are deleting a visualization, delete it when we leave the page
    if (visualizationToDelete.get())
        Meteor.call("deleteVisualization", visualizationToDelete.get());
    visualizationToDelete.set(null);
});

Template.viewVisualization.helpers({
    getData: (visualizationId, key) => {
        let user = Meteor.user();
        if (!user) return [];

        let visualization = Visualizations.find({createdAt: visualizationId}).fetch()[0];
        if (!visualization) return [];

        let value = visualization[`${key}`];

        // this is a real hack fix but it makes sure the data is loaded properly
        // store a copy of the visualization info to write back to the database if the user wants to undo a deletion
        if (!visualizationInfo.get())
            visualizationInfo.set(visualization);

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
        if (!visualization) return false;

        if (username === visualization.createdBy) return true;

        let shares = Shares.find({username: username}).fetch()[0];
        if (!shares) return false;
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

Template.shareVisualization.helpers({
    isCurrentUserAuthor: (visualizationId) => {
        let visualization = Visualizations.find({createdAt: visualizationId}).fetch()[0];
        let user = Meteor.user();
        let username = user.emails[0].address;

        return username === visualization.createdBy;
    }
});

Template.deleteVisualization.helpers({
    isCurrentUserAuthor: (visualizationId) => {
        let visualization = Visualizations.find({createdAt: visualizationId}).fetch()[0];
        let user = Meteor.user();
        let username = user.emails[0].address;

        return username === visualization.createdBy;
    },

    showUndo: () => {
        return showConfirmButton.get();
    }
});

Template.deleteVisualization.events({
    "click #deleteButton": (event, instance) => {
        showConfirmButton.set(true);
        visualizationToDelete.set(instance.data);
        console.log(visualizationToDelete.get());
    },

    "click #deleteConfirmButtton": (event, instance) => {
        Meteor.call("deleteVisualization", instance.data);
        FlowRouter.go("index");
    }
});