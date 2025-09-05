"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerQuestionAboutResume = answerQuestionAboutResume;
const conversationService_1 = require("./conversationService");
const geminiService_1 = require("./geminiService");
// Check if we have a valid Gemini API key
const hasValidApiKey = Boolean(process.env.GEMINI_API_KEY);
/**
 * AI-powered question answering service using Gemini
 */
async function answerQuestionAboutResume(question, resume, sessionId) {
    // Check if we have a valid API key, if not, use fallback immediately
    if (!hasValidApiKey) {
        console.log('No valid Gemini API key found, using enhanced fallback system');
        return fallbackAnswer(question, resume);
    }
    try {
        // Get or create conversation context
        let context = sessionId ? (0, conversationService_1.getConversationContext)(sessionId) : null;
        if (!context && sessionId) {
            context = (0, conversationService_1.createConversationContext)(sessionId, resume);
        }
        // Create a comprehensive context from the resume
        const resumeContext = createResumeContext(resume);
        const contextualInfo = context ? (0, conversationService_1.getContextualPrompt)(context, resume) : '';
        const systemPrompt = `You are an expert HR analyst and resume reviewer with 15+ years of experience. Your job is to analyze resumes and provide accurate, detailed answers about candidates.

RESUME DATA:
${resumeContext}${contextualInfo}

ANALYSIS GUIDELINES:
1. **Accuracy First**: Only provide information that is explicitly stated in the resume
2. **Be Specific**: Include exact details like company names, job titles, dates, skills, and achievements
3. **Professional Tone**: Write as if you're briefing a hiring manager or recruiter
4. **Context Matters**: Consider the full context of the candidate's career progression
5. **Missing Information**: If something isn't in the resume, say "This information is not provided in the resume"
6. **Quantify When Possible**: Mention specific achievements, years of experience, or metrics if available
7. **Use Conversation Context**: Reference previous questions and answers when relevant

QUESTION TYPES & RESPONSES:
- **Skills Questions**: List ALL relevant skills with context (e.g., "2+ years of React experience")
- **Experience Questions**: Provide role progression, key responsibilities, and achievements
- **Education Questions**: Include degrees, institutions, graduation years, and relevant coursework
- **Contact Questions**: Provide exact contact information as listed
- **Career Questions**: Analyze career progression, gaps, and trajectory
- **Technical Questions**: Detail specific technologies, frameworks, and proficiency levels
- **Follow-up Questions**: Build on previous answers and provide deeper insights

RESPONSE FORMAT:
- Start with a direct answer
- Provide supporting evidence from the resume
- Include relevant context or implications
- Be conversational but professional
- Reference previous conversation when helpful

Remember: You are analyzing a real person's career. Be respectful, accurate, and helpful.`;
        const fullPrompt = `${systemPrompt}\n\nUser Question: ${question}`;
        const geminiResponse = await (0, geminiService_1.generateContentWithGemini)(fullPrompt);
        const answer = geminiResponse.answer;
        // Add question and answer to conversation context
        if (context && sessionId) {
            (0, conversationService_1.addQuestionToContext)(sessionId, question, answer);
        }
        return {
            answer,
            confidence: 0.9, // High confidence for AI responses
            sources: ['resume_content', 'gemini_ai']
        };
    }
    catch (error) {
        const message = error?.message || 'Unknown error';
        console.error('Gemini API error:', message);
        // Fallback to rule-based answering if Gemini fails
        return fallbackAnswer(question, resume);
    }
}
function createResumeContext(resume) {
    let context = "RESUME INFORMATION:\n\n";
    if (resume.structuredData.name) {
        context += `Name: ${resume.structuredData.name}\n`;
    }
    if (resume.structuredData.email) {
        context += `Email: ${resume.structuredData.email}\n`;
    }
    if (resume.structuredData.phone) {
        context += `Phone: ${resume.structuredData.phone}\n`;
    }
    if (resume.structuredData.skills && resume.structuredData.skills.length > 0) {
        context += `Skills: ${resume.structuredData.skills.join(', ')}\n`;
    }
    if (resume.structuredData.experience && resume.structuredData.experience.length > 0) {
        context += "\nWork Experience:\n";
        resume.structuredData.experience.forEach((exp, index) => {
            context += `${index + 1}. ${exp.title} at ${exp.company}\n`;
            if (exp.description) {
                context += `   Description: ${exp.description}\n`;
            }
        });
    }
    if (resume.structuredData.education && resume.structuredData.education.length > 0) {
        context += "\nEducation:\n";
        resume.structuredData.education.forEach((edu, index) => {
            context += `${index + 1}. ${edu.degree} from ${edu.institution}`;
            if (edu.year) {
                context += ` (${edu.year})`;
            }
            context += "\n";
        });
    }
    context += "\nFull Resume Text:\n";
    context += resume.rawText;
    return context;
}
function fallbackAnswer(question, resume) {
    const q = question.toLowerCase();
    const { structuredData, rawText } = resume;
    // Handle specific question types with more detailed responses
    if (q.includes('name') || q.includes('who is')) {
        return {
            answer: structuredData.name
                ? `The candidate's name is ${structuredData.name}.`
                : "The candidate's name is not clearly specified in the resume.",
            confidence: 0.9,
            sources: ['resume_content']
        };
    }
    if (q.includes('email') || q.includes('contact')) {
        const contactInfo = [];
        if (structuredData.email)
            contactInfo.push(`Email: ${structuredData.email}`);
        if (structuredData.phone)
            contactInfo.push(`Phone: ${structuredData.phone}`);
        return {
            answer: contactInfo.length > 0
                ? `Contact information: ${contactInfo.join(', ')}`
                : "Contact information is not provided in the resume.",
            confidence: 0.9,
            sources: ['resume_content']
        };
    }
    if (q.includes('phone') || q.includes('number')) {
        return {
            answer: structuredData.phone
                ? `Phone number: ${structuredData.phone}`
                : "Phone number is not provided in the resume.",
            confidence: 0.9,
            sources: ['resume_content']
        };
    }
    if (q.includes('skill') || q.includes('technology') || q.includes('programming') || q.includes('expertise')) {
        const skills = structuredData.skills || [];
        if (skills.length > 0) {
            const skillCategories = categorizeSkills(skills);
            let response = `The candidate has expertise in the following areas:\n`;
            for (const [category, skillList] of Object.entries(skillCategories)) {
                if (skillList.length > 0) {
                    response += `• ${category}: ${skillList.join(', ')}\n`;
                }
            }
            return {
                answer: response.trim(),
                confidence: 0.8,
                sources: ['resume_content']
            };
        }
        return {
            answer: "No specific technical skills are clearly listed in the resume.",
            confidence: 0.7,
            sources: ['resume_content']
        };
    }
    if (q.includes('experience') || q.includes('work') || q.includes('job') || q.includes('career')) {
        const experience = structuredData.experience || [];
        if (experience.length > 0) {
            let response = `Work Experience:\n`;
            experience.forEach((exp, index) => {
                response += `${index + 1}. ${exp.title}`;
                if (exp.company)
                    response += ` at ${exp.company}`;
                if (exp.duration)
                    response += ` (${exp.duration})`;
                response += '\n';
                if (exp.description)
                    response += `   ${exp.description}\n`;
            });
            return {
                answer: response.trim(),
                confidence: 0.8,
                sources: ['resume_content']
            };
        }
        return {
            answer: "Work experience details are not clearly structured in the resume.",
            confidence: 0.6,
            sources: ['resume_content']
        };
    }
    if (q.includes('education') || q.includes('degree') || q.includes('university') || q.includes('college')) {
        const education = structuredData.education || [];
        if (education.length > 0) {
            let response = `Education:\n`;
            education.forEach((edu, index) => {
                response += `${index + 1}. ${edu.degree}`;
                if (edu.institution)
                    response += ` from ${edu.institution}`;
                if (edu.year)
                    response += ` (${edu.year})`;
                response += '\n';
            });
            return {
                answer: response.trim(),
                confidence: 0.8,
                sources: ['resume_content']
            };
        }
        return {
            answer: "Education details are not clearly structured in the resume.",
            confidence: 0.6,
            sources: ['resume_content']
        };
    }
    if (q.includes('summary') || q.includes('objective') || q.includes('profile')) {
        if (structuredData.summary) {
            return {
                answer: `Professional Summary: ${structuredData.summary}`,
                confidence: 0.8,
                sources: ['resume_content']
            };
        }
    }
    if (q.includes('years') && q.includes('experience')) {
        const experience = structuredData.experience || [];
        const yearsEstimate = experience.length * 1.5; // Rough estimate
        return {
            answer: `Based on the resume, the candidate appears to have approximately ${Math.round(yearsEstimate)} years of professional experience across ${experience.length} positions.`,
            confidence: 0.6,
            sources: ['resume_content']
        };
    }
    // Enhanced keyword search with context
    const keywords = q.split(/\W+/).filter(w => w.length > 3);
    const sentences = rawText.split(/[.?!\n]+/).map(s => s.trim()).filter(Boolean);
    const relevantSentences = [];
    for (const sentence of sentences) {
        const sl = sentence.toLowerCase();
        const keywordMatches = keywords.filter(keyword => sl.includes(keyword));
        if (keywordMatches.length > 0) {
            relevantSentences.push({
                sentence,
                matches: keywordMatches.length,
                confidence: Math.min(0.7, 0.4 + (keywordMatches.length * 0.1))
            });
        }
    }
    if (relevantSentences.length > 0) {
        // Sort by relevance and return the best match
        relevantSentences.sort((a, b) => b.matches - a.matches);
        const bestMatch = relevantSentences[0];
        return {
            answer: bestMatch.sentence,
            confidence: bestMatch.confidence,
            sources: ['resume_content']
        };
    }
    return {
        answer: "I couldn't find specific information about that in the resume. You can ask about:\n• Skills and technologies\n• Work experience and career history\n• Education and qualifications\n• Contact information\n• Professional summary",
        confidence: 0.3,
        sources: ['resume_content']
    };
}
function categorizeSkills(skills) {
    const categories = {
        'Programming Languages': [],
        'Web Technologies': [],
        'Databases': [],
        'Cloud & DevOps': [],
        'Tools & Frameworks': [],
        'Other Skills': []
    };
    const skillMap = {
        'Programming Languages': ['javascript', 'python', 'java', 'typescript', 'c++', 'c#', 'ruby', 'go', 'swift', 'kotlin', 'php', 'rust', 'scala'],
        'Web Technologies': ['react', 'angular', 'vue', 'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind', 'jquery', 'node.js', 'express'],
        'Databases': ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sqlite', 'cassandra'],
        'Cloud & DevOps': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd'],
        'Tools & Frameworks': ['git', 'github', 'gitlab', 'jira', 'confluence', 'slack', 'figma', 'sketch', 'photoshop', 'agile', 'scrum', 'kanban', 'devops']
    };
    for (const skill of skills) {
        let categorized = false;
        for (const [category, categorySkills] of Object.entries(skillMap)) {
            if (categorySkills.some(catSkill => skill.toLowerCase().includes(catSkill))) {
                categories[category].push(skill);
                categorized = true;
                break;
            }
        }
        if (!categorized) {
            categories['Other Skills'].push(skill);
        }
    }
    // Remove empty categories
    Object.keys(categories).forEach(key => {
        if (categories[key].length === 0) {
            delete categories[key];
        }
    });
    return categories;
}
