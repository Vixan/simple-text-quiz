import { useState } from "react";

type AnswerOption = {
  answerText: string;
  isCorrect: boolean;
};

type Question = {
  questionText: string;
  answerOptions: AnswerOption[];
};

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [textToConvert, setTextToConvert] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const handleNextQuestion = () => {
    const currentQuestionOptions = questions[currentQuestion].answerOptions;
    const correctAnswers = currentQuestionOptions.filter((q) => q.isCorrect);

    if (
      correctAnswers.every((q) =>
        selectedAnswers.some((s) => s === q.answerText)
      ) &&
      correctAnswers.length === selectedAnswers.length
    ) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }

    setSelectedAnswers([]);
  };

  const shuffleArray = (array: unknown[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  const onConvert = () => {
    const questionBlocks = textToConvert.split("\n\n");

    const newQuestions = questionBlocks.map((block) => {
      const questionParts = block.split("\n");
      const questionText = questionParts[0];
      const answerOptions = questionParts.slice(1).map((part) => {
        const answerParts = part.split("##");

        return {
          answerText: answerParts[0],
          isCorrect: answerParts.length > 1,
        };
      });

      return { questionText, answerOptions };
    });

    shuffleArray(newQuestions);
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setShowScore(false);
    setScore(0);
  };

  const onAnswerChecked = (checked: boolean, answerText: string) => {
    checked
      ? setSelectedAnswers([...selectedAnswers, answerText])
      : setSelectedAnswers(selectedAnswers.filter((a) => a !== answerText));
  };

  return (
    <main className="flex flex-col md:flex-row md:h-screen justify-center items-center bg-base-200 px-4 py-16 lg:px-32 gap-8">
      <div className="card w-full h-[36rem] md:w-[64rem] bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title font-bold text-2xl mb-2">Quiz time!</h2>
          <textarea
            name="inputPlaintext"
            className="textarea textarea-bordered w-full h-full"
            placeholder="Enter your questions here"
            value={textToConvert}
            onChange={(e) => setTextToConvert(e.target.value)}
          ></textarea>
          <div className="card-actions justify-end mt-4 gap-4">
            <button
              className="btn btn-ghost btn-outline w-full md:w-auto"
              onClick={() => setTextToConvert("")}
            >
              Clear
            </button>
            <button
              className="btn btn-primary md:btn-wide w-full"
              onClick={onConvert}
            >
              Convert to quiz
            </button>
          </div>
        </div>
      </div>

      {questions?.length > 0 && (
        <div className="card w-full h-[36rem] md:w-[64rem] bg-base-100 shadow-xl">
          <div className="card-body flex justify-between h-full overflow-hidden">
            {showScore ? (
              <div className="flex text-lg items-center">
                You scored {score} out of {questions.length}
              </div>
            ) : (
              <>
                <div className="w-full relative">
                  <div className="mb-5 font-medium text-lg">
                    <span className="mr-1">Question</span>
                    <span className="text-lg text-primary">
                      {currentQuestion + 1}
                    </span>
                    <span className="text-sm">/{questions.length}</span>
                  </div>
                  <div className="mb-3 font-bold">
                    {questions[currentQuestion].questionText}
                  </div>
                  <div className="w-full flex flex-col items-stretch overflow-y-auto h-80">
                    {questions[currentQuestion].answerOptions.map(
                      (answerOption) => (
                        <div
                          key={answerOption.answerText}
                          className="form-control hover:bg-base-200 rounded-md"
                        >
                          <label
                            className="cursor-pointer label justify-start gap-2"
                            htmlFor={answerOption.answerText}
                          >
                            <input
                              type="checkbox"
                              checked={selectedAnswers.includes(
                                answerOption.answerText
                              )}
                              className="checkbox checkbox-primary"
                              id={answerOption.answerText}
                              onChange={() => {
                                onAnswerChecked(
                                  !selectedAnswers.includes(
                                    answerOption.answerText
                                  ),
                                  answerOption.answerText
                                );
                              }}
                            />
                            <span className="label-text">
                              {answerOption.answerText}
                            </span>
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <button
                  className="btn btn-block mt-4"
                  onClick={() => handleNextQuestion()}
                >
                  Next
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
