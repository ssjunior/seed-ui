document.addEventListener("DOMContentLoaded", function () {
  // Accordion toggle (Tomato CSS uses .accordion-trigger)
  document.querySelectorAll(".accordion-trigger").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
    });
  });

  // Also support Seed's old .accordion-header class
  document.querySelectorAll(".accordion-header").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
    });
  });

  // FAQ toggle
  document.querySelectorAll(".faq-question").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var open = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", open ? "false" : "true");
    });
  });

  // Tabs
  document.querySelectorAll("[data-tabs]").forEach(function(root) {
    var items = root.querySelectorAll("[data-tabs-group] button");
    var panels = root.querySelectorAll("[data-tabs-panel]");
    function activate(i) {
      items.forEach(function(btn, j) { btn.dataset.active = i === j ? "true" : ""; });
      panels.forEach(function(p, j) { p.hidden = i !== j; });
    }
    items.forEach(function(btn, i) { btn.addEventListener("click", function() { activate(i); }); });
    if (items.length) activate(0);
  });

  // Navbar mobile toggle
  document.querySelectorAll(".navbar-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var navbar = btn.closest(".navbar");
      if (navbar) navbar.classList.toggle("open");
    });
  });

  // Nav sticky scroll — shrink + shadow on scroll
  document.querySelectorAll("nav.seed-nav").forEach(function (nav) {
    function updateNav() {
      var scrolled = window.scrollY > 20;
      nav.classList.toggle("shadow-xl", scrolled);
      nav.classList.toggle("bg-white", !scrolled);
      nav.classList.toggle("bg-white/80", scrolled);
      var inner = nav.querySelector(".seed-nav-inner");
      if (inner) {
        inner.classList.toggle("h-20", !scrolled);
        inner.classList.toggle("h-14", scrolled);
      }
    }
    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });
  });

  // Nav component — dropdown + mobile
  document.querySelectorAll("nav").forEach(function (nav) {
    // Move href from wrapper div to inner <a> for nav items and subitems
    nav
      .querySelectorAll(
        "[href] > .seed-nav-item, [href] > .seed-nav-dropdown a",
      )
      .forEach(function (a) {
        var wrapper = a.closest("[href]");
        if (wrapper && wrapper !== a) {
          a.setAttribute("href", wrapper.getAttribute("href"));
          wrapper.removeAttribute("href");
        }
      });

    // Mark active links now that hrefs are in place
    updateActiveLinks();

    // Mark parent nav item active if an active subitem is inside its dropdown
    nav
      .querySelectorAll(".relative a[data-active]")
      .forEach(function (a) {
        var parentItem = a.closest(".relative");
        if (parentItem) {
          var parentLink = parentItem.querySelector(".seed-nav-item");
          if (parentLink && parentLink !== a) parentLink.setAttribute("data-active", "");
        }
      });

    var burger = nav.querySelector(".seed-nav-burger");
    var mobile = nav.querySelector(".seed-nav-mobile");

    // Mobile burger toggle
    if (burger && mobile) {
      burger.addEventListener("click", function (e) {
        e.stopPropagation();
        var isHidden = mobile.classList.contains("hidden");
        mobile.classList.toggle("hidden", !isHidden);
        burger.setAttribute("aria-expanded", isHidden ? "true" : "false");
      });
    }

    // Dropdown items — desktop menu
    var desktopMenu = nav.querySelector(".seed-nav-menu");
    if (desktopMenu) {
      desktopMenu
        .querySelectorAll(".seed-nav-item")
        .forEach(function (trigger) {
          var wrapper = trigger.parentElement;
          var dropdown = wrapper && wrapper.querySelector(".seed-nav-dropdown");
          if (!dropdown) return;

          // Add chevron indicator
          trigger.insertAdjacentHTML(
            "beforeend",
            '<svg style="width:12px;height:12px;margin-left:2px;display:inline-block;vertical-align:middle;transition:transform .2s" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>',
          );

          trigger.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var isOpen = !dropdown.classList.contains("hidden");
            desktopMenu
              .querySelectorAll(".seed-nav-dropdown")
              .forEach(function (d) {
                d.classList.add("hidden");
              });
            if (!isOpen) {
              dropdown.classList.remove("hidden");
            }
          });
        });
    }

    // Dropdown items — mobile panel (accordion style)
    var mobilePanel = nav.querySelector(".seed-nav-mobile");
    if (mobilePanel) {
      mobilePanel
        .querySelectorAll(".seed-nav-item")
        .forEach(function (trigger) {
          var wrapper = trigger.parentElement;
          var dropdown = wrapper && wrapper.querySelector(".seed-nav-dropdown");
          if (!dropdown) return;

          // Override absolute positioning for mobile accordion
          dropdown.style.position = "static";
          dropdown.style.boxShadow = "none";
          dropdown.style.border = "none";
          dropdown.style.paddingTop = "0";
          dropdown.style.marginLeft = "0.75rem";
          dropdown.style.marginTop = "0.25rem";

          // Add chevron indicator
          trigger.insertAdjacentHTML(
            "beforeend",
            '<svg class="seed-nav-chevron" style="width:12px;height:12px;margin-left:2px;display:inline-block;vertical-align:middle;transition:transform .2s" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>',
          );

          trigger.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var isOpen = !dropdown.classList.contains("hidden");
            dropdown.classList.toggle("hidden", isOpen);
            var chevron = trigger.querySelector(".seed-nav-chevron");
            if (chevron)
              chevron.style.transform = isOpen ? "" : "rotate(180deg)";
          });
        });
    }
  });

  // Close desktop dropdowns on outside click (not mobile)
  document.addEventListener("click", function () {
    var desktopDropdowns = document.querySelectorAll(
      ".seed-nav-menu .seed-nav-dropdown",
    );
    desktopDropdowns.forEach(function (d) {
      d.classList.add("hidden");
    });
  });

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    console.log("ACHOU", el);
    revealObserver.observe(el);
  });

});

// Generic active link — adds/removes 'data-active' attribute on any <a> whose href
// matches the current URL exactly.
function updateActiveLinks() {
  var current = window.location.pathname;
  document.querySelectorAll("a[href]").forEach(function (a) {
    var path = a.getAttribute("href");
    path && current === path
      ? a.setAttribute("data-active", "")
      : a.removeAttribute("data-active");
  });
}
document.addEventListener("DOMContentLoaded", updateActiveLinks);
window.addEventListener("hashchange", updateActiveLinks);
window.addEventListener("popstate", updateActiveLinks);
