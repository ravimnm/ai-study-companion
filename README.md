# AI Study Companion

> A full-stack, context-aware learning platform that connects document-based knowledge, AI tutoring, assessment, mastery tracking, growth analysis, analytics, and personalized recommendations into one continuous learning workflow.

## Overview

AI Study Companion is designed around a simple problem: learning tools often treat reading, asking questions, taking quizzes, and reviewing progress as separate activities.

This project connects those activities through **persistent, project-level learning context**.

The core learning loop is:

```text
Space
  ↓
Project
  ↓
Material
  ↓
Knowledge / Retrieval
  ↓
AI Tutor
  ↓
Grounded Answer + Citation
  ↓
Quiz / Assessment
  ↓
Evaluation
  ↓
Concept Mastery
  ↓
Growth Analysis
  ↓
Analytics
  ↓
Recommendation
  ↓
Continue Learning
```

The objective is not simply to provide an AI chatbot. The system maintains a learner's working context and uses evidence from materials, conversations, assessments, mastery, and activity to support the next stage of learning.

---

## Key Features

### Learning Workspace

- User authentication
- Spaces for organizing learning
- Project-based learning contexts
- Project-level materials and learning history

### Document Intelligence

- PDF material ingestion
- Text extraction and processing
- Document chunking
- Local MiniLM embeddings
- MongoDB Atlas Vector Search
- Project-scoped semantic retrieval

### AI Tutor

- Retrieval-Augmented Generation (RAG)
- Context-aware responses
- Grounded answers based on uploaded learning material
- Citation-aware conversations
- Handling of questions outside the available knowledge context
- Persistent Tutor conversations

### Assessment

- Adaptive quiz workflow
- Multiple-choice questions
- Open-ended assessment questions
- Answer recording
- Evaluation
- Assessment completion tracking

### Learning Intelligence

- Concept-level mastery
- Mastery scores and trends
- Growth Analysis
- Improving / stable / needs-attention concepts
- Personalized recommendations
- Project analytics
- Global analytics
- Learning activity tracking

### Observability

- Activity/event tracking
- AI usage tracking
- Model, token, latency, cost, and success/failure information where available
- Tutor retrieval and citation metrics
- Administrative visibility into system activity and AI usage

---

## System Architecture

The application follows a layered full-stack architecture:

```text
┌──────────────────────────────────────────────────────────────┐
│                       React / Vite                           │
│                                                              │
│ Dashboard · Spaces · Projects · Materials · Tutor           │
│ Quiz · Mastery · Growth · Recommendations · Analytics        │
└──────────────────────────────┬───────────────────────────────┘
                               │ REST API
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                         FastAPI                              │
│                                                              │
│ Auth · Spaces · Projects · Materials · Tutor · Quiz         │
│ Mastery · Growth · Analytics · Recommendations · Admin       │
└───────────────┬──────────────────────────────┬───────────────┘
                │                              │
                ▼                              ▼
┌──────────────────────────────┐  ┌────────────────────────────┐
│        MongoDB Atlas         │  │       AI / Retrieval       │
│                              │  │                            │
│ Users                        │  │ MiniLM Embeddings          │
│ Spaces                       │  │ Atlas Vector Search        │
│ Projects                     │  │ Groq Generation            │
│ Materials / Chunks           │  │ Tutor / Quiz / Evaluation  │
│ Conversations                │  │ Recommendation Logic       │
│ Assessments                  │  │                            │
│ Mastery                      │  └────────────────────────────┘
│ Recommendations              │
│ Activity / AI Usage          │
└──────────────────────────────┘
```

### Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | FastAPI, Python |
| Database | MongoDB Atlas |
| Vector Search | MongoDB Atlas Vector Search |
| Embeddings | MiniLM |
| Generative AI | Groq |
| Authentication | JWT |
| API | REST / FastAPI |
| Development Runtime | Jupyter/Colab-backed backend modules |
| Deployment | Independently deployed frontend and backend |

---

## Retrieval-Augmented Generation

The Tutor uses a retrieval-first approach instead of sending an unrestricted question directly to a language model.

```text
User Question
      ↓
Query Embedding
      ↓
Semantic Retrieval
      ↓
Relevant Project Chunks
      ↓
Context Construction
      ↓
Groq Language Model
      ↓
Grounded Tutor Response
```

This architecture allows the Tutor to use the learner's uploaded material as a knowledge source while maintaining project-level context.

A key design consideration is **data isolation**: retrieval should operate within the appropriate learning context rather than treating all stored documents as one global knowledge base.

---

## Learning State

A major design decision is that learning state is persisted rather than reconstructed only from the current browser session.

The system represents relationships between:

```text
User
 └── Space
      └── Project
           ├── Materials
           │    └── Document Chunks
           ├── Tutor Conversations
           ├── Assessments
           │    ├── Questions
           │    └── Answers
           ├── Concepts
           │    └── Mastery
           ├── Recommendations
           └── Activity
```

