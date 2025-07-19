// services/imageKitService.js
const imageKit = require("../imagekit");

const uploadImage = async (imageBuffer, fileName) => {
  try {
    console.log("Uploading image to ImageKit...");
    const uploadedImage = await imageKit.upload({
      file: imageBuffer, // The image buffer from the uploaded file
      fileName: `/levelpay/${fileName}`, // Save to the 'levelpay' folder
      useUniqueFileName: true, // Ensures the file name is unique
    });

    console.log("Image uploaded successfully.");
    console.log(uploadedImage);

    return JSON.stringify(uploadedImage); // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image to ImageKit:", error);
    throw new Error("Error uploading image");
  }
};


const removeImageFromImagekit = async (fileId) => {
  try {
    if (!fileId) throw new Error("fileId is required to remove image");

    console.log("Removing image from ImageKit...", fileId);
    const response = await imageKit.deleteFile(fileId);
    console.log("Image removed successfully.");
    return response; // Usually returns { success: true }
  } catch (error) {
    console.error("Error removing image from ImageKit:", error);
    throw new Error("Error removing image");
  }
};
module.exports = { uploadImage, removeImageFromImagekit };
