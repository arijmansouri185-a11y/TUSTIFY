/* =========================================================
   TUSTIFY — Verify Before You Trust
   Main JavaScript
========================================================= */


/* =========================================================
   USER DATA
========================================================= */

let user = JSON.parse(localStorage.getItem("tustifyUser")) || {
  name: "Guest",
  xp: 0,
  completedChallenges: [],
  badges: []
};


/* =========================================================
   CHALLENGES DATA
========================================================= */

const challenges = {
  "1": {
    title: "Real or Fake?",
    question:
      "لقيت خبر على Social Media يقول: 'Scientists discovered a new planet yesterday'. شنوّة أول خطوة؟",
    options: [
      "نشارك الخبر بسرعة",
      "نبحث عن مصدر موثوق يؤكد الخبر",
      "نصدق الخبر خاطر فيه كلمة Scientists"
    ],
    answer: 1,
    xp: 100
  },

  "2": {
    title: "Trust the Link?",
    question:
      "وصلك رابط يطلب منك تسجيل الدخول لحسابك. شنوّة تعمل؟",
    options: [
      "ندخل معلوماتي مباشرة",
      "نتأكد من عنوان الموقع والمصدر قبل الدخول",
      "نبعث الرابط لأصحابي"
    ],
    answer: 1,
    xp: 150
  },

  "3": {
    title: "Think Twice",
    question:
      "صورة منتشرة وتقول إنها من حدث وقع اليوم. شنوّة أفضل تصرف؟",
    options: [
      "نصدقها لأنها صورة",
      "نبحث عن المصدر والتاريخ والسياق",
      "نشاركها قبل ما تختفي"
    ],
    answer: 1,
    xp: 200
  }
};


/* =========================================================
   SAVE USER
========================================================= */

function saveUser() {
  localStorage.setItem(
    "tustifyUser",
    JSON.stringify(user)
  );
}


/* =========================================================
   GET USER LEVEL
========================================================= */

function getLevel(xp) {
  if (xp >= 1500) return 5;
  if (xp >= 900) return 4;
  if (xp >= 500) return 3;
  if (xp >= 200) return 2;
  return 1;
}


/* =========================================================
   UPDATE BADGES
========================================================= */

function updateBadges() {

  const badges = [];

  if (user.completedChallenges.length >= 1) {
    badges.push("Verification Rookie");
  }

  if (user.completedChallenges.length >= 2) {
    badges.push("Fact Checker");
  }

  if (user.completedChallenges.length >= 3) {
    badges.push("Trust Defender");
  }

  if (user.xp >= 300) {
    badges.push("Critical Thinker");
  }

  if (user.xp >= 450) {
    badges.push("TUSTIFY Master");
  }

  user.badges = badges;
}


/* =========================================================
   UPDATE PROFILE
========================================================= */

function updateProfile() {

  const xpElements =
    document.querySelectorAll("[data-xp]");

  const levelElements =
    document.querySelectorAll("[data-level]");

  const badgeElements =
    document.querySelectorAll("[data-badges]");

  const challengeElements =
    document.querySelectorAll("[data-completed]");

  const progressElements =
    document.querySelectorAll("[data-progress]");

  const level = getLevel(user.xp);

  let progress = 0;

  if (level === 1) {
    progress = (user.xp / 200) * 100;
  } else if (level === 2) {
    progress = ((user.xp - 200) / 300) * 100;
  } else if (level === 3) {
    progress = ((user.xp - 500) / 400) * 100;
  } else if (level === 4) {
    progress = ((user.xp - 900) / 600) * 100;
  } else {
    progress = 100;
  }

  progress = Math.max(
    0,
    Math.min(100, progress)
  );

  xpElements.forEach(element => {
    element.textContent = user.xp;
  });

  levelElements.forEach(element => {
    element.textContent = level;
  });

  badgeElements.forEach(element => {
    element.textContent = user.badges.length;
  });

  challengeElements.forEach(element => {
    element.textContent =
      user.completedChallenges.length;
  });

  progressElements.forEach(element => {
    element.style.width = progress + "%";
  });


  /* Update user name */

  document
    .querySelectorAll("[data-user-name]")
    .forEach(element => {
      element.textContent = user.name;
    });


  /* Update streak */

  document
    .querySelectorAll("[data-streak]")
    .forEach(element => {
      element.textContent =
        user.completedChallenges.length;
    });
}


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  updateBadges();
  updateProfile();

});


/* =========================================================
   NAVIGATION
========================================================= */

document
  .querySelectorAll("a[href^='#']")
  .forEach(link => {

    link.addEventListener("click", function (event) {

      const targetId =
        this.getAttribute("href");

      if (
        !targetId ||
        targetId === "#"
      ) {
        return;
      }

      const target =
        document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth"
      });

    });

  });


/* =========================================================
   DARK MODE
========================================================= */

