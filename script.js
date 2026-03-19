/* =============================================
   PORTFOLIO SCRIPTS
   Smooth scroll · Typing effect · AOS init
   Navbar behaviour · Back-to-top · Form UX
   ============================================= */

/* ---------- LOADING SCREEN ---------- */
(function () {
  const loader = document.getElementById("loader");
  const bar = document.getElementById("loaderBar");
  const body = document.body;
  let progress = 0;
  let fakeTimer;

  body.classList.add("loading");

  // Gradually animate the bar to ~90% while assets load
  fakeTimer = setInterval(() => {
    if (progress < 90) {
      progress += Math.random() * 8;
      progress = Math.min(progress, 90);
      bar.style.width = progress + "%";
    }
  }, 200);

  // When everything (images, fonts, CSS) is fully loaded
  window.addEventListener("load", () => {
    clearInterval(fakeTimer);
    bar.style.width = "100%";

    // Small pause so the user sees the bar hit 100%
    setTimeout(() => {
      loader.classList.add("hidden");
      body.classList.remove("loading");
    }, 500);
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Dark / Light Mode Toggle ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  function applyTheme(mode) {
    if (mode === "light") {
      document.body.classList.add("light-mode");
      themeIcon.className = "bi bi-sun-fill";
    } else {
      document.body.classList.remove("light-mode");
      themeIcon.className = "bi bi-moon-stars-fill";
    }
  }

  // Always start in dark mode on fresh page load
  applyTheme("dark");

  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-mode");
    const newMode = isLight ? "dark" : "light";
    applyTheme(newMode);
    localStorage.setItem("theme", newMode);
  });

  /* ---------- AOS (Animate On Scroll) ---------- */
  AOS.init({
    duration: 700,
    easing: "ease-out-cubic",
    once: true,
    offset: 80,
  });

  /* ---------- Navbar shrink on scroll ---------- */
  const navbar = document.querySelector(".navbar");
  const backToTop = document.getElementById("backToTop");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar .nav-link");

  function onScroll() {
    const scrollY = window.scrollY;

    // Shrink navbar
    navbar.classList.toggle("scrolled", scrollY > 60);

    // Back-to-top visibility
    backToTop.classList.toggle("visible", scrollY > 400);

    // Highlight active nav link based on scroll position
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + id,
          );
        });
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load

  /* ---------- Smooth scroll for all anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });

      // Close mobile nav if open
      const navCollapse = document.getElementById("navMenu");
      if (navCollapse.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  /* ---------- Typing effect ---------- */
  const roles = [
    "Software Engineer ",
    "Full Stack Developer ",
    "AI Enthusiast ",
  ];
  const typedEl = document.getElementById("typed-output");
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 40;
  const pauseEnd = 1800;
  const pauseStart = 400;

  function typeLoop() {
    const current = roles[roleIndex];

    if (!isDeleting) {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeLoop, pauseEnd);
        return;
      }
      setTimeout(typeLoop, typeSpeed);
    } else {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeLoop, pauseStart);
        return;
      }
      setTimeout(typeLoop, deleteSpeed);
    }
  }

  typeLoop();

  /* ---------- Contact form via EmailJS (no backend) ---------- */
  // Credentials loaded from config.js (injected by GitHub Actions in CI)
  emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);

  const form = document.getElementById("contactForm");
  const btnText = form.querySelector(".btn-text");
  const btnLoader = form.querySelector(".btn-loader");
  const formMsg = document.getElementById("formMessage");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Show loading state
    btnText.classList.add("d-none");
    btnLoader.classList.remove("d-none");
    formMsg.classList.add("d-none");

    // Build timestamp in DD-MM-YYYY, Day, HH:MM (24h) format
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const timestamp =
      pad(now.getDate()) +
      "-" +
      pad(now.getMonth() + 1) +
      "-" +
      now.getFullYear() +
      ", " +
      days[now.getDay()] +
      ", " +
      pad(now.getHours()) +
      ":" +
      pad(now.getMinutes());

    // Send form data + timestamp as template parameters
    const params = {
      from_name: form.from_name.value,
      from_email: form.from_email.value,
      subject: form.subject.value,
      message: form.message.value,
      time: timestamp,
    };

    emailjs
      .send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, params)
      .then(function () {
        formMsg.textContent = "Message sent successfully!";
        formMsg.className = "form-message mt-3 success";
        formMsg.classList.remove("d-none");
        form.reset();
      })
      .catch(function () {
        formMsg.textContent = "Something went wrong. Please try again.";
        formMsg.className = "form-message mt-3 error";
        formMsg.classList.remove("d-none");
      })
      .finally(function () {
        btnText.classList.remove("d-none");
        btnLoader.classList.add("d-none");
      });
  });

  /* ---------- Parallax-lite on hero (mouse move) ---------- */
  const hero = document.getElementById("home");
  hero.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 15;
    const y = (e.clientY / window.innerHeight - 0.5) * 15;
    const img = hero.querySelector(".profile-img");
    if (img) {
      img.style.transform = `translate(${x}px, ${y}px)`;
    }
  });

  hero.addEventListener("mouseleave", () => {
    const img = hero.querySelector(".profile-img");
    if (img) img.style.transform = "translate(0, 0)";
  });

  /* ---------- Reusable Project Modal ---------- */
  // To add a new project: just push an object to this array
  // and add a card in HTML with data-project="<index>"
  const projects = [
    {
      icon: "bi-globe2",
      title: "Expense Tracker",
      image:
        "assets/projectImg/expenseTracker.png",
      tags: ["React", "Node.js", "MongoDB", "ExpressJs", "JWT"],
      codeUrl: "https://github.com/sharath778/expense-tracker",
      sections: [
        {
          icon: "bi-lightbulb",
          heading: "What was the problem?",
          text: "People pay and spend through multiple UPI apps, credit cards, and liquid cash on a daily basis. By the end of the day, month, or year, they have no clear picture of where all their money went. There was no simple, unified way to track every rupee across different payment methods—making it nearly impossible to identify wasteful spending or plan savings and investments effectively.",
        },
        {
          icon: "bi-gear",
          heading: "How did I solve it?",
          text: "I built a full-stack Expense Tracker using React, Express, and MongoDB. Users can sign up, log in to a personal account, and quickly log each expense. The app provides pictorial visualizations—charts and graphs—of their spending broken down by day, month, or year. This gives users a clear, at-a-glance view of their financial habits, helping them maximize savings and redirect money toward investments.",
        },
        {
          icon: "bi-trophy",
          heading: "What happened after shipping?",
          text: "I deployed the app and asked friends to use it and share genuine feedback. Many found it genuinely helpful—they could clearly see where they were spending unnecessarily and cut back on those expenses in the following days. Some users, however, mentioned that logging in every time and manually entering each expense was tedious; they wished for automation. Overall, several users found it beneficial for building better financial habits, while others are looking forward to future enhancements.",
        },
      ],
    },
    {
      icon: "bi-brush",
      title: "Dynamic Portfolio Builder",
      image:
        "assets/projectImg/dynamicPortfolioBuilder.png",
      tags: ["React", "Node.js", "MongoDB", "ExpressJs", "JWT"],
      codeUrl: "https://github.com/sharath778/dynamic_portfolio_web_app",
      sections: [
        {
          icon: "bi-lightbulb",
          heading: "What was the problem?",
          text: "Building a personal portfolio from scratch is time-consuming—choosing the right color palette, designing a clean structure, and actually coding it all up can take hours or even days. Most people want an instant, professional-looking portfolio but don't have the time or design skills to pull one off quickly.",
        },
        {
          icon: "bi-gear",
          heading: "How did I solve it?",
          text: "Using the MERN stack, I hand-picked trending portfolio templates and made every field dynamic based on user input. Users simply fill out a basic form with their name, skills, experience, and other details—all of which get persisted in the database. They can then choose any template they like, and the portfolio is generated instantly with their personalized content, ready to be shared wherever they want.",
        },
        {
          icon: "bi-trophy",
          heading: "What happened after shipping?",
          text: "Users gave positive reviews after trying it out and requested more template options. They appreciated the ability to share a public link for use on resumes, social profiles, and job applications. Several users also suggested adding profession-based templates so the design and layout could better match their field.",
        },
      ],
    },
    {
      icon: "bi-chat-dots",
      title: "Live Chat App",
      image:
        "assets/projectImg/liveChatApp.png",
      tags: ["React", "Node.js", "MongoDB", "ExpressJs", "JWT", "WebSockets"],
      codeUrl: "https://github.com/sharath778/LiveChatApp-MERN-",
      sections: [
        {
          icon: "bi-lightbulb",
          heading: "What was the problem?",
          text: "Users needed a way to chat in real time without experiencing lag in sending or receiving messages. Existing solutions often had noticeable delays, making conversations feel sluggish and unreliable—especially when trying to see whether someone was actively online.",
        },
        {
          icon: "bi-gear",
          heading: "How did I solve it?",
          text: "I used WebSockets to enable real-time, bi-directional communication between users. The app shows live active status so you always know who's online, and messages are delivered and displayed instantly without polling or page refreshes—creating a smooth, lag-free chat experience.",
        },
        {
          icon: "bi-trophy",
          heading: "What happened after shipping?",
          text: "Users appreciated the smooth, delay-free chat experience and loved being able to see active status in real time. The lag-less messaging made conversations feel natural and responsive. Some users suggested adding features like group chats and message reactions to make the app even more versatile.",
        },
      ],
    },
  ];

  const projectModal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("projectModalLabel");
  const modalImg = document.getElementById("modalImg");
  const modalTags = document.getElementById("modalTags");
  const modalSections = document.getElementById("modalSections");
  const modalCodeLink = document.getElementById("modalCodeLink");
  const bsModal = new bootstrap.Modal(projectModal);

  document.querySelectorAll(".view-details").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const p = projects[this.dataset.project];
      if (!p) return;

      // Title
      modalTitle.innerHTML = '<i class="bi ' + p.icon + ' me-2"></i>' + p.title;

      // Image
      modalImg.src = p.image;
      modalImg.alt = p.title;

      // Tags
      modalTags.innerHTML = p.tags
        .map(function (t) {
          return "<span>" + t + "</span>";
        })
        .join("");

      // Sections
      modalSections.innerHTML = p.sections
        .map(function (s) {
          return (
            '<div class="project-modal-section">' +
            '<h5><i class="bi ' +
            s.icon +
            ' me-2"></i>' +
            s.heading +
            "</h5>" +
            "<p>" +
            s.text +
            "</p>" +
            "</div>"
          );
        })
        .join("");

      // Footer links
      modalCodeLink.href = p.codeUrl;

      bsModal.show();
    });
  });
});
