export function FooterCats() {
  // Flip this to false if you ever want to fall back to the old SVG pixel cats.
  // (Kept around so we can iterate on sprite row indices without stress.)
  const USE_SPRITE_CATS = true;

  /**
   * Style switcher for the legacy SVG pixel cats.
   * (Only used when USE_SPRITE_CATS === false)
   */
  const catStyle: CatStyle = "kawaii";

  return (
    <div
      aria-hidden
      className="relative h-36 overflow-hidden border-t border-border/40 bg-background/30 print:hidden"
    >
      {/* Subtle ground line */}
      <div className="absolute inset-x-0 bottom-2 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-60" />

      {/* Cat 1: left -> right */}
      <div className="footer-cat footer-cat--l2r">
        <div className="footer-cat__body footer-cat__body--wiggle">
          <div className="footer-cat__mode footer-cat__mode--walk footer-cat__mode--walk-slate">
            {USE_SPRITE_CATS ? (
              <SpriteCat catId={1} state="walk" />
            ) : (
              <PixelCat style={catStyle} />
            )}
          </div>
          <div className="footer-cat__mode footer-cat__mode--sit">
            {USE_SPRITE_CATS ? (
              <SpriteCat catId={1} state="sit" />
            ) : (
              <PixelCatSit style={catStyle} />
            )}
          </div>
        </div>
      </div>

      {/* Cat 2: right -> left (orange; occasionally loafs; chases a yarn ball) */}
      <div className="footer-cat footer-cat--r2l footer-cat--chaser">
        <div className="footer-cat__body footer-cat__body--pounce">
          <div className="footer-cat__mode footer-cat__mode--walk">
            {USE_SPRITE_CATS ? (
              <SpriteCat catId={2} state="walk" />
            ) : (
              <PixelCat variant="orange" style={catStyle} />
            )}
          </div>
          <div className="footer-cat__mode footer-cat__mode--loaf">
            {USE_SPRITE_CATS ? (
              <SpriteCat catId={2} state="loaf" />
            ) : (
              <PixelCatLoaf variant="orange" style={catStyle} />
            )}
          </div>
        </div>
      </div>

      <div className="footer-yarn footer-yarn--r2l">
        <div className="footer-yarn__body">
          <YarnBall />
        </div>
      </div>

      {/* A mischievous laser dot distracts the chase */}
      <div className="footer-laser">
        <LaserDot />
      </div>

      {/* Sparkles during pounce + meeting */}
      <div className="footer-sparkle footer-sparkle--meet">
        <PixelSparkle />
      </div>
      <div className="footer-sparkle footer-sparkle--pounce">
        <PixelSparkle />
      </div>

      {/* When they meet in the middle: a tiny heart moment */}
      <div className="footer-heart">
        <PixelHeart />
      </div>
    </div>
  );
}

type Pixel = [x: number, y: number, fill: string];
type CatStyle = "classic" | "round" | "sleek" | "kawaii";

type SpriteCatId = 1 | 2 | 3;
type SpriteCatState = "walk" | "sit" | "loaf";

function SpriteCat({
  catId,
  state,
}: {
  catId: SpriteCatId;
  state: SpriteCatState;
}) {
  const isWalk = state === "walk";

  return (
    <span
      aria-hidden
      data-cat={catId}
      data-state={state}
      className={`footer-cat__sprite-sheet${isWalk ? " footer-cat__sprite-sheet--walk" : ""}`}
    />
  );
}

function Pixels({ pixels }: { pixels: Pixel[] }) {
  return (
    <>
      {pixels.map(([x, y, fill], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill={fill} />
      ))}
    </>
  );
}

