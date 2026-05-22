import { describe, it, expect } from "vitest";
import { detectStage } from "../engine/stageDetection";
import { extractSignals } from "../engine/signalExtractor";
import { generateRecommendations } from "../engine/recommendationEngine";

describe("Stage Detection and Recommendation Engine Test Suite", () => {
  describe("detectStage", () => {
    it("should correctly detect class10 students with confidence", () => {
      const res1 = detectStage("I am currently in class 10");
      expect(res1.stage).toBe("class10");
      expect(res1.confidence).toBeGreaterThan(0.5);

      const res2 = detectStage("10th grade");
      expect(res2.stage).toBe("class10");
    });

    it("should correctly detect plus1plus2 students with confidence", () => {
      expect(detectStage("I am in 12th grade").stage).toBe("plus1plus2");
      expect(detectStage("Plus 2 science student").stage).toBe("plus1plus2");
    });

    it("should correctly detect undergraduate students with confidence", () => {
      expect(detectStage("I am a college student studying computer science").stage).toBe("undergraduate");
      expect(detectStage("UG student in my final year").stage).toBe("undergraduate");
    });

    it("should correctly detect job shifters with confidence", () => {
      expect(detectStage("I am a working professional planning a pivot").stage).toBe("jobshift");
      expect(detectStage("Looking for a job switch").stage).toBe("jobshift");
    });

    it("should return unknown and low confidence for vague or empty answers", () => {
      const res1 = detectStage("Just curious about my options");
      expect(res1.stage).toBe("unknown");
      expect(res1.confidence).toBeLessThan(1);

      const res2 = detectStage(" ");
      expect(res2.stage).toBe("unknown");
      expect(res2.confidence).toBe(0);
    });

    it("should return unknown when inputs are contradictory", () => {
      // Input has both 'class 10' and 'working professional'
      const res = detectStage("I am a working professional who mentors class 10 students");
      expect(res.stage).toBe("unknown");
    });
  });

  describe("generateRecommendations - Edge Cases and Synonyms", () => {
    const userId = "test_user_synonym";

    it("should map synonymous inputs in Class 10 (arts vs creative)", () => {
      const answers = {
        "What subjects do you enjoy most?": "I really love creative visual media",
        "How do you prefer to learn?": "Doing projects"
      };
      const signals = extractSignals("class10", answers);
      const results = generateRecommendations(userId, signals, answers);

      // Engine now returns dataset streams — top match for creative/visual should be arts-related
      expect(results.recommendedStreams).toBeDefined();
      expect(results.recommendedStreams?.length).toBeGreaterThan(0);
      // The streams come from the dataset entries that matched — should contain an arts/design entry
      const allStreams = results.recommendedStreams?.map(s => s.stream).join(" ") ?? "";
      expect(allStreams.toLowerCase()).toMatch(/art|design|humanities|vocational/);
    });

    it("should map synonymous inputs in UG (data vs machine learning)", () => {
      const answers = {
        "What are your favorite parts of your studies?": "machine learning and statistics",
        "What do you consider your strongest skill?": "Python"
      };
      const signals = extractSignals("undergraduate", answers);
      const results = generateRecommendations(userId, signals, answers);

      // Dataset-driven engine returns real careers — Data Scientist or ML Engineer should rank top
      expect(results.primary?.title).toMatch(/Data Scientist|ML Engineer|AI/);
    });

    it("should fallback to a valid career when gibberish is passed", () => {
      const answers = {
        "What field are you currently working in?": "ajsdkfjksdf",
        "What type of career transition are you looking for?": "Move to adjacent domain",
        "What is your strongest transferable asset?": "zxcvbnm"
      };
      const signals = extractSignals("jobshift", answers);
      const results = generateRecommendations(userId, signals, answers);

      // With gibberish, the engine still returns a valid career (highest default score)
      expect(results.primary).toBeDefined();
      expect(results.primary?.title).toBeTruthy();
    });
  });

  describe("generateRecommendations - Standard Path Generation", () => {
    const userId = "test_user_456";

    it("should generate Class 10 stream and broad cluster suggestions", () => {
      const answers = {
        "What subjects do you enjoy most?": "Science & Math (Physics, Chemistry, Math)",
        "How do you prefer to learn?": "Doing experiments and projects"
      };
      const signals = extractSignals("class10", answers);
      const results = generateRecommendations(userId, signals, answers);

      expect(results.stage).toBe("class10");
      expect(results.recommendedStreams).toBeDefined();
      expect(results.broadClusters).toBeDefined();
      expect(results.careerMatches?.length).toBeGreaterThan(0);
    });

    it("should generate Job Shift transition feasibility, transferable strengths, and roadmap", () => {
      const answers = {
        "What field are you currently working in?": "Software / IT",
        "What type of career transition are you looking for?": "Move to adjacent domain",
        "What is your strongest transferable asset?": "Technical skills (code/systems)"
      };
      const signals = extractSignals("jobshift", answers);
      const results = generateRecommendations(userId, signals, answers);

      expect(results.stage).toBe("jobshift");
      expect(results.primary).toBeDefined();
      // With Software/IT signals, top career should be software-related
      expect(results.primary?.title).toMatch(/Software|Engineer|Data|Cloud|Product|Security/);
      expect(results.transitionFeasibility).toBeDefined();
      expect(results.upskillingRoadmap).toBeDefined();
    });
  });

});
