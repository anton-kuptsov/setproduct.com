{
  const script = document.createElement("script");
  script.src = "https://assets.gumroad.com/packs/js/overlay-e4dcbe661556fd5616a5.js";
  script.charset = "utf-8";
  document.head.appendChild(script);
    document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="https://assets.gumroad.com/packs/css/overlay-af027abd.css" />');

    const loaderScript = document.querySelector("script[src*='/js/gumroad.js']");
    loaderScript.dataset.stylesUrl = "https://assets.gumroad.com/packs/css/design-714602c5.css";
}
