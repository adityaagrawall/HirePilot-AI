import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingBadges = [
  { text: "ATS Score: 94%", color: "text-green-400 border-green-500/30 bg-green-500/10", delay: 0 },
  { text: "12 Keywords Added", color: "text-primary border-primary/30 bg-primary/10", delay: 0.15 },
  { text: "Cover Letter Ready", color: "text-secondary border-secondary/30 bg-secondary/10", delay: 0.3 },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[80px] opacity-40" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium mb-8"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Google Gemini AI
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight"
          >
            Optimize your Resume.{" "}
            <span className="gradient-text">Beat the ATS.</span>
            <br />
            Land More Interviews.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload your resume, paste the job description, and get instant AI-powered
            analysis — ATS scoring, missing keywords, rewrite suggestions, interview
            prep, and a tailored cover letter.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button variant="gradient" size="xl" asChild>
              <Link to="/sign-up" className="flex items-center gap-2">
                Start for Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/sign-in">View Demo</Link>
            </Button>
          </motion.div>

          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-16"
          >
            {floatingBadges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + badge.delay }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium ${badge.color}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {badge.text}
              </motion.div>
            ))}
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            {[
              { icon: Zap, text: "Instant Analysis" },
              { icon: Shield, text: "Secure & Private" },
              { icon: Sparkles, text: "AI-Powered" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                {text}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
