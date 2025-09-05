"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResumeBuffer = parseResumeBuffer;
exports.storeParsedResume = storeParsedResume;
exports.getParsedResume = getParsedResume;
// pdf-parse lacks types in some setups
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
/**
 * Enhanced resume parser that extracts both raw text and structured data
 */
async function parseResumeBuffer(buffer, filename = "file") {
    const lower = filename.toLowerCase();
    let rawText = "";
    // Parse based on file type
    if (lower.endsWith(".txt")) {
        rawText = buffer.toString("utf-8");
    }
    else if (lower.endsWith(".docx")) {
        try {
            const result = await mammoth_1.default.extractRawText({ buffer });
            rawText = result.value;
        }
        catch (err) {
            rawText = buffer.toString("utf-8");
        }
    }
    else {
        // Default to PDF parsing
        try {
            const data = await (0, pdf_parse_1.default)(buffer);
            rawText = (data.text || "").replace(/\r/g, "\n");
        }
        catch (err) {
            rawText = buffer.toString("utf-8");
        }
    }
    // Extract structured data
    const structuredData = extractStructuredData(rawText);
    return {
        rawText,
        structuredData
    };
}
function extractStructuredData(text) {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const structuredData = {
        skills: [],
        experience: [],
        education: []
    };
    // Extract name (improved logic)
    structuredData.name = extractName(text, lines);
    // Extract contact information
    structuredData.email = extractEmail(text);
    structuredData.phone = extractPhone(text);
    // Extract skills with context
    structuredData.skills = extractSkills(text);
    // Extract experience with better parsing
    structuredData.experience = extractExperience(text, lines);
    // Extract education with better parsing
    structuredData.education = extractEducation(text, lines);
    // Extract summary/objective
    structuredData.summary = extractSummary(text, lines);
    return structuredData;
}
function extractName(text, lines) {
    // Try multiple strategies to find the name
    for (let i = 0; i < Math.min(5, lines.length); i++) {
        const line = lines[i];
        // Skip if line contains email, phone, or URL
        if (line.includes('@') || line.includes('http') || line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)) {
            continue;
        }
        // Look for name patterns (2-4 words, proper case, reasonable length)
        if (line.length > 2 && line.length < 50 && /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(line)) {
            return line;
        }
    }
    return undefined;
}
function extractEmail(text) {
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    return emailMatch ? emailMatch[0] : undefined;
}
function extractPhone(text) {
    const phonePatterns = [
        /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
        /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
        /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/
    ];
    for (const pattern of phonePatterns) {
        const match = text.match(pattern);
        if (match)
            return match[0];
    }
    return undefined;
}
function extractSkills(text) {
    const skillCategories = {
        programming: ['javascript', 'python', 'java', 'typescript', 'c++', 'c#', 'ruby', 'go', 'swift', 'kotlin', 'php', 'rust', 'scala'],
        web: ['react', 'angular', 'vue', 'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind', 'jquery', 'node.js', 'express'],
        databases: ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sqlite', 'cassandra'],
        cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd'],
        mobile: ['react native', 'flutter', 'ios', 'android', 'xamarin', 'ionic'],
        data: ['machine learning', 'ai', 'data science', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'r', 'matplotlib'],
        tools: ['git', 'github', 'gitlab', 'jira', 'confluence', 'slack', 'figma', 'sketch', 'photoshop'],
        methodologies: ['agile', 'scrum', 'kanban', 'devops', 'tdd', 'bdd', 'microservices', 'rest api', 'graphql'],
        soft: ['leadership', 'communication', 'project management', 'team management', 'problem solving', 'analytical thinking']
    };
    const foundSkills = [];
    const lowerText = text.toLowerCase();
    for (const [category, skills] of Object.entries(skillCategories)) {
        for (const skill of skills) {
            if (lowerText.includes(skill.toLowerCase())) {
                foundSkills.push(skill);
            }
        }
    }
    // Remove duplicates and return
    return [...new Set(foundSkills)];
}
function extractExperience(text, lines) {
    const experience = [];
    // Look for experience section
    const experienceKeywords = ['experience', 'work history', 'employment', 'career', 'professional experience'];
    let inExperienceSection = false;
    let currentExperience = null;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lowerLine = line.toLowerCase();
        // Check if we're entering experience section
        if (experienceKeywords.some(keyword => lowerLine.includes(keyword))) {
            inExperienceSection = true;
            continue;
        }
        if (inExperienceSection) {
            // Look for job title patterns
            const titlePatterns = [
                /\b(senior|lead|principal|staff|junior|mid|senior|sr\.?|jr\.?)\s+(engineer|developer|analyst|consultant|manager|director|specialist|coordinator|architect|scientist|designer|programmer)/i,
                /\b(software|web|frontend|backend|full.?stack|mobile|data|devops|cloud|security|qa|test)\s+(engineer|developer|architect|specialist)/i,
                /\b(product|project|program|technical|engineering|development)\s+(manager|lead|director|coordinator)/i
            ];
            const isTitle = titlePatterns.some(pattern => pattern.test(line));
            if (isTitle && line.length > 5 && line.length < 100) {
                // Save previous experience if exists
                if (currentExperience) {
                    experience.push(currentExperience);
                }
                currentExperience = {
                    title: line,
                    company: '',
                    duration: '',
                    description: ''
                };
            }
            else if (currentExperience && !currentExperience.company && line.length > 2 && line.length < 100) {
                // Next line after title is usually company
                currentExperience.company = line;
            }
            else if (currentExperience && line.match(/\d{4}[-.\s]?(to|present|current|now|\d{4})/i)) {
                // Duration line
                currentExperience.duration = line;
            }
            else if (currentExperience && line.length > 10) {
                // Description line
                currentExperience.description += (currentExperience.description ? ' ' : '') + line;
            }
        }
    }
    // Add the last experience if exists
    if (currentExperience) {
        experience.push(currentExperience);
    }
    return experience;
}
function extractEducation(text, lines) {
    const education = [];
    const educationKeywords = ['education', 'academic', 'degree', 'university', 'college', 'bachelor', 'master', 'phd', 'diploma', 'certificate'];
    let inEducationSection = false;
    let currentEducation = null;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lowerLine = line.toLowerCase();
        // Check if we're entering education section
        if (educationKeywords.some(keyword => lowerLine.includes(keyword))) {
            inEducationSection = true;
            continue;
        }
        if (inEducationSection) {
            // Look for degree patterns
            const degreePatterns = [
                /\b(bachelor|master|phd|doctorate|b\.?s\.?|m\.?s\.?|mba|associate|diploma|certificate)\b/i,
                /\b(computer science|engineering|business|mathematics|physics|chemistry|biology|economics|psychology|english|history)\b/i
            ];
            const isDegree = degreePatterns.some(pattern => pattern.test(line));
            if (isDegree && line.length > 5 && line.length < 100) {
                // Save previous education if exists
                if (currentEducation) {
                    education.push(currentEducation);
                }
                currentEducation = {
                    degree: line,
                    institution: '',
                    year: ''
                };
            }
            else if (currentEducation && !currentEducation.institution && line.length > 2 && line.length < 100) {
                // Next line after degree is usually institution
                currentEducation.institution = line;
            }
            else if (currentEducation && line.match(/\d{4}/)) {
                // Year line
                currentEducation.year = line;
            }
        }
    }
    // Add the last education if exists
    if (currentEducation) {
        education.push(currentEducation);
    }
    return education;
}
function extractSummary(text, lines) {
    const summaryKeywords = ['summary', 'objective', 'profile', 'about', 'overview'];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if (summaryKeywords.some(keyword => line.includes(keyword))) {
            // Look for summary content in the next few lines
            let summary = '';
            for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                if (lines[j].length > 10) {
                    summary += (summary ? ' ' : '') + lines[j];
                }
            }
            if (summary.length > 20) {
                return summary;
            }
        }
    }
    return undefined;
}
// In-memory store: sessionId -> ParsedResume
const store = new Map();
function storeParsedResume(sessionId, resume) {
    store.set(sessionId, resume);
}
function getParsedResume(sessionId) {
    return store.get(sessionId);
}
