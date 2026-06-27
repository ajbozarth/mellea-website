/**
 * Hero CTA interactions — copy pip install command to clipboard.
 */

const COPY_RESET_MS = 2000;

/**
 * @param {string} text
 */
async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function initHeroActions() {
  const button = document.querySelector(".btn-pip-install");
  if (!button) return;

  const copyTextValue = button.dataset.copyText?.trim();
  const label = button.querySelector(".btn-pip-install__label-text");
  if (!copyTextValue || !label) return;

  const defaultLabel = label.textContent;

  button.addEventListener("click", async () => {
    try {
      await copyText(copyTextValue);
      label.textContent = "Copied!";
      button.classList.add("btn-pip-install--copied");
      button.setAttribute("aria-label", "Copied to clipboard");

      window.setTimeout(() => {
        label.textContent = defaultLabel;
        button.classList.remove("btn-pip-install--copied");
        button.setAttribute(
          "aria-label",
          "Copy pip install mellea to clipboard"
        );
      }, COPY_RESET_MS);
    } catch {
      label.textContent = "Copy failed";
      window.setTimeout(() => {
        label.textContent = defaultLabel;
      }, COPY_RESET_MS);
    }
  });
}
