import api from "./client";

export function generateQuiz(projectId, count = 5) {
  return api.post("/api/quiz/generate", {
    project_id: projectId,
    count,
  });
}

export function getQuiz(id) {
  return api.get(`/api/quiz/${id}`);
}

export function startQuiz(id) {
  return api.post(`/api/quiz/${id}/start`);
}

export function answerQuestion(id, questionId, answer) {
  return api.post(`/api/quiz/${id}/answer`, {
    question_id: questionId,
    answer,
  });
}

export function completeQuiz(id) {
  return api.post(`/api/quiz/${id}/complete`);
}
