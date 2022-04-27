// file uploding code courtesy of https://gist.github.com/dariocravero/3922137
import { Meteor } from "meteor/meteor";
import { EJSON } from "meteor/ejson";
import { Template } from "meteor/templating";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import "/imports/api/methods";
import { Comms } from "/imports/api/comms";

import HugeUploader from "huge-uploader";

// imagePaths: list
function displayImage(imagePaths) {
    let imagePane = document.getElementById("imagePane");
    imagePane.textContent = "";

    imagePaths.forEach((path) => {
        let image = document.createElement("img");
        image.setAttribute("src", path);
        image.setAttribute("class", "img-fluid");
        imagePane.appendChild(image);
    });
}

const startupTime = new Date().getTime();

let selectedTool = new ReactiveVar(null);
let uploadedFile = new ReactiveVar(null);
let visualizationInfo = new ReactiveVar(null);
let canSave = new ReactiveVar(null);

const toolParams = [
    {
        toolName: "SNFTool",
        inputFile: null,
        outputFilePrefix: "SNF",
        timestamp: null,
        neighbors: null,
        hyperparameter: null,
        numberIterations: null
    },
    {
        toolName: "NEMO",
        inputFile: null,
        outputFilePrefix: "NEMO",
        timestamp: null,
        clusters: null,
        neighbors: null
    },
    {
        toolName: "PINSPlus",
        inputFile: null,
        outputFilePrefix: "PINS",
        timestamp: null,
    }
];

Meteor.subscribe("comms", {
    onReady: (param) => { console.log("subscribe onReady / " + param); },
    onStop:  (param) => { console.log("subscribe onStop / "  + param); }
});

let msgs = Comms.find();
msgs.observe({
    added: (entry) => {
        if (entry.time === undefined || entry.time < startupTime) return;

        console.log("Client received message of type " + entry.type + " at time " + entry.time);

        switch (entry.type) {
            case "process-invocation":
                console.log("process invoked");
                break;
            case "visualization":
                console.log("visualization ready");
                displayImage(entry.images);
                let progressBar = document.getElementById("invokeScript-spinner");
                progressBar.removeAttribute("class");

                visualizationInfo.set({
                    createdAt: entry.createdAt,
                    createdBy: entry.createdBy,
                    images: entry.images
                });
                console.log(visualizationInfo);

                let saveButton = document.getElementById("saveButton");
                saveButton.removeAttribute("disabled");
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
    uploadedFile.set({
        serverName: null,
        createdAt: null
    });
    visualizationInfo.set({
        createdBy: null,
        createdAt: null,
        images: []
    });
    canSave.set(false);
});

Template.newVisualization.helpers({
    res() {
        return EJSON.stringify(Meteor.user());
    }
});



/// saveVisualization
Template.saveVisualization.events({
    "click button": (event, instance) => {
        // grab name and description
        let name = document.getElementById("visualizationName");
        console.log(name.value);
        let description = document.getElementById("visualizationDescription");
        console.log(description.value);
        let feedback = document.getElementById("feedbackText");
        feedback.textContent = "";

        if (name.value.trim() === "") {
            console.log("visualization must have a name");
            feedback.setAttribute("style", "color: red;");
            feedback.textContent = "Visualizations must have a name.";
            return;
        }

        let info = visualizationInfo.get();
        Meteor.call("saveVisualization", {
            createdBy: info.createdBy,
            createdAt: info.createdAt,
            images: info.images,
            name: name.value.trim(),
            description: description.value
        });
        console.log("saved");

        FlowRouter.go("saved");
        // // enable download
        // let downloadButton = document.getElementById("downloadButton");
        // downloadButton.removeAttribute("disabled");
    },

    "input #visualizationName": (event, instance) => {
        console.log(event);
        console.log(event.target);
        console.log(event.target.value.trim() === "");
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
        let progressBar = document.getElementById("fileUpload-progress");
        let file = ev.currentTarget.files[0];
        let feedback = document.getElementById("fileUploadFeedback");
        feedback.textContent = "";
        feedback.setAttribute("style", "");

        console.log(file.name);
        if (!file.name.match(/.*\.[Rr][Dd]ata/)) {
            console.log("invalid file uploaded");
            feedback.textContent = "File must be a .RData file.";
            feedback.setAttribute("style", "color: red;");
            return;
        }

        let user = Meteor.user();
        if (!user)
        {
            console.log("not logged in, returning");
            return;
        }

        let username = user.emails[0].address;
        console.log(username);

        const uploader = new HugeUploader({
            endpoint: "/upload",
            file: file,
            postParams: {
                filename: file.name,
                username: username
            },
            headers: {
                "filename": "test"
            }
        });
        console.log(uploader);

        uploader.on("error", (err) => {
            console.error("Upload errored:", err.detail);
        });

        uploader.on("progress", (progress) => {
            console.log(progress.detail);
            progressBar.setAttribute("value", progress.detail);
        });

        uploader.on("finish", () => {
            console.log("upload finished");
        });
    }
});


/// INVOKESCRIPT
Template.invokeScript.events({
    "click button"(event, instance) {
        let progressBar = document.getElementById("invokeScript-spinner");
        progressBar.setAttribute("class", "spinner-border");

        let params = toolParams[selectedTool.get()];
        params.inputFile = uploadedFile.get().serverName;
        params.timestamp = uploadedFile.get().createdAt;
        console.log(params);

        let user = Meteor.user();
        if (user)
        {
            Meteor.call("invokeProcess", user.emails[0].address, uploadedFile.get().createdAt, params);
        }
        else
        {
            console.log("not logged in, returning");
        }
    }
});


/// TOOLS
// todo make sure these indices are consistent with the switch staement in the generate visualization thingy
Template.tools.helpers({
    toolNames: toolParams.map(t => {return {name: t.toolName}; })
});

Template.tools.events({
    "change select"(event, instance) {
        let select = document.getElementById("toolSelection");
        selectedTool.set(select.options.selectedIndex);
    }
});


/// DOWNLOAD
Template.downloadVisualizationNewPage.events({
    "click button": (event, instance) => {
        // instance has a data field: this is the data that is passed to the template in the html template
        // here, it is the visualization ID
        window.location.href = "/download/" + visualizationInfo.get().createdAt;
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

    fileReader.onprogress = (event) => {};

    fileReader.onload = (file) => {
        Meteor.call("saveFile", username, file.target.result, name, path, encoding, callback);
    };

    fileReader[method](blob);

    let progressBar = document.getElementById("fileUpload-spinner");
    progressBar.removeAttribute("class");
};