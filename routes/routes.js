import { Meteor } from "meteor/meteor";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { BlazeLayout } from "meteor/kadira:blaze-layout";
import { Template } from "meteor/templating";

import "/imports/NewVisualization/NewVisualization.html";
import "/imports/NewVisualization/NewVisualization.js";
FlowRouter.route("/", {
    name: "index",
    action() {
        BlazeLayout.render("newVisualization");
    }
});

FlowRouter.route("*", {
    action() {
        throw new Meteor.Error(404);
    }
});