// Types
export interface Question {
    id: string;
    title: string;
    content: string;
    options: string[];
    correctOption?: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface Answer {
    id: string;
    questionId: string;
    userId: string;
    selectedOption: number;
    isCorrect?: boolean;
    createdAt: string;
    updatedAt: string;
    history: AnswerHistory[];
}

export interface AnswerHistory {
    selectedOption: number;
    timestamp: string;
}

// Initial questions
export const initialQuestions: Question[] = [
    {
        id: '1',
        title: 'JavaScript Basics',
        content: 'Which of the following is NOT a JavaScript data type?',
        options: ['String', 'Boolean', 'Float', 'Object'],
        correctOption: 2, // Float
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'admin-1'
    },
    {
        id: '2',
        title: 'React Fundamentals',
        content: 'Which hook would you use to run side effects in a React component?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctOption: 1, // useEffect
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'admin-1'
    },
    {
        id: '3',
        title: 'CSS Properties',
        content: 'Which CSS property is used to create space between elements\' content and its border?',
        options: ['margin', 'padding', 'spacing', 'border-spacing'],
        correctOption: 1, // padding
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'admin-1'
    },
    {
        id: '4',
        title: 'TypeScript Knowledge',
        content: 'Which of the following is NOT a TypeScript type?',
        options: ['any', 'unknown', 'string', 'float'],
        correctOption: 3, // float
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'admin-1'
    }
];

// Initial answers
export const initialAnswers: Answer[] = [
    {
        id: '1',
        questionId: '1',
        userId: 'user-1',
        selectedOption: 0, // incorrect
        isCorrect: false,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        history: [
            {
                selectedOption: 0,
                timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
            }
        ]
    },
    {
        id: '2',
        questionId: '2',
        userId: 'user-1',
        selectedOption: 1, // correct
        isCorrect: true,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        history: [
            {
                selectedOption: 1,
                timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
            }
        ]
    }
];
