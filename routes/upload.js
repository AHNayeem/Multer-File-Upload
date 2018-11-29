var express = require('express');
var multer  = require('multer');
var path = require('path');
var router = express.Router();

//Set Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

//Init Upload
const upload = multer({
  storage: storage,
  limits: {fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check file type
function checkFileType(file, cb){
  // Allowed ext 
  const filetypes = /jpeg|jpg|png|gif/;
  //check ext 
  extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // check mime 
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  }else{
    cb('Error: Upload Images only!');
  }
}
/* GET home page. */
router.get('/', function(req, res, next) {
	var data = {
    title: 'Upload Photo',
    data: true
  }
  res.render('upload', data);
});
router.post('/', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('upload', {
        msg: err
      });
    }else{
      // console.log(req.file);
      if(req.file == undefined){
        res.render('upload', {
          msg: 'Error: No File Selected!'
        });
      }else{
        res.render('upload', {
          msg: 'File Uploaded Successfully!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

module.exports = router;