function PixelCat({
  variant,
  style = "classic",
}: {
  variant?: "slate" | "orange";
  style?: CatStyle;
}) {
  // Three-frame pixel cat. We swap frames via CSS (opacity) to simulate a walk cycle.
  // Built from 1x1 rect pixels for crisp edges.
  const isOrange = variant === "orange";
  const outline = "#0b1220";
  const fur = isOrange ? "#f97316" : "#334155"; // orange-500 / slate-700
  const fur2 = isOrange ? "#fdba74" : "#64748b"; // highlight
  const eye = isOrange ? "#22c55e" : "#38bdf8"; // green for orange cat; sky for slate
  const nose = "#fb7185"; // rose-400
  const collar = isOrange ? "#0ea5e9" : "#a78bfa"; // sky/purple
  const bell = "#facc15"; // yellow
  const blush = "#fda4af"; // rose-300

  const stripes = isOrange
    ? ([
        [9, 12, outline],
        [10, 12, outline],
        [11, 12, outline],
        [10, 13, outline],
        [11, 13, outline],
      ] satisfies Pixel[])
    : ([] satisfies Pixel[]);

  // Higher-detail kawaii style uses a bigger grid for smoother curves.
  const isKawaii = style === "kawaii";

  const classicBase: Pixel[] = [
    // Ears
    [4, 4, outline],
    [5, 4, outline],
    [7, 4, outline],
    [8, 4, outline],
    [5, 5, fur],
    [7, 5, fur],

    // Head outline
    [4, 6, outline],
    [5, 6, outline],
    [6, 6, outline],
    [7, 6, outline],
    [8, 6, outline],
    [4, 7, outline],
    [8, 7, outline],
    [4, 8, outline],
    [8, 8, outline],
    [5, 9, outline],
    [6, 9, outline],
    [7, 9, outline],

    // Head fill
    [5, 7, fur],
    [6, 7, fur],
    [7, 7, fur],
    [5, 8, fur],
    [6, 8, fur],
    [7, 8, fur],

    // Face
    [5, 7, fur2],
    [7, 7, fur2],
    [6, 8, nose],
    [5, 8, eye],
    [7, 8, eye],

    // Whiskers
    [3, 8, outline],
    [2, 8, outline],
    [9, 8, outline],
    [10, 8, outline],

    // Collar + bell (tiny)
    [5, 10, collar],
    [6, 10, collar],
    [7, 10, collar],
    [6, 11, bell],

    // Body outline (slightly longer)
    [6, 11, outline],
    [7, 11, outline],
    [8, 11, outline],
    [9, 11, outline],
    [10, 11, outline],
    [11, 11, outline],
    [12, 11, outline],
    [5, 12, outline],
    [13, 12, outline],
    [5, 13, outline],
    [13, 13, outline],
    [6, 14, outline],
    [7, 14, outline],
    [8, 14, outline],
    [9, 14, outline],
    [10, 14, outline],
    [11, 14, outline],
    [12, 14, outline],

    // Body fill
    [6, 12, fur],
    [7, 12, fur],
    [8, 12, fur],
    [9, 12, fur],
    [10, 12, fur],
    [11, 12, fur],
    [12, 12, fur],
    [6, 13, fur],
    [7, 13, fur],
    [8, 13, fur],
    [9, 13, fur],
    [10, 13, fur],
    [11, 13, fur],
    [12, 13, fur],
    // Body highlight
    [7, 12, fur2],
    [8, 12, fur2],
    [9, 12, fur2],
  ];

  const roundBase: Pixel[] = [
    // Rounder head + bigger eyes
    [4, 5, outline],
    [5, 5, outline],
    [7, 5, outline],
    [8, 5, outline],
    [5, 5, fur],
    [7, 5, fur],
    [4, 6, outline],
    [8, 6, outline],
    [3, 7, outline],
    [9, 7, outline],
    [3, 8, outline],
    [9, 8, outline],
    [4, 9, outline],
    [5, 9, outline],
    [6, 9, outline],
    [7, 9, outline],
    [8, 9, outline],
    [4, 7, fur],
    [5, 7, fur],
    [6, 7, fur],
    [7, 7, fur],
    [8, 7, fur],
    [4, 8, fur],
    [5, 8, fur],
    [6, 8, fur],
    [7, 8, fur],
    [8, 8, fur],
    // cheeks highlight
    [4, 8, fur2],
    [8, 8, fur2],
    // eyes (bigger, closer)
    [5, 8, eye],
    [7, 8, eye],
    [6, 8, fur2],
    [6, 9, nose],
    // whiskers shorter
    [2, 8, outline],
    [10, 8, outline],
    // collar
    [5, 10, collar],
    [6, 10, collar],
    [7, 10, collar],
    [6, 11, bell],
    // Chonkier body
    [6, 11, outline],
    [7, 11, outline],
    [8, 11, outline],
    [9, 11, outline],
    [10, 11, outline],
    [5, 12, outline],
    [11, 12, outline],
    [5, 13, outline],
    [11, 13, outline],
    [6, 14, outline],
    [7, 14, outline],
    [8, 14, outline],
    [9, 14, outline],
    [10, 14, outline],
    [6, 12, fur],
    [7, 12, fur],
    [8, 12, fur],
    [9, 12, fur],
    [10, 12, fur],
    [6, 13, fur],
    [7, 13, fur],
    [8, 13, fur],
    [9, 13, fur],
    [10, 13, fur],
    [7, 12, fur2],
    [8, 12, fur2],
  ];

  const sleekBase: Pixel[] = [
    // Pointier ears, narrower face
    [4, 4, outline],
    [5, 4, outline],
    [7, 4, outline],
    [8, 4, outline],
    [5, 5, fur2],
    [7, 5, fur2],
    [4, 6, outline],
    [5, 6, outline],
    [6, 6, outline],
    [7, 6, outline],
    [8, 6, outline],
    [4, 7, outline],
    [8, 7, outline],
    [5, 8, outline],
    [7, 8, outline],
    [6, 9, outline],
    [5, 7, fur],
    [6, 7, fur],
    [7, 7, fur],
    [6, 8, fur],
    // eyes slightly narrower
    [5, 7, eye],
    [7, 7, eye],
    [6, 8, nose],
    // whiskers angled
    [3, 7, outline],
    [9, 7, outline],
    [2, 8, outline],
    [10, 8, outline],
    // collar
    [5, 10, collar],
    [6, 10, collar],
    [7, 10, collar],
    [6, 11, bell],
    // Longer body
    [6, 11, outline],
    [7, 11, outline],
    [8, 11, outline],
    [9, 11, outline],
    [10, 11, outline],
    [11, 11, outline],
    [12, 11, outline],
    [5, 12, outline],
    [13, 12, outline],
    [5, 13, outline],
    [13, 13, outline],
    [6, 14, outline],
    [7, 14, outline],
    [8, 14, outline],
    [9, 14, outline],
    [10, 14, outline],
    [11, 14, outline],
    [12, 14, outline],
    [6, 12, fur],
    [7, 12, fur],
    [8, 12, fur],
    [9, 12, fur],
    [10, 12, fur],
    [11, 12, fur],
    [12, 12, fur],
    [6, 13, fur],
    [7, 13, fur],
    [8, 13, fur],
    [9, 13, fur],
    [10, 13, fur],
    [11, 13, fur],
    [12, 13, fur],
    [8, 12, fur2],
    [9, 12, fur2],
  ];

  const frameBase: Pixel[] = isKawaii
    ? ([] satisfies Pixel[])
    : style === "round"
      ? roundBase
      : style === "sleek"
        ? sleekBase
        : classicBase;

  const kawaiiBase: Pixel[] = isKawaii
    ? [
        // Fluffy head (rounded)
        [7, 4, outline],
        [8, 4, outline],
        [9, 4, outline],
        [10, 4, outline],

        [6, 5, outline],
        [11, 5, outline],
        [6, 6, outline],
        [12, 6, outline],
        [5, 7, outline],
        [13, 7, outline],
        [5, 8, outline],
        [13, 8, outline],
        [6, 9, outline],
        [12, 9, outline],
        [7, 10, outline],
        [8, 10, outline],
        [9, 10, outline],
        [10, 10, outline],
        [11, 10, outline],

        // Ear tufts
        [6, 4, outline],
        [12, 4, outline],
        [6, 4, fur2],
        [12, 4, fur2],

        // Head fill
        [7, 5, fur],
        [8, 5, fur],
        [9, 5, fur],
        [10, 5, fur],
        [7, 6, fur],
        [8, 6, fur],
        [9, 6, fur],
        [10, 6, fur],
        [11, 6, fur],
        [6, 7, fur],
        [7, 7, fur],
        [8, 7, fur],
        [9, 7, fur],
        [10, 7, fur],
        [11, 7, fur],
        [12, 7, fur],
        [6, 8, fur],
        [7, 8, fur],
        [8, 8, fur],
        [9, 8, fur],
        [10, 8, fur],
        [11, 8, fur],
        [12, 8, fur],
        [7, 9, fur],
        [8, 9, fur],
        [9, 9, fur],
        [10, 9, fur],
        [11, 9, fur],

        // Face: big eyes, tiny mouth, blush
        [8, 7, eye],
        [10, 7, eye],
        [8, 6, fur2],
        [10, 6, fur2],
        [9, 8, nose],
        [9, 9, outline],
        [7, 8, blush],
        [11, 8, blush],

        // Whiskers (short)
        [4, 8, outline],
        [3, 8, outline],
        [14, 8, outline],
        [15, 8, outline],

        // Collar + bell
        [8, 11, collar],
        [9, 11, collar],
        [10, 11, collar],
        [9, 12, bell],

        // Fluffy body outline
        [7, 12, outline],
        [8, 12, outline],
        [10, 12, outline],
        [11, 12, outline],
        [6, 13, outline],
        [12, 13, outline],
        [5, 14, outline],
        [13, 14, outline],
        [5, 15, outline],
        [13, 15, outline],
        [6, 16, outline],
        [12, 16, outline],
        [7, 17, outline],
        [8, 17, outline],
        [9, 17, outline],
        [10, 17, outline],
        [11, 17, outline],

        // Body fill + highlight
        [7, 13, fur],
        [8, 13, fur],
        [9, 13, fur],
        [10, 13, fur],
        [11, 13, fur],
        [6, 14, fur],
        [7, 14, fur],
        [8, 14, fur],
        [9, 14, fur],
        [10, 14, fur],
        [11, 14, fur],
        [12, 14, fur],
        [6, 15, fur],
        [7, 15, fur],
        [8, 15, fur],
        [9, 15, fur],
        [10, 15, fur],
        [11, 15, fur],
        [12, 15, fur],
        [7, 16, fur],
        [8, 16, fur],
        [9, 16, fur],
        [10, 16, fur],
        [11, 16, fur],
        [8, 13, fur2],
        [9, 13, fur2],
        [10, 13, fur2],
      ]
    : ([] satisfies Pixel[]);

  const tailUp: Pixel[] =
    style === "round"
      ? [
          // curlier tail
          [11, 10, outline],
          [12, 10, outline],
          [13, 9, outline],
          [13, 10, outline],
          [11, 10, fur],
          [12, 10, fur],
          [13, 10, fur],
        ]
      : style === "sleek"
        ? [
            // longer tail up
            [13, 9, outline],
            [14, 8, outline],
            [14, 9, outline],
            [15, 8, outline],
            [13, 9, fur],
            [14, 9, fur],
          ]
        : [
            [13, 10, outline],
            [14, 9, outline],
            [14, 10, outline],
            [13, 11, outline],
            [13, 10, fur],
            [14, 10, fur],
          ];

  const tailMid: Pixel[] =
    style === "round"
      ? [
          [11, 12, outline],
          [12, 12, outline],
          [13, 12, outline],
          [11, 12, fur],
          [12, 12, fur],
        ]
      : style === "sleek"
        ? [
            [13, 12, outline],
            [14, 11, outline],
            [15, 10, outline],
            [13, 12, fur],
            [14, 11, fur],
          ]
        : [
            [13, 12, outline],
            [14, 12, outline],
            [15, 11, outline],
            [13, 12, fur],
            [14, 12, fur],
          ];

  const tailDown: Pixel[] =
    style === "round"
      ? [
          [11, 13, outline],
          [12, 13, outline],
          [11, 13, fur],
          [12, 13, fur],
        ]
      : style === "sleek"
        ? [
            [13, 13, outline],
            [14, 13, outline],
            [15, 13, outline],
            [13, 13, fur],
            [14, 13, fur],
          ]
        : [
            [13, 13, outline],
            [14, 13, outline],
            [15, 13, outline],
            [13, 13, fur],
            [14, 13, fur],
          ];

  const legsA: Pixel[] = [
    // stepping
    [7, 15, outline],
    [9, 15, outline],
    [11, 15, outline],
    [7, 15, fur],
    [9, 15, fur],
    [11, 15, fur],
  ];

  const legsB: Pixel[] = [
    [6, 15, outline],
    [8, 15, outline],
    [10, 15, outline],
    [12, 15, outline],
    [6, 15, fur],
    [8, 15, fur],
    [10, 15, fur],
    [12, 15, fur],
  ];

  const legsC: Pixel[] = [
    [7, 15, outline],
    [10, 15, outline],
    [7, 15, fur],
    [10, 15, fur],
  ];

  const legsD: Pixel[] = [
    [6, 15, outline],
    [9, 15, outline],
    [12, 15, outline],
    [6, 15, fur],
    [9, 15, fur],
    [12, 15, fur],
  ];

  return (
    <svg
      className="footer-cat__sprite"
      width="72"
      height="72"
      viewBox={isKawaii ? "0 0 24 24" : "0 0 16 16"}
      role="img"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      {/* Frame A */}
      <g className="footer-cat__frame footer-cat__frame--a">
        <Pixels
          pixels={
            isKawaii
              ? [
                  ...kawaiiBase,
                  ...kawaiiTailUp(isOrange, outline, fur, fur2),
                  ...kawaiiLegsA(isOrange, outline, fur),
                ]
              : [...frameBase, ...stripes, ...tailUp, ...legsA]
          }
        />
      </g>

      {/* Frame B */}
      <g className="footer-cat__frame footer-cat__frame--b">
        <Pixels
          pixels={
            isKawaii
              ? [
                  ...kawaiiBase,
                  ...kawaiiTailMid(isOrange, outline, fur, fur2),
                  ...kawaiiLegsB(isOrange, outline, fur),
                ]
              : [...frameBase, ...stripes, ...tailMid, ...legsB]
          }
        />
      </g>

      {/* Frame C */}
      <g className="footer-cat__frame footer-cat__frame--c">
        <Pixels
          pixels={
            isKawaii
              ? [
                  ...kawaiiBase,
                  ...kawaiiTailDown(isOrange, outline, fur, fur2),
                  ...kawaiiLegsC(isOrange, outline, fur),
                ]
              : [...frameBase, ...stripes, ...tailDown, ...legsC]
          }
        />
      </g>

      <g className="footer-cat__frame footer-cat__frame--d">
        <Pixels
          pixels={
            isKawaii
              ? [
                  ...kawaiiBase,
                  ...kawaiiTailMid(isOrange, outline, fur, fur2),
                  ...kawaiiLegsD(isOrange, outline, fur),
                ]
              : [...frameBase, ...stripes, ...tailMid, ...legsD]
          }
        />
      </g>
    </svg>
  );
}

