#!/bin/sh
set -e

PORT="${PORT:-8000}"

if [ "$ENVIRONMENT" = "production" ] || [ -n "$RENDER" ]; then
    echo "Starting in PRODUCTION mode on port $PORT"
    exec uvicorn main:app --host 0.0.0.0 --port "$PORT"
else
    echo "Starting in DEVELOPMENT mode on port $PORT"
    exec uvicorn main:app --host 0.0.0.0 --port "$PORT" --reload
fi