This makes the **Project** the primary learning-context boundary.

---

## Material Processing Pipeline

Uploaded material is transformed into searchable knowledge through the following process:

```text
PDF Upload
    ↓
Text Extraction
    ↓
Chunking
    ↓
MiniLM Embedding
    ↓
MongoDB Atlas
    ↓
Atlas Vector Search
    ↓
Project-Scoped Retrieval
```

Embeddings are generated during material processing so that later Tutor requests do not need to recompute the representation of every document chunk.

---

## Mastery, Growth, and Recommendations

The platform distinguishes between **current learning state** and **change in learning state**.

### Mastery

Concept mastery is represented on a `0.0 – 1.0` scale and can have trend states such as:

- `improving`
- `stable`
- `needs_attention`

### Growth Analysis

Growth Analysis combines learning signals such as:

- concept mastery
- assessment performance
- learning activity
- recommendation state

This provides a higher-level view of how learning is progressing.

### Recommendations

Recommendations convert learning signals into possible next actions.

```text
Assessment
    ↓
Evaluation
    ↓
Mastery Update
    ↓
Growth Signal
    ↓
Recommendation
    ↓
Next Learning Action
```

---

## Activity and Event Tracking

Learning activity is represented explicitly rather than being inferred only from UI state.

Representative events include:

```text
PROJECT_CREATED
MATERIAL_UPLOADED
TUTOR_MESSAGE_SENT
QUIZ_COMPLETED
MASTERY_UPDATED
RECOMMENDATION_CREATED
```

Activity supports:

- project-level learning history
- analytics
- recommendations
- background workflows
- administrative visibility

---

## AI Usage and Observability

The system includes an AI usage layer to make model-driven operations more observable.

Tracked information can include:

- model
- token usage
- latency
- cost-related information
- success/failure
- retrieval count
- citations
- groundedness-related Tutor metrics

This provides visibility into both **learner activity** and **AI system behavior**.

---

## Backend Organization

The backend is organized around application capabilities:

```text
backend/
├── app/
│   ├── core/
│   │   ├── config.ipynb
│   │   ├── security.ipynb
│   │   └── database.ipynb
│   │
│   ├── models/
│   │   ├── user
│   │   ├── space
│   │   ├── project
│   │   ├── material
│   │   ├── document_chunk
│   │   ├── conversation
│   │   ├── assessment
│   │   ├── mastery
│   │   ├── recommendation
│   │   ├── activity
│   │   └── ai_usage
│   │
│   ├── schemas/
│   │
│   ├── ai/
│   │   ├── prompts
│   │   ├── tutor
│   │   ├── quiz_generator
│   │   ├── evaluator
│   │   └── recommender
│   │
│   ├── services/
│   │   ├── ai_service
│   │   ├── document_service
│   │   ├── retrieval_service
│   │   ├── tutor_service
│   │   ├── quiz_service
│   │   ├── assessment_service
│   │   └── mastery_service
│   │
│   └── main.ipynb
│
├── requirements.txt
└── render_server.py
```

The repository also contains the React/Vite frontend under `frontend/`.

> The backend currently uses notebook-backed modules. `run_backend.ipynb` is intended for the development/runtime workflow, while `render_server.py` provides a production-oriented startup path.

---

## API Surface

The backend exposes capability-specific routes under `/api`.

Major route groups include:

```text
/api/auth
/api/spaces
/api/projects
/api/materials
/api/tutor
/api/quiz
/api/mastery
/api/growth
/api/analytics
/api/recommendations
/api/admin
```

Health endpoint:

```text
GET /health
```

---

## Local Development

### Prerequisites

- Python 3.10+
- Node.js and npm
- MongoDB Atlas
- Groq API key
- MongoDB Atlas Vector Search configuration
- Git

### Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ai-study-companion
```

### Backend Setup

```bash
cd backend
python -m venv .venv
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### Environment Configuration

Create a local `.env` file for development.

Example:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DATABASE=ai_study_companion

JWT_SECRET_KEY=your_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60

GROQ_API_KEY_1=your_groq_api_key
GROQ_MODEL=your_configured_groq_model