function kawaiiTailUp(
  isOrange: boolean,
  outline: string,
  fur: string,
  fur2: string,
): Pixel[] {
  // Big fluffy tail up-right (24x24 grid)
  const t = isOrange ? fur2 : fur;
  return [
    [14, 13, outline],
    [15, 12, outline],
    [16, 11, outline],
    [17, 11, outline],
    [18, 12, outline],
    [18, 13, outline],
    [17, 14, outline],
    [16, 14, outline],
    [15, 14, outline],
    [16, 12, t],
    [17, 12, t],
    [17, 13, t],
    [16, 13, t],
  ];
}

function kawaiiTailMid(
  isOrange: boolean,
  outline: string,
  fur: string,
  fur2: string,
): Pixel[] {
  const t = isOrange ? fur2 : fur;
  return [
    [14, 15, outline],
    [15, 14, outline],
    [16, 13, outline],
    [17, 13, outline],
    [18, 14, outline],
    [18, 15, outline],
    [17, 16, outline],
    [16, 16, outline],
    [16, 14, t],
    [17, 14, t],
    [17, 15, t],
    [16, 15, t],
  ];
}

function kawaiiTailDown(
  isOrange: boolean,
  outline: string,
  fur: string,
  fur2: string,
): Pixel[] {
  const t = isOrange ? fur2 : fur;
  return [
    [14, 16, outline],
    [15, 16, outline],
    [16, 16, outline],
    [17, 16, outline],
    [18, 16, outline],
    [15, 17, outline],
    [17, 17, outline],
    [16, 17, t],
    [15, 16, t],
    [16, 16, t],
    [17, 16, t],
  ];
}

