import { Meteor } from "meteor/meteor";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { BlazeLayout } from "meteor/kadira:blaze-layout";
import { Template } from "meteor/templating";

// common elements for all html pages
import "/imports/common/common.html";
import "/imports/common/common.js";

import "/imports/Index/Index.html";
FlowRouter.route("/", {
    name: "index",
    action() {
        BlazeLayout.render("index");
    }
});

import "/imports/NewVisualization/NewVisualization.html";
import "/imports/NewVisualization/NewVisualization.js";
FlowRouter.route("/new", {
    name: "new",
    action() {
        BlazeLayout.render("newVisualization");
    }
});

import "/imports/SavedVisualization/SavedVisualization.html";
import "/imports/SavedVisualization/SavedVisualization.js";
FlowRouter.route("/saved", {
    name: "saved",
    action() {
        BlazeLayout.render("savedVisualization");
    }
});

import "/imports/ViewVisualization/ViewVisualization.html";
import "/imports/ViewVisualization/ViewVisualization.js";
FlowRouter.route("/view/:_index", {
    name: "view",
    action(params) {
        BlazeLayout.render("viewVisualization", {visualizationId: parseInt(params._index)});
    }
});



FlowRouter.route("*", {
    action() {
        BlazeLayout.render("404");
        throw new Meteor.Error(404);
    }
});