#!/usr/bin/env bash
# Uptime Kuma Monitoring Setup for PPID BAZNAS
#
# Uptime Kuma is deployed as part of docker-compose.prod.yml
# Access dashboard: http://<vps-ip>:3003 (behind nginx in production)
#
# After first run, create an admin account, then run this script
# to auto-configure monitors via the Uptime Kuma API.
# Usage: bash infra/scripts/setup-uptime-kuma.sh

API_URL="${UPTIME_KUMA_URL:-http://localhost:3003}"
USERNAME="${UPTIME_KUMA_USER:-admin}"
PASSWORD="${UPTIME_KUMA_PASS:-changeme}"
APP_URL="${NEXT_PUBLIC_APP_URL:-https://ppid.baznascianjur.or.id}"

echo "Logging in to Uptime Kuma at $API_URL..."
TOKEN=$(curl -s -X POST "$API_URL/api/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" | \
  python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "Failed to login. Check credentials."
  exit 1
fi

echo "Logged in successfully."

add_monitor() {
  local name="$1"
  local url="$2"
  local type="${3:-http}"
  local interval="${4:-60}"

  echo "Adding monitor: $name ($url)"
add_monitor() {
  local name="$1"
  local url="$2"
  local type="${3:-http}"
  local interval="${4:-60}"

  echo "Adding monitor: $name ($url)"
  jq -n \
    --arg name "$name" \
    --arg type "$type" \
    --arg url "$url" \
    --argjson interval "$interval" \
    '{
      name: $name,
      type: $type,
      url: $url,
      interval: $interval,
      retryInterval: 30,
      maxretries: 3,
      upsideDown: false,
      notificationIDList: []
    }' | \
  curl -s -X POST "$API_URL/api/monitor" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d @- > /dev/null
}
}

echo "Configuring monitors..."

add_monitor "PPID Website" "$APP_URL" "http" 60
add_monitor "PPID API" "$APP_URL/api/trpc/health" "http" 60
add_monitor "PPID CMS" "$APP_URL/cms" "http" 60
add_monitor "PPID SSL Check" "$APP_URL" "http" 1440  # check SSL daily

echo ""
echo "Done! Monitors configured:"
echo "  - PPID Website     (every 60s)"
echo "  - PPID API         (every 60s)"
echo "  - PPID CMS Panel   (every 60s)"
echo "  - PPID SSL Expiry  (daily)"
echo ""
echo "Dashboard: $API_URL/dashboard"
