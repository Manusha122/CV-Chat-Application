import { Router } from "express";
import multer from "multer";
import { uploadCV, askQuestion } from "../controllers/chatController";

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Allow PDF, DOCX, and TXT files
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, and TXT files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.post("/upload", upload.single("file"), uploadCV); // form-data: file
router.post("/ask", askQuestion); // { sessionId, question }

export default router;