function kawaiiLegsA(
  _isOrange: boolean,
  outline: string,
  fur: string,
): Pixel[] {
  return [
    [7, 18, outline],
    [9, 18, outline],
    [11, 18, outline],
    [7, 18, fur],
    [9, 18, fur],
    [11, 18, fur],
  ];
}

function kawaiiLegsB(
  _isOrange: boolean,
  outline: string,
  fur: string,
): Pixel[] {
  return [
    [6, 18, outline],
    [8, 18, outline],
    [10, 18, outline],
    [12, 18, outline],
    [6, 18, fur],
    [8, 18, fur],
    [10, 18, fur],
    [12, 18, fur],
  ];
}

function kawaiiLegsC(
  _isOrange: boolean,
  outline: string,
  fur: string,
): Pixel[] {
  return [
    [7, 18, outline],
    [10, 18, outline],
    [7, 18, fur],
    [10, 18, fur],
  ];
}

function kawaiiLegsD(
  _isOrange: boolean,
  outline: string,
  fur: string,
): Pixel[] {
  return [
    [6, 18, outline],
    [9, 18, outline],
    [12, 18, outline],
    [6, 18, fur],
    [9, 18, fur],
    [12, 18, fur],
  ];
}

function PixelCatSit({ style }: { style?: CatStyle }) {
  const outline = "#0b1220";
  const fur = "#334155";
  const fur2 = "#64748b";
  const eye = "#38bdf8";
  const nose = "#fb7185";
  const collar = "#a78bfa";
  const blush = "#fda4af";

  const isKawaii = style === "kawaii";

  const kawaiiPixels = [
    // kawaii sit: big head, paws, fluffy tail curl
    [7, 4, outline],
    [8, 4, outline],
    [9, 4, outline],
    [10, 4, outline],
    [6, 5, outline],
    [11, 5, outline],
    [5, 6, outline],
    [12, 6, outline],
    [5, 7, outline],
    [12, 7, outline],
    [6, 8, outline],
    [11, 8, outline],
    [7, 9, outline],
    [8, 9, outline],
    [9, 9, outline],
    [10, 9, outline],
    [7, 5, fur],
    [8, 5, fur],
    [9, 5, fur],
    [10, 5, fur],
    [6, 6, fur],
    [7, 6, fur],
    [8, 6, fur],
    [9, 6, fur],
    [10, 6, fur],
    [11, 6, fur],
    [6, 7, fur],
    [7, 7, fur],
    [8, 7, fur],
    [9, 7, fur],
    [10, 7, fur],
    [11, 7, fur],
    [7, 8, fur],
    [8, 8, fur],
    [9, 8, fur],
    [10, 8, fur],
    [8, 6, fur2],
    [10, 6, fur2],
    [8, 7, eye],
    [10, 7, eye],
    [9, 8, nose],
    [7, 8, blush],
    [11, 8, blush],

    [8, 10, collar],
    [9, 10, collar],
    [10, 10, collar],

    // sitting body
    [7, 11, outline],
    [11, 11, outline],
    [6, 12, outline],
    [12, 12, outline],
    [6, 13, outline],
    [12, 13, outline],
    [7, 14, outline],
    [8, 14, outline],
    [9, 14, outline],
    [10, 14, outline],
    [11, 14, outline],
    [7, 12, fur],
    [8, 12, fur],
    [9, 12, fur],
    [10, 12, fur],
    [11, 12, fur],
    [7, 13, fur],
    [8, 13, fur],
    [9, 13, fur],
    [10, 13, fur],
    [11, 13, fur],
    [8, 12, fur2],
    [9, 12, fur2],

    // paws
    [8, 15, outline],
    [10, 15, outline],
    [8, 15, fur],
    [10, 15, fur],

    // tail curl
    [13, 13, outline],
    [14, 12, outline],
    [15, 12, outline],
    [15, 13, outline],
    [14, 13, fur],
    [15, 13, fur],
  ] satisfies Pixel[];

  const classicPixels = [
    // head
    [4, 6, outline],
    [5, 6, outline],
    [6, 6, outline],
    [7, 6, outline],
    [8, 6, outline],
    [4, 7, outline],
    [8, 7, outline],
    [4, 8, outline],
    [8, 8, outline],
    [5, 9, outline],
    [6, 9, outline],
    [7, 9, outline],
    [5, 7, fur],
    [6, 7, fur],
    [7, 7, fur],
    [5, 8, fur],
    [6, 8, fur],
    [7, 8, fur],
    [5, 8, eye],
    [7, 8, eye],
    [6, 9, nose],

    // ears
    [4, 5, outline],
    [5, 5, outline],
    [7, 5, outline],
    [8, 5, outline],
    [5, 6, fur2],
    [7, 6, fur2],

    // collar
    [5, 10, collar],
    [6, 10, collar],
    [7, 10, collar],

    // body (sitting)
    [6, 11, outline],
    [7, 11, outline],
    [8, 11, outline],
    [5, 12, outline],
    [9, 12, outline],
    [5, 13, outline],
    [9, 13, outline],
    [6, 14, outline],
    [7, 14, outline],
    [8, 14, outline],
    [6, 12, fur],
    [7, 12, fur],
    [8, 12, fur],
    [6, 13, fur],
    [7, 13, fur],
    [8, 13, fur],
    [7, 12, fur2],

    // tail curl
    [9, 11, outline],
    [10, 11, outline],
    [10, 12, outline],
    [9, 12, fur],
    [10, 12, fur],
  ] satisfies Pixel[];

  const pixels = isKawaii ? kawaiiPixels : classicPixels;

  return (
    <svg
      className="footer-cat__sprite"
      width="72"
      height="72"
      viewBox={isKawaii ? "0 0 24 24" : "0 0 16 16"}
      role="img"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      <g className="footer-cat__sit">
        <Pixels pixels={pixels} />
      </g>
    </svg>
  );
}

