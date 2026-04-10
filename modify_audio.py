import re

with open("src/game/audio/AudioManager.ts", "r") as f:
    content = f.read()

# Add fields to the class
insert_fields = """
  // ── Native Phaser Sound ──────────────────────────────────────────
  public soundManager: Phaser.Sound.BaseSoundManager | null = null;
  public mp3Music: Phaser.Sound.BaseSound | null = null;
  private _useRetroMusic: boolean = false;

  get useRetroMusic(): boolean { return this._useRetroMusic; }
  set useRetroMusic(v: boolean) {
    this._useRetroMusic = v;
    if (v) {
      if (this.mp3Music) {
        this.mp3Music.stop();
      }
      if (this.currentTrack) {
        // Re-play current retro track
        const t = this.currentTrack;
        this.currentTrack = null;
        this.playMusic(t);
      } else {
        this.playRandomBgMusic();
      }
    } else {
      for (const cancel of this.cancelFns) cancel();
      this.cancelFns = [];
      this.playMp3();
    }
  }

  playMp3(): void {
    if (!this.soundManager) return;
    if (this.mp3Music && this.mp3Music.isPlaying) return;
    
    // Check if we already created it
    if (!this.mp3Music) {
      this.mp3Music = this.soundManager.add("intro-music", { loop: true, volume: 0.6 });
    }
    
    this.mp3Music.play();
  }
"""

content = content.replace("private unlocked = false;", "private unlocked = false;\n" + insert_fields)

play_music_old = """  playMusic(name: TrackName): void {
    if (this.currentTrack === name) return; // already playing
    this.stopMusic();

    const track = ALL_TRACKS[name];
    if (!track) return;

    this.currentTrack = name;"""
play_music_new = """  playMusic(name: TrackName): void {
    if (this.currentTrack === name) return; // already playing
    this.currentTrack = name; // Just remember the logical track
    this.stopMusic();

    if (!this._useRetroMusic) {
      this.playMp3();
      return;
    }

    const track = ALL_TRACKS[name];
    if (!track) return;

    const ctx = this.engine.ensureContext();
    const startTime = ctx.currentTime + 0.05;

    for (const ch of track.channels) {
      const { cancel } = this.engine.playSequence(
        ch.options,
        ch.notes,
        startTime,
        true, // loop
      );
      this.cancelFns.push(cancel);
    }
  }"""

content = content.replace("""  playMusic(name: TrackName): void {
    if (this.currentTrack === name) return; // already playing
    this.stopMusic();

    const track = ALL_TRACKS[name];
    if (!track) return;

    this.currentTrack = name;
    const ctx = this.engine.ensureContext();
    const startTime = ctx.currentTime + 0.05;

    for (const ch of track.channels) {
      const { cancel } = this.engine.playSequence(
        ch.options,
        ch.notes,
        startTime,
        true, // loop
      );
      this.cancelFns.push(cancel);
    }
  }""", play_music_new)

# Stop music should also consider mp3
stop_music_old = """  stopMusic(): void {
    for (const cancel of this.cancelFns) cancel();
    this.cancelFns = [];
    this.currentTrack = null;
  }"""
stop_music_new = """  stopMusic(): void {
    for (const cancel of this.cancelFns) cancel();
    this.cancelFns = [];
    if (this.mp3Music) {
      this.mp3Music.stop();
    }
  }"""
content = content.replace(stop_music_old, stop_music_new)

# global controls
muted_old = """  set muted(v: boolean) {
    this.engine.muted = v;
  }"""
muted_new = """  set muted(v: boolean) {
    this.engine.muted = v;
    if (this.soundManager) {
        this.soundManager.mute = v;
    }
  }"""
content = content.replace(muted_old, muted_new)

volume_old = """  set volume(v: number) {
    this.engine.volume = v;
  }"""
volume_new = """  set volume(v: number) {
    this.engine.volume = v;
    if (this.soundManager) {
        this.soundManager.volume = v;
    }
  }"""
content = content.replace(volume_old, volume_new)

with open("src/game/audio/AudioManager.ts", "w") as f:
    f.write(content)
