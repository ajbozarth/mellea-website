import { createCursorSprite } from "./cursorSprite.js";
import { createCursorTrail } from "./cursorTrail.js";
import { cursorConfig } from "./cursorConfig.js";
import { assetUrl } from "./assetBase.js";
import { initHeroIntro } from "./heroIntro.js";
import { initSectionReveal } from "./sectionReveal.js";
import { initHeroActions } from "./heroActions.js";
import { initGithubStars } from "./githubStars.js";
import { initHeroDotField } from "./dotField.js";
import { initCursorToggle } from "./cursorToggle.js";
import { initFutureSoftwarePanel } from "./futureSoftwarePanel.js";
import { initMelleaCompare } from "./melleaCompare.js";

const SCROLL_THRESHOLD = 12;

const resolvedConfig = {
  ...cursorConfig,
  sprites: cursorConfig.sprites.map((sprite) => ({
    ...sprite,
    src: assetUrl(sprite.src),
  })),
};

const cursor = createCursorSprite(resolvedConfig);
const trail = createCursorTrail({
  src: assetUrl("assets/g.svg"),
  sectionSelector: "#granite-section",
  getFollowTarget: () => cursor.getAnchorPosition(),
  onSectionChange: () => syncCursorFollowerVisibility(),
});
const siteHeader = document.getElementById("site-header");
const brandIcon = document.querySelector(".brand__icon");

let cursorFollowerEnabled = false;

function updateHeaderScrollState() {
  const isScrolled = window.scrollY > SCROLL_THRESHOLD;

  if (siteHeader) {
    siteHeader.classList.toggle("is-scrolled", isScrolled);
  }
}

function syncBrandIconForFollower(isActive) {
  if (siteHeader) {
    siteHeader.classList.toggle("is-follower-active", isActive);
  }

  if (brandIcon) {
    brandIcon.setAttribute("aria-hidden", isActive ? "true" : "false");
  }
}

function syncCursorFollowerVisibility() {
  const showFollower = cursorFollowerEnabled;
  cursor.setVisible(showFollower);
  trail.syncVisibility(showFollower);
  syncBrandIconForFollower(showFollower);
}

function applyCursorFollowerEnabled(enabled) {
  cursorFollowerEnabled = enabled;
  document.body.classList.toggle("cursor-follower-off", !enabled);
  trail.setEnabled(enabled);

  if (!enabled) {
    cursor.setVisible(false);
    trail.syncVisibility(false);
    syncBrandIconForFollower(false);
    return;
  }

  syncCursorFollowerVisibility();
}

initHeroIntro();
initSectionReveal();
initHeroActions();
initGithubStars();
initHeroDotField();
initCursorToggle({ onChange: applyCursorFollowerEnabled });
initFutureSoftwarePanel();
initMelleaCompare();

cursor.start();
trail.start();
cursor.setVisible(false);
trail.syncVisibility(false);

window.addEventListener("scroll", updateHeaderScrollState, { passive: true });
window.addEventListener("resize", updateHeaderScrollState, { passive: true });
updateHeaderScrollState();
