#!/usr/bin/env npx tsx
/**
 * generate-parallax.ts
 *
 * Generates 5-layer parallax background images for the Cat Adventure game
 * using OpenAI's DALL-E 3 API, then post-processes them to game-ready format.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... npx tsx scripts/generate-parallax.ts
 *   # or via npm script:
 *   OPENAI_API_KEY=sk-... pnpm generate:parallax
 *
 * Output:
 *   public/assets/game/2-Background/1..5.png  (processed, game-ready)
 *   public/assets/game/2-Background/raw/       (raw DALL-E outputs)
 *   public/assets/game/2-Background/originals/ (backup of previous images)
 */

import OpenAI from "openai";
import sharp from "sharp";
import { existsSync, mkdirSync, copyFileSync, writeFileSync } from "fs";
import { join } from "path";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const OUTPUT_DIR = join(
  __dirname,
  "..",
  "public",
  "assets",
  "game",
  "2-Background",
);
const RAW_DIR = join(OUTPUT_DIR, "raw");
const ORIGINALS_DIR = join(OUTPUT_DIR, "originals");

/** Final output resolution (2x the original 576x324). */
const TARGET_WIDTH = 1152;
const TARGET_HEIGHT = 648;

/** DALL-E 3 request size — closest to 16:9. */
const DALLE_SIZE = "1792x1024" as const;

/** Max retries per layer on API failure. */
const MAX_RETRIES = 3;

// ---------------------------------------------------------------------------
// Layer prompts
// ---------------------------------------------------------------------------

const BASE_STYLE =
  "pixel art game background, industrial urban alley theme, 16-bit retro style, muted gray-brown palette with amber and orange accents, seamless horizontal tile, no text, no characters, no UI elements";

const LAYER_PROMPTS: Record<number, string> = {
  1: `${BASE_STYLE}, sky layer: gradient sky from deep navy blue to dusty orange at the horizon, distant smokestacks silhouetted against the sky, hazy industrial atmosphere, very sparse detail, mostly flat color bands`,
  2: `${BASE_STYLE}, far background layer: distant industrial skyline, small factories and warehouses, water towers, faint window lights, low detail silhouettes on a dusky sky`,
  3: `${BASE_STYLE}, mid-ground layer: mid-distance industrial buildings, metal scaffolding, pipes, catwalks, cranes, moderate detail, darker at the base with lighter tops`,
  4: `${BASE_STYLE}, near-background layer: close industrial structures, brick walls, ventilation units, ladders, rust and grime details, pipes running horizontally, some broken windows`,
  5: `${BASE_STYLE}, foreground layer: closest alley elements, tall dumpsters, chain-link fences, thick vertical pipes, fire escape ladders, graffiti hints, mostly transparent with elements at the bottom and sides`,
};

