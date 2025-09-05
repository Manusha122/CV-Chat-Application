import { Request, Response } from "express";
import { parseResumeBuffer, storeParsedResume, getParsedResume } from "../services/resumeParser";
import { answerQuestionAboutResume } from "../services/aiService";

// POST /chat/upload
export async function uploadCV(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded. Use form-data 'file'." });
  }

  const buffer = req.file.buffer;
  try {
    const parsedResume = await parseResumeBuffer(buffer, req.file.originalname);
    // Create session id (timestamp-based)
    const sessionId = `s_${Date.now()}`;
    storeParsedResume(sessionId, parsedResume);
    
    // Provide summary of what was extracted
    const summary = createUploadSummary(parsedResume);
    
    res.json({ 
      sessionId, 
      message: "CV uploaded and parsed successfully.",
      summary
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || "Failed to parse resume." });
  }
}

// POST /chat/ask
// body: { sessionId, question }
export async function askQuestion(req: Request, res: Response) {
  const { sessionId, question } = req.body;
  if (!sessionId || !question) {
    return res.status(400).json({ error: "sessionId and question are required." });
  }

  const parsedResume = getParsedResume(sessionId);
  if (!parsedResume) {
    return res.status(404).json({ error: "Parsed resume not found. Upload first." });
  }

  try {
    // Use AI service for intelligent question answering with conversation context
    const aiResponse = await answerQuestionAboutResume(question, parsedResume, sessionId);
    
    res.json({ 
      answer: aiResponse.answer,
      confidence: aiResponse.confidence,
      sources: aiResponse.sources
    });
  } catch (err: any) {
    console.error('Question answering error:', err);
    res.status(500).json({ error: "Failed to process question. Please try again." });
  }
}

function createUploadSummary(parsedResume: any) {
  const { structuredData } = parsedResume;
  const summary = [];
  
  if (structuredData.name) {
    summary.push(`Name: ${structuredData.name}`);
  }
  
  if (structuredData.skills && structuredData.skills.length > 0) {
    summary.push(`Skills found: ${structuredData.skills.length} skills`);
  }
  
  if (structuredData.experience && structuredData.experience.length > 0) {
    summary.push(`Experience: ${structuredData.experience.length} positions`);
  }
  
  if (structuredData.education && structuredData.education.length > 0) {
    summary.push(`Education: ${structuredData.education.length} entries`);
  }
  
  return summary.length > 0 ? summary.join(', ') : 'Basic text extracted';
}
