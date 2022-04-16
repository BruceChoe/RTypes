import { Meteor } from 'meteor/meteor';
import { Picker } from 'meteor/communitypackages:picker';

import fs from 'fs';

import uploader from 'huge-uploader-nodejs';
import admZip from 'adm-zip';
import { Comms } from '/imports/api/comms.js';
import { Visualizations } from '/imports/api/visualizations.js';

const rootPath = "../../../../../";

Picker.route("/img/:_user/:_name", (params, req, res, next) => {
    console.log(params._user, params._name);
    let imgPath = rootPath + "users/" + params._user + "/visualizations/" + params._name;

    fs.readFile(imgPath, (err, data) => {
        if (err) {
            console.error(err);
            res.writeHeader("404");
            res.end();
            return;
        }

        res.writeHeader("200", {
            "Content-Type": "image/png",
            "Content-Length": data.length
        });
        res.write(data);
        res.end();
    });
});

// visualization donwloads
Picker.route("/download/:_id", (params, req, res, next) => {
    let createdAt = parseInt(params._id);
    console.log(createdAt);
    let visualization = Visualizations.find({createdAt: createdAt}).fetch()[0];
    let images = visualization.images;
    let user = visualization.createdBy;
    console.log(visualization);

    let zip = new admZip();
    let userImagesDir = rootPath + "users/" + user + "/visualizations/";
    let userImageFilenames = images.map(path => userImagesDir + path.split("/").pop());
    console.log(userImageFilenames);

    for (let i = 0; i < userImageFilenames.length; i++) {
        zip.addLocalFile(userImageFilenames[i]);
    }
    //zip.writeZip(rootPath + "temp/test.zip");
    
    let zipBuffer = zip.toBuffer();
    res.writeHead(200, {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=${createdAt}.zip`
    });
    res.end(zipBuffer);
});

Picker.route("/upload", (params, req, res, next) => {
    let tmpDir = rootPath + "temp/";
    let maxFileSize = 10;
    let maxChunkSize = 10;

    if (!fs.existsSync(tmpDir))
    {
        fs.mkdir(tmpDir, err => console.log(err));
    }

    uploader(req, tmpDir, maxFileSize, maxChunkSize)
        .then((assembleChunks) => {
            res.writeHead(204, "No content");
            res.end();

            if (assembleChunks) {
                assembleChunks()
                    .then((data) => {
                        let saveTime = new Date().getTime();
                        let username = data.postParams.username;
                        let filename = data.postParams.filename;
                        let tmpPath = rootPath + "temp/" + req.headers["uploader-file-id"];
                        let newName = "users\\" + username + "\\data\\" + saveTime.toString() + "-" + filename;
                        let newPath = rootPath + newName;

                        if (!fs.existsSync(rootPath + "\\users\\" + username))
                        {
                            console.log('not exits');
                            Meteor.call("createUserDirectories", username);
                        }

                        fs.renameSync(tmpPath, newPath);
                        console.log('The file ' + newName + ' was saved at ' + saveTime);
            
                        Comms.insert({
                            type: "file-upload-complete",
                            time: saveTime,
                            serverName: newName
                        });
                    }).catch(err => console.log(err));
            }
        })
        .catch((err) => {
            if (err.message === 'Missing header(s)') {
                res.writeHead(400, 'Bad Request', { 'Content-Type': 'text/plain' });
                res.end('Missing uploader-* header');
                return;
            }

            if (err.message === 'Missing Content-Type') {
                res.writeHead(400, 'Bad Request', { 'Content-Type': 'text/plain' });
                res.end('Missing Content-Type');
                return;
            }

            if (err.message.includes('Unsupported content type')) {
                res.writeHead(400, 'Bad Request', { 'Content-Type': 'text/plain' });
                res.end('Unsupported content type');
                return;
            }

            if (err.message === 'Chunk is out of range') {
                res.writeHead(400, 'Bad Request', { 'Content-Type': 'text/plain' });
                res.end('Chunk number must be between 0 and total chunks - 1 (0 indexed)');
                return;
            }

            if (err.message === 'File is above size limit') {
                res.writeHead(413, 'Payload Too Large', { 'Content-Type': 'text/plain' });
                res.end(`File is too large. Max fileSize is: ${maxFileSize}MB`);
                return;
            }

            if (err.message === 'Chunk is above size limit') {
                res.writeHead(413, 'Payload Too Large', { 'Content-Type': 'text/plain' });
                res.end(`Chunk is too large. Max chunkSize is: ${maxChunkSize}MB`);
                return;
            }

			// this error is triggered if a chunk with uploader-chunk-number header != 0
            // is sent and there is no corresponding temp dir.
            // It means that the upload dir has been deleted in the meantime.
            // Although uploads should be resumable, you can't keep partial uploads for days on your server
            if (err && err.message === 'Upload has expired') {
                res.writeHead(410, 'Gone', { 'Content-Type': 'text/plain' });
                res.end(err.message);
                return;
            }

            // other FS errors
            res.writeHead(500, 'Internal Server Error'); // potentially saturated disk
            res.end();
        });
});