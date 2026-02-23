const multer = require("multer");
const path = require("path");

// storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");  // store images in uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// file filter (only images allowed)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|webp/;

    const isValid = 
        allowedTypes.test(file.mimetype) &&
        allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isValid)
        cb(null, true);
    else 
        cb(new Error("Only images are allowed"), false);
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;