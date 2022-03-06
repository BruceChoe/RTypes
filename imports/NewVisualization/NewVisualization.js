// file uploding code courtesy of https://gist.github.com/dariocravero/3922137
import { Meteor } from "meteor/meteor";
import { EJSON } from "meteor/ejson";
import { Template } from "meteor/templating";

import "/imports/api/methods";
import { Users } from "/imports/api/users";
import { Comms } from "/imports/api/comms";

// serving images via router? see here https://github.com/iron-meteor/iron-router/issues/1565
function displayImage(imagePath) {
    let imagePane = document.getElementById("imagePane");
    let image = document.createElement("img");
    image.setAttribute("src", imagePath);
    imagePane.appendChild(image);
}

const startupTime = new Date().getTime();

let selectedTool = new ReactiveVar(null);
let uploadedFile = new ReactiveVar(null);

const toolParams = [
    {
        toolName: "SNFTool",
        inputFile: null,
        outputFilePrefix: "SNF",
        neighbors: null,
        hyperparameter: null,
        numberIterations: null
    },
    {
        toolName: "NEMO",
        inputFile: null,
        outputFilePrefix: "NEMO",
        clusters: null,
        neighbors: null
    }
];

Meteor.subscribe("comms", {
    onReady: (param) => { console.log("subscribe onReady / " + param); },
    onStop:  (param) => { console.log("subscribe onStop / "  + param); }
});

Meteor.subscribe("users", {
    onReady: (param) => { console.log("subscribe onReady / " + param); },
    onStop:  (param) => { console.log("subscribe onStop / "  + param); }
});

let msgs = Comms.find();
msgs.observe({
    added: (entry) => {
        // jesus christ javascript, if there is no time field this silently fails
        if (entry.time < startupTime) return;

        console.log("Client received message of type " + entry.type + " at time " + entry.time);

        switch (entry.type) {
            case "process-invocation":
                console.log("process invoked");
                break;
            case "visualization":
                console.log("visualization ready");
                displayImage(entry.path);
                break;
            case "file-upload-complete":
                console.log("file upload complete");
                uploadedFile.set(
                    {
                        serverName: entry.serverName,
                        createdAt: entry.time
                    }
                );
                console.log(uploadedFile);
                document.getElementById("generateButton").removeAttribute("disabled");
                break;
            default:
                console.log("Unknown message type " + entry.type);
                break;
        }
    }
});


/// newVisualization
Template.newVisualization.onCreated(() => {
    selectedTool.set(0);
    uploadedFile.set(
        {
            serverName: null,
            createdAt: null
        }
    );
});

Template.newVisualization.helpers({
    res() {
        return EJSON.stringify(Users.find({}).fetch());
    }
});


/// TESTMKDIR
Template.testMkdir.events({
    "click button": (event, instance) => {
        Meteor.call("createUserDirectories", "test_user");
    }
});


/// FILEUPLOAD
Template.fileUpload.events({
    "change input": (ev) => {
        let file = ev.currentTarget.files[0];
        let user = "test_user";

        let res = Users.find({username: user}).fetch();
        console.log(Users);
        console.log("fetched: " + res);
        if (res.length != 0) {
            console.log("Saving file " + file.name + "...");
            saveFile(user, file, file.name, null, null, null);
        }
    }
});


/// INVOKESCRIPT
Template.invokeScript.events({
    "click button"(event, instance) {
        let params = toolParams[selectedTool.get()];
        params.inputFile = uploadedFile.get().serverName;
        console.log(params);
        Meteor.call("invokeProcess", "test_user", uploadedFile.get().createdAt, params);
    }
});


/// TOOLS
// todo make sure these indices are consistent with the switch staement in the generate visualization thingy
Template.tools.helpers({
    toolNames: toolParams.map(t => {return {name: t.toolName}; })
});

Template.tools.events({
    "change select"(event, instance) {
        selectedTool.set(instance.firstNode.options.selectedIndex);
    }
});



saveFile = (username, blob, name, path, type, callback) => {
    let fileReader = new FileReader();
    let method;
    let encoding = "binary";
    type = type || "binary";

    switch (type) {
    case "text":
        // TODO Is this needed? If we"re uploading content from file, yes, but if it"s from an input/textarea I think not...
        method = "readAsText";
        encoding = "utf8";
        break;
    case "binary": 
        method = "readAsBinaryString";
        encoding = "binary";
        break;
    default:
        method = "readAsBinaryString";
        encoding = "binary";
        break;
    }

    fileReader.onload = (file) => {
        Meteor.call("saveFile", username, file.target.result, name, path, encoding, callback);
    };

    fileReader[method](blob);
};