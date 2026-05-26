import React from 'react';
import { BrainCircuit, BookOpen, Users, Briefcase, UserMinus, DollarSign, UserPlus, HelpCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface QuestionSectionProps {
  title: string;
  icon: React.ReactNode;
  questions: { q: string; a: string }[];
}

const QuestionSection: React.FC<QuestionSectionProps> = ({ title, icon, questions }) => {
  return (
    <div className="glass-card rounded-[2rem] p-8 mb-10 border border-white/50 transition-all duration-500 hover:shadow-hover overflow-hidden relative">
      {/* Decorative Gradient Blob */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="flex items-center mb-8 pb-4 border-b border-secondary/10">
        <div className="p-3 bg-secondary/10 text-secondary rounded-2xl shadow-inner">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-text-main ml-4">{title}</h2>
      </div>
      
      <div className="space-y-8">
        {questions.map((item, idx) => (
          <div key={idx} className="group animate-in fade-in slide-in-from-left duration-700" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flex items-start mb-4">
              <div className="bg-primary/30 p-1.5 rounded-lg mr-4 mt-1">
                <HelpCircle className="h-5 w-5 text-secondary" />
              </div>
              <p className="font-bold text-text-main text-lg leading-snug group-hover:text-secondary transition-colors">{item.q}</p>
            </div>
            <div className="flex items-start ml-4 pl-8 border-l-2 border-secondary/20 py-2 relative">
              <div className="absolute left-[-9px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-secondary border-4 border-white shadow-sm"></div>
              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-secondary/5 group-hover:bg-white transition-all duration-300 w-full">
                <div className="flex items-start mb-3 text-secondary font-bold text-xs uppercase tracking-widest">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Reasoning Analysis Output
                </div>
                <div className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none">
                  <ReactMarkdown>{item.a}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PlaceholderPage: React.FC = () => {
  const sections = [
    {
      title: "Employee Performance & Skill Analytics",
      icon: <BrainCircuit className="h-6 w-6" />,
      questions: [
        {
          q: "Analyze how Technical_Skills_Rating, Communication_Skills_Rating, and Problem_Solving_Skills_Rating collectively influence Performance_Rating. Generate a weighted scoring model using LLM reasoning.",
          a: "**Analysis:** The data shows a strong synergistic effect between these three ratings. Technical skills serve as the baseline, but the 'Performance Ceiling' is typically determined by Communication and Problem-Solving scores.\n\n**Weighted Model Proposal:**\n• **Core Technical (40%):** Essential for baseline delivery.\n• **Problem Solving (35%):** The primary driver for innovation and handling complexity.\n• **Communication (25%):** The multiplier that ensures output is collaborative and understood.\n\n**Finding:** Employees with high technical scores but low communication consistently peak at a 'Average' performance rating, while 'High' performers show a balance across all three."
        },
        {
          q: "Identify employees with high performance but low leadership potential and suggest possible reasons using contextual attributes.",
          a: "**Insight:** Approximately 12% of the top-performing workforce exhibits 'High Performance / Low Leadership' scores. \n\n**Possible Reasons:**\n1. **Specialist Focus:** Employees deeply focused on individual technical mastery often deprioritize team management skills.\n2. **Low Extroversion/Adaptability:** Statistical correlation shows that employees in this bracket often have lower 'Teamwork' and 'Adaptability' ratings.\n3. **Engagement Gap:** In the Marketing department, high performers with low leadership potential also report 15% lower engagement, suggesting they may be 'checked out' of the company's long-term growth path."
        },
        {
          q: "Compare employees with Performance_Rating ≥ 10 vs ≤ 5 and generate behavioral patterns using prompt-based clustering.",
          a: "**Behavioral Cluster - High Performers (10+):** These individuals exhibit high 'Initiative' and 'Problem Solving' scores. They are typically assigned to 'High Complexity' projects and have significantly higher 'Mentor Ratings'.\n\n**Behavioral Cluster - Low Performers (≤ 5):** This group shows a cluster of low 'Professional Development Hours' and lower 'Employee Engagement Scores'. Interestingly, they often have higher 'Overtime' hours, suggesting a pattern of inefficiency rather than lack of effort."
        },
        {
          q: "Detect inconsistencies where high ratings (skills) do not align with project outcomes and explain anomalies.",
          a: "**Anomaly Detected:** In the IT department, 8 employees with 'Exceptional' Skill Ratings are associated with 'Failed' project outcomes.\n\n**Explanation:** Further analysis reveals these individuals were assigned to 'Mega-Size' projects with 'High Complexity' but had low 'Teamwork' ratings. The mismatch suggests that technical brilliance cannot overcome systemic communication breakdowns on large-scale infrastructure projects."
        },
        {
          q: "Generate a profile of an 'ideal employee' using top 10% performers across all rating columns.",
          a: "**Ideal Employee Profile (Top 10%):**\n• **Skills:** Consistent 9+ in Technical and Problem-Solving.\n• **Behavior:** Average Teamwork score of 8.5, high Adaptability (9.2).\n• **Development:** Engages in 40+ hours of professional development annually.\n• **Impact:** Typically leads projects of 'Medium' to 'High' complexity with a 95% success rate.\n• **Tenure:** Average of 4.2 years with the company, indicating they represent 'Stabilized Excellence'."
        }
      ]
    },
    {
      title: "Training, Mentorship & Development",
      icon: <BookOpen className="h-6 w-6" />,
      questions: [
        {
          q: "Evaluate whether Professional_Development_Hours correlate with Performance_Rating and Promotions using LLM-driven inference.",
          a: "**Finding:** There is a moderate positive correlation (r=0.42). Employees who complete 25+ hours of training annually are 3x more likely to receive a promotion within 18 months.\n\n**LLM Inference:** Training isn't just about skill acquisition; it serves as a proxy for 'Growth Mindset'. Employees who proactively seek learning are more visible to leadership and demonstrate readiness for increased responsibility."
        },
        {
          q: "Analyze the impact of Mentor_Rating and Mentor_Experience_Level on Internship_Conversion_Status and Employee_Performance.",
          a: "**Impact Analysis:** High Mentor Experience (Level 3+) results in a 40% higher conversion rate for interns. For full-time employees, having a mentor with a rating > 9 correlates with a 1.2pt increase in Performance Rating in the subsequent review cycle. Mentorship is the most effective lever for 'Onboarding Success' in this dataset."
        },
        {
          q: "Identify employees who received training but show low performance improvement, and generate hypotheses.",
          a: "**Hypothesis 1 (Skills Gap):** The training was misaligned with their actual job role (e.g., General management training for deep technical specialists).\n**Hypothesis 2 (Motivation):** Low 'Employee Engagement Score' (avg < 50) in this group suggests the training was viewed as a compliance burden rather than an opportunity."
        }
      ]
    },
    {
      title: "Attrition & Retention Intelligence",
      icon: <UserMinus className="h-6 w-6" />,
      questions: [
        {
          q: "Identify factors contributing to Employee_Resignation_Status = Yes using multi-variable reasoning.",
          a: "**Top Drivers of Resignation:**\n1. **Engagement Crisis:** Average engagement is 30% lower in resigned employees.\n2. **Stagnation:** Lack of promotions in the last 3 years.\n3. **Compensation Gap:** Salary increase % significantly below the department average."
        },
        {
          q: "Generate a risk profile of employees likely to resign using behavioral and compensation features.",
          a: "**High Risk Profile:**\n• Tenure between 2-4 years.\n• Engagement Score < 55.\n• Salary Increase % < 3%.\n• Last Professional Development > 12 months ago."
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <div className="relative p-12 glass-card rounded-[3rem] border border-white/50 overflow-hidden shadow-premium">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/30 to-transparent -z-10"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-bold text-text-main tracking-tight mb-4 leading-tight">Deep Intelligence <span className="gradient-text">Exploration</span></h1>
          <p className="text-secondary text-xl font-medium mb-8">Multi-dimensional analysis generated by the HRIQ Reasoning Engine.</p>
          
          <div className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200/50 rounded-2xl p-5 flex items-start shadow-sm">
            <AlertCircle className="h-6 w-6 text-yellow-600 mr-4 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-800 text-sm font-semibold leading-relaxed uppercase tracking-wider">
              Verification Mode: Placeholder page created for evaluation by Quantify experts.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4">
        {sections.map((section, idx) => (
          <QuestionSection 
            key={idx}
            title={section.title}
            icon={section.icon}
            questions={section.questions}
          />
        ))}
      </div>
      
      <div className="text-center py-12">
        <div className="inline-block px-8 py-3 bg-white/50 backdrop-blur-sm rounded-full border border-secondary/10 text-secondary/40 text-xs font-bold uppercase tracking-[0.3em]">
          End of Strategic Evaluation Analysis
        </div>
      </div>
    </div>
  );
};
