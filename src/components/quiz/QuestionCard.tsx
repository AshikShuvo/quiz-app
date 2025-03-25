import React, {useState} from 'react';
import {Edit, Trash, Clock, Check, X} from 'lucide-react';
import {Question} from '@/lib/mockData';
import {formatDistanceToNow} from 'date-fns';

interface QuestionCardProps {
    question: Question;
    isAdmin?: boolean;
    onEdit?: (question: Question) => void;
    onDelete?: (id: string) => void;
    selectedOption?: number;
    onSelectOption?: (option: number) => void;
    isSubmitting?: boolean;
    isCorrect?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
                                                       question,
                                                       isAdmin = false,
                                                       onEdit,
                                                       onDelete,
                                                       selectedOption,
                                                       onSelectOption,
                                                       isSubmitting = false,
                                                       isCorrect
                                                   }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleEdit = () => {
        if (onEdit) onEdit(question);
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (onDelete) onDelete(question.id);
        setShowDeleteConfirm(false);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const getTimeAgo = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), {addSuffix: true});
        } catch (e) {
            return 'some time ago';
        }
    };

    return (
        <div
            className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md w-[30rem]">
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium">{question.title}</h3>

                    {isAdmin && (
                        <div className="flex space-x-2">
                            <button
                                onClick={handleEdit}
                                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
                                aria-label="Edit question"
                            >
                                <Edit className="h-4 w-4"/>
                            </button>

                            <button
                                onClick={handleDeleteClick}
                                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                aria-label="Delete question"
                            >
                                <Trash className="h-4 w-4"/>
                            </button>
                        </div>
                    )}
                </div>

                <p className="mb-6 text-foreground">{question.content}</p>

                <div className="space-y-3">
                    {question.options.map((option, index) => (
                        <div key={index}>
                            <label className={`
                flex items-center p-3 rounded-lg border cursor-pointer
                ${selectedOption === index ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-secondary/50'}
                ${isAdmin && question.correctOption === index ? 'border-green-500/50 bg-green-500/5' : ''}
                ${isCorrect === false && selectedOption === index ? 'border-destructive bg-destructive/5' : ''}
                transition-colors duration-200
              `}>
                                <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value={index}
                                    checked={selectedOption === index}
                                    onChange={() => onSelectOption && onSelectOption(index)}
                                    disabled={isSubmitting || (!onSelectOption)}
                                    className="sr-only"
                                />
                                <div className={`
                  w-5 h-5 rounded-full flex items-center justify-center border
                  ${selectedOption === index ? 'border-primary' : 'border-muted-foreground'}
                  ${isCorrect === false && selectedOption === index ? 'border-destructive' : ''}
                  mr-3
                `}>
                                    {selectedOption === index && (
                                        <div className={`
                      w-3 h-3 rounded-full 
                      ${isCorrect === false ? 'bg-destructive' : 'bg-primary'}
                    `}></div>
                                    )}
                                </div>
                                <span className="flex-1 text-left">{option}</span>

                                {isAdmin && question.correctOption === index && (
                                    <span className="ml-2 text-green-500 flex items-center">
                    <Check className="h-4 w-4 mr-1"/>
                    <span className="text-xs font-medium">Correct</span>
                  </span>
                                )}

                                {isCorrect === false && selectedOption === index && (
                                    <span className="ml-2 text-destructive flex items-center">
                    <X className="h-4 w-4 mr-1"/>
                    <span className="text-xs font-medium">Incorrect</span>
                  </span>
                                )}

                                {isCorrect === true && selectedOption === index && (
                                    <span className="ml-2 text-green-500 flex items-center">
                    <Check className="h-4 w-4 mr-1"/>
                    <span className="text-xs font-medium">Correct</span>
                  </span>
                                )}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-6 py-3 bg-muted/30 text-xs text-muted-foreground flex items-center justify-between">
                <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1"/>
                    <span>Updated {getTimeAgo(question.updatedAt)}</span>
                </div>
            </div>

            {/* Delete confirmation */}
            {showDeleteConfirm && (
                <div className="p-4 border-t border-border bg-card">
                    <div className="text-sm mb-4">
                        Are you sure you want to delete this question? This action cannot be undone.
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={cancelDelete}
                            className="px-3 py-1 text-sm border border-input rounded-md hover:bg-secondary/50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionCard;