// file uploding code courtesy of https://gist.github.com/dariocravero/3922137

/**
 * TODO support other encodings:
 * http://stackoverflow.com/questions/7329128/how-to-write-binary-data-to-a-file-using-node-js
 */

Meteor.methods({
    //saveFile: function(blob, name, path, encoding) {
    "saveFile"(blob, name, path, encoding) {
        var path = cleanPath(path);
        var fs = Npm.require('fs');
        var name = cleanName(name || 'file');
        var encoding = encoding || 'binary';
        var chroot = Meteor.chroot || '../../../../../public';

        console.log(name);
        console.log(path);
        console.log(encoding);

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
    }
});