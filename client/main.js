// file uploding code courtesy of https://gist.github.com/dariocravero/3922137

import { Template } from 'meteor/templating';

import './main.html';
import { Meteor } from 'meteor/meteor';

import '/imports/api/methods';
import { Users } from '/imports/api/users';
import { Comms } from '/imports/api/comms';

import { EJSON } from 'meteor/ejson';
import { Tracker } from 'meteor/tracker';


// Meteor.subscribe('comms', {
//     onReady: function() { console.log('rcv'); }
// });

// let msgs = Comms.find();
// msgs.observe({
//     added: function(id, obj) {
//         console.log(id);
//     }
// });

let handle = Meteor.subscribe("Comms");

Template.body.helpers({
    res() {
        return EJSON.stringify(Users.find({}).fetch()[0]["test_user"]);
    },
});

Template.testMkdir.events({
    'click button': function(event, instance) {
        Meteor.call("createUserDirectories", "test_user");
    }
});

Template.fileUpload.events({
    'change input': function(ev) {
        var file = ev.currentTarget.files[0];
        // console.log(file.name);
        // console.log((file.stream()));
        // console.log(file instanceof Blob);

        user = "test_user";

        let res = Users.find({username: user}).fetch();
        console.log("fetched");
        if (res.length != 0) {
            saveFile(user, file, file.name, null, null, null);
            console.log("saved");
        }
    }
});

Template.invokeScript.events({
    'click button'(event, instance) {
        Meteor.call("invokeProcess", ["python.exe", "../../../../../scripts/test.py"]);
    }
});

saveFile = function(username, blob, name, path, type, callback) {
    var fileReader = new FileReader();
    var method;
    var encoding = 'binary';
    var type = type || 'binary';

    switch (type) {
    case 'text':
        // TODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
        method = 'readAsText';
        encoding = 'utf8';
        break;
    case 'binary': 
        method = 'readAsBinaryString';
        encoding = 'binary';
        break;
    default:
        method = 'readAsBinaryString';
        encoding = 'binary';
        break;
    }

    fileReader.onload = function(file) {
        Meteor.call('saveFile', username, file.target.result, name, path, encoding, callback);
    };

    fileReader[method](blob);
};