import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const isPdf = file.mimetype === "application/pdf";

    if (isImage || isPdf) {
      cb(null, true);
    } else {
      cb(new Error("Only image files or PDFs are allowed!"), false);
    }
  },
});