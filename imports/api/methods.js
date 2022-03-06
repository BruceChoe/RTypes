// file uploding code courtesy of https://gist.github.com/dariocravero/3922137

import { Meteor } from 'meteor/meteor';

import { Users } from '/imports/api/users';
import { Comms } from './comms';

import ChildProcess from 'child_process';
import fs from 'fs';
import path from 'path';
import process from 'process';

const rootPath = '../../../../../';

if (Meteor.isServer)
{
    Meteor.methods({
        "saveFile"(user, blob, name, path, encoding) {
            name = "users\\" + user + "\\data\\" + name;
            Users.update(
                { username: user },
                {
                    $push: {
                        visualizations: {
                            source_dataset: name,
                            visualizations: []
                        }
                    }
                }
            );

            path = cleanPath(path);
            var fs = Npm.require('fs');
            name = cleanName(name || 'file');
            encoding = encoding || 'binary';
            chroot = Meteor.chroot || rootPath;

            // console.log(name);
            // console.log(path);
            // console.log(encoding);

            // Clean up the path. Remove any initial and final '/' -we prefix them-,
            // any sort of attempt to go to the parent directory '..' and any empty directories in
            // between '/////' - which may happen after removing '..'
            path = chroot + (path ? '/' + path + '/' : '/');
        
            // TODO Add file existance checks, etc...
            fs.writeFile(path + name, blob, encoding, function(err) {
                if (err) {
                    throw (new Meteor.Error(500, 'Failed to save file.', err));
                } else {
                    console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
                }
            }); 
    
            function cleanPath(str) {
                if (str) {
                    return str.replace(/\.\./g,'').replace(/\/+/g,'').
                        replace(/^\/+/,'').replace(/\/+$/,'');
                }
            }

            function cleanName(str) {
                return str.replace(/\.\./g,'').replace(/\//g,'');
            }
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

            let invocation = "Rscript.exe --vanilla " + toolPath;
            let proc = childProcess.exec(invocation, invocationCallback);

            Comms.insert({
                type: "visualization",
                time: new Date().getTime(),
                path: "/old/FDkcVr5acAEk04i.jfif"
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