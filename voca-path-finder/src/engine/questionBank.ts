import { UserStage } from "../services/interfaces";

export interface Question {
  id: string;
  question: string;
  options: string[];
}

export const INITIAL_QUESTION: Question = {
  id: "stage_selection",
  question: "Where are you right now in your journey?",
  options: [
    "I’m in Class 10",
    "I’m in Plus 1 / Plus 2",
    "I’m doing my UG",
    "I’m working and exploring a shift"
  ]
};

export const STAGE_QUESTIONS: Record<UserStage, Question[]> = {
  class10: [
    {
      id: "class10_subjects",
      question: "What subjects do you enjoy most?",
      options: ["Science & Math", "Languages & Literature", "Social Studies & History", "Arts, Crafts & Design", "Commerce & Business"]
    },
    {
      id: "class10_strengths",
      question: "What feels most natural to you?",
      options: ["Explaining things to others", "Solving puzzles", "Making or building things", "Organizing and planning", "Exploring nature or society"]
    },
    {
      id: "class10_learning",
      question: "How do you prefer to learn?",
      options: ["Reading and studying theory", "Doing experiments and projects", "Discussing ideas with others", "Drawing or creating"]
    },
    {
      id: "class10_energizer",
      question: "What kind of activity energizes you?",
      options: ["Coding or technology", "Writing or storytelling", "Sports or physical activity", "Music or art", "Debates or public speaking"]
    },
    {
      id: "class10_focus",
      question: "What matters most to you after 10th?",
      options: ["I want the best academic path", "I want flexibility to explore", "I want a career-ready path", "I'm not sure yet"]
    }
  ],
  plus1plus2: [
    {
      id: "plus2_stream",
      question: "What stream are you in currently?",
      options: ["Science (PCM)", "Science (PCB)", "Commerce", "Humanities/Arts", "Vocational"]
    },
    {
      id: "plus2_enjoyment",
      question: "Which area do you enjoy most in your stream?",
      options: ["Technical/Problem Solving", "Creative/Writing", "Business/Economics", "Research/Observation", "Practical Application"]
    },
    {
      id: "plus2_learning_style",
      question: "Are you more exam-driven or project-driven?",
      options: ["I love cracking exams", "I prefer projects and portfolios", "Both equally", "Neither much"]
    },
    {
      id: "plus2_career_interest",
      question: "What kind of career domain excites you most?",
      options: ["Technology / Engineering", "Medicine / Healthcare", "Business / Finance", "Design / Media", "Research / Academia", "Law & Public Policy"]
    },
    {
      id: "plus2_work_pref",
      question: "Do you prefer working with people, data, or physical things?",
      options: ["People – interacting and leading", "Data – analyzing and structuring", "Things – building and making"]
    },
    {
      id: "plus2_plan",
      question: "What is your main target after 12th?",
      options: ["Engineering college", "Medical college", "Arts or Commerce degree", "Design or Media school", "Still deciding"]
    }
  ],
  undergraduate: [
    {
      id: "ug_program",
      question: "What is your primary degree program?",
      options: ["Engineering & Tech", "Sciences & Maths", "Commerce & Business", "Arts & Humanities", "Design & Architecture", "Law & Medicine"]
    },
    {
      id: "ug_favorite",
      question: "What are your favorite parts of your studies?",
      options: ["Technical coding/labs", "Research and data analysis", "Creative projects and design", "Theoretical concepts", "Working in team projects"]
    },
    {
      id: "ug_experience",
      question: "Do you have prior internship or project experience?",
      options: ["Yes, active experience", "Some academic projects", "Very little experience", "None yet"]
    },
    {
      id: "ug_plan",
      question: "After graduation, what is your primary plan?",
      options: ["Start working immediately", "Pursue higher studies (Masters/PhD)", "Build my own startup", "Still figuring it out"]
    },
    {
      id: "ug_env",
      question: "What type of work environment appeals to you?",
      options: ["Fast-paced startup", "Large corporation", "Research lab/Academic", "Creative agency", "Non-profit or social sector"]
    },
    {
      id: "ug_skill",
      question: "What do you consider your strongest skill?",
      options: ["Coding / Technical implementation", "Data analysis & Strategy", "Communication & Writing", "Design & Aesthetics", "Leadership & Operations"]
    }
  ],
  jobshift: [
    {
      id: "shift_field",
      question: "What field are you currently working in?",
      options: ["Software / IT", "Design / Creative", "Marketing / Sales", "Operations / Finance", "Education / Research", "Other"]
    },
    {
      id: "shift_exp",
      question: "How many years of experience do you have?",
      options: ["0-2 years", "3-5 years", "6-10 years", "10+ years"]
    },
    {
      id: "shift_type",
      question: "What type of career transition are you looking for?",
      options: ["Small step up in same domain", "Move to adjacent domain", "Major pivot to new industry", "Shift from individual contributor to management"]
    },
    {
      id: "shift_motivation",
      question: "What do you want MORE of in your next role?",
      options: ["Better compensation", "Creative freedom", "Better work-life balance", "More impact/meaning", "Leadership opportunity"]
    },
    {
      id: "shift_constraint",
      question: "What is your biggest constraint for switching?",
      options: ["Must match current salary", "Cannot relocate", "Need flexible hours", "Need a job quickly", "No major constraints"]
    },
    {
      id: "shift_asset",
      question: "What is your strongest transferable asset?",
      options: ["Technical skills (code/systems)", "People & team leadership", "Domain expertise & strategy", "Communication & writing", "Creative design & branding"]
    }
  ]
};
