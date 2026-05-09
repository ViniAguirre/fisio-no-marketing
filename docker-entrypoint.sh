#!/bin/sh
set -eu

cat > /usr/share/nginx/html/env.js <<EOF
window.__APP_CONFIG__ = {
  VITE_WHATSAPP_LINK: "${VITE_WHATSAPP_LINK:-}",
  VITE_SITE_URL: "${VITE_SITE_URL:-}"
};
EOF

exec nginx -g "daemon off;"
