(() => {
  const PAGE_SIZE = 8;

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const normalize = (v) => (v || "").replace(/\s+/g, " ").trim();

  const getItemCategory = (item) => {
    const el =
      qs('[fs-cmsfilter-field="blog-categories"]', item) ||
      qs('[fs-cmsfilter-field="category-2"]', item);
    return normalize(el ? el.textContent : "");
  };

  const decodeCategoryFromUrl = () => {
    const p = new URLSearchParams(window.location.search);
    return normalize(p.get("blog-categories") || "");
  };

  const setCategoryToUrl = (category) => {
    const url = new URL(window.location.href);
    if (!category) {
      url.searchParams.delete("blog-categories");
    } else {
      url.searchParams.set("blog-categories", category);
    }
    window.history.replaceState({}, "", url);
  };

  const allButton = qs("#all-button");
  const categoryLabels = qsa('label.nav_radio[fs-cmsfilter-field="category-2"]');
  const items = qsa(".blog_list-item");
  const loadMoreButton = qs("#blog-load-more");
  const itemsCount = qs('[fs-cmsload-element="items-count"]');

  if (!allButton || !items.length) return;

  let activeCategory = "";
  let visibleLimit = PAGE_SIZE;

  const matchesCategory = (item) => {
    if (!activeCategory) return true;
    return getItemCategory(item) === activeCategory;
  };

  const setActiveControl = () => {
    allButton.classList.toggle("fs-cmsfilter_active", !activeCategory);
    categoryLabels.forEach((label) => {
      const labelText = normalize(label.textContent);
      label.classList.toggle("fs-cmsfilter_active", labelText === activeCategory);
      const input = qs('input[type="radio"]', label);
      if (input) input.checked = labelText === activeCategory;
    });
  };

  const render = () => {
    const matched = items.filter(matchesCategory);
    const showCount = activeCategory ? matched.length : Math.min(matched.length, visibleLimit);

    items.forEach((item) => {
      item.style.display = "none";
    });

    matched.slice(0, showCount).forEach((item) => {
      item.style.display = "";
    });

    if (itemsCount) itemsCount.textContent = String(matched.length);

    if (loadMoreButton) {
      const shouldShowLoadMore = !activeCategory && matched.length > showCount;
      loadMoreButton.style.display = shouldShowLoadMore ? "" : "none";
    }
  };

  const applyCategory = (category) => {
    activeCategory = normalize(category);
    visibleLimit = PAGE_SIZE;
    setActiveControl();
    setCategoryToUrl(activeCategory);
    render();
  };

  allButton.addEventListener("click", (e) => {
    e.preventDefault();
    applyCategory("");
  });

  categoryLabels.forEach((label) => {
    label.addEventListener("click", () => {
      applyCategory(normalize(label.textContent));
    });
  });

  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", (e) => {
      e.preventDefault();
      visibleLimit += PAGE_SIZE;
      render();
    });
  }

  applyCategory(decodeCategoryFromUrl());
})();
