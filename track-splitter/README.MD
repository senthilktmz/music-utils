# track-splitter

Currently tested only on mac

This repository provides a Python script (`track-splitter.py`) to automate the workflow of downloading a YouTube video with yt-dlp, converting the audio track to WAV with ffmpeg, and splitting the audio file into tracks for bass, drums, vocals and others.

---

## Requirements, Installation & Usage

You need Python 3.7+, yt-dlp, ffmpeg, and optionally demucs.

### Install all requirements

```bash
pip install yt-dlp demucs
brew install ffmpeg             # macOS
sudo apt-get install ffmpeg -y  # Ubuntu/Debian
```

### Run the script

#### copy the script locally
```bash
# track-splitter.py is from https://github.com/senthilktmz/music-utils/blob/main/track-splitter/track-splitter.py
cp track-splitter.py /usr/local/bin/track-splitter.py
sudo ln -snf /usr/local/bin/track-splitter.py /usr/local/bin/track-splitter
```

### Run the script 
```bash
track-splitter <output_dir> <youtube_url> <basename>
```

- <output_dir> → Directory to download into (e.g., $PWD)  
- <youtube_url> → The YouTube video link  
- <basename> → Base name for the .wav file  

Example:

```bash
mkdir -p /Users/camel/billie-jean
python track-splitter.py /Users/camel/billie-jean 'https://www.youtube.com/watch?v=Zi_XLOJCo_Y' billie-jean
```

This will download the video into your current directory, convert it into billie-jean.wav, and run Demucs on the .wav file.

---

## Configuration

At the top of track-splitter.py, you can adjust:

```python
EXTENSIONS = ["*.mp4", "*.webm"]  # Add "*.flv", "*.mkv", etc.
FFMPEG_AUDIO_ARGS = ["-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2"]
RUN_DEMUCS = True  # Set to False to skip Demucs
```

---

## Output

- Video file → Saved in <output_dir> (.mp4, .webm, etc.)  
- WAV file → <basename>.wav in <output_dir>  
- Demucs stems → Saved in <output_dir>/separated/<model>/<basename>/  

---

## Troubleshooting

- No video found → Add its extension to EXTENSIONS  
- Demucs errors → Set RUN_DEMUCS = False  
- Filenames with spaces → Add --restrict-filenames to the yt-dlp command in the script  

---

## License

MIT License. See LICENSE for details.
