import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Lightbulb,
  MessageSquare,
  FileText,
  Code,
  Award,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";

export interface AnalysisData {
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

interface AnalysisResultProps {
  data: AnalysisData;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? (
        <><Check className="h-3.5 w-3.5 text-green-400" /> Copied</>
      ) : (
        <><Copy className="h-3.5 w-3.5" /> Copy</>
      )}
    </button>
  );
}

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AnalysisResult({ data }: AnalysisResultProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Score Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="flex flex-col items-center py-8 gap-4">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              ATS Score
            </p>
            <ScoreRing score={data.atsScore} label="ATS Compatible" color="auto" size={130} />
            <p className="text-xs text-muted-foreground text-center px-6">
              {data.atsScore >= 80
                ? "Excellent! Your resume is highly ATS-friendly."
                : data.atsScore >= 60
                ? "Good. A few tweaks will improve compatibility."
                : "Needs improvement. Follow the suggestions below."}
            </p>
          </Card>
          <Card className="flex flex-col items-center py-8 gap-4">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Job Match
            </p>
            <ScoreRing score={data.matchScore} label="Job Description Match" color="auto" size={130} />
            <p className="text-xs text-muted-foreground text-center px-6">
              {data.matchScore >= 80
                ? "Strong match! You're a great candidate for this role."
                : data.matchScore >= 60
                ? "Moderate match. Add more relevant keywords."
                : "Low match. Focus on incorporating missing skills."}
            </p>
          </Card>
        </div>
      </motion.div>

      {/* Summary */}
      {data.summary && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Overall Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{data.summary}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Missing Keywords */}
      {data.missingKeywords.length > 0 && (
        <motion.div variants={itemVariants}>
          <CollapsibleSection title="Missing Keywords" icon={XCircle}>
            <div className="flex flex-wrap gap-2">
              {data.missingKeywords.map((kw) => (
                <Badge key={kw} variant="destructive">
                  {kw}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Add these keywords naturally throughout your resume where applicable.
            </p>
          </CollapsibleSection>
        </motion.div>
      )}

      {/* Strengths & Weaknesses */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.strengths.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {data.weaknesses.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-400" />
                  Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                      {w}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>

      {/* Suggestions */}
      {data.suggestions.length > 0 && (
        <motion.div variants={itemVariants}>
          <CollapsibleSection title="Improvement Suggestions" icon={Lightbulb}>
            <ul className="space-y-3">
              {data.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        </motion.div>
      )}

      {/* Experience Rewrite */}
      {data.experienceRewrite.length > 0 && (
        <motion.div variants={itemVariants}>
          <CollapsibleSection title="Rewritten Experience Bullets" icon={FileText} defaultOpen={false}>
            <ul className="space-y-3">
              {data.experienceRewrite.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="text-primary font-bold flex-shrink-0">→</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        </motion.div>
      )}

      {/* Skills, Projects, Certifications */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.skills.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Code className="h-4 w-4 text-blue-400" /> Skills to Add
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {data.projects.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-400" /> Suggested Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {data.projects.map((p, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">•</span> {p}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {data.certifications.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Award className="h-4 w-4 text-orange-400" /> Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {data.certifications.map((c, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">•</span> {c}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>

      {/* Interview Questions */}
      {data.interviewQuestions.length > 0 && (
        <motion.div variants={itemVariants}>
          <CollapsibleSection title="Likely Interview Questions" icon={MessageSquare} defaultOpen={false}>
            <ul className="space-y-3">
              {data.interviewQuestions.map((q, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-secondary/20 text-secondary text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-muted-foreground">{q}</p>
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        </motion.div>
      )}

      {/* Cover Letter */}
      {data.coverLetter && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Tailored Cover Letter
              </CardTitle>
              <CopyButton text={data.coverLetter} />
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted/30 border border-border/50 p-5">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {data.coverLetter}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
