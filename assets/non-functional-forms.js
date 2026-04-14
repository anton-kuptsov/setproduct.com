(() => {
  const FALLBACK_TEXT = "Form submission is temporarily unavailable in this static mirror.";

  const showFallbackState = (form) => {
    const container = form.closest(".w-form");
    if (!container) {
      window.alert(FALLBACK_TEXT);
      return;
    }

    const done = container.querySelector(".w-form-done");
    const fail = container.querySelector(".w-form-fail");

    if (done) {
      done.style.display = "none";
      done.setAttribute("aria-hidden", "true");
    }

    if (fail) {
      fail.style.display = "block";
      fail.removeAttribute("aria-hidden");
      const textNode = fail.querySelector("div");
      if (textNode) textNode.textContent = FALLBACK_TEXT;
    } else {
      window.alert(FALLBACK_TEXT);
    }
  };

  const disableForm = (form) => {
    form.setAttribute("data-static-mirror-disabled", "true");
    form.setAttribute("action", "javascript:void(0)");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      showFallbackState(form);
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("form").forEach(disableForm);
  });
})();
