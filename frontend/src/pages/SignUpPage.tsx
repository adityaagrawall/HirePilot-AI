import { SignUp } from "@clerk/clerk-react";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-card border-r border-border p-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
        </div>

        <Link to="/" className="flex items-center gap-2.5 relative">
          <div className="bg-primary/20 border border-primary/30 rounded-lg p-1.5">
            <Zap className="h-5 w-5 text-primary" fill="currentColor" />
          </div>
          <span className="font-bold text-xl">Hire<span className="gradient-text">Pilot</span></span>
        </Link>

        <div className="relative space-y-8">
          <h2 className="text-3xl font-bold text-foreground">
            Start optimizing your resume{" "}
            <span className="gradient-text">in seconds.</span>
          </h2>
          <ul className="space-y-4">
            {[
              "Instant ATS compatibility scoring",
              "Missing keyword detection",
              "AI-powered resume rewriting",
              "Tailored cover letter generation",
              "Interview question preparation",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground relative">
          Free to start · No credit card required
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="bg-primary/20 border border-primary/30 rounded-lg p-1.5">
                <Zap className="h-5 w-5 text-primary" fill="currentColor" />
              </div>
              <span className="font-bold text-xl">Hire<span className="gradient-text">Pilot</span></span>
            </Link>
          </div>
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-card border border-border shadow-2xl rounded-2xl",
                headerTitle: "text-foreground font-bold text-2xl",
                headerSubtitle: "text-muted-foreground",
                socialButtonsBlockButton: "border-border bg-muted/30 hover:bg-muted text-foreground transition-colors",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground",
                formFieldLabel: "text-foreground font-medium",
                formFieldInput: "bg-muted/30 border-border text-foreground focus:border-primary",
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-white btn-glow",
                footerActionLink: "text-primary hover:text-primary/80",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
