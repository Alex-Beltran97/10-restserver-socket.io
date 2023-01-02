const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadFile = (
  files,
  allowedExtentions = ["png", "jpg", "jpeg", "gif"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const slicedName = file.name.split(".");
    const extention = slicedName[slicedName.length - 1];

    const allowdExtentions = ["png", "jpg", "jpeg", "gif"];

    if (!allowedExtentions.includes(extention)) {
      return reject(
        `The extention ${extention} is not allowed - ${allowdExtentions}`
      );
    }

    const tempFileName = uuidv4() + "." + extention;
    const uploadPath = path.join(__dirname, "../uploads/", folder, tempFileName);

    file.mv(uploadPath, ( err ) => {
      if ( err ) return reject( err );
      
      resolve( tempFileName  );
    });
  });
};

module.exports = {
  uploadFile,
};
