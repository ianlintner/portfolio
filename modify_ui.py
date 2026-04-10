with open("src/game/scenes/UIScene.ts", "r") as f:
    content = f.read()

import re

old_mute = """    // Mute toggle indicator (top-right)
    const audio = AudioManager.instance;
    this.muteText = this.add
      .text(this.scale.width - 16, 12, audio.muted ? "🔇 [M]" : "🔊 [M]", {
        ...textStyle,
        fontSize: "16px",
      })
      .setOrigin(1, 0);

    // "M" key toggles mute
    this.input.keyboard?.on("keydown-M", () => {
      audio.muted = !audio.muted;
      this.muteText.setText(audio.muted ? "🔇 [M]" : "🔊 [M]");
    });"""

new_menu = """    // Audio Menu (top-right)
    const audio = AudioManager.instance;
    this.muteText = this.add
      .text(this.scale.width - 16, 12, audio.muted ? "🔇 [M]" : "🔊 [M]", {
        ...textStyle,
        fontSize: "16px",
      })
      .setOrigin(1, 0)
      .setInteractive()
      .on("pointerdown", () => {
        audio.muted = !audio.muted;
        updateAudioText();
      });

    const retroText = this.add
      .text(this.scale.width - 16, 36, "Retro: " + (audio.useRetroMusic ? "ON" : "OFF"), {
        ...textStyle,
        fontSize: "16px",
        color: "#93c5fd",
      })
      .setOrigin(1, 0)
      .setInteractive()
      .on("pointerdown", () => {
        audio.useRetroMusic = !audio.useRetroMusic;
        // Start retro random track
        if (!audio.useRetroMusic && audio.mp3Music) {
            audio.playRandomBgMusic(); // Will fall back to MP3
        } else {
            audio.playRandomBgMusic(); // Will play chiptune
        }
        updateAudioText();
      });

    const volDecText = this.add
      .text(this.scale.width - 120, 60, "[-]", { ...textStyle, fontSize: "16px", color: "#fca5a5" })
      .setOrigin(1, 0)
      .setInteractive()
      .on("pointerdown", () => {
        audio.volume = Math.max(0, audio.volume - 0.1);
        updateAudioText();
      });

    const volIncText = this.add
      .text(this.scale.width - 16, 60, "[+]", { ...textStyle, fontSize: "16px", color: "#86efac" })
      .setOrigin(1, 0)
      .setInteractive()
      .on("pointerdown", () => {
        audio.volume = Math.min(1, audio.volume + 0.1);
        updateAudioText();
      });

    const volText = this.add
      .text(this.scale.width - 68, 60, `Vol: ${Math.round(audio.volume * 100)}%`, {
        ...textStyle,
        fontSize: "16px",
      })
      .setOrigin(0.5, 0);

    const updateAudioText = () => {
      this.muteText.setText(audio.muted ? "🔇 [M]" : "🔊 [M]");
      retroText.setText("Retro: " + (audio.useRetroMusic ? "ON" : "OFF"));
      volText.setText(`Vol: ${Math.round(audio.volume * 100)}%`);
    };

    // "M" key toggles mute
    this.input.keyboard?.on("keydown-M", () => {
      audio.muted = !audio.muted;
      updateAudioText();
    });
"""
content = content.replace(old_mute, new_menu)

with open("src/game/scenes/UIScene.ts", "w") as f:
    f.write(content)
