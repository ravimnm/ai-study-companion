# AI Study Companion - Growth / Analytics Fixes

Implemented fixes based on the supplied Product Requirements Document.

## Activity tracking

Added real activity event creation for:
- PROJECT_CREATED
- MATERIAL_UPLOADED
- MATERIAL_PROCESSED
- MATERIAL_PROCESSING_FAILED
- tutor_interaction
- QUIZ_ATTEMPTED
- QUESTION_ANSWERED
- ASSESSMENT_COMPLETED
- MASTERY_UPDATED
- RECOMMENDATION_CREATED

Activity logging is non-blocking: a telemetry write failure does not break the primary learning operation.

## Growth

Growth now exposes:
- average mastery
- concept count
- improving / stable / needs-attention counts
- strong concepts
- weak concepts
- per-concept score/trend/confidence
- assessment metrics
- activity count
- recommendation count

## Analytics

Added:
- global analytics endpoint: `/api/analytics/global`
- richer project analytics endpoint
- assessment performance
- mastery/trend metrics
- activity event breakdown
- AI usage metrics
- project analytics UI under `/projects/:projectId/analytics`
- global analytics UI using the global analytics endpoint plus recent activity

## Packaging

Runtime `.env` files and `frontend/node_modules` are excluded from this source archive. Use the included `.env.example` files and install frontend dependencies with npm.
