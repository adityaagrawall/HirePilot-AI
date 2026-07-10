import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ResumeUpload from "@/components/analyze/ResumeUpload";
import AnalysisResult, { AnalysisData } from "@/components/analyze/AnalysisResult";
import TailoredResumeModal from "@/components/analyze/TailoredResumeModal";
import { StructuredResume } from "@/components/resume-templates/ModernTemplate";
import { AnalysisSkeleton } from "@/components/ui/skeleton";
import { useApiClient } from "@/lib/api";

export default function AnalyzePage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [jdError, setJdError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiClient = useApiClient();

  const {
    mutate: analyze,
    data: analysisData,
    isPending,
    error,
    reset,
  } = useMutation<AnalysisData>({
    mutationFn: async () => {
      const { data } = await apiClient.post("/api/analyze", {
        resumeText,
        jobDescription,
      });
      return data;
    },
  });

  const {
    mutate: buildResume,
    data: generatedResume,
    isPending: isBuilding,
    error: buildError,
  } = useMutation<StructuredResume>({
    mutationFn: async () => {
      const { data } = await apiClient.post("/api/analyze/build-resume", {
        resumeText,
        jobDescription,
        analysisData,
      });
      return data;
    },
    onSuccess: () => {
      setIsModalOpen(true);
    },
  });

  const handleAnalyze = () => {
    let valid = true;
    setResumeError("");
    setJdError("");

    if (!resumeText.trim() || resumeText.trim().length < 100) {
      setResumeError("Please provide a resume with at least 100 characters.");
      valid = false;
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      setJdError("Please provide a job description with at least 50 characters.");
      valid = false;
    }

    if (valid) {
      reset();
      analyze();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
                <Sparkles className="h-7 w-7 text-primary" />
                Resume Analyzer
              </h1>
              <p className="text-muted-foreground mt-1">
                Upload your resume and paste the job description to get a comprehensive AI analysis.
              </p>
            </motion.div>

            {/* Input form */}
            <AnimatePresence>
              {!analysisData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Resume input */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-semibold text-foreground">
                          Your Resume
                        </label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Upload a PDF or paste your resume text
                        </p>
                      </div>
                      <ResumeUpload
                        value={resumeText}
                        onChange={setResumeText}
                        error={resumeError}
                      />
                    </div>

                    {/* Job description */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-semibold text-foreground">
                          Job Description
                        </label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Paste the complete job posting
                        </p>
                      </div>
                      <Textarea
                        value={jobDescription}
                        onChange={(e) => {
                          setJobDescription(e.target.value);
                          if (jdError) setJdError("");
                        }}
                        placeholder="Paste the job description here...&#10;&#10;Example:&#10;We are looking for a Senior Software Engineer...&#10;Requirements:&#10;- 5+ years of experience in React&#10;- Strong TypeScript skills&#10;..."
                        className="min-h-[340px] font-mono text-xs"
                      />
                      {jdError && (
                        <div className="flex items-center gap-2 text-sm text-red-400">
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          {jdError}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Error from API */}
                  {error && (
                    <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 mb-6">
                      <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-400">Analysis Failed</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {error instanceof Error ? error.message : "Something went wrong. Please try again."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Analyze button */}
                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={handleAnalyze}
                    disabled={isPending}
                    className="w-full sm:w-auto min-w-[200px]"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing with Gemini AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Analyze Resume
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading skeleton */}
            {isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8"
              >
                <div className="flex items-center gap-3 mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-primary">
                      Gemini AI is analyzing your resume...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This typically takes 15–30 seconds
                    </p>
                  </div>
                </div>
                <AnalysisSkeleton />
              </motion.div>
            )}

            {/* Results */}
            {analysisData && !isPending && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-xl font-bold text-foreground">Analysis Results</h2>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="gradient" 
                      onClick={() => buildResume()}
                      disabled={isBuilding}
                    >
                      {isBuilding ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Building...</>
                      ) : (
                        <><Sparkles className="mr-2 h-4 w-4" /> Get Perfect Resume</>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      reset();
                      setResumeText("");
                      setJobDescription("");
                    }}>
                      Analyze Another
                    </Button>
                  </div>
                </div>
                
                {buildError && (
                  <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 mb-6">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-red-400">
                      Failed to build resume. Please try again.
                    </p>
                  </div>
                )}
                
                <AnalysisResult data={analysisData} />
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* The Resume Modal */}
      <TailoredResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resumeData={generatedResume || null}
      />
    </div>
  );
}
