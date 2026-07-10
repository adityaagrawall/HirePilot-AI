import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    avatar: "SC",
    avatarBg: "from-purple-500 to-pink-500",
    text: "HirePilot helped me go from a 42% ATS score to 91% in minutes. I got 3 interview calls that week after updating my resume.",
    stars: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager at Stripe",
    avatar: "MJ",
    avatarBg: "from-blue-500 to-cyan-500",
    text: "The cover letter generator is insane. It captured exactly what I wanted to say in a fraction of the time. Got the job!",
    stars: 5,
  },
  {
    name: "Priya Patel",
    role: "Data Scientist at Meta",
    avatar: "PP",
    avatarBg: "from-orange-500 to-amber-500",
    text: "I was missing 15 key keywords from my resume. HirePilot identified all of them and showed me exactly where to add them.",
    stars: 5,
  },
  {
    name: "Alex Rivera",
    role: "DevOps Engineer at Netflix",
    avatar: "AR",
    avatarBg: "from-green-500 to-teal-500",
    text: "The interview questions feature is brilliant. I walked into my interview prepared for every question they asked. Highly recommend.",
    stars: 5,
  },
  {
    name: "Emily Watson",
    role: "UX Designer at Airbnb",
    avatar: "EW",
    avatarBg: "from-red-500 to-rose-500",
    text: "Switched careers from finance to tech. HirePilot's skills gap analysis showed me exactly what I needed to learn and add to my resume.",
    stars: 5,
  },
  {
    name: "David Kim",
    role: "Full Stack Engineer at Vercel",
    avatar: "DK",
    avatarBg: "from-indigo-500 to-violet-500",
    text: "Applied to 20 jobs before HirePilot. After using it, my response rate jumped from 5% to 40%. This tool is a game changer.",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-primary uppercase tracking-widest mb-3"
          >
            Loved by Job Seekers
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-foreground"
          >
            Join thousands who've landed their dream jobs
          </motion.h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 card-hover"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
