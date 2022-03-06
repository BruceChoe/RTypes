// file uploding code courtesy of https://gist.github.com/dariocravero/3922137

import { Meteor } from 'meteor/meteor';

import { Users } from '/imports/api/users';
import { Comms } from './comms';

import ChildProcess from 'child_process';
import fs from 'fs';
import path from 'path';
import process from 'process';

const rootPath = '../../../../../';
const bindEnv = Meteor.bindEnvironment((callback) => {callback();});

if (Meteor.isServer)
{
    Meteor.methods({
        "saveFile"(user, blob, name, path, encoding) {
            name = "users\\" + user + "\\data\\" + name;
            encoding = encoding || 'binary';
            chroot = Meteor.chroot || rootPath;
        
            // TODO Add file existance checks, etc...
            // synchronous because we want fileWriteTime to be set when the upload finishes
            fs.writeFileSync(chroot + name, blob, encoding, (err) => {
                if (err) {
                    throw (new Meteor.Error(500, 'Failed to save file.', err));
                }
            });

            let fileWriteTime = new Date().getTime();
            console.log('The file ' + name + ' (' + encoding + ') was saved at ' + fileWriteTime);
    
            Users.update(
                { username: user },
                {
                    $push: {
                        visualizations: {
                            createdAt: fileWriteTime,
                            source_dataset: name,
                            visualizations: []
                        }
                    }
                }
            );

            Comms.insert({
                type: "file-upload-complete",
                time: fileWriteTime,
                serverName: name
            });
        },

        // paramsObject: a JSON object of parameters
        "invokeProcess"(paramObject) {
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
                case "CIMLR":
                    console.log("CIMLR detected");
                    toolPath = path.join(rootPath, "scripts", "CIMLRSingleSetNoParallel.R");
                    console.log(toolPath);
                    break;
                default:
                    console.log("Unknown tool " + paramObject.toolName);
                    return;
            }

            let invocation = "Rscript.exe --vanilla " + toolPath + " penis";
            let proc = ChildProcess.exec(invocation, invocationCallback);
            proc.on("exit", () => {
                bindEnv(() => // magic that needs to be here or else meteor throws a fit
                    Comms.insert({
                        type: "visualization",
                        time: new Date().getTime(),
                        path: "/old/FDkcVr5acAEk04i.jfif"
                    }));
            });
        },

        // username: str
        "createUserDirectories"(username) {
            if (!username) return;

            function errorCallback(err, username, subdirectrory) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`User directory users/${username}/${subdirectrory} created successfully`);
                }
            }

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
        }
    });
}

function invocationCallback(error, stdout, stderr) {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }
  
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
  
    console.log(`stdout: ${stdout}`);
}

function errorCallback(error) {
    console.log(error);
}