import multer from "multer";

export const upload = multer({
  //store in RAM
  storage: multer.memoryStorage(),
  //to avoid RAM overflow
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  //for security validation
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error("Only JPG, PNG, WebP and PDF allowed");
      err.status = 400;
      cb(err, false);
    }
  },
});
