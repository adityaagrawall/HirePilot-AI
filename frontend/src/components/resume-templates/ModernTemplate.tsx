import React, { forwardRef } from "react";

// The same interface expected from the backend
export interface StructuredResume {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
  };
  summary: string;
  experience: {
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    location: string;
    graduationDate: string;
    gpa: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
  }[];
}

interface Props {
  data: StructuredResume;
}

// Ensure A4 proportions and print-friendly styles
const ModernTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white text-black p-10 font-sans mx-auto box-border"
      style={{
        width: "210mm",
        minHeight: "297mm", // A4 paper dimensions
        padding: "12mm 15mm", // Professional margins
      }}
    >
      {/* HEADER */}
      <header className="text-center mb-6 border-b-2 border-gray-900 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight uppercase mb-2">
          {data.personalInfo.fullName}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-700">
          {data.personalInfo.email && (
            <a href={`mailto:${data.personalInfo.email}`} className="hover:underline">
              {data.personalInfo.email}
            </a>
          )}
          {data.personalInfo.phone && (
            <span>• {data.personalInfo.phone}</span>
          )}
          {data.personalInfo.location && (
            <span>• {data.personalInfo.location}</span>
          )}
          {data.personalInfo.linkedin && (
            <span>• {data.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
          )}
          {data.personalInfo.portfolio && (
            <span>• {data.personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, '')}</span>
          )}
        </div>
      </header>

      {/* SUMMARY */}
      {data.summary && (
        <section className="mb-5">
          <p className="text-sm text-gray-800 leading-relaxed text-justify">
            {data.summary}
          </p>
        </section>
      )}

      {/* EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-300 pb-1">
            Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-xs text-gray-700 font-medium">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-xs italic text-gray-800">{exp.company}</p>
                  <span className="text-xs text-gray-600">{exp.location}</span>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1">
                  {exp.highlights.map((h, j) => (
                    <li key={j} className="text-sm text-gray-800 leading-snug pl-1">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-300 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-bold text-gray-900">{edu.institution}</h3>
                  <span className="text-xs text-gray-700 font-medium">{edu.graduationDate}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <p className="text-xs text-gray-800">{edu.degree}</p>
                  {edu.gpa && <span className="text-xs text-gray-600">GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="space-y-1.5">
            {data.skills.map((skillGroup, i) => (
              <div key={i} className="text-sm">
                <span className="font-bold text-gray-900 mr-2">{skillGroup.category}:</span>
                <span className="text-gray-800">{skillGroup.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-300 pb-1">
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{proj.name}</h3>
                    {proj.link && (
                      <a href={proj.link} className="text-xs text-blue-600 hover:underline">
                        {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-800 mb-1 leading-snug">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-xs text-gray-600 italic">
                    Technologies: {proj.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-300 pb-1">
            Certifications
          </h2>
          <ul className="list-none space-y-1">
            {data.certifications.map((cert, i) => (
              <li key={i} className="text-sm text-gray-800 flex justify-between">
                <span><span className="font-semibold">{cert.name}</span>, {cert.issuer}</span>
                <span className="text-xs text-gray-700">{cert.date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
});

export default ModernTemplate;
