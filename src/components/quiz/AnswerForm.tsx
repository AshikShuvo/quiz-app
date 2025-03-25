import React, {useState} from 'react';
import {Question} from '@/lib/mockData';
import {Send} from 'lucide-react';

interface AnswerFormProps {
    question: Question;
    selectedOption?: number;
    onSubmit: (option: number) => void;
}

const AnswerForm: React.FC<AnswerFormProps> = ({
                                                   question,
                                                   selectedOption,
                                                   onSubmit,
                                               }) => {
    const [option, setOption] = useState<number | undefined>(selectedOption);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (option === undefined) return;
        onSubmit(option);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
                {question.options.map((optionText, index) => (
                    <div key={index}>
                        <label className={`
              flex items-center p-3 rounded-lg border cursor-pointer
              ${option === index ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50'}
              transition-colors duration-200
            `}>
                            <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={index}
                                checked={option === index}
                                onChange={() => setOption(index)}
                                className="sr-only"
                            />
                            <div className={`
                w-5 h-5 rounded-full flex items-center justify-center border
                ${option === index ? 'border-primary' : 'border-muted-foreground'}
                mr-3
              `}>
                                {option === index && (
                                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                                )}
                            </div>
                            <span>{optionText}</span>
                        </label>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={option === undefined}
                    className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <>
                        <Send className="h-4 w-4 mr-2"/>
                        Submit Answer
                    </>
                </button>
            </div>
        </form>
    );
};

export default AnswerForm;