#!/usr/bin/env bash
# 一键部署：构建 dist 并推送到 gh-pages 分支（Pages 从这里托管）
# 用法：GH_TOKEN=xxx ./scripts/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."

REPO="${REPO:-$(git remote get-url origin 2>/dev/null | sed -E 's#.*github.com[:/](.+)\.git#\1#; s#.*github.com[:/](.+)$#\1#')}"
REPO="${REPO:-cgr916/cgr916.github.io}"
BRANCH=gh-pages

npm run build
touch dist/.nojekyll

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

cd dist
git init -q
git checkout -q -b "$BRANCH"
git add -A
git -c user.name="${GIT_NAME:-chan_gr}" \
    -c user.email="${GIT_EMAIL:-cgr916@users.noreply.github.com}" \
    commit -q -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')"

if [ -n "${GH_TOKEN:-}" ]; then
  git push -f "https://x-access-token:${GH_TOKEN}@github.com/${REPO}.git" "$BRANCH"
else
  git push -f origin "$BRANCH"
fi

echo "已发布到 https://${REPO%%/*}.github.io"
