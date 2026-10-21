import os
from typing import Dict, Any, List
from app.schemas.screening import GenerateAssessmentRequest

def generate_screening_test(request: GenerateAssessmentRequest) -> Dict[str, Any]:
    """
    Generates a proctored 10-Question Technical Assessment tailored to the
    job requisition and candidate profile per PRD Section 4.2:
    - 7 Multiple Choice Questions (MCQs)
    - 2 Situational System Design / Trade-off Scenarios
    - 1 Practical Coding / Implementation Exercise
    """
    skills = request.required_skills or ["React", "TypeScript", "Node.js", "System Design", "SQL"]
    primary_skill = skills[0] if skills else "Full Stack Engineering"
    secondary_skill = skills[1] if len(skills) > 1 else "Modern Architecture"

    questions: List[Dict[str, Any]] = [
        # ── 7 MULTIPLE CHOICE QUESTIONS ──────────────────────────────────────
        {
            "id": "q1",
            "type": "mcq",
            "points": 10,
            "question": f"In {primary_skill}, how should you optimize resource rendering or prevent unnecessary sub-component state re-evaluations?",
            "options": [
                "By invoking deep object comparisons on every render cycle synchronously",
                "Using memoization primitives (e.g. useMemo / PureComponent) and stable callback references",
                "By storing all transient UI state inside global immutable stores",
                "Disabling virtual DOM reconciliation passes entirely",
            ],
            "correct_option_index": 1,
            "explanation": "Memoization and stable callback references minimize redundant reconciliations and unnecessary DOM operations.",
        },
        {
            "id": "q2",
            "type": "mcq",
            "points": 10,
            "question": f"When configuring asynchronous pipelines or APIs in {secondary_skill}, what is the optimal pattern to handle rate-limiting and service degradation?",
            "options": [
                "Exponential backoff with randomized jitter and circuit breaker protection",
                "Immediate tight-loop retrying until an HTTP 200 is received",
                "Ignoring 429 status codes and re-routing to fallback mirrors without delay",
                "Terminating the server process immediately to trigger an orchestrator restart",
            ],
            "correct_option_index": 0,
            "explanation": "Exponential backoff combined with jitter prevents thundering herd problems, and circuit breakers stop cascade failures.",
        },
        {
            "id": "q3",
            "type": "mcq",
            "points": 10,
            "question": "What is the primary benefit of connection pooling in high-throughput PostgreSQL / relational database architectures?",
            "options": [
                "It enables schema migrations without acquiring table locks",
                "It eliminates the TLS certificate handshake overhead",
                "It reuses existing established backend TCP connections, avoiding expensive process fork overhead",
                "It compresses table columns on disk in real time",
            ],
            "correct_option_index": 2,
            "explanation": "Connection pools maintain open backend processes, preventing the high CPU and memory overhead of creating a new socket connection per query.",
        },
        {
            "id": "q4",
            "type": "mcq",
            "points": 10,
            "question": "Which HTTP security header is critical to prevent Cross-Site Scripting (XSS) by restricting where scripts, styles, and media can load from?",
            "options": [
                "Strict-Transport-Security (HSTS)",
                "Content-Security-Policy (CSP)",
                "X-Frame-Options",
                "Access-Control-Allow-Origin",
            ],
            "correct_option_index": 1,
            "explanation": "Content-Security-Policy restricts executable scripts and resource origins, providing robust defense against XSS.",
        },
        {
            "id": "q5",
            "type": "mcq",
            "points": 10,
            "question": f"When scaling {primary_skill} applications, which caching strategy guarantees that database updates immediately invalidate stale read-replicas?",
            "options": [
                "Write-behind (deferred asynchronous) caching",
                "Write-through caching with proactive cache key invalidation / Redis PUB/SUB",
                "Client-side local storage memoization without TTLs",
                "DNS round-robin routing with sticky sessions",
            ],
            "correct_option_index": 1,
            "explanation": "Write-through caching ensures cache updates happen simultaneously with database writes, preventing stale reads.",
        },
        {
            "id": "q6",
            "type": "mcq",
            "points": 10,
            "question": "In microservices architectures, what is the role of an Idempotency Key in payment and order processing POST endpoints?",
            "options": [
                "It encrypts the payload using asymmetric public keys",
                "It guarantees that duplicate network transmissions result in only a single business transaction execution",
                "It bypasses the API Gateway authentication layer for trusted partners",
                "It compresses large JSON payloads into Protocol Buffers",
            ],
            "correct_option_index": 1,
            "explanation": "An idempotency key ensures that if a network failure causes a client retry, the server recognizes the duplicate and avoids charging twice.",
        },
        {
            "id": "q7",
            "type": "mcq",
            "points": 10,
            "question": "What is the purpose of Docker multi-stage builds in production deployment pipelines?",
            "options": [
                "To deploy containers simultaneously to multiple cloud providers",
                "To isolate compile-time tooling from the final lightweight, hardened runtime image",
                "To automatically scale container CPU limits horizontally",
                "To run automated integration tests inside the production container",
            ],
            "correct_option_index": 1,
            "explanation": "Multi-stage builds leave compilers and dev dependencies behind, drastically reducing image size and attack surface.",
        },

        # ── 2 SITUATIONAL SYSTEM DESIGN SCENARIOS ────────────────────────────
        {
            "id": "q8",
            "type": "scenario",
            "points": 15,
            "scenario": (
                f"You are leading the {request.department} team for a high-traffic staffing platform. During a product launch, "
                f"the candidate application endpoint encounters a 10x traffic spike. The database write IOPS hit 95% capacity, causing "
                f"HTTP 504 gateway timeouts for applicant submissions."
            ),
            "question": (
                "Describe how you would architect an immediate mitigation and long-term asynchronous queue pipeline "
                "(e.g., BullMQ, Redis, or Kafka) to decouple incoming HTTP submissions from database writes while ensuring zero data loss."
            ),
            "rubric": "Evaluates understanding of message queues, asynchronous task workers, backpressure management, and database connection pooling.",
        },
        {
            "id": "q9",
            "type": "scenario",
            "points": 15,
            "scenario": (
                f"A major enterprise client requests a feature where technical candidate resumes are automatically parsed, vectorized, "
                f"and compared across 50,000 active candidate dossiers in under 500ms."
            ),
            "question": (
                "Explain the data architecture you would select (e.g. pgvector, Pinecone, or Milvus), indexing strategies "
                "(IVFFlat vs HNSW), and how you would balance similarity precision against query latency."
            ),
            "rubric": "Evaluates knowledge of vector embeddings, indexing algorithms (HNSW vs IVFFlat), and memory-efficient search architecture.",
        },

        # ── 1 PRACTICAL CODE EXERCISE ────────────────────────────────────────
        {
            "id": "q10",
            "type": "practical",
            "points": 20,
            "title": f"High-Throughput Task Batcher in {primary_skill}",
            "instructions": (
                "Implement a task batcher function `createBatcher(batchHandler, maxBatchSize, delayMs)` that gathers individual "
                "incoming requests and executes them in a single batch once `maxBatchSize` is reached or `delayMs` elapses, "
                "resolving each individual caller's promise with its respective result."
            ),
            "starter_code": (
                "function createBatcher(batchHandler, maxBatchSize = 10, delayMs = 50) {\n"
                "  let queue = [];\n"
                "  let timer = null;\n\n"
                "  function flush() {\n"
                "    // TODO: Execute batchHandler with collected items and resolve respective promises\n"
                "  }\n\n"
                "  return function enqueue(item) {\n"
                "    return new Promise((resolve, reject) => {\n"
                "      // TODO: Add item with resolve/reject callbacks and trigger flush if threshold met\n"
                "    });\n"
                "  };\n"
                "}\n"
            ),
            "solution_rubric": "Evaluates Promise orchestration, closure state management, timer clearing, and batch error propagation.",
        },
    ]

    total_points = sum(q.get("points", 10) for q in questions)

    return {
        "success": True,
        "test_id": f"tw_eval_{request.job_id}_{int(os.times()[4] * 1000)}",
        "job_id": request.job_id,
        "job_title": request.job_title,
        "passing_threshold": request.passing_threshold or 75,
        "time_limit_minutes": request.time_limit_minutes or 20,
        "total_points": total_points,
        "questions": questions,
    }
