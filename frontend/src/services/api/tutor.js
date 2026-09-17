import api from "./client";

export function askTutor(projectId, message, conversationId = null) {
  return api.post("/api/tutor/ask", {
    project_id: projectId,
    message,
    conversation_id: conversationId,
  });
}

export function getConversations(projectId) {
  return api.get(`/api/tutor/conversations/project/${projectId}`);
}

export function getConversation(conversationId) {
  return api.get(`/api/tutor/conversations/${conversationId}`);
}
