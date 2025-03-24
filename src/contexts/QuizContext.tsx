import React, {createContext, useContext, useState, useEffect} from 'react';
import {toast} from 'sonner';
import {
    initializeStorage,
    getQuestions,
    getAnswers,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addAnswer,
    updateAnswer,
    getUserAnswerForQuestion
} from "@/lib/localStorage.ts";
import {useAuth} from "@/contexts/AutContext.tsx";
import {Answer, Question} from "@/lib/mockData.ts";

// Types
interface QuizContextType {
    questions: Question[];
    userAnswers: Answer[];
    allAnswers: Answer[];
    isLoading: boolean;
    // Admin actions
    createQuestion: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => Question;
    editQuestion: (id: string, updates: Partial<Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>) => Question | null;
    removeQuestion: (id: string) => boolean;
    // User actions
    submitAnswer: (questionId: string, selectedOption: number) => Answer;
    editAnswer: (questionId: string, selectedOption: number) => Answer | null;
    getAnswerForQuestion: (questionId: string) => Answer | undefined;
}

// Create context
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Quiz provider component
export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {user} = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [allAnswers, setAllAnswers] = useState<Answer[]>([]);
    const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize local storage and load data on mount
    useEffect(() => {
        initializeStorage();
        loadData();
    }, []);

    // Update user answers when user changes
    useEffect(() => {
        if (user) {
            setUserAnswers(allAnswers.filter(answer => answer.userId === user.id));
        } else {
            setUserAnswers([]);
        }
    }, [user, allAnswers]);

    // Load data from local storage
    const loadData = () => {
        setIsLoading(true);
        try {
            const loadedQuestions = getQuestions();
            const loadedAnswers = getAnswers();

            setQuestions(loadedQuestions);
            setAllAnswers(loadedAnswers);

            if (user) {
                setUserAnswers(loadedAnswers.filter(answer => answer.userId === user.id));
            }
        } catch (error) {
            console.error('Failed to load quiz data:', error);
            toast.error('Failed to load quiz data');
        } finally {
            setIsLoading(false);
        }
    };

    // Admin: Create question
    const createQuestion = (questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Question => {
        if (!user || user.role !== 'admin') {
            throw new Error('Only admins can create questions');
        }
        try {
            const newQuestion = addQuestion({
                ...questionData,
                createdBy: user.id
            });

            setQuestions(prev => [...prev, newQuestion]);
            toast.success('Question created successfully');
            return newQuestion;
        } catch (error) {
            console.error('Failed to create question:', error);
            toast.error('Failed to create question');
            throw error;
        }
    };

    // Admin: Edit question
    const editQuestion = (
        id: string,
        updates: Partial<Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>
    ): Question | null => {
        if (!user || user.role !== 'admin') {
            throw new Error('Only admins can edit questions');
        }
        try {
            const updatedQuestion = updateQuestion(id, updates);

            if (updatedQuestion) {
                setQuestions(prev => prev.map(q => q.id === id ? updatedQuestion : q));
                toast.success('Question updated successfully');
            }

            return updatedQuestion;
        } catch (error) {
            console.error('Failed to update question:', error);
            toast.error('Failed to update question');
            throw error;
        }
    };

    // Admin: Remove question
    const removeQuestion =  (id: string): boolean => {
        if (!user || user.role !== 'admin') {
            throw new Error('Only admins can delete questions');
        }

        try {
            const success = deleteQuestion(id);

            if (success) {
                setQuestions(prev => prev.filter(q => q.id !== id));
                setAllAnswers(prev => prev.filter(a => a.questionId !== id));
                setUserAnswers(prev => prev.filter(a => a.questionId !== id));
                toast.success('Question deleted successfully');
            }

            return success;
        } catch (error) {
            console.error('Failed to delete question:', error);
            toast.error('Failed to delete question');
            throw error;
        }
    };

    // User: Submit answer
    const submitAnswer = (questionId: string, selectedOption: number): Answer => {
        if (!user) {
            throw new Error('You must be logged in to submit an answer');
        }

        try {
            // Check if user already answered this question
            const existingAnswer = getUserAnswerForQuestion(user.id, questionId);

            let answer: Answer;

            if (existingAnswer) {
                // Update existing answer
                const updated = updateAnswer(user.id, questionId, selectedOption);
                if (!updated) throw new Error('Failed to update answer');
                answer = updated;

                // Update state
                setAllAnswers(prev => prev.map(a =>
                    a.id === answer.id ? answer : a
                ));
                setUserAnswers(prev => prev.map(a =>
                    a.id === answer.id ? answer : a
                ));

                toast.success('Answer updated successfully');
            } else {
                // Create new answer
                answer = addAnswer({
                    questionId,
                    userId: user.id,
                    selectedOption
                });

                // Update state
                setAllAnswers(prev => [...prev, answer]);
                setUserAnswers(prev => [...prev, answer]);

                toast.success('Answer submitted successfully');
            }

            return answer;
        } catch (error) {
            console.error('Failed to submit answer:', error);
            toast.error('Failed to submit answer');
            throw error;
        }
    };

    // User: Edit answer
    const editAnswer = (questionId: string, selectedOption: number): Answer | null => {
        if (!user) {
            throw new Error('You must be logged in to edit an answer');
        }

        try {
            const updatedAnswer = updateAnswer(user.id, questionId, selectedOption);

            if (updatedAnswer) {
                setAllAnswers(prev => prev.map(a =>
                    a.id === updatedAnswer.id ? updatedAnswer : a
                ));
                setUserAnswers(prev => prev.map(a =>
                    a.id === updatedAnswer.id ? updatedAnswer : a
                ));
                toast.success('Answer updated successfully');
            }

            return updatedAnswer;
        } catch (error) {
            console.error('Failed to edit answer:', error);
            toast.error('Failed to edit answer');
            throw error;
        }
    };

    // Helper: Get user answer for a specific question
    const getAnswerForQuestion = (questionId: string): Answer | undefined => {
        if (!user) return undefined;
        return userAnswers.find(a => a.questionId === questionId);
    };

    return (
        <QuizContext.Provider value={{
            questions,
            userAnswers,
            allAnswers,
            isLoading,
            // Admin actions
            createQuestion,
            editQuestion,
            removeQuestion,
            // User actions
            submitAnswer,
            editAnswer,
            getAnswerForQuestion
        }}>
            {children}
        </QuizContext.Provider>
    );
};

// Hook for using quiz context
export const useQuiz = () => {
    const context = useContext(QuizContext);
    if (context === undefined) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
};
