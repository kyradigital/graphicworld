/* Graphic World Ltd: site interactions */
(() => {
  // ---- Config: confirm the WhatsApp number with the client ----
  const WA_NUMBER = "254722442724";
  const EMAIL = "info@graphicworldgroup.com";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  $$("[data-wa]").forEach((a) => { a.href = waLink(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });

  // ---- Nav ----
  const nav = $(".nav"), burger = $("#burger"), links = $("#navLinks");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  const closeMenu = () => { links.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); };
  burger.addEventListener("click", () => {
    links.style.setProperty("--nav-bottom", `${nav.getBoundingClientRect().bottom}px`);
    const open = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });
  $$("a", links).forEach((a) => a.addEventListener("click", closeMenu));
  window.addEventListener("scroll", () => { if (links.classList.contains("open")) closeMenu(); }, { passive: true });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  const navMap = new Map($$("a:not(.btn)", links).map((a) => [a.getAttribute("href").slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navMap.forEach((a) => a.classList.remove("active"));
      navMap.get(en.target.id)?.classList.add("active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  navMap.forEach((_, id) => { const el = document.getElementById(id); if (el) spy.observe(el); });

  // ---- Quote form ----
  const form = $("#quoteForm"), err = $("#formError"), select = $("#serviceSelect");

  // Open the quote form with a service (and optional details) already filled in
  const openQuote = (service, extra = {}) => {
    if (service) {
      const opt = [...select.options].find((o) => o.text === service || o.value === service);
      if (opt) select.value = opt.value;
      select.removeAttribute("aria-invalid");
    }
    if (extra.size) $("#sizeInput").value = extra.size;
    if (extra.details) $("#detailsInput").value = extra.details;
    $("#quote").scrollIntoView({ behavior: "smooth" });
    form.classList.remove("flash"); void form.offsetWidth; form.classList.add("flash");
    setTimeout(() => $('[name="name"]', form).focus({ preventScroll: true }), 600);
  };
  $$("[data-service]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault(); openQuote(a.dataset.service);
  }));

  const collect = () => {
    const d = Object.fromEntries(new FormData(form));
    const missing = ["name", "phone", "service"].filter((k) => !String(d[k] || "").trim());
    $$("[required]", form).forEach((el) => el.setAttribute("aria-invalid", String(missing.includes(el.name))));
    if (missing.length) {
      err.textContent = "Please add your name, phone number and the service you need.";
      $(`[name="${missing[0]}"]`, form).focus();
      return null;
    }
    err.textContent = "";
    const text = [
      "Hi Graphic World, I'd like to request a quote.",
      `• Name: ${d.name}`,
      d.company && `• Company: ${d.company}`,
      `• Phone: ${d.phone}`,
      `• Service: ${d.service}`,
      d.size && `• Size / quantity: ${d.size}`,
      d.date && `• Needed by: ${d.date}`,
      d.details && `• Details: ${d.details}`,
    ].filter(Boolean).join("\n");
    return { d, text };
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const r = collect(); if (r) window.open(waLink(r.text), "_blank", "noopener");
  });
  $("#emailQuote").addEventListener("click", () => {
    const r = collect(); if (!r) return;
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Quote request: " + r.d.service)}&body=${encodeURIComponent(r.text)}`;
  });
  $$("[required]", form).forEach((el) => el.addEventListener("input", () => el.removeAttribute("aria-invalid")));

  // ---- Services: image and text slide in toward each other as you scroll ----
  // Each text block and image is tracked on its own, so on phones (where the
  // image sits under the text) the image still slides in as it reaches the screen.
  const movers = $$(".srv-text, .srv-media");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (movers.length && !still.matches) {
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      movers.forEach((el) => {
        // the slide is horizontal only, so the vertical position is unaffected
        const top = el.getBoundingClientRect().top;
        // starts when the element's top reaches 95% of the screen, finishes at 45%
        const t = Math.min(1, Math.max(0, (vh * 0.95 - top) / (vh * 0.5)));
        el.style.setProperty("--p", ease(t).toFixed(3));
      });
    };
    const onMove = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onMove, { passive: true });
    window.addEventListener("resize", onMove);
    update();
  }

})();
