import cloudinary from "./cloudinary.js";

/**
 * Uploads a file buffer to Cloudinary via stream.
 * Used with multer memoryStorage so the file never touches disk.
 */
export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "vault", resource_type: "auto" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};
