#!/usr/bin/env bash
set -euo pipefail

PYTHON_BIN="${PYTHON_BIN:-python}"
CHECK_MODE="${CHECK_MODE:-deploy}" # deploy|dev
HAS_ERROR=0

log_error() {
  echo "! error: $1"
  HAS_ERROR=1
}

echo "[check] mode=${CHECK_MODE}"

echo "[check] Python runtime"
"${PYTHON_BIN}" - <<'PY'
import platform
import sys
print(f"- executable: {sys.executable}")
print(f"- version: {platform.python_version()}")
PY

if ! "${PYTHON_BIN}" - <<'PY'
import sys
major, minor = sys.version_info[:2]
raise SystemExit(0 if (major, minor) >= (3, 10) and (major, minor) <= (3, 12) else 1)
PY
then
  log_error "supported Python range is 3.10 to 3.12"
fi

echo "[check] Proxy variables"
for key in HTTP_PROXY HTTPS_PROXY ALL_PROXY NO_PROXY http_proxy https_proxy all_proxy no_proxy; do
  if [[ -n "${!key:-}" ]]; then
    echo "- ${key} is set"
  fi
done

echo "[check] pip index configuration"
"${PYTHON_BIN}" -m pip config list 2>/dev/null || true

echo "[check] pip connectivity probe (fastapi metadata)"
if "${PYTHON_BIN}" -m pip index versions fastapi >/tmp/pip-fastapi-check.log 2>&1; then
  echo "- ok: pip index is reachable"
else
  log_error "pip index unreachable or blocked (see /tmp/pip-fastapi-check.log)"
  tail -n 10 /tmp/pip-fastapi-check.log || true
fi

if [[ "${CHECK_MODE}" == "deploy" ]]; then
  echo "[check] production dependency resolution"
  if "${PYTHON_BIN}" -m pip install --no-build-isolation --dry-run . >/tmp/pip-install-check.log 2>&1; then
    echo "- ok: production dependency resolution succeeded"
  else
    log_error "production dependency resolution failed (see /tmp/pip-install-check.log)"
    tail -n 10 /tmp/pip-install-check.log || true
  fi
elif [[ "${CHECK_MODE}" == "dev" ]]; then
  echo "[check] editable dev install"
  if "${PYTHON_BIN}" -m pip install --no-build-isolation -e .[dev] >/tmp/pip-install-check.log 2>&1; then
    echo "- ok: editable dev install succeeded"
  else
    log_error "editable dev install failed (see /tmp/pip-install-check.log)"
    tail -n 10 /tmp/pip-install-check.log || true
  fi
else
  log_error "invalid CHECK_MODE='${CHECK_MODE}' (expected deploy|dev)"
fi

if [[ "${HAS_ERROR}" -ne 0 ]]; then
  echo "[result] environment is NOT deploy-ready"
  exit 1
fi

echo "[result] environment is deploy-ready"
