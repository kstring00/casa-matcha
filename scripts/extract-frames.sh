#!/usr/bin/env bash
# Re-extracts the scroll-scrubbed hero frames from public/hero/pour.mp4.
#
# Why not one ffmpeg line? The payload budget is hard (<= 3.5 MB desktop,
# <= 1.2 MB mobile) and a naive 24fps full-frame dump is ~10 MB. So we:
#   1. crop each frame to what viewports actually show around the focal point
#      (desktop 4:3 landscape band, mobile 9:16 portrait band; focal 50% 38%)
#   2. keep every frame during the splash, thin the near-static pour.
# Output file names keep the SOURCE frame number (f-057.webp = frame 57 of 97)
# and a manifest.json per set tells the loader which frames exist.
#
# Usage: bash scripts/extract-frames.sh            (writes to public/hero)
#        OUT=/tmp/x DQ=60 MQ=52 bash scripts/extract-frames.sh
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=${SRC:-public/hero/pour.mp4}
OUT=${OUT:-public/hero}
DQ=${DQ:-70}   # desktop webp quality
MQ=${MQ:-58}   # mobile webp quality
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

ffmpeg -loglevel error -y -i "$SRC" -vf "fps=24" "$TMP/src-%03d.png"
TOTAL=$(ls "$TMP"/src-*.png | wc -l | tr -d ' ')
echo "source frames: $TOTAL"

# Beats (source frame numbers, 1-based): still 1-9, pour 9-53, splash 53-end.
POUR_START=9; SPLASH_START=53
select_frames() { # $1 = still step, $2 = pour step, $3 = splash step
  local out=() i
  for ((i=1; i<POUR_START; i+=$1)); do out+=("$i"); done
  for ((i=POUR_START; i<SPLASH_START; i+=$2)); do out+=("$i"); done
  for ((i=SPLASH_START; i<=TOTAL; i+=$3)); do out+=("$i"); done
  [[ "${out[-1]}" != "$TOTAL" ]] && out+=("$TOTAL")
  echo "${out[@]}"
}

encode_set() { # $1 dir, $2 vf, $3 quality, $4 width, $5 height, frames...
  local dir=$1 vf=$2 q=$3 w=$4 h=$5; shift 5
  rm -rf "$dir"; mkdir -p "$dir"
  local list=""
  for i in "$@"; do
    local n; n=$(printf "%03d" "$i")
    ffmpeg -loglevel error -y -i "$TMP/src-$n.png" -vf "$vf" -c:v libwebp -quality "$q" -compression_level 6 "$dir/f-$n.webp"
    list="$list${list:+,}$i"
  done
  printf '{"fps":24,"total":%s,"width":%s,"height":%s,"frames":[%s]}\n' "$TOTAL" "$w" "$h" "$list" > "$dir/manifest.json"
  echo "$dir: $(ls "$dir"/*.webp | wc -l | tr -d ' ') frames, $(du -sk "$dir" | cut -f1) KB"
}

# Desktop: 1080 wide, 4:3 band. 1080x1440 scaled frame -> rows 239..1049 keep focal at 38%.
read -r -a D <<< "$(select_frames 4 3 1)"
encode_set "$OUT/frames"   "scale=1080:-1,crop=1080:810:0:239" "$DQ" 1080 810 "${D[@]}"
# Mobile: 720 tall band (9:16). 720x960 scaled frame -> columns 90..630 keep focal at 50%.
read -r -a M <<< "$(select_frames 8 4 3)"
encode_set "$OUT/frames-m" "scale=720:-1,crop=540:960:90:0" "$MQ" 540 960 "${M[@]}"
