(() => {
  const DEFAULT_PAGE_SIZE = 8;

  function initCollectionLoadMore() {
    const list = document.querySelector(".templates_cl-wr .templates_cl.w-dyn-items[role='list']");
    if (!list) return;

    const items = Array.from(list.querySelectorAll(":scope > .w-dyn-item"));
    if (!items.length) return;

    const pageSize = Math.max(
      1,
      Number.parseInt(list.getAttribute("data-static-page-size") || `${DEFAULT_PAGE_SIZE}`, 10) ||
        DEFAULT_PAGE_SIZE
    );

    if (items.length <= pageSize) return;

    let visibleCount = pageSize;
    let loadMoreBtn = null;
    const section = list.closest(".templates_list-section") || list.closest(".section") || list.parentElement;

    function setButtonText(text) {
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

      if (visibleCount >= items.length) {
        loadMoreBtn.style.display = "none";
      } else {
        loadMoreBtn.style.display = "";
        setButtonText("Load More");
      }
    }

    function bindButton(button) {
      loadMoreBtn = button;
      loadMoreBtn.addEventListener("click", (event) => {
        event.preventDefault();
        visibleCount = Math.min(visibleCount + pageSize, items.length);
        render();
      });
      render();
    }

    function findButton() {
      return (
        section?.querySelector('[fs-cmsload-element="button"]') ||
        section?.querySelector(".w-pagination-next")
      );
    }

    function createButton() {
      const wrap = document.createElement("div");
      wrap.style.display = "flex";
      wrap.style.justifyContent = "center";
      wrap.style.marginTop = "32px";

      const button = document.createElement("a");
      button.href = "#";
      button.className = "button-x-small w-inline-block";
      button.innerHTML = '<div class="text-size-regular text-weight-bold">Load More</div>';

      wrap.appendChild(button);
      list.closest(".templates_cl-wr")?.insertAdjacentElement("afterend", wrap);
      return button;
    }

    section?.querySelector(".w-pagination-wrapper")?.remove();

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const existing = findButton();
      if (existing) {
        window.clearInterval(timer);
        bindButton(existing);
        return;
      }
      if (attempts >= 10) {
        window.clearInterval(timer);
        bindButton(createButton());
      }
    }, 200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCollectionLoadMore, { once: true });
  } else {
    initCollectionLoadMore();
  }
})();
