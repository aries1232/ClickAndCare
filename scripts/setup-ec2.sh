#!/usr/bin/env bash
# One-shot bootstrap for a fresh Amazon Linux 2023 (or Ubuntu) EC2 instance
# that hosts ONLY the always-on Socket.IO server. REST API stays on Lambda.
#
# Usage (from your laptop, not the EC2 box):
#   scp scripts/setup-ec2.sh ec2-user@<your-ip>:~
#   ssh ec2-user@<your-ip> 'bash ~/setup-ec2.sh'
#
# Or run the steps manually from EC2 Web SSH if you don't have ssh keys handy.
#
# Idempotent: rerunning is safe.
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/aries1232/ClickAndCare.git}"
REPO_DIR="${REPO_DIR:-$HOME/ClickAndCare}"
NODE_MAJOR="${NODE_MAJOR:-20}"

echo "▶ Detecting OS…"
. /etc/os-release
echo "  → $PRETTY_NAME"

echo "▶ Installing system packages…"
if [[ "$ID" == "amzn" ]]; then
  sudo dnf -y install git curl tar gzip
elif [[ "$ID" == "ubuntu" || "$ID" == "debian" ]]; then
  sudo apt update
  sudo apt -y install git curl ca-certificates
else
  echo "Unknown distro: $ID — install git+curl manually and re-run."
  exit 1
fi

echo "▶ Installing Node.js $NODE_MAJOR via NodeSource…"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL "https://rpm.nodesource.com/setup_${NODE_MAJOR}.x" 2>/dev/null \
    | sudo bash - || true
  if [[ "$ID" == "amzn" ]]; then
    sudo dnf -y install nodejs
  else
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | sudo -E bash -
    sudo apt -y install nodejs
  fi
fi
echo "  → node $(node -v)"

echo "▶ Installing pm2 (process keeper)…"
sudo npm i -g pm2

echo "▶ Installing Doppler CLI (for env vars at runtime)…"
if ! command -v doppler >/dev/null 2>&1; then
  curl -Ls https://cli.doppler.com/install.sh | sudo sh
fi
echo "  → $(doppler --version)"

echo "▶ Installing Caddy (HTTPS reverse proxy with auto-Let's-Encrypt)…"
if ! command -v caddy >/dev/null 2>&1; then
  if [[ "$ID" == "amzn" ]]; then
    sudo dnf -y install 'dnf-command(copr)' || true
    sudo dnf copr enable -y @caddy/caddy || true
    sudo dnf -y install caddy
  else
    sudo apt -y install debian-keyring debian-archive-keyring apt-transport-https
    curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt | sudo tee /etc/apt/sources.list.d/caddy-stable.list
    sudo apt update && sudo apt -y install caddy
  fi
fi
echo "  → $(caddy version)"

echo "▶ Cloning repo…"
if [[ ! -d "$REPO_DIR/.git" ]]; then
  git clone "$REPO_URL" "$REPO_DIR"
else
  git -C "$REPO_DIR" fetch origin
  git -C "$REPO_DIR" reset --hard origin/main
fi

echo "▶ Installing backend dependencies…"
cd "$REPO_DIR/backend"
npm ci --omit=dev

echo
echo "✅ Bootstrap complete."
echo
echo "Next steps:"
echo "  1. doppler login                # authenticate to Doppler on this box"
echo "  2. doppler setup                # pick project clickandcare-be / config prd"
echo "  3. cd $REPO_DIR/backend"
echo "  4. doppler run -- pm2 start ecosystem.config.cjs"
echo "  5. pm2 save && sudo pm2 startup  # auto-restart pm2 on reboot"
echo "  6. sudo cp $REPO_DIR/Caddyfile.example /etc/caddy/Caddyfile"
echo "     # then edit /etc/caddy/Caddyfile to set your real domain"
echo "  7. sudo systemctl enable --now caddy"
echo
