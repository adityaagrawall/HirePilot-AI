import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface AnalysisResult {
  atsScore: number;
  matchScore: number;
  summary: string;
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  experienceRewrite: string[];
  projects: string[];
  skills: string[];
  certifications: string[];
  interviewQuestions: string[];
  coverLetter: string;
}

function buildPrompt(resumeText: string, jobDescription: string): string {
  return `You are an expert ATS (Applicant Tracking System) analyzer and career coach.

Analyze the following resume against the job description and return a comprehensive analysis.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY a valid JSON object with NO markdown, NO code blocks, NO explanation text. Just the raw JSON.

The JSON must match this exact structure:
{
  "atsScore": <integer 0-100 representing ATS compatibility>,
  "matchScore": <integer 0-100 representing how well the resume matches the job>,
  "summary": "<2-3 sentence overall assessment>",
  "missingKeywords": ["<keyword1>", "<keyword2>", ...],
  "strengths": ["<strength1>", "<strength2>", ...],
  "weaknesses": ["<weakness1>", "<weakness2>", ...],
  "suggestions": ["<actionable suggestion1>", "<actionable suggestion2>", ...],
  "experienceRewrite": ["<rewritten bullet point1>", "<rewritten bullet point2>", ...],
  "projects": ["<suggested project1>", "<suggested project2>", ...],
  "skills": ["<skill to add1>", "<skill to add2>", ...],
  "certifications": ["<certification1>", "<certification2>", ...],
  "interviewQuestions": ["<likely interview question1>", "<likely interview question2>", ...],
  "coverLetter": "<complete professional cover letter tailored to the job>"
}

Rules:
- atsScore: Based on keyword density, formatting compatibility, and ATS parsing friendliness
- matchScore: Based on how many job requirements the resume addresses
- missingKeywords: Keywords from the job description not found in the resume (max 15)
- strengths: What the candidate does well relative to the job (max 6)
- weaknesses: Areas where the resume falls short (max 6)
- suggestions: Specific, actionable improvements to make (max 8)
- experienceRewrite: 5 rewritten achievement-focused bullet points using STAR format
- projects: 3 portfolio project ideas that would strengthen this application
- skills: Top 8 skills to add to the resume for this role
- certifications: Top 5 certifications that would help get this job
- interviewQuestions: 10 likely interview questions based on the job description
- coverLetter: Full professional cover letter (3-4 paragraphs)`;
}

export async function analyzeResume(
  resumeText: string,
  jobDescription: string
): Promise<AnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      maxOutputTokens: 8192,
    },
  });

  const prompt = buildPrompt(resumeText, jobDescription);

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text().trim();

  // Strip any accidental markdown code fences
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: AnalysisResult;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      "Gemini returned an invalid response. Please try again."
    );
  }

  // Validate and normalize
  return {
    atsScore: Math.min(100, Math.max(0, Number(parsed.atsScore) || 0)),
    matchScore: Math.min(100, Math.max(0, Number(parsed.matchScore) || 0)),
    summary: parsed.summary || "",
    missingKeywords: Array.isArray(parsed.missingKeywords)
      ? parsed.missingKeywords
      : [],
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    experienceRewrite: Array.isArray(parsed.experienceRewrite)
      ? parsed.experienceRewrite
      : [],
    projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    certifications: Array.isArray(parsed.certifications)
      ? parsed.certifications
      : [],
    interviewQuestions: Array.isArray(parsed.interviewQuestions)
      ? parsed.interviewQuestions
      : [],
    coverLetter: parsed.coverLetter || "",
  };
}
