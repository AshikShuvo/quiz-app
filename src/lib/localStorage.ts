import {Question, Answer, initialQuestions, initialAnswers} from './mockData';
import {v4 as uuidv4} from 'uuid';

// Local storage keys
const QUESTIONS_KEY = 'quiz_questions';
const ANSWERS_KEY = 'quiz_answers';

// Initialize local storage with mock data if empty
export const initializeStorage = () => {
    if (!localStorage.getItem(QUESTIONS_KEY)) {
        localStorage.setItem(QUESTIONS_KEY, JSON.stringify(initialQuestions));
    }

    if (!localStorage.getItem(ANSWERS_KEY)) {
        localStorage.setItem(ANSWERS_KEY, JSON.stringify(initialAnswers));
    }
};

// Question methods
export const getQuestions = (): Question[] => {
    const questions = localStorage.getItem(QUESTIONS_KEY);
    return questions ? JSON.parse(questions) : [];
};

export const addQuestion = (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Question => {
    const newQuestion: Question = {
        ...question,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const questions = getQuestions();
    questions.push(newQuestion);
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));

    return newQuestion;
};

export const updateQuestion = (id: string, updates: Partial<Question>): Question | null => {
    const questions = getQuestions();
    const index = questions.findIndex(q => q.id === id);

    if (index === -1) return null;

    const updatedQuestion = {
        ...questions[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    questions[index] = updatedQuestion;
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));

    return updatedQuestion;
};

export const deleteQuestion = (id: string): boolean => {
    const questions = getQuestions();
    const filteredQuestions = questions.filter(q => q.id !== id);

    if (filteredQuestions.length === questions.length) return false;

    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(filteredQuestions));

    // Also remove all answers for this question
    const answers = getAnswers();
    const filteredAnswers = answers.filter(a => a.questionId !== id);
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(filteredAnswers));

    return true;
};

// Answer methods
export const getAnswers = (): Answer[] => {
    const answers = localStorage.getItem(ANSWERS_KEY);
    return answers ? JSON.parse(answers) : [];
};

export const getUserAnswers = (userId: string): Answer[] => {
    const answers = getAnswers();
    return answers.filter(a => a.userId === userId);
};

export const getQuestionAnswers = (questionId: string): Answer[] => {
    const answers = getAnswers();
    return answers.filter(a => a.questionId === questionId);
};

export const getUserAnswerForQuestion = (userId: string, questionId: string): Answer | undefined => {
    const answers = getAnswers();
    return answers.find(a => a.userId === userId && a.questionId === questionId);
};

export const addAnswer = (answer: {
    questionId: string;
    userId: string;
    selectedOption: number;
}): Answer => {
    const questions = getQuestions();
    const question = questions.find(q => q.id === answer.questionId);
    const isCorrect = question?.correctOption === answer.selectedOption;

    const newAnswer: Answer = {
        id: uuidv4(),
        questionId: answer.questionId,
        userId: answer.userId,
        selectedOption: answer.selectedOption,
        isCorrect,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [
            {
                selectedOption: answer.selectedOption,
                timestamp: new Date().toISOString()
            }
        ]
    };

    const answers = getAnswers();
    answers.push(newAnswer);
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));

    return newAnswer;
};

export const updateAnswer = (userId: string, questionId: string, selectedOption: number): Answer | null => {
    const answers = getAnswers();
    const index = answers.findIndex(a => a.userId === userId && a.questionId === questionId);

    if (index === -1) return null;

    // Get the correct option from the question
    const questions = getQuestions();
    const question = questions.find(q => q.id === questionId);
    const isCorrect = question?.correctOption === selectedOption;

    // Update the answer with history
    const updatedAnswer = {
        ...answers[index],
        selectedOption,
        isCorrect,
        updatedAt: new Date().toISOString(),
        history: [
            ...answers[index].history,
            {
                selectedOption,
                timestamp: new Date().toISOString()
            }
        ]
    };

    answers[index] = updatedAnswer;
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));

    return updatedAnswer;
};
