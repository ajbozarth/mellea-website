/**
 * Fetches and displays GitHub star count for the Mellea repository.
 */
const REPO_API =
  "https://api.github.com/repos/generative-computing/mellea";

/**
 * @param {number} count
 */
function formatStarCount(count) {
  if (count >= 1000) {
    const value = count / 1000;
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}k`;
  }
  return String(count);
}

export async function initGithubStars() {
  const starsEl = document.querySelector("[data-github-stars]");
  const button = document.querySelector(".github-btn");
  if (!starsEl || !button) return;

  try {
    const response = await fetch(REPO_API);
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);

    const data = await response.json();
    const stars = formatStarCount(data.stargazers_count);

    starsEl.textContent = stars;
    starsEl.removeAttribute("aria-hidden");
    button.setAttribute(
      "aria-label",
      `Mellea on GitHub, ${data.stargazers_count} stars`
    );
  } catch {
    starsEl.textContent = "";
    starsEl.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-label", "Mellea on GitHub");
  }
}