const themeToggle =
  document.querySelector(".theme-toggle");

if (themeToggle) {

  const savedTheme =
    localStorage.getItem("tustifyTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    const isDark =
      document.body.classList.contains("dark-mode");

    localStorage.setItem(
      "tustifyTheme",
      isDark ? "dark" : "light"
    );

  });
}


/* =========================================================
   HERO VERIFY BUTTON
========================================================= */

const heroVerifyButton =
  document.querySelector("[data-hero-verify]");

if (heroVerifyButton) {

  heroVerifyButton.addEventListener("click", () => {

    const verifySection =
      document.querySelector("#verify");

    if (verifySection) {

      verifySection.scrollIntoView({
        behavior: "smooth"
      });

    }

  });
}


/* =========================================================
   VERIFY TYPE BUTTONS
========================================================= */

document
  .querySelectorAll("[data-verify-type]")
  .forEach(button => {

    button.addEventListener("click", () => {

      const type =
        button.dataset.verifyType;

      const input =
        document.querySelector("#verifyInput");

      if (!input) return;

      if (type === "link") {

        input.placeholder =
          "Paste a suspicious link here...";

      }

      if (type === "news") {

        input.placeholder =
          "Paste a news headline or text...";

      }

      if (type === "image") {

        input.placeholder =
          "Describe the image or claim...";

      }

      input.focus();

    });

  });


/* =========================================================
   VERIFY ENGINE
========================================================= */

const verifyButton =
  document.querySelector("#verifyButton");

if (verifyButton) {

  verifyButton.addEventListener("click", () => {

    const input =
      document.querySelector("#verifyInput");

    const result =
      document.querySelector("#verifyResult");

    if (!input || !result) return;

    const value =
      input.value.trim();

    if (!value) {

      result.innerHTML =
        "<p>Please enter something to verify.</p>";

      result.classList.add("show");

      return;
    }


    const suspiciousWords = [
      "free",
      "urgent",
      "winner",
      "click",
      "password",
      "giveaway",
      "congratulations",
      "limited",
      "breaking"
    ];

    const lowerValue =
      value.toLowerCase();

    const suspicious =
      suspiciousWords.some(word =>
        lowerValue.includes(word)
      );


    if (suspicious) {

      result.innerHTML = `
        <div class="verify-warning">
          <h3>⚠️ Be Careful</h3>
          <p>
            This content contains signs that
            deserve further verification.
          </p>
          <p>
            Check the source, date, author,
            and supporting evidence before trusting it.
          </p>
        </div>
      `;

    } else {

      result.innerHTML = `
        <div class="verify-safe">
          <h3>🔎 Keep Checking</h3>
          <p>
            No obvious warning sign was detected,
            but you should still verify the source
            and context.
          </p>
        </div>
      `;

    }

    result.classList.add("show");

  });

}


/* =========================================================
   LEARN HUB
========================================================= */

document
  .querySelectorAll(".lesson-card")
  .forEach(card => {

    const button =
      card.querySelector("button");

    if (!button) return;

    button.addEventListener("click", () => {

      const title =
        card.querySelector("h3");

      const lessonTitle =
        title
          ? title.textContent
          : "This lesson";

      alert(
        "📚 " +
        lessonTitle +
        "\n\n" +
        "Learn how to identify misleading information, " +
        "check sources, and think critically before trusting content."
      );

    });

  });


/* =========================================================
   CHALLENGES
   FIXED VERSION
========================================================= */

document
  .querySelectorAll(".challenge-btn")
  .forEach(button => {

    const challengeId =
      button.dataset.challenge;

    if (!challenges[challengeId]) {
      return;
    }


    button.addEventListener("click", () => {

      /* Already completed */

      if (
        user.completedChallenges.includes(
          challengeId
        )
      ) {

        alert(
          "You already completed this challenge! 🎉"
        );

        return;
      }


      const challenge =
        challenges[challengeId];


      /* Build question */

      const questionText =
        challenge.question +
        "\n\n" +
        challenge.options
          .map(
            (option, index) =>
              (index + 1) + ". " + option
          )
          .join("\n") +
        "\n\nEnter the number of your answer:";


      const answer =
        prompt(questionText);


      if (answer === null) {
        return;
      }


      const selected =
        Number(answer) - 1;


      /* Invalid answer */

      if (
        selected < 0 ||
        selected >= challenge.options.length ||
        !Number.isInteger(selected)
      ) {

        alert(
          "Please choose a valid answer."
        );

        return;
      }


      /* Correct answer */

      if (
        selected === challenge.answer
      ) {

        user.xp += challenge.xp;

        user.completedChallenges.push(
          challengeId
        );

        updateBadges();

        saveUser();

        updateProfile();


        alert(
          "Correct! 🎉\n\n+" +
          challenge.xp +
          " XP"
        );


        /* Change button */

        button.textContent =
          "Completed ✓";

        button.disabled = true;

        button.classList.add(
          "completed"
        );


      } else {

        alert(
          "Not quite. 🤔\n\n" +
          "Think about checking the source " +
          "and evidence before trusting information."
        );

      }

    });

  });