function PixelCatLoaf({
  variant,
  style,
}: {
  variant?: "slate" | "orange";
  style?: CatStyle;
}) {
  const isOrange = variant === "orange";
  const outline = "#0b1220";
  const fur = isOrange ? "#f97316" : "#334155";
  const fur2 = isOrange ? "#fed7aa" : "#64748b";
  const eye = isOrange ? "#22c55e" : "#38bdf8";
  const nose = "#fb7185";
  const blush = "#fda4af";

  const isKawaii = style === "kawaii";

  const kawaiiPixels = [
    // kawaii loaf (24x24): fluffy bun with face
    [6, 12, outline],
    [7, 12, outline],
    [8, 12, outline],
    [9, 12, outline],
    [10, 12, outline],
    [11, 12, outline],
    [12, 12, outline],
    [13, 12, outline],
    [5, 13, outline],
    [14, 13, outline],
    [5, 14, outline],
    [14, 14, outline],
    [6, 15, outline],
    [7, 15, outline],
    [8, 15, outline],
    [9, 15, outline],
    [10, 15, outline],
    [11, 15, outline],
    [12, 15, outline],
    [13, 15, outline],

    [6, 13, fur],
    [7, 13, fur],
    [8, 13, fur],
    [9, 13, fur],
    [10, 13, fur],
    [11, 13, fur],
    [12, 13, fur],
    [13, 13, fur],
    [6, 14, fur],
    [7, 14, fur],
    [8, 14, fur],
    [9, 14, fur],
    [10, 14, fur],
    [11, 14, fur],
    [12, 14, fur],
    [13, 14, fur],

    // face
    [8, 13, fur2],
    [12, 13, fur2],
    [9, 13, eye],
    [11, 13, eye],
    [10, 14, nose],
    [8, 14, blush],
    [12, 14, blush],

    // tiny ears
    [7, 11, outline],
    [8, 11, outline],
    [12, 11, outline],
    [13, 11, outline],
    [8, 11, fur2],
    [12, 11, fur2],
  ] satisfies Pixel[];

  const classicPixels = [
    // loaf outline
    [4, 9, outline],
    [5, 9, outline],
    [6, 9, outline],
    [7, 9, outline],
    [8, 9, outline],
    [9, 9, outline],
    [10, 9, outline],
    [11, 9, outline],
    [3, 10, outline],
    [12, 10, outline],
    [3, 11, outline],
    [12, 11, outline],
    [4, 12, outline],
    [5, 12, outline],
    [6, 12, outline],
    [7, 12, outline],
    [8, 12, outline],
    [9, 12, outline],
    [10, 12, outline],
    [11, 12, outline],

    // loaf fill
    [4, 10, fur],
    [5, 10, fur],
    [6, 10, fur],
    [7, 10, fur],
    [8, 10, fur],
    [9, 10, fur],
    [10, 10, fur],
    [11, 10, fur],
    [4, 11, fur],
    [5, 11, fur],
    [6, 11, fur],
    [7, 11, fur],
    [8, 11, fur],
    [9, 11, fur],
    [10, 11, fur],
    [11, 11, fur],

    // head
    [3, 8, outline],
    [4, 8, outline],
    [5, 8, outline],
    [6, 8, outline],
    [3, 9, outline],
    [6, 9, outline],
    [4, 9, fur],
    [5, 9, fur],

    // ears
    [3, 7, outline],
    [5, 7, outline],
    [4, 7, fur],

    // face
    [4, 9, fur2],
    [5, 9, fur2],
    [4, 10, eye],
    [5, 10, eye],
    [5, 11, nose],

    // tucked tail nub
    [12, 11, fur],
  ] satisfies Pixel[];

  const pixels = isKawaii ? kawaiiPixels : classicPixels;

  return (
    <svg
      className="footer-cat__sprite"
      width="72"
      height="72"
      viewBox={isKawaii ? "0 0 24 24" : "0 0 16 16"}
      role="img"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      <g className="footer-cat__loaf">
        <Pixels pixels={pixels} />
      </g>
    </svg>
  );
}

