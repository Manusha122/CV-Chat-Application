"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationContext = getConversationContext;
exports.createConversationContext = createConversationContext;
exports.addQuestionToContext = addQuestionToContext;
exports.getContextualPrompt = getContextualPrompt;
// In-memory store for conversation contexts
const conversationStore = new Map();
function getConversationContext(sessionId) {
    return conversationStore.get(sessionId);
}
function createConversationContext(sessionId, resume) {
    const context = {
        sessionId,
        questions: [],
        extractedInsights: extractInitialInsights(resume)
    };
    conversationStore.set(sessionId, context);
    return context;
}
function addQuestionToContext(sessionId, question, answer) {
    const context = conversationStore.get(sessionId);
    if (context) {
        context.questions.push({
            question,
            answer,
            timestamp: new Date()
        });
        // Update insights based on new information
        updateInsights(context, question, answer);
    }
}
function extractInitialInsights(resume) {
    const { structuredData } = resume;
    // Determine career level based on experience
    let careerLevel = 'Entry Level';
    let yearsExperience = 0;
    if (structuredData.experience && structuredData.experience.length > 0) {
        yearsExperience = structuredData.experience.length * 2; // Rough estimate
        const titles = structuredData.experience.map(exp => exp.title.toLowerCase());
        if (titles.some(title => title.includes('senior') || title.includes('lead') || title.includes('principal'))) {
            careerLevel = 'Senior Level';
        }
        else if (titles.some(title => title.includes('manager') || title.includes('director'))) {
            careerLevel = 'Management Level';
        }
        else if (titles.some(title => title.includes('junior') || title.includes('intern'))) {
            careerLevel = 'Junior Level';
        }
        else {
            careerLevel = 'Mid Level';
        }
    }
    // Determine industry based on skills and experience
    let industry = 'Technology';
    if (structuredData.skills) {
        const skills = structuredData.skills.map(s => s.toLowerCase());
        if (skills.some(s => s.includes('finance') || s.includes('banking'))) {
            industry = 'Finance';
        }
        else if (skills.some(s => s.includes('healthcare') || s.includes('medical'))) {
            industry = 'Healthcare';
        }
        else if (skills.some(s => s.includes('education') || s.includes('teaching'))) {
            industry = 'Education';
        }
        else if (skills.some(s => s.includes('marketing') || s.includes('sales'))) {
            industry = 'Marketing/Sales';
        }
    }
    return {
        keySkills: structuredData.skills || [],
        careerLevel,
        industry,
        yearsExperience,
        recentRole: structuredData.experience?.[0]?.title || 'Unknown'
    };
}
function updateInsights(context, question, answer) {
    const q = question.toLowerCase();
    const a = answer.toLowerCase();
    // Update years of experience if mentioned
    const yearsMatch = a.match(/(\d+)\s*years?\s*(of\s*)?experience/i);
    if (yearsMatch) {
        context.extractedInsights.yearsExperience = parseInt(yearsMatch[1]);
    }
    // Update career level if mentioned
    if (a.includes('senior') || a.includes('lead')) {
        context.extractedInsights.careerLevel = 'Senior Level';
    }
    else if (a.includes('junior') || a.includes('entry')) {
        context.extractedInsights.careerLevel = 'Junior Level';
    }
    else if (a.includes('manager') || a.includes('director')) {
        context.extractedInsights.careerLevel = 'Management Level';
    }
    // Extract additional skills mentioned in answers
    const skillKeywords = ['javascript', 'python', 'react', 'node', 'aws', 'docker', 'kubernetes', 'sql', 'mongodb'];
    for (const skill of skillKeywords) {
        if (a.includes(skill) && !context.extractedInsights.keySkills.includes(skill)) {
            context.extractedInsights.keySkills.push(skill);
        }
    }
}
function getContextualPrompt(context, resume) {
    const { questions, extractedInsights } = context;
    let contextualInfo = `\n\nCONVERSATION CONTEXT:\n`;
    contextualInfo += `Career Level: ${extractedInsights.careerLevel}\n`;
    contextualInfo += `Industry: ${extractedInsights.industry}\n`;
    contextualInfo += `Years of Experience: ${extractedInsights.yearsExperience}\n`;
    contextualInfo += `Recent Role: ${extractedInsights.recentRole}\n`;
    contextualInfo += `Key Skills: ${extractedInsights.keySkills.join(', ')}\n`;
    if (questions.length > 0) {
        contextualInfo += `\nPrevious Questions & Answers:\n`;
        questions.slice(-3).forEach((qa, index) => {
            contextualInfo += `${index + 1}. Q: ${qa.question}\n   A: ${qa.answer.substring(0, 100)}...\n`;
        });
    }
    contextualInfo += `\nUse this context to provide more personalized and relevant answers. Reference previous information when appropriate.`;
    return contextualInfo;
}
