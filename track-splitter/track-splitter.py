#!/usr/bin/env python3
import os
import sys
import glob
import shutil
import subprocess

# ---- Edit these as you like ----
EXTENSIONS = ["*.mp4", "*.webm"]  # add "*.flv", "*.mkv", etc.
FFMPEG_AUDIO_ARGS = ["-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2"]
RUN_DEMUCS = True  # set to False if you want to skip demucs step
# --------------------------------

def check_cmd(cmd):
    """Ensure an external command exists in PATH."""
    if shutil.which(cmd) is None:
        print(f"[ERROR] Required command not found: {cmd}")
        sys.exit(1)

def newest_matching_file(directory, patterns):
    """Return the most recently modified file matching any pattern in directory."""
    candidates = []
    for pat in patterns:
        candidates.extend(glob.glob(os.path.join(directory, pat)))
    if not candidates:
        return None
    return max(candidates, key=os.path.getmtime)

def main():
    if len(sys.argv) != 4:
        print("Usage: track-splitter <output_dir> <youtube_url> <basename>")
        print("Example:")
        print("  track-splitter $PWD 'https://www.youtube.com/watch?v=Zi_XLOACo_Y' billie-jean")
        sys.exit(1)

    # Positional args
    output_dir = os.path.abspath(sys.argv[1])
    youtube_url = sys.argv[2]
    basename = sys.argv[3]

    # Check deps
    check_cmd("yt-dlp")
    check_cmd("ffmpeg")
    if RUN_DEMUCS:
        check_cmd("demucs")

    # Ensure output directory (with error handling)
    try:
        os.makedirs(output_dir, exist_ok=True)
        print(f"[INFO] Output directory ready: {output_dir}")
    except PermissionError:
        print(f"[ERROR] Cannot create directory {output_dir}. Permission denied.")
        sys.exit(1)
    except OSError as e:
        print(f"[ERROR] Failed to create directory {output_dir}: {e}")
        sys.exit(1)

    # 1) Download with yt-dlp
    # Use title + id to avoid collisions; yt-dlp picks best format automatically.
    # You can add "--restrict-filenames" if you prefer stricter names.
    print(f"[INFO] Downloading from {youtube_url} to {output_dir} ...")
    try:
        subprocess.run(
            [
                "yt-dlp",
                "-o", f"{output_dir}/%(title)s [%(id)s].%(ext)s",
                youtube_url,
            ],
            check=True
        )
    except subprocess.CalledProcessError:
        print("[ERROR] yt-dlp failed.")
        sys.exit(1)

    # 2) Find downloaded file by allowed extensions
    video_file = newest_matching_file(output_dir, EXTENSIONS)
    if not video_file:
        print(f"[ERROR] No downloaded video found matching: {', '.join(EXTENSIONS)}")
        sys.exit(1)

    # 3) Convert to WAV via ffmpeg
    wav_file = os.path.join(output_dir, f"{basename}.wav")
    print(f"[INFO] Converting to WAV: {wav_file}")
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", video_file, *FFMPEG_AUDIO_ARGS, wav_file],
            check=True
        )
    except subprocess.CalledProcessError:
        print("[ERROR] ffmpeg conversion failed.")
        sys.exit(1)

    # 4) Run demucs (optional) with output inside the chosen output_dir
    if RUN_DEMUCS:
        demucs_out_dir = os.path.join(output_dir, "separated")
        try:
            os.makedirs(demucs_out_dir, exist_ok=True)
        except Exception:
            # not fatal; demucs will try to create it, but we attempt for better errors
            pass

        print(f"[INFO] Running demucs on {wav_file} ...")
        try:
            # -o/--out controls the destination directory for separated stems
            subprocess.run(["demucs", "-o", demucs_out_dir, wav_file], check=True)
            print(f"[INFO] Demucs output in: {demucs_out_dir}")
        except subprocess.CalledProcessError:
            print("[ERROR] demucs failed.")
            sys.exit(1)

    print("[INFO] Done.")

if __name__ == "__main__":
    main()