EMBEDDING_MODEL=all-MiniLM-L6-v2
EMBEDDING_DIMENSIONS=384
```

Additional variables may be required by the current backend configuration.

**Never commit `.env` files, API keys, database credentials, JWT secrets, or other private configuration to GitHub.**

### Start the Backend

For the development environment, use the project's backend launcher/runtime workflow.

For the production-oriented startup path:

```bash
python render_server.py
```

The production launcher uses the deployment platform's `PORT` environment variable and binds the application to `0.0.0.0`.

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

---

## Production Deployment

The frontend and backend are designed to be deployed independently.

### Frontend

Build the React/Vite application:

```bash
npm run build
```

The production build is generated in:

```text
dist/
```

Set the production backend URL:

```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN
```

### Backend

Use the production launcher:

```bash
python render_server.py
```

Configure production secrets and environment variables through the hosting platform.

The backend requires access to:

- MongoDB Atlas
- Groq
- required Python/model dependencies
- appropriate CORS configuration
- secure JWT configuration

---

## Security

The application incorporates several basic security boundaries:

- JWT authentication
- authenticated API access
- user/project scoping
- project-level data isolation
- controlled CORS configuration
- environment-based secrets
- backend validation
- error handling

A particularly important boundary is project-scoped access to learning data and retrieval context.

---

## Validation Strategy

Development followed an iterative engineering cycle:

```text
Implement
   ↓
Run
   ↓
Observe
   ↓
Diagnose
   ↓
Correct
   ↓
Re-test
```

Validation covered major areas including:

- authentication
- spaces and projects
- material processing
- embedding generation
- Tutor interactions
- quiz generation
- assessment completion
- mastery
- growth
- recommendations
- analytics
- activity
- CORS behavior
- deployment/runtime behavior

The objective was meaningful integration validation rather than claiming exhaustive test coverage.

---

## Engineering Decisions

### Why MongoDB Atlas?

The application stores several related but flexible entities: projects, materials, conversations, assessments, mastery records, recommendations, activity, and AI usage.

MongoDB provides a practical document-oriented persistence layer, while Atlas also provides the vector-search capability needed by the retrieval workflow.

### Why MiniLM?

A local MiniLM embedding model provides a lightweight semantic representation for document retrieval without requiring a separate embedding API call for every retrieval operation.

The trade-off is local model loading and its associated runtime resource requirements.

### Why Atlas Vector Search?

Keeping semantic retrieval within MongoDB reduces the number of separate infrastructure components required by the prototype and keeps document metadata and vector representations close to the same persistence layer.

### Why Groq?

Groq is used as the generative AI provider for language-model operations. The application keeps generation separate from the embedding layer, allowing the retrieval representation and generation provider to have independent responsibilities.

### Why Project-Level Context?

The Project is the most useful boundary for maintaining learning continuity. Materials, conversations, assessments, mastery, recommendations, and activity can all be associated with the same learning objective.

---

## AI-Assisted Development

AI tools were used as part of a **human-in-the-loop engineering workflow**.

The development process was:

```text
Problem Definition
        ↓
Engineering Decision
        ↓
AI Assistance
        ↓
Source / Requirement Review
        ↓
Implementation
        ↓
Runtime Validation
```

AI assistance was used for:

- architecture reasoning
- implementation assistance
- debugging
- API/schema alignment
- frontend development
- RAG and prompt reasoning
- deployment troubleshooting
- documentation

The developer remained responsible for:

- requirements
- architectural decisions
- technology choices
- integration
- testing and validation
- deployment configuration
- final acceptance of changes

AI-generated suggestions were treated as candidate solutions and checked against actual source code, requirements, logs, API responses, and runtime behavior.

---

## Engineering Trade-offs and Limitations

The project intentionally prioritizes the core learning loop over unnecessary complexity.

### Notebook-backed backend

The backend uses notebook-backed modules as part of its current development workflow. This supports the existing development environment but introduces additional production-runtime considerations compared with a conventional Python package layout.

### Local embeddings

Local embedding generation avoids a separate embedding API dependency, but model loading adds runtime overhead.

### Vector-search configuration

Semantic retrieval depends on correct Atlas Vector Search index configuration, including fields used for project-level filtering.

### AI dependency

AI-generated output is probabilistic. Grounding, structured responses, evaluation, and runtime validation are therefore important parts of the system rather than optional additions.

---

## Project Status

The application implements the primary architecture required for the AI Study Companion workflow, including:

- authentication
- Spaces and Projects
- PDF material processing
- semantic retrieval
- AI Tutor
- assessments
- mastery
- growth analysis
- recommendations
- analytics
- activity tracking
- AI observability
- administrative capabilities
- deployment configuration

The project remains extensible for future capabilities such as richer document understanding, streaming Tutor responses, spaced repetition, flashcards, concept maps, notifications, and more advanced analytics.

---

## Repository Documentation

Additional technical documentation is maintained separately for the project submission:

- Architecture Documentation
- AI Tools and Usage Documentation
- AI Prompts Used During Development

These documents describe the system design, AI-assisted development methodology, engineering decisions, and representative prompting patterns in greater detail.

---

## Author

**Ravi Sankar Manem**

Computer Science & Engineering  
RGUKT Nuzvid

This repository represents the implementation and engineering work for the AI Study Companion project.

---

## License

This project is intended primarily as an academic/project submission. Add an explicit open-source license here if the repository is intended for public reuse.