/** Colors per layer for quantization (sky gets more for gradient smoothness). */
const COLORS_PER_LAYER: Record<number, number> = {
  1: 128,
  2: 64,
  3: 64,
  4: 64,
  5: 64,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${res.statusText}`);
  return Buffer.from(await res.arrayBuffer());
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

async function generateLayer(
  client: OpenAI,
  layerIndex: number,
): Promise<Buffer> {
  const prompt = LAYER_PROMPTS[layerIndex];
  if (!prompt) throw new Error(`No prompt for layer ${layerIndex}`);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `  [Layer ${layerIndex}] Calling DALL-E 3 (attempt ${attempt}/${MAX_RETRIES})...`,
      );

      const response = await client.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: DALLE_SIZE,
        quality: "hd",
        style: "natural",
        response_format: "url",
      });

      const imageUrl = response.data[0]?.url;
      if (!imageUrl) throw new Error("No image URL in response");

      // Log the revised prompt (DALL-E 3 often rewrites it)
      const revisedPrompt = response.data[0]?.revised_prompt;
      if (revisedPrompt) {
        console.log(
          `  [Layer ${layerIndex}] Revised prompt: ${revisedPrompt.slice(0, 120)}...`,
        );
      }

      console.log(`  [Layer ${layerIndex}] Downloading...`);
      return await downloadImage(imageUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(
        `  [Layer ${layerIndex}] Attempt ${attempt} failed: ${message}`,
      );
      if (attempt < MAX_RETRIES) {
        const delay = 2000 * Math.pow(2, attempt - 1);
        console.log(`  [Layer ${layerIndex}] Retrying in ${delay}ms...`);
        await sleep(delay);
      } else {
        throw new Error(
          `Layer ${layerIndex} failed after ${MAX_RETRIES} attempts: ${message}`,
        );
      }
    }
  }

  // Unreachable, but TypeScript needs it
  throw new Error("Unreachable");
}

// ---------------------------------------------------------------------------
// Post-processing
// ---------------------------------------------------------------------------

async function processLayer(
  rawBuffer: Buffer,
  layerIndex: number,
): Promise<Buffer> {
  const colors = COLORS_PER_LAYER[layerIndex] ?? 64;

  console.log(
    `  [Layer ${layerIndex}] Post-processing: resize to ${TARGET_WIDTH}x${TARGET_HEIGHT}, quantize to ${colors} colors...`,
  );

  return sharp(rawBuffer)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, {
      fit: "cover",
      position: "center",
    })
    .png({
      palette: true,
      colours: colors,
      compressionLevel: 9,
      effort: 10,
    })
    .toBuffer();
}

// ---------------------------------------------------------------------------
// Backup
// ---------------------------------------------------------------------------

function backupOriginals() {
  ensureDir(ORIGINALS_DIR);

  let backedUp = 0;
  for (let i = 1; i <= 5; i++) {
    const src = join(OUTPUT_DIR, `${i}.png`);
    const dst = join(ORIGINALS_DIR, `${i}.png`);

    if (existsSync(src) && !existsSync(dst)) {
      copyFileSync(src, dst);
      backedUp++;
    }
  }

  if (backedUp > 0) {
    console.log(`Backed up ${backedUp} original image(s) to ${ORIGINALS_DIR}`);
  } else {
    console.log("Originals already backed up (or don't exist).");
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error(
      "Error: OPENAI_API_KEY environment variable is required.\n" +
        "Usage: OPENAI_API_KEY=sk-... npx tsx scripts/generate-parallax.ts",
    );
    process.exit(1);
  }

  const client = new OpenAI({ apiKey });

  console.log("=== Parallax Background Generator ===\n");

  // Ensure directories
  ensureDir(OUTPUT_DIR);
  ensureDir(RAW_DIR);

  // Backup originals
  backupOriginals();

  console.log("\nGenerating 5 parallax layers via DALL-E 3...\n");

  const failed: number[] = [];

  for (let layer = 1; layer <= 5; layer++) {
    try {
      // Generate
      const rawBuffer = await generateLayer(client, layer);

      // Save raw
      const rawPath = join(RAW_DIR, `${layer}.png`);
      writeFileSync(rawPath, rawBuffer);
      console.log(`  [Layer ${layer}] Raw saved to ${rawPath}`);

      // Post-process
      const processed = await processLayer(rawBuffer, layer);

      // Save final
      const finalPath = join(OUTPUT_DIR, `${layer}.png`);
      writeFileSync(finalPath, processed);
      console.log(`  [Layer ${layer}] Final saved to ${finalPath}`);

      // Report size
      const rawKB = (rawBuffer.length / 1024).toFixed(1);
      const finalKB = (processed.length / 1024).toFixed(1);
      console.log(
        `  [Layer ${layer}] Size: ${rawKB} KB (raw) -> ${finalKB} KB (processed)\n`,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  [Layer ${layer}] FAILED: ${message}\n`);
      failed.push(layer);
    }
  }

  // Summary
  console.log("=== Generation Complete ===");
  if (failed.length === 0) {
    console.log("All 5 layers generated successfully!");
    console.log(`  Output: ${OUTPUT_DIR}/1..5.png`);
    console.log(`  Raw:    ${RAW_DIR}/1..5.png`);
    console.log(`  Backup: ${ORIGINALS_DIR}/1..5.png`);
  } else {
    console.error(`${failed.length} layer(s) failed: ${failed.join(", ")}`);
    console.error("Re-run the script to retry failed layers.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
