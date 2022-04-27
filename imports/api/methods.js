// file uploding code courtesy of https://gist.github.com/dariocravero/3922137

import { Meteor } from 'meteor/meteor';

import { Comms } from './comms';
import { Visualizations } from '/imports/api/visualizations';
import { Shares } from '/imports/api/shares';

import ChildProcess from 'child_process';
import fs, { readdirSync } from 'fs';
import path from 'path';
import process from 'process';

const rootPath = '../../../../../';
const bindEnv = Meteor.bindEnvironment((callback) => {callback();});

if (Meteor.isServer)
{
    Meteor.methods({
        saveFile(user, blob, name, path, encoding) {
            // yes, this isn't an accurate save time, but we need to do this to incorporate it into the filename
            // unix timestamps are a pretty "good enough" strat for unique filenames
            let saveTime = new Date().getTime();

            if (!fs.existsSync(rootPath + "/users/" + user))
            {
                console.log('not exitss');
                Meteor.call("createUserDirectories", user);
            }

            name = "users/" + user + "/data/" + saveTime.toString() + "-" + name;
            encoding = encoding || 'binary';
            chroot = Meteor.chroot || rootPath;
        
            // TODO Add file existance checks, etc...
            // synchronous because we want databases to be updated when the upload finishes
            fs.writeFileSync(chroot + name, blob, encoding, (err) => {
                if (err) {
                    throw (new Meteor.Error(500, 'Failed to save file.', err));
                }
            });

            console.log('The file ' + name + ' (' + encoding + ') was saved at ' + saveTime);

            Visualizations.insert({
                createdBy: user,
                createdAt: saveTime,
                images: []
            });

            Comms.insert({
                type: "file-upload-complete",
                time: saveTime,
                serverName: name
            });
        },

        // paramsObject: a JSON object of parameters
        invokeProcess(user, visualizationId, paramObject) {
            console.log(user);
            console.log(visualizationId);
            console.log(paramObject);

            let toolPath = "";
            switch (paramObject.toolName)
            {
                case "SNFTool":
                    console.log("SNF detected");
                    toolPath = path.join(rootPath, "scripts", "SNFSingleSetNoParallel.R");
                    console.log(toolPath);
                    break;
                case "NEMO":
                    console.log("NEMO detected");
                    toolPath = path.join(rootPath, "scripts", "NEMOSingleSetNoParallel.R");
                    console.log(toolPath);
                    break;
                case "PINSPlus":
                    console.log("PINSPlus detected");
                    toolPath = path.join(rootPath, "scripts", "PINSplus.R");
                    console.log(toolPath);
                    break;
                default:
                    console.log("Unknown tool " + paramObject.toolName);
                    return;
            }

            let outputFilePrefix = paramObject.timestamp + "-" + paramObject.outputFilePrefix;
            let outputFileFolder = rootPath + "users/" + user + "/visualizations/";
            let fullOutputFilePath = outputFileFolder + outputFilePrefix;
            
            let invocation = "Rscript --vanilla " +
                toolPath + " " + // tool
                rootPath + paramObject.inputFile + " " + // input file path
                fullOutputFilePath;
            let proc = ChildProcess.exec(invocation, invocationCallback);
            proc.on("exit", () => {
                bindEnv(() => { // magic that needs to be here or else meteor throws a fit
                    console.log("PATH: " + path.join(rootPath, "users", user, "visualizations"));
                    let visualizationList = readdirSync(path.join(rootPath, "users", user, "visualizations"));
                    let serverImagePath = "/img/" + user + "/";

                    generatedVisualizations = visualizationList.filter(f => f.startsWith(outputFilePrefix));
                    generatedVisualizations = generatedVisualizations.map(f => serverImagePath + f);
                    console.log("initial files: " + visualizationList);
                    console.log("visualization generated: " + generatedVisualizations);

                    Comms.insert({
                        type: "visualization",
                        time: new Date().getTime(),
                        createdAt: visualizationId,
                        createdBy: user,
                        images: generatedVisualizations
                    });
                });
            });
        },

        // username: str
        createUserDirectories(username) {
            if (!username) return;

            errorCallback = (err, username, subdirectrory) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`User directory users/${username}/${subdirectrory} created successfully`);
                }
            };

            let userPath = path.join(path.join(rootPath, 'users'));

            fs.mkdir(userPath, (err) => { console.log(err); });
            fs.mkdir(path.join(userPath, username), (err) => {
                errorCallback(err, username, "");
            });
            fs.mkdir(path.join(userPath, username, 'data'), (err) => {
                errorCallback(err, username, "data");
            });
            fs.mkdir(path.join(userPath, username, 'visualizations'), (err) => {
                errorCallback(err, username, "visualizations");
            });
        },

        // visualizationInfo: {
        //     createdBy: str
        //     createdAt: str
        //     images: list of str
        // }
        saveVisualization(visualizationInfo) {
            Visualizations.insert({
                createdBy: visualizationInfo.createdBy,
                createdAt: visualizationInfo.createdAt,
                images: visualizationInfo.images,
                name: visualizationInfo.name,
                description: visualizationInfo.description
            });
        },

        shareVisualization(sharedWith, visualizationId) {
            // add entry to shares database if not present
            let userShares = Shares.find({username: sharedWith}).fetch();
            if (userShares.length === 0) {
                Shares.insert({
                    username: sharedWith,
                    shares: []
                });   
            }

            Shares.update(
                { username: sharedWith },
                {
                    $addToSet: {
                        shares: visualizationId
                    }
                }
            );
        },

        userExists(username) {
            let users = Meteor.users.find({}).fetch();
            for (let i = 0; i < users.length; i++) {
                if (username == users[i].emails[0].address){ console.log("found"); return true; }
            }

            return false;
        },

        deleteVisualization(visualizationId) {
            Visualizations.remove({createdAt: visualizationId});
        },

        undoDeletion(visualizationInfo) {
            Visualizations.insert(visualizationInfo);
        }
    });
}

invocationCallback = (error, stdout, stderr) => {
    if (error) {
      console.error(`\n========== ERROR OUTPUT ==========\n\n${error.message}`);
      return;
    }
  
    if (stderr) {
      console.error(`\n========== STDERR OUTPUT ==========\n\n${stderr}`);
    }
  
    console.log(`\n========== STDOUT OUTPUT ==========\n\n${stdout}`);
};