import React from 'react';
import {Answer} from '@/lib/mockData';
import {formatRelative} from 'date-fns';

interface AnswerHistoryProps {
    answer: Answer;
    question: {
        options: string[];
        correctOption?: number;
    };
}

const AnswerHistory: React.FC<AnswerHistoryProps> = ({
                                                         answer,
                                                         question
                                                     }) => {
    const getFormattedDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return formatRelative(date, new Date());
        } catch (e) {
            return 'Invalid date';
        }
    };

    const getOptionText = (optionIndex: number): string => {
        return question.options[optionIndex] || 'Unknown option';
    };

    const isCorrect = (optionIndex: number): boolean => {
        return question.correctOption === optionIndex;
    };

    // Sort history from newest to oldest
    const sortedHistory = [...answer.history].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return (
        <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium text-muted-foreground">Answer History</h4>
            <ul className="space-y-2 text-sm">
                {sortedHistory.map((entry, index) => (
                    <li
                        key={index}
                        className={`p-3 rounded-lg border ${
                            index === 0 ? 'border-primary/30 bg-primary/5' : 'border-border bg-background'
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="font-medium">
                                    {getOptionText(entry.selectedOption)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {getFormattedDate(entry.timestamp)}
                                </div>
                            </div>
                            <div
                                className={`text-xs px-2 py-1 rounded-full ${
                                    isCorrect(entry.selectedOption)
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-destructive/10 text-destructive'
                                }`}
                            >
                                {isCorrect(entry.selectedOption) ? 'Correct' : 'Incorrect'}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AnswerHistory;