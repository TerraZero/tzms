const Controller = use('controllers/Controller');
const formidable = require('formidable');
const fs = require('fs');

module.exports = class UserController extends Controller {

  /**
    * @Controller('/user/:id')
    */
  user(params) {
    if (this.req().method === 'POST') {
      var form = new formidable.IncomingForm();

      form.parse(this.req(), (err, fields, files) => {
        console.log(err);
        console.log(fields);
        console.log(files);
        var oldpath = files.filetoupload.path;
        var newpath = use._root + '/files/' + files.filetoupload.name;

        fs.readFile(oldpath, (err, data) => {
          if (err) throw err;
          console.log('File readed!');
          fs.writeFile(newpath, data, function (err) {
            if (err) throw err;
            console.log('File written!');
            fs.unlink(oldpath, function (err) {
              if (err) throw err;
              console.log('File deleted!');
            });
          });
        });
      });
    } else {
      this.res().write('<html><body><form method="post" enctype="multipart/form-data"><input type="text" name="name"><input type="file" name="filetoupload"><input type="submit"></form></body></html>');
    }
  }

}
