// file uploding code courtesy of https://gist.github.com/dariocravero/3922137

import { Template } from 'meteor/templating';

import './main.html';
import { Meteor } from 'meteor/meteor';

import '/imports/api/methods';


Template.fileUpload.events({
    'change input': function(ev) {
        var file = ev.currentTarget.files[0];
        console.log(file.name);
        console.log((file.stream()));
        console.log(file instanceof Blob);
        saveFile(file, file.name);
    }
});

Template.invokeScript.events({
    'click button'(event, instance) {
        Meteor.call("invokeProcess", ["python.exe", "../../../../../scripts/test.py"]);
    }
});

saveFile = function(blob, name, path, type, callback) {
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
        Meteor.call('saveFile', file.target.result, name, path, encoding, callback);
    }

    fileReader[method](blob);
}