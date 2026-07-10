import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  FileText,
  MessageSquare,
  TrendingUp,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "ATS Score Analysis",
    description:
      "Get an instant ATS compatibility score and understand exactly why recruiters' systems may reject your resume.",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    borderColor: "border-primary/20",
  },
  {
    icon: Sparkles,
    title: "Keyword Optimization",
    description:
      "Identify missing keywords from job descriptions and get specific suggestions to include them naturally.",
    gradient: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary",
    borderColor: "border-secondary/20",
  },
  {
    icon: FileText,
    title: "Resume Rewrite",
    description:
      "Get AI-powered rewrites for your experience bullets using the STAR method with quantified achievements.",
    gradient: "from-green-500/20 to-green-500/5",
    iconColor: "text-green-400",
    borderColor: "border-green-500/20",
  },
  {
    icon: MessageSquare,
    title: "Cover Letter Generator",
    description:
      "Receive a professionally crafted cover letter tailored specifically to the job description.",
    gradient: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/20",
  },
  {
    icon: TrendingUp,
    title: "Interview Prep",
    description:
      "Get a curated list of likely interview questions based on the job requirements and your experience.",
    gradient: "from-orange-500/20 to-orange-500/5",
    iconColor: "text-orange-400",
    borderColor: "border-orange-500/20",
  },
  {
    icon: Shield,
    title: "Skills Gap Analysis",
    description:
      "Discover exactly which certifications, projects, and skills to add to maximize your chances.",
    gradient: "from-pink-500/20 to-pink-500/5",
    iconColor: "text-pink-400",
    borderColor: "border-pink-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function FeatureCards() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-primary uppercase tracking-widest mb-3"
          >
            Everything You Need
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
          >
            Your complete job search toolkit
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            From ATS analysis to interview prep — everything you need to go from
            application to offer.
          </motion.p>
        </div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`relative rounded-xl border ${feature.borderColor} bg-card p-6 overflow-hidden group cursor-default`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative">
                <div className={`inline-flex rounded-lg bg-muted p-2.5 mb-4 ${feature.iconColor}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
