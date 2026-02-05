import { apiFetch } from "../../../services/api";

const BASE_URL = "/api/questions";
const DEBUG = true;

const logApi = (method, endpoint, payload = null, response = null, error = null) => {
    if (!DEBUG && !error) return;
    const style = error ? "color: #ff4d4d; font-weight: bold;" : "color: #00bcd4; font-weight: bold;";
    console.group(`%c[QuestionService] ${method} ${endpoint}`, style);
    if (payload) console.log("Request:", payload);
    if (response) console.log("Response:", response);
    if (error) console.error("Error Detail:", error);
    console.groupEnd();
};

export const QuestionService = {
    // Create a new question in the global bank
    createQuestion: async (questionData) => {
        const url = `${BASE_URL}`;
        // Map frontend model to backend entity expectation
        // Assuming backend accepts a direct payload or needs specific mapping
        // We'll send a generally robust payload
        const payload = {
            questionType: (questionData.type || "MCQ").toUpperCase(),
            content: questionData.question, // The question text
            marks: Number(questionData.marks || 1),
            options: questionData.options || [],
            correctOptionIndex: questionData.correctOption !== undefined ? questionData.correctOption : null,
            // Coding specific
            language: questionData.language,
            starterCode: questionData.starterCode,
            testCases: questionData.testCases,
            // Metadata
            difficulty: "MEDIUM", // Default
            subjectId: questionData.courseId || null,
            topicId: null
        };

        if (DEBUG) {
            // Mock response with a generated ID
            return {
                id: Math.floor(Math.random() * 10000) + 1,
                mock: true,
                ...questionData
            };
        }

        try {
            const data = await apiFetch(url, {
                method: "POST",
                body: JSON.stringify(payload)
            });
            logApi("POST", url, payload, data);
            return data; // Should return { questionId: 123, ... }
        } catch (error) {
            logApi("POST", url, payload, null, error);
            throw error;
        }
    },

    // Get all questions
    getQuestions: async () => {
        try {
            const data = await apiFetch(BASE_URL);
            return data;
        } catch (error) {
            logApi("GET", BASE_URL, null, null, error);
            return [];
        }
    }
};
