/* =========================================================
   Hadil Ben Rhouma — Portfolio
   Langue (FR/EN), navigation, animations, carrousel, formulaire
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. Bilingue FR / EN
     Chaque texte porte data-en / data-fr (ou -html pour du
     balisage, -ph pour un placeholder). Le choix est mémorisé.
     --------------------------------------------------------- */
  var STORAGE_KEY = "hbr-lang";
  var DEFAULT_LANG = "en";

  function readLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "fr" || saved === "en") return saved;
    } catch (e) { /* navigation privée : on garde la valeur par défaut */ }
    return (navigator.language || "").toLowerCase().indexOf("fr") === 0 ? "fr" : DEFAULT_LANG;
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-" + lang + "]").forEach(function (el) {
      el.textContent = el.getAttribute("data-" + lang);
    });
    document.querySelectorAll("[data-" + lang + "-html]").forEach(function (el) {
      el.innerHTML = el.getAttribute("data-" + lang + "-html");
    });
    document.querySelectorAll("[data-ph-" + lang + "]").forEach(function (el) {
      el.setAttribute("placeholder", el.getAttribute("data-ph-" + lang));
    });
    document.querySelectorAll("[data-title-" + lang + "]").forEach(function (el) {
      el.setAttribute("title", el.getAttribute("data-title-" + lang));
      el.setAttribute("aria-label", el.getAttribute("data-title-" + lang));
    });

    document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* rien à mémoriser */ }
  }

  applyLang(readLang());

  document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
    btn.addEventListener("click", function () { applyLang(btn.dataset.lang); });
  });

  /* ---------------------------------------------------------
     2. Lien de navigation actif
     --------------------------------------------------------- */
  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a, .nav-mobile a").forEach(function (a) {
    var href = (a.getAttribute("href") || "").toLowerCase();
    if (href === page || (page === "" && href === "index.html")) a.classList.add("active");
  });

  /* ---------------------------------------------------------
     3. Menu mobile
     --------------------------------------------------------- */
  var burger = document.querySelector(".burger");
  var mobile = document.querySelector(".nav-mobile");
  if (burger && mobile) {
    // Le libellé suit l'état du menu ; data-title-* est relu par applyLang
    // si la langue change pendant que le menu est ouvert.
    var setMenu = function (open) {
      mobile.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("data-title-en", open ? "Close menu" : "Open menu");
      burger.setAttribute("data-title-fr", open ? "Fermer le menu" : "Ouvrir le menu");
      var label = burger.getAttribute("data-title-" + document.documentElement.lang);
      burger.setAttribute("title", label);
      burger.setAttribute("aria-label", label);
    };
    burger.addEventListener("click", function () {
      setMenu(!mobile.classList.contains("open"));
    });
    window.addEventListener("scroll", function () {
      if (mobile.classList.contains("open")) setMenu(false);
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     4. Apparition au défilement + remplissage des barres
     --------------------------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        entry.target.querySelectorAll(".bar i").forEach(function (fill) {
          fill.style.width = (fill.dataset.level || "0") + "%";
        });
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 90 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll(".bar i").forEach(function (fill) {
      fill.style.width = (fill.dataset.level || "0") + "%";
    });
  }

  /* ---------------------------------------------------------
     5. Compteurs de statistiques
     --------------------------------------------------------- */
  document.querySelectorAll(".stat .num[data-count]").forEach(function (node) {
    var target = parseInt(node.dataset.count, 10) || 0;
    var suffix = node.dataset.suffix || "";
    var started = false;

    function run() {
      if (started) return;
      started = true;
      var start = performance.now();
      var duration = 1400;
      (function step(now) {
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        node.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    }

    if ("IntersectionObserver" in window) {
      var so = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { run(); so.disconnect(); }
      }, { threshold: 0.4 });
      so.observe(node);
    } else {
      run();
    }
  });

  /* ---------------------------------------------------------
     6. Carrousel de projets
     --------------------------------------------------------- */
  document.querySelectorAll(".carousel").forEach(function (carousel) {
    var track = carousel.querySelector(".track");
    var prev = carousel.querySelector("[data-car='prev']");
    var next = carousel.querySelector("[data-car='next']");
    if (!track) return;

    function stride() {
      var first = track.firstElementChild;
      if (!first) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap || "22") || 22;
      return first.getBoundingClientRect().width + gap;
    }

    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -stride(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: stride(), behavior: "smooth" }); });
  });

  /* ---------------------------------------------------------
     7. Formulaire de contact
     Site statique : on ouvre WhatsApp avec le message
     pré-rempli, sans envoyer quoi que ce soit en arrière-plan.
     --------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var lang = document.documentElement.lang === "fr" ? "fr" : "en";
      // form.elements : form.name renverrait l'attribut name du formulaire,
      // pas le champ qui porte ce nom.
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();

      var text = (lang === "fr"
        ? "Bonjour Hadil, je vous contacte depuis votre portfolio.\n\nNom : " + name + "\nEmail : " + email + "\n\n" + message
        : "Hi Hadil, I'm reaching out from your portfolio.\n\nName: " + name + "\nEmail: " + email + "\n\n" + message);

      // wa.me ouvre WhatsApp (appli sur mobile, WhatsApp Web sur ordinateur)
      // avec le message pré-rempli vers le numéro indiqué.
      window.open("https://wa.me/21626434087?text=" + encodeURIComponent(text), "_blank", "noopener");

      var note = document.getElementById("form-note");
      if (note) {
        note.classList.add("show");
        setTimeout(function () { note.classList.remove("show"); }, 6000);
      }
    });
  }

  /* ---------------------------------------------------------
     8. Année du pied de page
     --------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
