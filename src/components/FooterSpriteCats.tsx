export type SpriteCatId = 1 | 2 | 3;
export type SpriteCatAction = "sit" | "stand" | "walk" | "run" | "sleep";
export type SpriteCatDir = "down" | "up" | "right" | "left";

function SpriteCat({
  catId,
  action,
  dir,
  animated,
}: {
  catId: SpriteCatId;
  action: SpriteCatAction;
  dir: SpriteCatDir;
  animated?: boolean;
}) {
  return (
    <span
      aria-hidden
      data-cat={catId}
      data-action={action}
      data-dir={dir}
      data-animated={animated ? "true" : "false"}
      className="footer-sprite-cats__sprite"
    />
  );
}

export function FooterSpriteCats() {
  return (
    <div
      aria-hidden
      className="footer-sprite-cats print:hidden"
      // This is decorative; keep it out of the accessibility tree.
    >
      <div className="footer-sprite-cats__ground" />

      {/* One simple walk each direction. No yarn, no lasers, no meet-cute. */}
      <div className="footer-sprite-cats__cat footer-sprite-cats__cat--l2r">
        <SpriteCat catId={1} action="walk" dir="right" animated />
      </div>

      <div className="footer-sprite-cats__cat footer-sprite-cats__cat--r2l">
        <SpriteCat catId={2} action="walk" dir="left" animated />
      </div>
    </div>
  );
}
