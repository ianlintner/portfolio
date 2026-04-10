with open("src/game/scenes/MainMenu.ts", "r") as f:
    content = f.read()

# Replace the unlockAndPlay manually
old1 = """    // Unlock Web Audio on first user gesture, then start menu music.
    const unlockAndPlay = () => {
      audio.unlock();
      audio.stopMusic(); // Ensure old chiptune engine is stopped
      if (!this.bgMusic) {
        this.bgMusic = this.sound.add("intro-music", {
          loop: true,
          volume: 0.6,
        });
        this.bgMusic.play();
      }
    };"""
new1 = """    // Config global audio manager to allow MP3 playing instead of tracking locally
    audio.soundManager = this.sound;
    
    // Unlock Web Audio on first user gesture, then start menu music.
    const unlockAndPlay = () => {
      audio.unlock();
      audio.playRandomBgMusic(); // This will play MP3 if not retro!
    };"""
content = content.replace(old1, new1)

old2 = """    // If already unlocked from a previous visit, start music immediately.
    if (audio.isUnlocked) {
      audio.stopMusic();
      if (!this.bgMusic) {
        this.bgMusic = this.sound.add("intro-music", {
          loop: true,
          volume: 0.6,
        });
        this.bgMusic.play();
      }
    }"""
new2 = """    // If already unlocked, ensure music is looping correctly.
    if (audio.isUnlocked) {
      audio.playRandomBgMusic();
    }"""
content = content.replace(old2, new2)

old3 = """      .on("pointerdown", () => {
        audio.sfx.menuSelect();
        if (this.bgMusic) {
          this.bgMusic.stop();
        }
        audio.stopMusic();"""
new3 = """      .on("pointerdown", () => {
        audio.sfx.menuSelect();
        // Do not stop music here; we want it to flow directly into the game if it's the MP3!
        // The game will change tracks via playRandomBgMusic() when RogueRun starts
"""
content = content.replace(old3, new3)

with open("src/game/scenes/MainMenu.ts", "w") as f:
    f.write(content)
