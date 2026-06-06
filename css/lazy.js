/** تحميل كسول للفيديوهات والـ embed */
(function (global) {
  "use strict";

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const video = entry.target;
        const src = video.dataset.src;
        if (src && !video.dataset.loaded) {
          const source = video.querySelector("source") || document.createElement("source");
          source.src = src;
          source.type = "video/mp4";
          if (!source.parentElement) video.appendChild(source);
          video.dataset.loaded = "1";
          video.load();
          if (video.dataset.autoplayHero === "1") {
            video.play().catch(() => {});
          }
        }
        videoObserver.unobserve(video);
      });
    },
    { rootMargin: "120px", threshold: 0.05 }
  );

  function observeVideos(root = document) {
    root.querySelectorAll("video[data-src]").forEach((v) => videoObserver.observe(v));
  }

  function loadEmbed(btn) {
    const wrap = btn.closest(".reel-embed");
    if (!wrap || wrap.dataset.loaded) return;
    const url = wrap.dataset.embed;
    if (!url) return;
    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.title = btn.getAttribute("aria-label") || "فيديو مضمّن";
    iframe.loading = "lazy";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    const poster = wrap.querySelector(".reel-embed__poster");
    if (poster) poster.remove();
    btn.remove();
    wrap.appendChild(iframe);
    wrap.dataset.loaded = "1";
  }

  function bindEmbedButtons(root = document) {
    root.querySelectorAll("[data-load-embed]").forEach((btn) => {
      btn.addEventListener("click", () => loadEmbed(btn));
    });
  }

  global.GenixLazy = {
    observeVideos,
    bindEmbedButtons
  };
})(window);
