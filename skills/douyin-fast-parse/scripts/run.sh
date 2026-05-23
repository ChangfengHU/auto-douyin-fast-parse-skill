#!/usr/bin/env bash
# cloudflare worker source
set -euo pipefail

MODE=""
TOKEN="${DOUYIN_FAST_PARSE_TOKEN:-}"
ENDPOINT_OVERRIDE=""
URL=""

for arg in "$@"; do
  case "$arg" in
    --mode=*) MODE="${arg#--mode=}" ;;
    --token=*) TOKEN="${arg#--token=}" ;;
    --endpoint=*) ENDPOINT_OVERRIDE="${arg#--endpoint=}" ;;
    --url=*) URL="${arg#--url=}" ;;
    -h|--help)
      echo "Usage: $0 --mode=<mode> [--token=TOKEN] [--endpoint=URL]"
      exit 0
      ;;
  esac
done

if [[ -z "$MODE" ]] && [[ -n "${URL}" ]]; then
  MODE="parse"
fi

if [[ -z "$MODE" ]]; then
  echo "Provide --mode or enough fields to infer one" >&2
  exit 1
fi

TOKEN="${TOKEN#Bearer }"
TOKEN="${TOKEN#bearer }"

ENDPOINT=https://auto-api-douyin-fast-parse.hb67egcim4.workers.dev
if [[ -n "$ENDPOINT_OVERRIDE" ]]; then
  ENDPOINT="$ENDPOINT_OVERRIDE"
fi

COMMON_HEADERS=()
if [[ -n "$TOKEN" ]]; then
  COMMON_HEADERS+=(-H "Authorization: Bearer $TOKEN")
fi

echo "Calling douyin-fast-parse..." >&2

case "$MODE" in
parse)
  PAYLOAD=$(URL="${URL}" python3 -c 'import json, os; keys = ["url"]; data = {}; [data.__setitem__(key, os.environ.get(key.upper().replace("-", "_").replace(".", "_")) or os.environ.get(key.upper().replace("-", "_"))) for key in keys if (os.environ.get(key.upper().replace("-", "_").replace(".", "_")) or os.environ.get(key.upper().replace("-", "_")))]; print(json.dumps(data))')
  curl --connect-timeout 10 --max-time 60 --fail-with-body -sS -L "$ENDPOINT" ${COMMON_HEADERS[@]+"${COMMON_HEADERS[@]}"} -H "Content-Type: application/json" -d "$PAYLOAD"
  ;;
  *)
    echo "Unsupported mode: $MODE" >&2
    exit 1
    ;;
esac
