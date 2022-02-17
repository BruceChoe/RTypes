// file uploding code courtesy of https://gist.github.com/dariocravero/3922137

import { Meteor } from 'meteor/meteor';

import { Users } from '/imports/api/users';

import childProcess from 'child_process';
import fs from 'fs';
import path from 'path';
import { Comms } from './comms';

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

            var path = cleanPath(path);
            var fs = Npm.require('fs');
            var name = cleanName(name || 'file');
            var encoding = encoding || 'binary';
            var chroot = Meteor.chroot || rootPath;

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

        // parameters: list of parameters, one token at a time
        "invokeProcess"(tokens) {        
            if (tokens.length === 0) return;

            // Comms.insert({true: true});
            // Meteor.publish(null, function() { return Comms.find({}); });
            // console.log("sfsdf");

            // return;

            let invocation = tokens[0];
            for (let i = 1; i < tokens.length; i++)
            {
                invocation += " " + tokens[i];
            }
            
            let proc = childProcess.exec(invocation, invocationCallback);
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