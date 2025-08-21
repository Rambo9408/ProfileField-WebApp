const multer = require('multer');
const path = require('path');
/* "Fs" is a built-in Node.js module that allows you to work with the file system on your computer — such as reading from, writing to,
 updating, deleting, and interacting with files and directories. */
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // const uploadType = req.body.uploadType || 'others';
        // const folderPath = path.join(__dirname, '..', 'uploads', uploadType);
        const folderPath = path.join(__dirname, "../uploads");

        fs.mkdirSync(folderPath, { recursive: true });

        //Multer uses this callback to get the destination path where the uploaded file should be stored.
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|avif|webp|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    //the MIME type tells the server what kind of file was uploaded — like whether it’s an image, a PDF, a video, etc.
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Images only!"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit per file
    }
});

module.exports = upload;
