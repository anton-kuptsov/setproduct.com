(() => {
  const PAGE_SIZE = 15;

  function getKitName(item) {
    const title = item.querySelector(".heading-style-h4, h3, h4, p");
    return (title?.textContent || "").trim();
  }

  function getButtonText(countLeft) {
    return countLeft > 0 ? "Load More" : "No more kits";
  }

  function initKitsLoadMore() {
    const list = document.querySelector(".templates_cl-wr .templates_cl.w-dyn-items");
    if (!list) return;

    const items = Array.from(list.querySelectorAll(":scope > .w-dyn-item"));
    if (items.length <= PAGE_SIZE) return;

    // Keep stable order and avoid duplicate entries if scripts re-run.
    const uniqueItems = [];
    const seen = new Set();
    items.forEach((item) => {
      const key = item.querySelector("a[href]")?.getAttribute("href") || getKitName(item);
      if (!seen.has(key)) {
        seen.add(key);
        uniqueItems.push(item);
      }
    });

    const section = list.closest(".section") || list.parentElement;
    let visibleCount = PAGE_SIZE;
    let loadMoreBtn = null;

    function setButtonLabel(text) {
      const label = loadMoreBtn.querySelector("div, span");
      if (label) {
        label.textContent = text;
      } else {
        loadMoreBtn.textContent = text;
      }
    }

    function render() {
      uniqueItems.forEach((item, index) => {
        item.style.display = index < visibleCount ? "" : "none";
      });

      const hiddenCount = Math.max(uniqueItems.length - visibleCount, 0);
      if (hiddenCount === 0) {
        loadMoreBtn.style.display = "none";
      } else {
        loadMoreBtn.style.display = "";
        setButtonLabel(getButtonText(hiddenCount));
      }
    }

    function bindButton(button) {
      loadMoreBtn = button;
      loadMoreBtn.addEventListener("click", (event) => {
        event.preventDefault();
        visibleCount = Math.min(visibleCount + PAGE_SIZE, uniqueItems.length);
        render();
      });
      render();
    }

    function createFallbackButton() {
      const buttonWrap = document.createElement("div");
      buttonWrap.style.display = "flex";
      buttonWrap.style.justifyContent = "center";
      buttonWrap.style.marginTop = "32px";

      const button = document.createElement("a");
      button.href = "#";
      button.className = "button-x-small w-inline-block";
      button.innerHTML = '<div class="text-size-regular text-weight-bold">Load More</div>';

      buttonWrap.appendChild(button);
      list.closest(".templates_cl-wr")?.insertAdjacentElement("afterend", buttonWrap);
      return button;
    }

    function findExistingButton() {
      return (
        section?.querySelector('[fs-cmsload-element="button"]') ||
        section?.querySelector(".w-pagination-next")
      );
    }

    let attempts = 0;
    const maxAttempts = 10;
    const timer = window.setInterval(() => {
      const existingButton = findExistingButton();
      attempts += 1;
      if (existingButton) {
        window.clearInterval(timer);
        bindButton(existingButton);
        return;
      }
      if (attempts >= maxAttempts) {
        window.clearInterval(timer);
        bindButton(createFallbackButton());
      }
    }, 200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initKitsLoadMore, { once: true });
  } else {
    initKitsLoadMore();
  }
})();
