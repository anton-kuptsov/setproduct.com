(() => {
  const PAGE_SIZE = 8;

  function initAllKitsLoadMore() {
    const list = document.querySelector(".templates_cl-wr .templates_cl.w-dyn-items");
    if (!list) return;

    const items = Array.from(list.querySelectorAll(":scope > .w-dyn-item"));
    if (items.length <= PAGE_SIZE) return;

    let visibleCount = PAGE_SIZE;
    const section = list.closest(".templates_list-section") || list.closest(".section") || list.parentElement;
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
      items.forEach((item, index) => {
        item.style.display = index < visibleCount ? "" : "none";
      });

      const hiddenCount = Math.max(items.length - visibleCount, 0);
      if (hiddenCount === 0) {
        loadMoreBtn.style.display = "none";
      } else {
        loadMoreBtn.style.display = "";
        setButtonLabel("Load More");
      }
    }

    function bindButton(button) {
      loadMoreBtn = button;
      loadMoreBtn.addEventListener("click", (event) => {
        event.preventDefault();
        visibleCount = Math.min(visibleCount + PAGE_SIZE, items.length);
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

    const badPagination = section?.querySelector(".w-pagination-wrapper");
    if (badPagination) badPagination.remove();

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const existingButton = findExistingButton();
      if (existingButton) {
        window.clearInterval(timer);
        bindButton(existingButton);
        return;
      }
      if (attempts >= 10) {
        window.clearInterval(timer);
        bindButton(createFallbackButton());
      }
    }, 200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllKitsLoadMore, { once: true });
  } else {
    initAllKitsLoadMore();
  }
})();
