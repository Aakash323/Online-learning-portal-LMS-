import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.mimetype.startsWith("video/")) {
      cb(null, "uploads/videos/");
    } else if (file.mimetype === "application/pdf") {
      cb(null, "uploads/pdfs/");
    } else if (file.mimetype.startsWith("image/")) {
      cb(null, "uploads/images/");
    } else {
      cb(new Error("Unsupported file format"), false);
    }
  },
  filename(req, file, cb) {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
