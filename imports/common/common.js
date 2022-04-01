import { Meteor } from "meteor/meteor";
import { EJSON } from "meteor/ejson";
import { Template } from "meteor/templating";

import { Users } from "/imports/api/users";
import { Visualizations } from "/imports/api/visualizations";

Template.sidebarVisualizationItems.helpers({
    list() { return [...Array(10).keys()]; },
    visualizations: () => {
        let user = Users.find({username: "test_user"}).fetch()[0];
        let visualizations = Visualizations.find({createdAt: { $in: user.visualizations }}).fetch();
        console.log(visualizations);
        return visualizations.map(v => v.createdAt);
    }
});
/*
Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
}); */