import React, {useState} from 'react';
import {Question} from '@/lib/mockData';
import {Plus, Minus, Save} from 'lucide-react';

interface QuestionFormProps {
    initialData?: Question;
    onSubmit: (data: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
    onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
                                                       initialData,
                                                       onSubmit,
                                                       onCancel
                                                   }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [options, setOptions] = useState<string[]>(initialData?.options || ['', '']);
    const [correctOption, setCorrectOption] = useState<number | undefined>(initialData?.correctOption);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Validate form
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) newErrors.title = 'Title is required';
        if (!content.trim()) newErrors.content = 'Question content is required';

        // Check if at least 2 options are provided
        const filledOptions = options.filter(opt => opt.trim() !== '');
        if (filledOptions.length < 2) {
            newErrors.options = 'At least 2 options are required';
        }

        // Check if a correct option is selected
        if (correctOption === undefined || options[correctOption]?.trim() === '') {
            newErrors.correctOption = 'Please select a correct answer';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            // Filter out empty options
            const filteredOptions = options.filter(opt => opt.trim() !== '');

            // Adjust correct option index if needed
            let adjustedCorrectOption = correctOption;
            if (correctOption !== undefined) {
                const selectedOptionValue = options[correctOption];
                adjustedCorrectOption = filteredOptions.findIndex(opt => opt === selectedOptionValue);
            }

            await onSubmit({
                title,
                content,
                options: filteredOptions,
                correctOption: adjustedCorrectOption as number
            });
        } catch (error) {
            console.error('Error submitting question:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add option field
    const addOption = () => {
        setOptions([...options, '']);
    };

    // Remove option field
    const removeOption = (index: number) => {
        // Don't allow removing if only 2 options remain
        if (options.length <= 2) return;

        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);

        // Adjust correctOption if needed
        if (correctOption !== undefined) {
            if (index === correctOption) {
                setCorrectOption(undefined);
            } else if (index < correctOption) {
                setCorrectOption(correctOption - 1);
            }
        }
    };

    // Update option at index
    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    return (
        <form onSubmit={handleSubmit}
              className="space-y-6 p-6 backdrop-blur-sm bg-white/5 rounded-xl border border-border">
            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                        Question Title
                    </label>
                    <input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`w-full px-4 py-2 bg-background border ${errors.title ? 'border-destructive' : 'border-input'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50`}
                        placeholder="Enter a title for the question"
                    />
                    {errors.title && (
                        <p className="mt-1 text-xs text-destructive">{errors.title}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium mb-1">
                        Question Content
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-2 bg-background border ${errors.content ? 'border-destructive' : 'border-input'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50`}
                        placeholder="Enter the question content"
                    />
                    {errors.content && (
                        <p className="mt-1 text-xs text-destructive">{errors.content}</p>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium">
                            Answer Options
                        </label>
                        <button
                            type="button"
                            onClick={addOption}
                            className="inline-flex items-center p-1 border border-transparent text-xs font-medium rounded text-primary hover:bg-primary/10"
                        >
                            <Plus className="h-4 w-4"/>
                            <span className="ml-1">Add Option</span>
                        </button>
                    </div>

                    {errors.options && (
                        <p className="mb-2 text-xs text-destructive">{errors.options}</p>
                    )}

                    <div className="space-y-3">
                        {options.map((option, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <div className="flex-1">
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => updateOption(index, e.target.value)}
                                            className="w-full pl-10 pr-10 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            placeholder={`Option ${index + 1}`}
                                        />
                                        <div className="absolute left-3 flex items-center h-full">
                                            <input
                                                type="radio"
                                                name="correctOption"
                                                checked={correctOption === index}
                                                onChange={() => setCorrectOption(index)}
                                                className="h-4 w-4 text-primary focus:ring-primary/50"
                                            />
                                        </div>
                                        {options.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeOption(index)}
                                                className="absolute right-3 text-muted-foreground hover:text-destructive"
                                            >
                                                <Minus className="h-4 w-4"/>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {errors.correctOption && (
                        <p className="mt-2 text-xs text-destructive">{errors.correctOption}</p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                        Select the radio button next to the correct answer.
                    </p>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-input rounded-md text-sm font-medium hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2"/>
                            Save Question
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default QuestionForm;