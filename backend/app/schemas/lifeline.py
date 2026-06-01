from pydantic import BaseModel


class FiftyFiftyResponse(BaseModel):
    QuestionId: int
    remainingAnswers: list[int]


class SageHintResponse(BaseModel):
    QuestionId: int
    hintText: str
    philosophy: str = "Philosophical Sagacity"
    category: str


class PhoneAPeerResponse(BaseModel):
    QuestionId: int
    avatarName: str
    hintText: str


class AskTheClassVoteRequest(BaseModel):
    GameId: int
    QuestionId: int
    AnswerId: int


class AskTheClassResultResponse(BaseModel):
    QuestionId: int
    votes: dict[int, int]
    totalVotes: int
