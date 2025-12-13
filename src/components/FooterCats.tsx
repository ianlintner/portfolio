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
        <PixelCat />
      </div>

      {/* Cat 2: right -> left (orange; occasionally loafs; chases a yarn ball) */}
      <div className="footer-cat footer-cat--r2l footer-cat--chaser">
        <div className="footer-cat__mode footer-cat__mode--walk">
          <PixelCat variant="orange" />
        </div>
        <div className="footer-cat__mode footer-cat__mode--loaf">
          <PixelCatLoaf variant="orange" />
        </div>
      </div>

      <div className="footer-yarn footer-yarn--r2l">
        <YarnBall />
      </div>
    </div>
  );
}

function PixelCat({ variant }: { variant?: "slate" | "orange" }) {
  // Two-frame pixel cat. We swap frames via CSS (opacity) to simulate a walk cycle.
  // Keep it tiny and let CSS scale it up with crisp edges.
  const isOrange = variant === "orange";
  const fur = isOrange ? "#f97316" : "#334155"; // orange-500 / slate-700-ish
  const fur2 = isOrange ? "#fdba74" : "#475569"; // orange-300 / lighter highlight
  const eye = "#22c55e"; // green
  const nose = "#f97316"; // orange

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
        {/* body */}
        <rect x="5" y="7" width="7" height="4" fill={fur} />
        <rect x="6" y="8" width="5" height="2" fill={fur2} />
        {/* head */}
        <rect x="3" y="6" width="3" height="3" fill={fur} />
        <rect x="4" y="7" width="1" height="1" fill={fur2} />
        {/* ears */}
        <rect x="3" y="5" width="1" height="1" fill={fur} />
        <rect x="5" y="5" width="1" height="1" fill={fur} />
        {/* eyes + nose */}
        <rect x="4" y="7" width="1" height="1" fill={eye} />
        <rect x="5" y="7" width="1" height="1" fill={eye} />
        <rect x="5" y="8" width="1" height="1" fill={nose} />
        {/* tail (up) */}
        <rect x="12" y="6" width="1" height="3" fill={fur} />
        <rect x="13" y="6" width="1" height="1" fill={fur} />
        {/* legs */}
        <rect x="6" y="11" width="1" height="1" fill={fur} />
        <rect x="8" y="11" width="1" height="1" fill={fur} />
        <rect x="10" y="11" width="1" height="1" fill={fur} />
      </g>

      {/* Frame B */}
      <g className="footer-cat__frame footer-cat__frame--b">
        {/* body */}
        <rect x="5" y="7" width="7" height="4" fill={fur} />
        <rect x="6" y="8" width="5" height="2" fill={fur2} />
        {/* head */}
        <rect x="3" y="6" width="3" height="3" fill={fur} />
        <rect x="4" y="7" width="1" height="1" fill={fur2} />
        {/* ears */}
        <rect x="3" y="5" width="1" height="1" fill={fur} />
        <rect x="5" y="5" width="1" height="1" fill={fur} />
        {/* eyes + nose */}
        <rect x="4" y="7" width="1" height="1" fill={eye} />
        <rect x="5" y="7" width="1" height="1" fill={eye} />
        <rect x="5" y="8" width="1" height="1" fill={nose} />
        {/* tail (down) */}
        <rect x="12" y="9" width="2" height="1" fill={fur} />
        {/* legs (alternate) */}
        <rect x="7" y="11" width="1" height="1" fill={fur} />
        <rect x="9" y="11" width="1" height="1" fill={fur} />
        <rect x="11" y="11" width="1" height="1" fill={fur} />
      </g>
    </svg>
  );
}

function PixelCatLoaf({ variant }: { variant?: "slate" | "orange" }) {
  const isOrange = variant === "orange";
  const fur = isOrange ? "#f97316" : "#334155";
  const fur2 = isOrange ? "#fdba74" : "#475569";
  const eye = "#22c55e";
  const nose = "#f97316";

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
      {/* loaf body */}
      <rect x="4" y="8" width="9" height="3" fill={fur} />
      <rect x="5" y="9" width="7" height="1" fill={fur2} />
      {/* head */}
      <rect x="3" y="7" width="3" height="2" fill={fur} />
      {/* ears */}
      <rect x="3" y="6" width="1" height="1" fill={fur} />
      <rect x="5" y="6" width="1" height="1" fill={fur} />
      {/* eyes + nose */}
      <rect x="4" y="8" width="1" height="1" fill={eye} />
      <rect x="5" y="8" width="1" height="1" fill={eye} />
      <rect x="5" y="9" width="1" height="1" fill={nose} />
      {/* tail tucked */}
      <rect x="12" y="10" width="1" height="1" fill={fur} />
    </svg>
  );
}

function YarnBall() {
  const yarn = "#ef4444"; // red-500
  const yarn2 = "#fca5a5"; // red-300

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
      {/* ball */}
      <rect x="6" y="9" width="4" height="4" fill={yarn} />
      <rect x="7" y="10" width="2" height="2" fill={yarn2} />
      {/* trailing string */}
      <rect x="10" y="12" width="3" height="1" fill={yarn} />
      <rect x="13" y="11" width="1" height="1" fill={yarn} />
    </svg>
  );
}
