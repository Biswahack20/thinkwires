FROM python:3.11-slim AS builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim AS runner

WORKDIR /app

RUN useradd -m -u 1001 aiapp && \
    apt-get update && apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /root/.local /home/aiapp/.local
COPY . /app

ENV PATH=/home/aiapp/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PORT=8000

RUN chown -R aiapp:aiapp /app /home/aiapp/.local

USER aiapp

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/healthz || exit 1

CMD ["python", "main.py"]
