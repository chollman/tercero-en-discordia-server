const fs = require("fs");

exports.setImageInObject = (object, image) => {
    if (image) {
        object.data = fs.readFileSync(image.path);
        object.contentType = image.type;
    }
};
