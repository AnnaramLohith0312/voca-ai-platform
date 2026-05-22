import { CareerSignals } from "./types";
import { UserStage } from "../services/interfaces";

export function extractSignals(stage: UserStage, answers: Record<string, string>): CareerSignals {
  const signals: CareerSignals = {
    stage,
    interests: [],
    academicPreferences: [],
    subjectAffinity: [],
    strengths: [],
    workStyle: [],
    learningStyle: [],
    motivationDrivers: [],
    collaborationPreference: "Medium",
    creativityVsStructure: "Balanced",
    analyticalOrientation: "Medium",
    communicationOrientation: "Medium",
    technicalOrientation: "Medium",
    leadershipInclination: "Medium",
    problemPreference: "Balanced",
    careerGoals: [],
    constraints: [],
    confidenceScore: 85
  };

  if (stage === "class10") {
    const subjects = answers["What subjects do you enjoy most?"];
    const natural = answers["What feels most natural to you?"];
    const learning = answers["How do you prefer to learn?"];
    const energizer = answers["What kind of activity energizes you?"];
    const focus = answers["What matters most to you after 10th?"];

    signals.subjectComfort = subjects;
    signals.exploratoryOpenness = focus;
    signals.streamInclination = subjects;

    if (subjects) signals.subjectAffinity.push(subjects);
    if (natural) signals.strengths.push(natural);
    if (learning) signals.learningStyle.push(learning);
    if (energizer) {
      signals.interests.push(energizer);
      if (energizer.includes("Coding") || energizer.includes("technology")) {
        signals.technicalOrientation = "High";
      } else if (energizer.includes("Writing") || energizer.includes("Debates")) {
        signals.communicationOrientation = "High";
      } else if (energizer.includes("art") || energizer.includes("Music")) {
        signals.creativityVsStructure = "Creativity";
      }
    }
    if (focus) signals.motivationDrivers.push(focus);

  } else if (stage === "plus1plus2") {
    const stream = answers["What stream are you in currently?"];
    const area = answers["Which area do you enjoy most in your stream?"];
    const style = answers["Are you more exam-driven or project-driven?"];
    const domain = answers["What kind of career domain excites you most?"];
    const work = answers["Do you prefer working with people, data, or physical things?"];
    const plan = answers["What is your main target after 12th?"];

    signals.currentStream = stream;
    signals.examOrientation = style;
    signals.degreeAspiration = plan;

    if (stream) signals.subjectAffinity.push(stream);
    if (area) signals.interests.push(area);
    if (style) signals.learningStyle.push(style);
    if (domain) {
      signals.careerGoals.push(domain);
      if (domain.includes("Technology")) signals.technicalOrientation = "High";
      if (domain.includes("Medicine") || domain.includes("Research")) signals.analyticalOrientation = "High";
    }
    if (work) {
      if (work.includes("People")) {
        signals.collaborationPreference = "High";
        signals.leadershipInclination = "High";
      } else if (work.includes("Data")) {
        signals.analyticalOrientation = "High";
      } else {
        signals.technicalOrientation = "High";
      }
    }

  } else if (stage === "undergraduate") {
    const program = answers["What is your primary degree program?"];
    const fav = answers["What are your favorite parts of your studies?"];
    const exp = answers["Do you have prior internship or project experience?"];
    const plan = answers["After graduation, what is your primary plan?"];
    const env = answers["What type of work environment appeals to you?"];
    const skill = answers["What do you consider your strongest skill?"];

    signals.degreeProgram = program;
    signals.specializationLeaning = fav;
    signals.internshipProjectExposure = exp;
    signals.employabilityReadiness = exp;

    if (program) signals.subjectAffinity.push(program);
    if (fav) signals.learningStyle.push(fav);
    if (plan) signals.careerGoals.push(plan);
    if (env) signals.workStyle.push(env);
    if (skill) {
      signals.strengths.push(skill);
      if (skill.includes("Coding")) signals.technicalOrientation = "High";
      if (skill.includes("Data")) signals.analyticalOrientation = "High";
      if (skill.includes("Design")) signals.creativityVsStructure = "Creativity";
      if (skill.includes("Communication")) signals.communicationOrientation = "High";
      if (skill.includes("Leadership")) signals.leadershipInclination = "High";
    }

  } else if (stage === "jobshift") {
    const current = answers["What field are you currently working in?"];
    const exp = answers["How many years of experience do you have?"];
    const trans = answers["What type of career transition are you looking for?"];
    const mot = answers["What do you want MORE of in your next role?"];
    const constraint = answers["What is your biggest constraint for switching?"];
    const asset = answers["What is your strongest transferable asset?"];

    signals.currentRole = current;
    signals.yearsOfExperience = exp;
    signals.switchType = trans;
    signals.transitionUrgency = trans;
    if (constraint) signals.incomeRiskConstraints = [constraint];

    if (current) signals.workStyle.push(current);
    if (trans) signals.careerGoals.push(trans);
    if (mot) signals.motivationDrivers.push(mot);
    if (constraint) signals.constraints.push(constraint);
    if (asset) {
      signals.strengths.push(asset);
      if (asset.includes("Technical")) signals.technicalOrientation = "High";
      if (asset.includes("People")) {
        signals.collaborationPreference = "High";
        signals.leadershipInclination = "High";
      }
      if (asset.includes("Communication") || asset.includes("strategy")) signals.communicationOrientation = "High";
      if (asset.includes("Creative")) signals.creativityVsStructure = "Creativity";
    }
  }

  return signals;
}