function YarnBall() {
  const outline = "#0b1220";
  const yarn = "#ef4444"; // red-500
  const yarn2 = "#fca5a5"; // red-300
  const yarn3 = "#7c2d12"; // amber-ish shadow

  return (
    <svg
      className="footer-yarn__sprite"
      width="48"
      height="48"
      viewBox="0 0 16 16"
      role="img"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      {/* ball outline */}
      <Pixels
        pixels={[
          [6, 8, outline],
          [7, 8, outline],
          [8, 8, outline],
          [9, 8, outline],
          [5, 9, outline],
          [10, 9, outline],
          [5, 10, outline],
          [10, 10, outline],
          [5, 11, outline],
          [10, 11, outline],
          [6, 12, outline],
          [7, 12, outline],
          [8, 12, outline],
          [9, 12, outline],

          // fill
          [6, 9, yarn],
          [7, 9, yarn],
          [8, 9, yarn],
          [9, 9, yarn],
          [6, 10, yarn],
          [7, 10, yarn2],
          [8, 10, yarn2],
          [9, 10, yarn],
          [6, 11, yarn],
          [7, 11, yarn],
          [8, 11, yarn],
          [9, 11, yarn3],

          // trailing string
          [10, 12, outline],
          [11, 12, yarn],
          [12, 12, yarn],
          [13, 12, yarn],
          [14, 11, yarn],
        ]}
      />
    </svg>
  );
}

