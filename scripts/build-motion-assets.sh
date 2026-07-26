#!/bin/zsh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEMP_ROOT="/private/tmp/unimarket-motion"
RENDERER="$TEMP_ROOT/render-motion-assets"
FPS=60

if [[ -n "${FFMPEG_BIN:-}" ]]; then
  FFMPEG="$FFMPEG_BIN"
elif command -v ffmpeg >/dev/null 2>&1; then
  FFMPEG="$(command -v ffmpeg)"
else
  ffmpeg_candidates=("$HOME"/Library/Caches/ms-playwright/ffmpeg-*/ffmpeg-mac(N))
  FFMPEG="${ffmpeg_candidates[1]:-}"
fi

if [[ -z "$FFMPEG" ]]; then
  print -u2 "ffmpeg was not found. Install it or set FFMPEG_BIN."
  exit 1
fi

mkdir -p "$TEMP_ROOT"

clang \
  -fobjc-arc \
  -framework AppKit \
  -framework CoreGraphics \
  -framework Foundation \
  -framework ImageIO \
  "$ROOT/scripts/render-motion-assets.m" \
  -o "$RENDERER"

(
  cd "$ROOT"
  "$RENDERER"
)

for scene in access browse network; do
  "$FFMPEG" \
    -y \
    -hide_banner \
    -loglevel warning \
    -f image2pipe \
    -vcodec mjpeg \
    -framerate "$FPS" \
    -i "$TEMP_ROOT/$scene.mjpeg" \
    -an \
    -c:v libvpx \
    -crf 15 \
    -b:v 3M \
    -deadline good \
    -cpu-used 2 \
    -lag-in-frames 25 \
    -threads 8 \
    -g 600 \
    -pix_fmt yuv420p \
    "$ROOT/public/motion/$scene.webm"
done

(
  cd "$ROOT"
  node --input-type=module -e "
    import sharp from 'sharp';
    const scenes = ['access', 'browse', 'network'];
    await Promise.all(scenes.map((scene) =>
      sharp(\`public/motion/\${scene}-poster.png\`)
        .webp({ quality: 92, smartSubsample: true, effort: 6 })
        .toFile(\`public/motion/\${scene}-poster.webp\`)
    ));
  "
)

print "Motion assets built at 1080 × 1350, ${FPS} fps."
