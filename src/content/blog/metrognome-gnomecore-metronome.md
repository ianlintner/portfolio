---
title: "🍄 Beat by Beat: Engineering a 'Gnomecore' 3D Metronome in Godot 4.6"
date: "2026-05-24"
excerpt: "A deep dive into building Metrognome—a whimsical 3D metronome in GDScript featuring procedural audio generation, bounding gnomes, and custom spatial layout constraints."
tags:
  [
    "Game Development",
    "Godot",
    "GDScript",
    "Audio Engineering",
    "3D Mathematics",
  ]
author: "Ian Lintner"
image: "/images/metrognome-hero.png"
imageAlt: "Metrognome - Gnomecore 3D Metronome built with Godot"
---

# Beat by Beat: Engineering a 'Gnomecore' 3D Metronome in Godot 4.6

Every developer has a list of "micro-projects" they build to keep their skills sharp or blow off some steam. For me, that recently took the form of **[Metrognome](https://growlbear.itch.io/metrognomes)**, a whimsical 3D metronome built from scratch using the **Godot 4.6** engine and pure **GDScript**.

The concept is simple: a line of garden gnomes stands in a mushroom grove, bouncing to the beat. If you select a 5/4 time signature, you get five gnomes. On the downbeat (or accents), the respective gnome does a high, dramatic leap; on regular beats, a short bounce.

But under the hood of this cozy, "gnomecore" aesthetic lies a series of classic real-time systems problems: procedural audio synthesis, custom spatial layout algorithms, and stateful physics-like animation loops.

Let's tear down the architecture and see how it works.

---

## 🔊 Procedural Audio: Generating Clicks in Real Time

In a standard game, if you want a click or a beep, you load a `.wav` file. For a metronome, this has two downsides:

1. It bloats the asset size (even slightly).
2. It lacks customization. If you want a different pitch, you have to pitch-shift the sample, which can introduce artifacts.

Instead, I opted for **procedural audio synthesis** using Godot's `AudioStreamGenerator` and `AudioStreamGeneratorPlayback`. Every tick, the application generates raw PCM audio data in memory and pushes it to the audio buffer.

Here is the math: a click is just a sine wave that decays exponentially over time. By combining a frequency (pitch) with an exponential decay multiplier (`e^-t`), we get a clean, punchy click:

```gdscript
func _generate_frames(frequency: float, duration: float, amplitude: float) -> PackedVector2Array:
	var total_frames := int(_sample_rate * duration)
	var frames := PackedVector2Array()
	frames.resize(total_frames)
	for i in total_frames:
		var t := float(i) / float(_sample_rate)
		var envelope := exp(-t * 50.0) # Decay multiplier
		var value := sin(2.0 * PI * frequency * t) * envelope * amplitude
		frames[i] = Vector2(value, value) # Stereo
	return frames
```

In `audio_clicker.gd`, I pre-calculate arrays of these frames for three different sound types:

- **Click**: High-pitched sine wave (1200Hz base / 1600Hz accent) with a short 0.025s duration.
- **Wood Block**: Lower, woody resonance (500Hz base / 700Hz accent) with a slightly longer 0.04s decay.
- **Beep**: Mid-range electronic tone (900Hz base / 1300Hz accent).

When the metronome ticks, `_playback.push_frame()` feeds the buffer, yielding latency-free, mathematically perfect beats.

---

## ⏱️ The Metronome Core & Time Signatures

A metronome is only as good as its timing. In game engines, doing timing inside `_process` using `delta` (frame time) requires care. If you just check if a timer exceeds an interval, frame rate fluctuations can cause drift.

To combat this, `metronome.gd` uses a **time accumulator** that subtracts the interval once reached, preserving sub-frame precision:

```gdscript
func _process(delta: float) -> void:
	if not _is_playing:
		return
	_time_accumulator += delta
	if _time_accumulator >= _tick_interval:
		_time_accumulator -= _tick_interval # Retain leftover remainder to avoid drift
		var is_accent := _current_beat < accent_pattern.size() and accent_pattern[_current_beat]
		tick.emit(_current_beat, _beats_per_measure, is_accent)
		beat_changed.emit(_current_beat)
		_current_beat = (_current_beat + 1) % _beats_per_measure
```

By subtracting `_tick_interval` instead of setting the accumulator back to `0.0`, any sub-frame timing errors are carried over and resolved in the next frame, maintaining long-term drift-free accuracy.

---

## 🍄 Bouncing Gnomes & Opossums: Real-time 3D Math

Once the metronome ticks, the visual elements react. The gnomes are arranged in a horizontal line. On their designated beat, they execute a vertical arc.

Instead of writing a complex state machine or using Godot's animation player for a simple bounce, the vertical displacement is calculated using a **half-sine wave**:

$$y = \sin(t \cdot \pi) \cdot h_{max}$$

Where $t$ ranges from `0.0` (start of bounce) to `1.0` (end of bounce), and $h_{max}$ is the maximum bounce height (larger for accented beats).

```gdscript
func _process(delta: float) -> void:
	if not _is_bouncing:
		return
	_bounce_timer += delta
	if _bounce_timer >= bounce_duration:
		_bounce_timer = bounce_duration
		_is_bouncing = false
		position = _original_position
		return
	var t := _bounce_timer / bounce_duration
	var height := sin(t * PI) # Half-sine wave arc
	var max_height := accent_bounce_height if _is_accented else base_bounce_height
	position = _original_position + Vector3.UP * height * max_height
```

### The Opossum Wanderer

To add character, I populated the scene with local wildlife. A small opossum model walks a randomized curvy path around the mushroom forest while the metronome is active. To make its movement feel natural rather than rigid, the heading vector is modulated by a sine wave over time:

```gdscript
_opossum_phase += delta * 0.7
var curve := sin(_opossum_phase) * 0.35 # Curvy wander adjustment
# ... Apply position and rotate the opossum to look in the heading direction
```

---

## 🌲 Procedural Spatial Layout (Forest Generation)

To ensure the environment looks organic but never clips through UI elements or the camera's sightline, the mushroom forest is generated procedurally on startup in `main.gd`.

The layout logic employs a simplified **Poisson Disk-like clearance check**:

1. It maintains an array `_occupied` containing `[Vector2, radius]` pairs of existing assets.
2. It attempts to generate coordinates within a ring (distance 9 to 22 units from the center).
3. It filters out coordinates that block the gnomes (center ground) or the camera sightline (`z > 0.0` check).
4. It calls a clearance validation:

```gdscript
func _is_clear(x: float, z: float, radius: float) -> bool:
	var p := Vector2(x, z)
	for o in _occupied:
		if p.distance_to(o[0]) < radius + float(o[1]):
			return false # Too close to another object
	return true
```

Only if the check returns `true` is the mushroom instantiated, scaled randomly, rotated randomly, and placed.

---

## 🎮 Play & Inspect

Metrognome is a fun reminder of why building small, self-contained utilities is such a rewarding exercise. It blends audio programming, basic linear algebra, and aesthetics into a neat, 30MB HTML5 bundle.

- **Play it in your browser**: [Metrognome on itch.io](https://growlbear.itch.io/metrognomes)
- **Browse the source code**: [ianlintner/metrognome on GitHub](https://github.com/ianlintner/metrognome)

Next time you need a practice click for your guitar, synth, or drums—why not let some gnomes handle it?
