from pydantic import BaseModel


class AnswerResponse(BaseModel):
    AnswerId: int
    answerCode: str
    answer: str

    model_config = {"from_attributes": True}


class AnswerRevealResponse(BaseModel):
    AnswerId: int
    answerCode: str
    answer: str
    isCorrect: bool
    justification: str | None

    model_config = {"from_attributes": True}


class CategoryResponse(BaseModel):
    CategoryId: int
    categoryCode: str
    name: str

    model_config = {"from_attributes": True}


class PrizeLevelResponse(BaseModel):
    PrizeLevelId: int
    prizeLevelCode: str
    prizeValue: int
    isSafetyNet: bool

    model_config = {"from_attributes": True}


class QuestionResponse(BaseModel):
    QuestionId: int
    questionCode: str
    question: str
    CategoryId: int
    PrizeLevelId: int
    answers: list[AnswerResponse]

    model_config = {"from_attributes": True}


class AnswerSubmitRequest(BaseModel):
    GameId: int
    QuestionId: int
    AnswerId: int
    questionSequence: int


class AnswerSubmitResponse(BaseModel):
    isCorrect: bool
    correctAnswer: AnswerRevealResponse
    justification: str | None
    prizeWon: int
    gameOver: bool
    nextQuestion: QuestionResponse | None
