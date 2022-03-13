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

const SNFParams = {
    toolName: "SNFTool",
    inputFile: "",
    outputFilePrefix: "SNF",
    neighbors: "",
    hyperparameter: "",
    numberIterations: ""
};

const NEMOParams = {
    toolName: "NEMO",
    inputFile: "",
    outputFilePrefix: "NEMO",
    clusters: "",
    neighbors: ""
};

Meteor.subscribe("comms", {
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
            default:
                console.log("Unknown message type " + entry.type);
                break;
        }
    }
});

Template.body.helpers({
    res() {
        return EJSON.stringify(Users.find({}).fetch()[0]["test_user"]);
    },
});

Template.testMkdir.events({
    "click button": (event, instance) => {
        Meteor.call("createUserDirectories", "test_user");
    }
});

Template.fileUpload.events({
    "change input": (ev) => {
        let file = ev.currentTarget.files[0];
        let user = "test_user";

        let res = Users.find({username: user}).fetch();
        console.log(Users);
        console.log("fetched: " + res);
        //if (res.length != 0) { // this check doesn't actually work, res is empty
            console.log("Saving file " + file.name + "...");
            saveFile(user, file, file.name, null, null, null);
            console.log("saved");
        //}
    }
});

Template.invokeScript.events({
    "click button"(event, instance) {
        //Meteor.call("invokeProcess", ["python.exe", "../../../../../scripts/test.py"]);
        Meteor.call("invokeProcess", SNFParams);
    }
});

Template.tools.helpers({
    toolNames: [
        {name: "SNFTool"},
        {name: "KIRC"},
        {name: "CIMLR"}
    ]
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