function PixelHeart() {
  const c1 = "#fb7185"; // rose
  const c2 = "#fda4af"; // light rose
  const outline = "#0b1220";

  return (
    <svg
      className="footer-heart__sprite"
      width="32"
      height="32"
      viewBox="0 0 16 16"
      role="img"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      <Pixels
        pixels={[
          // outline-ish heart
          [5, 6, outline],
          [6, 6, outline],
          [9, 6, outline],
          [10, 6, outline],
          [4, 7, outline],
          [11, 7, outline],
          [4, 8, outline],
          [11, 8, outline],
          [5, 9, outline],
          [10, 9, outline],
          [6, 10, outline],
          [9, 10, outline],
          [7, 11, outline],
          [8, 11, outline],

          // fill
          [5, 7, c1],
          [6, 7, c1],
          [7, 7, c1],
          [8, 7, c1],
          [9, 7, c1],
          [10, 7, c1],
          [5, 8, c1],
          [6, 8, c2],
          [7, 8, c1],
          [8, 8, c1],
          [9, 8, c1],
          [10, 8, c1],
          [6, 9, c1],
          [7, 9, c1],
          [8, 9, c1],
          [9, 9, c1],
          [7, 10, c1],
          [8, 10, c1],
        ]}
      />
    </svg>
  );
}

function LaserDot() {
  const dot = "#ef4444";
  const glow = "#fca5a5";

  return (
    <svg
      className="footer-laser__sprite"
      width="24"
      height="24"
      viewBox="0 0 16 16"
      role="img"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      <Pixels
        pixels={[
          [8, 12, dot],
          [7, 12, glow],
          [9, 12, glow],
          [8, 11, glow],
          [8, 13, glow],
        ]}
      />
    </svg>
  );
}

function PixelSparkle() {
  const s1 = "#facc15";
  const s2 = "#fde68a";
  const o = "#0b1220";

  return (
    <svg
      className="footer-sparkle__sprite"
      width="32"
      height="32"
      viewBox="0 0 16 16"
      role="img"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      <Pixels
        pixels={[
          [8, 4, o],
          [8, 5, s1],
          [8, 6, s2],
          [7, 6, s1],
          [9, 6, s1],
          [8, 7, s1],
          [8, 8, s2],
          [8, 9, s1],
          [7, 8, s1],
          [9, 8, s1],
        ]}
      />
    </svg>
  );
}
