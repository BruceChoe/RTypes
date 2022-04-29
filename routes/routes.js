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
        window.scrollTo(0, 0);
    }
});

import "/imports/NewVisualization/NewVisualization.html";
import "/imports/NewVisualization/NewVisualization.js";
FlowRouter.route("/new", {
    name: "new",
    action() {
        BlazeLayout.render("newVisualization");
        window.scrollTo(0, 0);
    }
});

import "/imports/SavedVisualization/SavedVisualization.html";
import "/imports/SavedVisualization/SavedVisualization.js";
FlowRouter.route("/saved", {
    name: "saved",
    action() {
        BlazeLayout.render("savedVisualization");
        window.scrollTo(0, 0);
    }
});

import "/imports/ViewVisualization/ViewVisualization.html";
import "/imports/ViewVisualization/ViewVisualization.js";
FlowRouter.route("/view/:_index", {
    name: "view",
    action(params) {
        BlazeLayout.render("viewVisualization", {visualizationId: parseInt(params._index)});
        window.scrollTo(0, 0);
    }
});

FlowRouter.route("*", {
    action() {
        BlazeLayout.render("404");
        window.scrollTo(0, 0);
        throw new Meteor.Error(404);
    }
});

Accounts.onLogin(() => {
    FlowRouter.go("index");
});

Accounts.onLogout(() => {
    FlowRouter.go("index");
});