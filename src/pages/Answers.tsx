import React, {useState} from 'react';
import {useQuiz} from "@/contexts/QuizContext.tsx";
import {useAuth} from "@/contexts/AutContext.tsx";
import QuestionCard from "@/components/quiz/QuestionCard.tsx";
import AnswerForm from "@/components/quiz/AnswerForm.tsx";
import AnswerHistory from "@/components/quiz/AnswerHistory.tsx";
import BaseModal from "@/components/layouts/BaseModal.tsx";

const Answers: React.FC = () => {
    const {questions, submitAnswer, getAnswerForQuestion} = useQuiz();
    const {user} = useAuth();
    const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

    const handleSubmitAnswer = (questionId: string, selectedOption: number) => {
        if (!user) return;
        submitAnswer(questionId, selectedOption);
    };
    const toggleQuestionExpand = (questionId: string) => {
        setExpandedQuestion(prev => prev === questionId ? null : questionId);
    };

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Quiz Questions</h1>
                <p className="text-muted-foreground mt-2">
                    Answer the questions below by selecting the correct option.
                </p>
            </div>

            {questions.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <h3 className="font-medium mb-2">No questions available</h3>
                    <p className="text-muted-foreground">Check back later for new questions.</p>
                </div>
            ) : (
                <div className="space-y-8 container mx-auto">
                    <div className="flex flex-row justify-start align-middle gap-3 flex-wrap">
                        {questions.map((question) => {
                            const userAnswer = getAnswerForQuestion(question.id);
                            const hasAnswered = !!userAnswer;

                            return (
                                <div
                                    key={question.id}
                                    className="border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 min-w-[30rem]"
                                >
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => toggleQuestionExpand(question.id)}
                                    >
                                        <QuestionCard
                                            question={question}
                                            selectedOption={userAnswer?.selectedOption}
                                            isCorrect={userAnswer?.isCorrect}
                                        />
                                    </div>

                                    {expandedQuestion === question.id && (
                                        <BaseModal open={expandedQuestion === question.id}
                                                   onClose={() => toggleQuestionExpand(question.id)}>
                                            <div className="p-6">
                                                {!hasAnswered ? (
                                                    <AnswerForm
                                                        question={question}
                                                        onSubmit={(option) => handleSubmitAnswer(question.id, option)}
                                                    />
                                                ) : (
                                                    <div className="space-y-6">
                                                        <div>
                                                            <h3 className="text-lg font-medium mb-3">Update your
                                                                answer</h3>
                                                            <AnswerForm
                                                                question={question}
                                                                selectedOption={userAnswer.selectedOption}
                                                                onSubmit={(option) => handleSubmitAnswer(question.id, option)}
                                                            />
                                                        </div>

                                                        {userAnswer.history.length > 1 && (
                                                            <AnswerHistory
                                                                answer={userAnswer}
                                                                question={question}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </BaseModal>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

        </>
    );
};

export default Answers;