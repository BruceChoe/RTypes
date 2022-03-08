import { Meteor } from 'meteor/meteor';
import { Picker } from 'meteor/communitypackages:picker';

import fs from 'fs';

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