/* =========================================================
   MARK ALREADY COMPLETED CHALLENGES
========================================================= */

document
  .querySelectorAll(".challenge-btn")
  .forEach(button => {

    const challengeId =
      button.dataset.challenge;

    if (
      user.completedChallenges.includes(
        challengeId
      )
    ) {

      button.textContent =
        "Completed ✓";

      button.disabled = true;

      button.classList.add(
        "completed"
      );

    }

  });


/* =========================================================
   SIGN UP
========================================================= */

const signupForm =
  document.querySelector("#signupForm");

if (signupForm) {

  signupForm.addEventListener("submit", event => {

    event.preventDefault();

    const nameInput =
      signupForm.querySelector(
        'input[name="name"]'
      );

    const emailInput =
      signupForm.querySelector(
        'input[name="email"]'
      );

    const passwordInput =
      signupForm.querySelector(
        'input[name="password"]'
      );


    const name =
      nameInput
        ? nameInput.value.trim()
        : "";

    const email =
      emailInput
        ? emailInput.value.trim()
        : "";

    const password =
      passwordInput
        ? passwordInput.value
        : "";


    if (!name || !email || !password) {

      alert(
        "Please fill in all fields."
      );

      return;
    }


    user.name = name;

    saveUser();

    updateProfile();


    alert(
      "Account created successfully! 🎉"
    );


    signupForm.reset();

  });

}


/* =========================================================
   LOGIN
========================================================= */

const loginForm =
  document.querySelector("#loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", event => {

    event.preventDefault();

    const emailInput =
      loginForm.querySelector(
        'input[name="email"]'
      );

    const email =
      emailInput
        ? emailInput.value.trim()
        : "";


    if (!email) {

      alert(
        "Please enter your email."
      );

      return;
    }


    alert(
      "Welcome back to TUSTIFY! 👋"
    );


    loginForm.reset();

  });

}


/* =========================================================
   LOGOUT
========================================================= */

document
  .querySelectorAll("[data-logout]")
  .forEach(button => {

    button.addEventListener("click", () => {

      const confirmLogout =
        confirm(
          "Are you sure you want to log out?"
        );

      if (!confirmLogout) {
        return;
      }


      user = {
        name: "Guest",
        xp: 0,
        completedChallenges: [],
        badges: []
      };


      saveUser();

      updateProfile();

      updateBadges();


      alert(
        "You have been logged out."
      );

    });

  });


/* =========================================================
   PROFILE RESET
========================================================= */

document
  .querySelectorAll("[data-reset-progress]")
  .forEach(button => {

    button.addEventListener("click", () => {

      const confirmed =
        confirm(
          "Reset all your TUSTIFY progress?"
        );

      if (!confirmed) {
        return;
      }


      user.xp = 0;

      user.completedChallenges = [];

      user.badges = [];


      saveUser();

      updateProfile();

      updateBadges();


      document
        .querySelectorAll(".challenge-btn")
        .forEach(challengeButton => {

          challengeButton.disabled = false;

          challengeButton.textContent =
            "Start Challenge";

          challengeButton.classList.remove(
            "completed"
          );

        });


      alert(
        "Your progress has been reset."
      );

    });

  });


/* =========================================================
   MOBILE MENU
========================================================= */

const menuToggle =
  document.querySelector(".menu-toggle");

const navMenu =
  document.querySelector(".nav-menu");


if (menuToggle && navMenu) {

  menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("active");

  });


  navMenu
    .querySelectorAll("a")
    .forEach(link => {

      link.addEventListener("click", () => {

        navMenu.classList.remove(
          "active"
        );

      });

    });

}


/* =========================================================
   CLOSE ALERT / MODAL BUTTONS
========================================================= */

document
  .querySelectorAll("[data-close]")
  .forEach(button => {

    button.addEventListener("click", () => {

      const targetId =
        button.dataset.close;

      const target =
        document.getElementById(
          targetId
        );

      if (target) {

        target.classList.remove(
          "show"
        );

      }

    });

  });


/* =========================================================
   CONTACT / CTA BUTTONS
========================================================= */

document
  .querySelectorAll("[data-scroll-to]")
  .forEach(button => {

    button.addEventListener("click", () => {

      const targetId =
        button.dataset.scrollTo;

      const target =
        document.querySelector(
          targetId
        );

      if (!target) return;

      target.scrollIntoView({
        behavior: "smooth"
      });

    });

  });


/* =========================================================
   FINAL INITIALIZATION
========================================================= */

updateBadges();

updateProfile();

saveUser();
