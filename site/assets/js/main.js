/* ==========================================================================
   Manhattan Grapple Club — progressive enhancement only.

   Every fact on every page renders without JavaScript. This file adds four
   conveniences and nothing load-bearing:
     1. Marks the next upcoming class in the schedule.
     2. Shows/hides the sticky mobile CTA.
     3. Adds a scroll reveal, self-healing so content is never trapped hidden.
     4. Escape / outside-tap / close-on-navigate for the mobile menu.

   Shared by all four pages (index, first-class, standards, contact). Every
   function no-ops when the elements it enhances are absent from that page.
   ========================================================================== */
(function () {
  'use strict';

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduceMotion = motionQuery.matches;

  // Respond if the user flips the OS setting mid-session rather than waiting for a reload.
  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', function (e) {
      reduceMotion = e.matches;
      if (reduceMotion) {
        document.documentElement.classList.remove('js-reveal');
      }
    });
  }

  /* ----------------------------------------------------------------------
     1. Next class marker
     The schedule renders in full regardless; this only adds emphasis.
     data-day uses JS day numbering: 0 = Sunday ... 6 = Saturday.
     ---------------------------------------------------------------------- */
  function markNextClass() {
    // Rest days carry data-day so the week renders complete, but they can never be "next".
    var rows = Array.prototype.slice.call(
      document.querySelectorAll('.day[data-day]:not(.day-rest)')
    );
    if (!rows.length) return;

    var now = new Date();
    var nowDay = now.getDay();
    var nowMins = now.getHours() * 60 + now.getMinutes();

    // Start time per weekday, in minutes from midnight. Weeknights 7:00pm, Sunday 9:30am.
    var startMins = { 0: 9 * 60 + 30, 1: 19 * 60, 2: 19 * 60, 3: 19 * 60, 4: 19 * 60 };

    var CLASS_LENGTH = 90; // minutes — assumed; the club has not published end times

    var best = null;
    var bestDelta = Infinity;
    var onNow = null;

    rows.forEach(function (row) {
      var day = parseInt(row.getAttribute('data-day'), 10);
      if (isNaN(day) || !(day in startMins)) return;

      var start = startMins[day];

      // A class happening right now is the single most useful thing we can say to
      // someone checking from the parking lot at 7:15pm.
      if (day === nowDay && nowMins >= start && nowMins < start + CLASS_LENGTH) {
        onNow = row;
      }

      // Days until this class next occurs, then minutes until it starts.
      var dayDelta = (day - nowDay + 7) % 7;
      if (dayDelta === 0 && nowMins > start) dayDelta = 7; // today's class already started
      var delta = dayDelta * 1440 + (start - nowMins);

      if (delta < bestDelta) { bestDelta = delta; best = row; }
    });

    var target = onNow || best;
    if (!target) return;

    target.classList.add('is-next');

    // mirror the mark onto the glance strip so both views agree
    var glance = document.querySelector(
      '.week-glance li[data-day="' + target.getAttribute('data-day') + '"]'
    );
    if (glance) glance.classList.add('is-next');

    // The text label is what carries the meaning — colour alone is never the signal.
    // In this direction it sits inside the day's gold header bar, not in the body.
    var head = target.querySelector('.day-name');
    if (head && !head.querySelector('.next-pill')) {
      var pill = document.createElement('span');
      pill.className = 'next-pill';
      pill.textContent = onNow ? 'On now' : 'Next';
      head.appendChild(pill);
    }
  }

  /* ----------------------------------------------------------------------
     2. Sticky mobile CTA
     Appears once the hero has scrolled away, hides again when the footer CTA
     is on screen so the two never compete.
     ---------------------------------------------------------------------- */
  function stickyCta() {
    var bar = document.getElementById('stickyCta');
    // Home has the photo hero; subpages have a compact .pagehead. Either is the
    // "top of page" region the bar waits to clear.
    var hero = document.querySelector('.hero, .pagehead');
    var finalCta = document.getElementById('join');
    if (!bar || !hero) return;

    if (!('IntersectionObserver' in window)) return; // bar stays hidden; header CTA still works

    bar.hidden = false;

    // Suppress the entrance transition for the first frame, so a reload with scroll
    // restoration (or a #pricing deep link) doesn't play an unprompted 260ms slide.
    bar.classList.add('no-anim');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { bar.classList.remove('no-anim'); });
    });

    var heroVisible = true;
    var finalVisible = false;

    // No width check here — CSS already does `display: none !important` at 1025px.
    // Duplicating the breakpoint in JS disagreed with the media query at exactly
    // the breakpoint, because innerWidth includes the scrollbar and the media query does not.
    function update() {
      bar.classList.toggle('is-visible', !heroVisible && !finalVisible);
    }

    var headerH = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--header-h'), 10) || 68;

    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      update();
    }, { rootMargin: '-' + headerH + 'px 0px 0px 0px' }).observe(hero);

    if (finalCta) {
      new IntersectionObserver(function (entries) {
        finalVisible = entries[0].isIntersecting;
        update();
      }).observe(finalCta);
    }

    update();
  }

  /* ----------------------------------------------------------------------
     3. Scroll reveal
     Content is visible by default in CSS. We only opt in to hiding it after
     confirming IntersectionObserver exists, so a failure can never leave the
     page blank. Skipped entirely under reduced-motion.
     ---------------------------------------------------------------------- */
  function scrollReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    // .feature-inner is deliberately NOT a target: #womens nests its own eyebrow and h2
    // inside it, so both would fade at once — opacities multiply and that one section
    // ends up fading differently from every other.
    // Headings live inside .secthead. Subpage components (.reach, .navcards) included.
    var targets = document.querySelectorAll(
      '.section > .wrap > .secthead, .section > .wrap > .section-lede,' +
      '.week, .cards, .steps, .standards-grid, .faq, .location-grid, .reach, .navcards'
    );
    if (!targets.length) return;

    document.documentElement.classList.add('js-reveal');
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('reveal'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    // Fire as soon as any part enters, with no negative bottom margin. A visitor
    // thumb-flicking down the page must never catch a section mid-fade.
    }, { rootMargin: '0px 0px 0px 0px', threshold: 0 });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });

    // Safety net only for a genuinely broken observer — long enough that it can't
    // pre-empt the real reveal, and it disconnects so the effect isn't silently
    // switched off for everything the user has not scrolled to yet.
    window.setTimeout(function () {
      var stuck = document.querySelectorAll('.reveal:not(.is-in)');
      if (stuck.length === targets.length) { // nothing ever revealed => observer failed
        io.disconnect();
        Array.prototype.forEach.call(stuck, function (el) { el.classList.add('is-in'); });
      }
    }, 2500);
  }

  /* ----------------------------------------------------------------------
     4. Mobile menu enhancements
     The <details> element already opens, closes and takes keyboard focus on its
     own. This only adds the three behaviours it has no native answer for.
     ---------------------------------------------------------------------- */
  function mobileMenu() {
    var menu = document.getElementById('menu');
    if (!menu) return;

    function close() {
      if (!menu.open) return;
      menu.open = false;
      var btn = menu.querySelector('summary');
      if (btn) btn.focus();
    }

    // Escape closes and returns focus to the button.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.open) close();
    });

    // A tap outside the panel closes it.
    document.addEventListener('click', function (e) {
      if (menu.open && !menu.contains(e.target)) menu.open = false;
    });

    // Navigating to a section closes it, so the panel isn't left covering
    // the very content it just jumped to.
    menu.querySelectorAll('.menu-panel a').forEach(function (a) {
      a.addEventListener('click', function () { menu.open = false; });
    });
  }

  markNextClass();
  stickyCta();
  scrollReveal();
  mobileMenu();
})();
