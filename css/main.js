(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => r.querySelectorAll(s);

  let heroIndex = 0;
  let lightboxImages = [];
  let lightboxIndex = 0;
  let revealObs;

  function initHeader() {
    const header = $("#header");
    const toggle = $("#navToggle");
    const nav = $("#navMenu");
    const progress = $("#scrollProgress");

    const onScroll = () => {
      const y = window.scrollY;
      header?.classList.toggle("topbar--solid", y > 40);
      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = max > 0 ? `${(y / max) * 100}%` : "0";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    toggle?.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    $$(".topbar__nav a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle?.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initHeroRotate() {
    const el = $("#heroRotate");
    if (!el || !HERO_WORDS.length) return;

    setInterval(() => {
      heroIndex = (heroIndex + 1) % HERO_WORDS.length;
      el.style.opacity = "0";
      setTimeout(() => {
        el.textContent = HERO_WORDS[heroIndex];
        el.style.opacity = "1";
      }, 250);
    }, 3200);
  }

  function renderSolutions() {
    const grid = $("#solutionsGrid");
    if (!grid) return;
    const select = $("#fldService");

    SOLUTIONS.forEach((s) => {
      const card = document.createElement("div");
      card.className = `bento-card ${s.wide ? "bento-card--wide" : ""}`;
      card.innerHTML = `
        <div class="bento-card__glow"></div>
        <div class="bento-card__icon">✦</div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <div class="bento-card__media">
          <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'></svg>" data-src="${s.image}" alt="${s.title}" class="bento-card__img lazy">
        </div>
      `;
      grid.appendChild(card);

      if (select) {
        const op = document.createElement("option");
        op.value = s.id;
        op.textContent = s.title;
        select.appendChild(op);
      }

      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--x", `${e.clientX - r.left}px`);
        card.style.setProperty("--y", `${e.clientY - r.top}px`);
      });
    });
  }

  function renderShowreel() {
    const grid = $("#showreelGrid");
    if (!grid) return;

    SHOWREEL_ITEMS.forEach((item) => {
      const card = document.createElement("div");
      card.className = "reel-card";
      if (item.type === "video") {
        card.innerHTML = `
          <div class="reel-embed">
            <video class="lazy" loop muted playsinline data-src="${item.src}"></video>
            <div class="reel-embed__poster" style="background-image:url('${item.poster}')"></div>
            <button class="reel-embed__play" aria-label="تشغيل العرض">▶</button>
          </div>
          <div class="reel-card__body"><h3>${item.title}</h3></div>
        `;
        const vid = $("video", card);
        const play = $(".reel-embed__play", card);
        const poster = $(".reel-embed__poster", card);
        play?.addEventListener("click", () => {
          if (vid) {
            vid.muted = false;
            vid.controls = true;
            vid.play().catch(() => {});
          }
          poster?.remove();
          play.remove();
        });
      } else {
        card.innerHTML = `
          <div class="reel-embed" data-embed="${item.embedUrl || ""}">
            <div class="reel-embed__poster" style="background-image:url('${item.poster}')"></div>
            <button class="reel-embed__play" ${item.embedUrl ? "data-load-embed" : `onclick="window.open('${item.externalUrl}','_blank')"`} aria-label="شاهد على المنصة">✦</button>
          </div>
          <div class="reel-card__body"><h3>${item.title}</h3></div>
        `;
      }
      grid.appendChild(card);
    });
    if (window.GenixLazy) window.GenixLazy.bindEmbedButtons(grid);
  }

  function initPortfolio() {
    const tabs = $("#portfolioTabs");
    const view = $("#portfolioView");
    if (!tabs || !view) return;

    PORTFOLIO.forEach((cat, idx) => {
      const btn = document.createElement("button");
      btn.className = `tab-btn ${idx === 0 ? "active" : ""}`;
      btn.textContent = cat.label;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", idx === 0 ? "true" : "false");
      tabs.appendChild(btn);

      btn.addEventListener("click", () => {
        $$(".tab-btn", tabs).forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        switchCat(cat);
      });
    });

    if (PORTFOLIO.length) switchCat(PORTFOLIO[0]);

    function switchCat(cat) {
      view.innerHTML = "";
      const grid = document.createElement("div");
      grid.className = "portfolio-grid";
      lightboxImages = cat.images || [];

      lightboxImages.forEach((imgSrc, i) => {
        const item = document.createElement("div");
        item.className = "portfolio-card";
        item.innerHTML = `
          <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 1 1 1'></svg>" data-src="${imgSrc}" alt="${cat.label}" class="portfolio-card__img lazy">
          <div class="portfolio-card__meta"><span class="portfolio-card__title">عرض العمل #${i + 1}</span></div>
        `;
        grid.appendChild(item);
        item.addEventListener("click", () => openLightbox(i));
      });

      if (cat.note) {
        const note = document.createElement("p");
        note.className = "section-desc text-center";
        note.style.gridColumn = "1/-1";
        note.textContent = cat.note;
        grid.appendChild(note);
      }

      view.appendChild(grid);
      if (window.GenixLazy) {
        window.GenixLazy.observeVideos(grid);
        window.GenixLazy.observeImages ? window.GenixLazy.observeImages(grid) : observeImagesLocal(grid);
      }
      observeReveal(grid);
    }
  }

  function observeImagesLocal(root) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const img = en.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove("lazy");
          }
          obs.unobserve(img);
        }
      });
    }, { rootMargin: "200px" });
    root.querySelectorAll("img.lazy").forEach((im) => obs.observe(im));
  }

  function initLightbox() {
    const box = $("#lightbox");
    const img = $("#lightboxImg");
    if (!box || !img) return;

    const show = (idx) => {
      lightboxIndex = idx;
      img.src = lightboxImages[lightboxIndex] || "";
    };

    $("#lightboxPrev")?.addEventListener("click", () => {
      const prev = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
      show(prev);
    });
    $("#lightboxNext")?.addEventListener("click", () => {
      const next = (lightboxIndex + 1) % lightboxImages.length;
      show(next);
    });

    window.openLightbox = (idx) => {
      show(idx);
      box.showModal();
    };
  }

  function initForm() {
    const form = $("#genixForm");
    const modal = $("#successModal");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;

      $$("[required]", form).forEach((f) => {
        const err = document.querySelector(`.fld__err[data-for="${f.id}"]`);
        if (!f.value.trim()) {
          f.setAttribute("aria-invalid", "true");
          if (err) err.textContent = "هذا الحقل مطلوب لإتمام الطلب.";
          ok = false;
        } else {
          f.setAttribute("aria-invalid", "false");
          if (err) err.textContent = "";
        }
      });

      if (!ok) return;

      const name = $("#fldName")?.value || "";
      const comp = $("#fldCompany")?.value || "";
      const svcEl = $("#fldService");
      const svcText = svcEl?.options[svcEl.selectedIndex]?.text || "";
      const msg = $("#fldMsg")?.value || "";

      const text = `*طلب جديد من استوديو Genix ID*\n\n*الاسم:* ${name}\n*الشركة:* ${comp || "لا يوجد"}\n*الخدمة:* ${svcText}\n*تفاصيل المشروع:*\n${msg}`;
      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

      $("#submitBtn").disabled = true;
      setTimeout(() => { window.open(url, "_blank"); $("#submitBtn").disabled = false; }, 800);

      $$(".fld__input", form).forEach((f) => {
        f.value = ""; f.setAttribute("aria-invalid", "false");
        const err = document.querySelector(`.fld__err[data-for="${f.id}"]`);
        if (err) err.textContent = "";
      });
      modal?.showModal();
    });

    $("#successClose")?.addEventListener("click", () => modal?.close());
    modal?.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
  }

  function observeReveal(root = document) {
    if (!revealObs) {
      revealObs = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            revealObs.unobserve(en.target);
          }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -48px 0px" });
    }
    $$(".reveal:not(.is-visible)", root).forEach((el) => revealObs.observe(el));
  }

  function initReducedMotion() {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    $$(".marquee__track").forEach((el) => { el.style.animation = "none"; });
    const heroVid = $(".hero__media video");
    if (heroVid) heroVid.removeAttribute("data-autoplay-hero");
  }

  function init() {
    initHeader();
    initHeroRotate();
    initReducedMotion();
    renderSolutions();
    renderShowreel();
    initPortfolio();
    initLightbox();
    initForm();

    const bgVideo = $("#bgVideo");
    if (bgVideo) {
      bgVideo.dataset.src = BRAND.heroVideo;
    }
    const poster = $("#heroPoster");
    if (poster) {
      poster.style.backgroundImage = `url('${BRAND.heroPoster}')`;
    }

    if (window.GenixLazy) window.GenixLazy.observeVideos(document);
    observeImagesLocal(document);
    observeReveal(document);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
