import React, {useState} from 'react';
import {Plus} from 'lucide-react';
import {Question} from '@/lib/mockData';
import {useQuiz} from '@/contexts/QuizContext';
import {useAuth} from '@/contexts/AutContext';
import {useNavigate} from 'react-router-dom';
import QuestionCard from "@/components/quiz/QuestionCard.tsx";
import QuestionForm from "@/components/quiz/QuestionForm.tsx";
import BaseModal from '@/components/layouts/BaseModal';

const Questions: React.FC = () => {
    const {questions, createQuestion, editQuestion, removeQuestion} = useQuiz();
    const {isAdmin} = useAuth();
    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

    // Redirect if not admin
    React.useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    const handleCreateQuestion = (questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
        createQuestion(questionData);
        setShowForm(false);
    };

    const handleEditQuestion = (questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
        if (editingQuestion) {
            editQuestion(editingQuestion.id, questionData);
            setEditingQuestion(null);
        }
    };

    const handleDeleteQuestion = (id: string) => {
        removeQuestion(id);
    };

    const startEditing = (question: Question) => {
        setEditingQuestion(question);
        setShowForm(false);
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingQuestion(null);
    };

    if (!isAdmin) {
        return null;
    }

    return (

        <div className="container mx-auto overflow-x-hidden">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Questions</h1>

                <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    <Plus className="h-4 w-4 mr-2"/>
                    Add Question
                </button>
            </div>

            {showForm && (
                <BaseModal open={showForm} onClose={() => setShowForm(false)}>
                    <div className="mb-8 animate-fade-in w-[30rem]">
                        <h2 className="text-xl font-medium mb-4">Create New Question</h2>
                        <QuestionForm
                            onSubmit={handleCreateQuestion}
                            onCancel={cancelForm}
                        />
                    </div>
                </BaseModal>
            )}

            {editingQuestion && (
                <BaseModal open={!!editingQuestion} onClose={() => setEditingQuestion(null)}>
                    <div className="mb-8 animate-fade-in">
                        <h2 className="text-xl font-medium mb-4">Edit Question</h2>
                        <QuestionForm
                            initialData={editingQuestion}
                            onSubmit={handleEditQuestion}
                            onCancel={cancelForm}
                        />
                    </div>
                </BaseModal>
            )}

            <div className="space-y-6">
                {questions.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card">
                        <h3 className="font-medium mb-2">No questions yet</h3>
                        <p className="text-muted-foreground mb-4">Create your first question to get started.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            <Plus className="h-4 w-4 mr-2"/>
                            Add Question
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-row justify-start align-middle gap-3 flex-wrap">
                        {
                            questions.map((question) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    isAdmin={true}
                                    onEdit={startEditing}
                                    onDelete={handleDeleteQuestion}
                                />
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

export default Questions;