/* Section navigator shared by all four pages.
   - Highlights every section heading (numbered badge / accent bar).
   - Adds a sticky "Jump to" bar: one chip per section, live scroll-spy, and a search box.
   - When a page is shown inside the hub (index.html) the page's own top menu is hidden. */
(function () {
  "use strict";
  var framed = window.parent !== window;
  var root = document.documentElement;
  if (framed) root.classList.add("framed");

  var css = [
    ".framed .top nav{display:none}",
    ".framed .chapnav{display:none!important}",
    ".chapnav{display:none!important}",
    "main{counter-reset:sn}",
    "main .card{counter-increment:sn;border-top:3px solid var(--accent,#1c5cab);scroll-margin-top:var(--sn-off,110px)}",
    "main .card>h2{display:flex;align-items:center;gap:9px;font-size:16px;line-height:1.3}",
    "main .card>h2::before{content:counter(sn);flex:none;display:inline-grid;place-items:center;min-width:24px;height:24px;border-radius:50%;background:var(--accent,#1c5cab);color:#fff;font-size:12px;font-weight:700}",
    "main .chap{scroll-margin-top:var(--sn-off,60px)}",
    ".chap .kick{display:inline-block;background:var(--accent,#1c5cab);color:#fff!important;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase}",
    ".chap .hd{border-left:5px solid var(--accent,#1c5cab);padding-left:14px}",
    ".sn-current.card{box-shadow:0 0 0 2px var(--accent,#1c5cab)}",
    ".sn-current.chap .hd{border-left-color:var(--s2,#eb6834)}",
    ".sn-hit>h2,.sn-hit .hd{background:#fff2a8;color:#111;border-radius:6px}",
    ".sn-miss{opacity:.35}",
    ".sn-flash{animation:snflash 1.3s ease-out}",
    "@keyframes snflash{0%{box-shadow:0 0 0 4px var(--s4,#eda100)}100%{box-shadow:0 0 0 0 transparent}}",
    "#secnav{position:sticky;top:var(--sn-top,0px);z-index:19;background:var(--page,#f9f9f7);border-bottom:1px solid var(--grid,#e1e0d9);box-shadow:0 2px 6px rgba(0,0,0,.05)}",
    "#secnav .sn-row{display:flex;align-items:center;gap:10px;padding:8px 24px}",
    "#secnav .sn-label{flex:none;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted,#6f6e68)}",
    "#secnav .sn-chips{flex:1;display:flex;gap:6px;overflow-x:auto;scrollbar-width:thin;padding:2px 0}",
    "#secnav .sn-chip{flex:none;display:flex;align-items:center;gap:6px;max-width:260px;padding:5px 11px;border-radius:999px;border:1px solid var(--grid,#e1e0d9);background:var(--surface,#fcfcfb);color:var(--ink2,#52514e);font:inherit;font-size:13px;cursor:pointer;white-space:nowrap}",
    "#secnav .sn-chip b{flex:none;display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;background:var(--wash,#ecebe6);color:var(--ink,#0b0b0b);font-size:11px}",
    "#secnav .sn-chip span{overflow:hidden;text-overflow:ellipsis}",
    "#secnav .sn-chip:hover{border-color:var(--accent,#1c5cab);color:var(--ink,#0b0b0b)}",
    "#secnav .sn-chip.on{background:var(--accent,#1c5cab);border-color:var(--accent,#1c5cab);color:#fff}",
    "#secnav .sn-chip.on b{background:rgba(255,255,255,.28);color:#fff}",
    "#secnav .sn-chip.sn-off{display:none}",
    "#secnav .sn-search{flex:none;width:190px;padding:6px 10px;border:1px solid var(--axis,#c3c2b7);border-radius:8px;background:var(--surface,#fcfcfb);color:var(--ink,#0b0b0b);font:inherit;font-size:13px}",
    "#secnav .sn-count{flex:none;font-size:12px;color:var(--muted,#6f6e68);min-width:54px}",
    "@media (max-width:860px){#secnav .sn-row{flex-wrap:wrap;padding:8px 14px}#secnav .sn-chips{flex-basis:100%;order:3}#secnav .sn-search{flex:1;width:auto}}",
    ".sn-ftoggle,.sn-dltoggle{display:none}",
    "@media (max-width:860px){",
    "  .sn-ftoggle,.sn-dltoggle{display:flex;align-items:center;justify-content:space-between;width:calc(100% - 32px);margin:8px 16px 0;padding:9px 12px;border:1px solid var(--axis,#c3c2b7);border-radius:8px;background:var(--surface,#fcfcfb);color:var(--ink,#0b0b0b);font:inherit;font-size:14px;font-weight:600;cursor:pointer}",
    "  .sn-ftoggle b{color:var(--accent,#1c5cab)}",
    "  .filters:not(.fopen) .filter-row{display:none}",
    "  .dl.sn-dlc:not(.dlopen){display:none}",
    "  .dl.sn-dlc{margin-top:6px}",
    "  .top .sub{font-size:12px}",
    "}",
    "@media print{#secnav{display:none}}"
  ].join("\n");
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  var main = document.querySelector("main");
  if (!main) return;

  var bar = document.createElement("div");
  bar.id = "secnav";
  bar.setAttribute("role", "navigation");
  bar.setAttribute("aria-label", "Sections on this page");
  bar.innerHTML = '<div class="sn-row"><span class="sn-label">Jump to</span><div class="sn-chips"></div>' +
    '<span class="sn-count" aria-live="polite"></span>' +
    '<input class="sn-search" type="search" placeholder="Search sections…" aria-label="Search sections"></div>';
  main.parentNode.insertBefore(bar, main);
  var chipsEl = bar.querySelector(".sn-chips");
  var search = bar.querySelector(".sn-search");
  var countEl = bar.querySelector(".sn-count");

  var items = [];
  var sig = "";

  function txt(el) { return (el && el.textContent || "").replace(/\s+/g, " ").trim(); }

  function collect() {
    var secs = Array.prototype.slice.call(main.querySelectorAll("section.chap"));
    var story = secs.length > 0;
    if (!story) secs = Array.prototype.slice.call(main.querySelectorAll("section.card"));
    return secs.map(function (el, i) {
      var h = el.querySelector(story ? "h2.hd" : "h2");
      var label = story ? (el.getAttribute("data-title") || txt(el.querySelector(".kick"))) : txt(h);
      var q = el.querySelector(".q, .plain");
      if (!el.id) el.id = "sec-" + (i + 1);
      return { el: el, id: el.id, label: label, heading: txt(h), search: (label + " " + txt(h) + " " + txt(q)).toLowerCase() };
    });
  }

  function build() {
    var next = collect();
    var s = next.map(function (x) { return x.id + "|" + x.heading; }).join("~");
    if (s === sig) return;
    sig = s; items = next;
    chipsEl.innerHTML = "";
    items.forEach(function (it, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "sn-chip"; b.title = it.heading;
      b.innerHTML = "<b>" + (i + 1) + "</b><span></span>";
      b.lastChild.textContent = it.label;
      b.addEventListener("click", function () { go(it); });
      it.chip = b; chipsEl.appendChild(b);
    });
    bar.style.display = items.length ? "" : "none";
    applySearch(); spy();
  }

  function offset() {
    var o = bar.offsetHeight + (parseFloat(getComputedStyle(root).getPropertyValue("--sn-top")) || 0);
    root.style.setProperty("--sn-off", o + 10 + "px");
    return o;
  }

  function go(it) {
    var off = offset(), y = it.el.getBoundingClientRect().top + window.pageYOffset - off - 6;
    y = Math.max(0, y);
    var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: y, behavior: calm ? "auto" : "smooth" });
    /* If the smooth scroll did not get there (some browsers and embedded panes drop it), jump. */
    setTimeout(function () {
      var fix = it.el.getBoundingClientRect().top - offset() - 6;
      if (Math.abs(fix) > 6) window.scrollTo(0, Math.max(0, window.pageYOffset + fix));
    }, 700);
    it.el.classList.add("sn-flash");
    setTimeout(function () { it.el.classList.remove("sn-flash"); }, 1400);
    if (history.replaceState) { try { history.replaceState(null, "", "#" + it.id); } catch (e) { /* framed or blocked */ } }
  }

  var cur = null;
  function spy() {
    if (!items.length) return;
    var line = offset() + 24, pick = items[0], best = -1e9;
    for (var i = 0; i < items.length; i++) {
      var t = items[i].el.getBoundingClientRect().top;
      /* cards sitting side by side share a top: the first of them wins */
      if (t <= line && t > best + 4) { best = t; pick = items[i]; }
    }
    if (pick === cur) return;
    if (cur) { cur.chip.classList.remove("on"); cur.el.classList.remove("sn-current"); }
    cur = pick;
    cur.chip.classList.add("on"); cur.el.classList.add("sn-current");
    var c = cur.chip, box = chipsEl;
    box.scrollTo({ left: c.offsetLeft - box.clientWidth / 2 + c.offsetWidth / 2, behavior: "smooth" });
  }

  function applySearch() {
    var q = search.value.trim().toLowerCase(), hits = 0;
    items.forEach(function (it) {
      var hit = !q || it.search.indexOf(q) !== -1 || txt(it.el).toLowerCase().indexOf(q) !== -1;
      if (hit) hits++;
      it.chip.classList.toggle("sn-off", !hit);
      it.el.classList.toggle("sn-hit", !!q && hit);
      it.el.classList.toggle("sn-miss", !!q && !hit);
    });
    countEl.textContent = q ? hits + " of " + items.length : "";
  }

  search.addEventListener("input", applySearch);
  search.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var first = items.filter(function (it) { return !it.chip.classList.contains("sn-off"); })[0];
      if (first) go(first);
    } else if (e.key === "Escape") { search.value = ""; applySearch(); search.blur(); }
  });

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return; ticking = true;
    var done = function () { if (!ticking) return; ticking = false; spy(); };
    requestAnimationFrame(done); setTimeout(done, 120);
  }, { passive: true });
  window.addEventListener("resize", function () { stackUnderFilters(); spy(); });

  /* Explorer pages have a sticky filter bar; sit just below it. */
  function stackUnderFilters() {
    var f = document.querySelector(".filters");
    var sticky = f && getComputedStyle(f).position === "sticky" && !f.closest("details");
    root.style.setProperty("--sn-top", sticky ? f.offsetHeight + "px" : "0px");
    offset();
  }
  if (window.ResizeObserver) {
    var f0 = document.querySelector(".filters");
    if (f0) new ResizeObserver(stackUnderFilters).observe(f0);
  }

  /* Story chapters are drawn by script and redrawn when filters change. */
  var t = null;
  new MutationObserver(function () { clearTimeout(t); t = setTimeout(build, 60); }).observe(main, { childList: true });

  /* Phones: collapse the filter buttons and the data-source bar behind one-tap toggles. */
  var filters = document.querySelector(".filters");
  if (filters && !filters.closest("details")) {
    var ft = document.createElement("button");
    ft.type = "button"; ft.className = "sn-ftoggle";
    filters.parentNode.insertBefore(ft, filters);
    var paintF = function () {
      var n = filters.querySelectorAll(".chip").length, open = filters.classList.contains("fopen");
      ft.innerHTML = "<span>Filters" + (n ? " <b>(" + n + " active)</b>" : "") + "</span><span>" + (open ? "Hide ▴" : "Show ▾") + "</span>";
      ft.setAttribute("aria-expanded", String(open));
    };
    ft.addEventListener("click", function () { filters.classList.toggle("fopen"); paintF(); });
    new MutationObserver(paintF).observe(filters, { childList: true, subtree: true });
    paintF();
  }
  var dl = document.getElementById("dl");
  if (dl && !document.body.classList.contains("story")) {
    dl.classList.add("sn-dlc");
    var dt = document.createElement("button");
    dt.type = "button"; dt.className = "sn-dltoggle";
    dl.parentNode.insertBefore(dt, dl);
    var paintD = function () {
      var open = dl.classList.contains("dlopen");
      dt.innerHTML = "<span>Data source</span><span>" + (open ? "Hide ▴" : "Show ▾") + "</span>";
      dt.setAttribute("aria-expanded", String(open));
    };
    dt.addEventListener("click", function () { dl.classList.toggle("dlopen"); paintD(); });
    paintD();
  }

  /* "What this selection says": show the headline, fold the rest behind a toggle. */
  var read = document.getElementById("read");
  if (read) {
    var fixRead = function () {
      var lis = read.querySelectorAll("ul li"), btn = read.querySelector(".rd-more");
      if (lis.length < 2) { if (btn) btn.remove(); read.classList.remove("rd-collapsed"); return; }
      if (!btn) {
        btn = document.createElement("button"); btn.type = "button"; btn.className = "rd-more";
        read.appendChild(btn);
        read.classList.toggle("rd-collapsed", read.dataset.open !== "1");
      }
      var open = read.dataset.open === "1";
      read.classList.toggle("rd-collapsed", !open);
      btn.textContent = open ? "Show less ▴" : "Show " + (lis.length - 1) + " more ▾";
    };
    read.addEventListener("click", function (e) {
      if (e.target.classList.contains("rd-more")) { read.dataset.open = read.dataset.open === "1" ? "0" : "1"; fixRead(); }
    });
    new MutationObserver(function () { fixRead(); }).observe(read, { childList: true });
    fixRead();
  }

  stackUnderFilters();
  build();
  setTimeout(function () { stackUnderFilters(); build(); }, 800);
})();
