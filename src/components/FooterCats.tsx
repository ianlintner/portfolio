export function FooterCats() {
  return (
    <div
      aria-hidden
      className="relative h-24 overflow-hidden border-t border-border/40 bg-background/30 print:hidden"
    >
      {/* Subtle ground line */}
      <div className="absolute inset-x-0 bottom-6 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-60" />

      {/* Cat 1: left -> right */}
      <div className="footer-cat footer-cat--l2r">
        <div className="footer-cat__body">
          <PixelCat />
        </div>
      </div>

      {/* Cat 2: right -> left (orange; occasionally loafs; chases a yarn ball) */}
      <div className="footer-cat footer-cat--r2l footer-cat--chaser">
        <div className="footer-cat__body footer-cat__body--pounce">
          <div className="footer-cat__mode footer-cat__mode--walk">
            <PixelCat variant="orange" />
          </div>
          <div className="footer-cat__mode footer-cat__mode--loaf">
            <PixelCatLoaf variant="orange" />
          </div>
        </div>
      </div>

      <div className="footer-yarn footer-yarn--r2l">
        <div className="footer-yarn__body">
          <YarnBall />
        </div>
      </div>

      {/* When they meet in the middle: a tiny heart moment */}
      <div className="footer-heart">
        <PixelHeart />
      </div>
    </div>
  );
}

type Pixel = [x: number, y: number, fill: string];

function Pixels({ pixels }: { pixels: Pixel[] }) {
  return (
    <>
      {pixels.map(([x, y, fill], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill={fill} />
      ))}
    </>
  );
}

function PixelCat({ variant }: { variant?: "slate" | "orange" }) {
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

  const frameBase: Pixel[] = [
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

    // Collar + bell (tiny)
    [5, 10, collar],
    [6, 10, collar],
    [7, 10, collar],
    [6, 11, bell],

    // Body outline
    [6, 11, outline],
    [7, 11, outline],
    [8, 11, outline],
    [9, 11, outline],
    [10, 11, outline],
    [11, 11, outline],
    [5, 12, outline],
    [12, 12, outline],
    [5, 13, outline],
    [12, 13, outline],
    [6, 14, outline],
    [7, 14, outline],
    [8, 14, outline],
    [9, 14, outline],
    [10, 14, outline],
    [11, 14, outline],

    // Body fill
    [6, 12, fur],
    [7, 12, fur],
    [8, 12, fur],
    [9, 12, fur],
    [10, 12, fur],
    [11, 12, fur],
    [6, 13, fur],
    [7, 13, fur],
    [8, 13, fur],
    [9, 13, fur],
    [10, 13, fur],
    [11, 13, fur],
    // Body highlight
    [7, 12, fur2],
    [8, 12, fur2],
    [9, 12, fur2],
  ];

  const tailUp: Pixel[] = [
    [12, 10, outline],
    [13, 9, outline],
    [13, 10, outline],
    [12, 11, outline],
    [12, 10, fur],
    [13, 10, fur],
  ];

  const tailMid: Pixel[] = [
    [12, 12, outline],
    [13, 12, outline],
    [14, 11, outline],
    [12, 12, fur],
    [13, 12, fur],
  ];

  const tailDown: Pixel[] = [
    [12, 13, outline],
    [13, 13, outline],
    [14, 13, outline],
    [12, 13, fur],
    [13, 13, fur],
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

  return (
    <svg
      className="footer-cat__sprite"
      width="72"
      height="72"
      viewBox="0 0 16 16"
      role="img"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      {/* Frame A */}
      <g className="footer-cat__frame footer-cat__frame--a">
        <Pixels pixels={[...frameBase, ...tailUp, ...legsA]} />
      </g>

      {/* Frame B */}
      <g className="footer-cat__frame footer-cat__frame--b">
        <Pixels pixels={[...frameBase, ...tailMid, ...legsB]} />
      </g>

      {/* Frame C */}
      <g className="footer-cat__frame footer-cat__frame--c">
        <Pixels pixels={[...frameBase, ...tailDown, ...legsC]} />
      </g>
    </svg>
  );
}

function PixelCatLoaf({ variant }: { variant?: "slate" | "orange" }) {
  const isOrange = variant === "orange";
  const outline = "#0b1220";
  const fur = isOrange ? "#f97316" : "#334155";
  const fur2 = isOrange ? "#fed7aa" : "#64748b";
  const eye = isOrange ? "#22c55e" : "#38bdf8";
  const nose = "#fb7185";

  return (
    <svg
      className="footer-cat__sprite"
      width="72"
      height="72"
      viewBox="0 0 16 16"
      role="img"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      <g className="footer-cat__loaf">
        <Pixels
          pixels={[
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
          ]}
        />
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
