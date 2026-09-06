document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     TUSTIFY - MAIN SETTINGS
     ========================= */

  let user = JSON.parse(localStorage.getItem("tustifyUser")) || {
    name: "Guest",
    xp: 0,
    completedChallenges: [],
    badges: []
  };

  let selectedType = "news";

  const lessons = {
    "fake-news": {
      title: "Fake News",
      text: "قبل ما تصدق خبر، شوف المصدر، التاريخ، الكاتب، وهل مصادر أخرى موثوقة تقول نفس الشيء."
    },
    "phishing": {
      title: "Phishing",
      text: "التصيد يحاول يخليك تضغط على رابط أو تعطي معلومات. تحقق دائما من الرابط والمرسل قبل أي تفاعل."
    },
    "ai": {
      title: "AI Content",
      text: "المحتوى المصنوع بالذكاء الاصطناعي يمكن أن يبدو حقيقيا. لا تعتمد على الصورة أو النص وحده، وابحث عن مصادر مستقلة."
    },
    "images": {
      title: "Misleading Images",
      text: "الصورة يمكن تكون حقيقية لكن مستعملة خارج سياقها. حاول معرفة مصدرها وتاريخها والسياق الأصلي."
    },
    "sources": {
      title: "Reliable Sources",
      text: "المصدر الموثوق يكون واضحا، قابلا للتحقق، ويعتمد على أدلة أو مصادر يمكن الرجوع إليها."
    },
    "critical-thinking": {
      title: "Critical Thinking",
      text: "اسأل: شكون قالها؟ شنوّة الدليل؟ هل توجد مصادر أخرى؟ وهل يمكن أن يكون هناك تفسير مختلف؟"
    }
  };

  const challenges = {
    "1": {
      title: "Real or Fake?",
      question: "لقيت خبر على Social Media يقول: 'Scientists discovered a new planet yesterday'. شنوّة أول خطوة؟",
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
      question: "وصلك رابط يطلب منك تسجيل الدخول لحسابك. شنوّة تعمل؟",
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
      question: "صورة منتشرة وتقول إنها من حدث وقع اليوم. شنوّة أفضل تصرف؟",
      options: [
        "نصدقها لأنها صورة",
        "نبحث عن المصدر والتاريخ والسياق",
        "نشاركها قبل ما تختفي"
      ],
      answer: 1,
      xp: 200
    }
  };


  /* =========================
     SAVE USER
     ========================= */

  function saveUser() {
    localStorage.setItem("tustifyUser", JSON.stringify(user));
  }


  /* =========================
     NAVIGATION
     ========================= */

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });


  /* =========================
     DARK MODE
     ========================= */

  const themeButton = document.querySelector(".theme-toggle");

  const savedTheme = localStorage.getItem("tustifyTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }

  if (themeButton) {
    themeButton.addEventListener("click", () => {

      document.body.classList.toggle("dark");

      const isDark = document.body.classList.contains("dark");

      localStorage.setItem(
        "tustifyTheme",
        isDark ? "dark" : "light"
      );

      themeButton.textContent = isDark ? "☀️" : "🌙";
    });

    themeButton.textContent =
      document.body.classList.contains("dark") ? "☀️" : "🌙";
  }


  /* =========================
     HERO BUTTONS
     ========================= */

  document.querySelectorAll('a[href="#verify"]').forEach(button => {
    button.addEventListener("click", () => {
      setTimeout(() => {
        document.getElementById("verifyInput")?.focus();
      }, 500);
    });
  });


  /* =========================
     VERIFY TYPES
     ========================= */

  const verifyTypes = document.querySelectorAll(".verify-type");

  verifyTypes.forEach(button => {

    button.addEventListener("click", () => {

      verifyTypes.forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      selectedType = button.dataset.type || "news";

      const input = document.getElementById("verifyInput");

      if (!input) return;

      const placeholders = {
        news: "Paste a news headline, claim or text here...",
        website: "Paste a website link here...",
        image: "Describe the image or paste its context here...",
        message: "Paste the message you received here..."
      };

      input.placeholder =
        placeholders[selectedType] ||
        placeholders.news;
    });

  });


  /* =========================
     VERIFY ENGINE
     ========================= */

  const verifyButton = document.getElementById("verifyButton");

  if (verifyButton) {

    verifyButton.addEventListener("click", () => {

      const input = document.getElementById("verifyInput");
      const result = document.getElementById("verifyResult");
      const title = document.getElementById("resultTitle");
      const text = document.getElementById("resultText");

      if (!input || !result || !title || !text) return;

      const content = input.value.trim();

      if (!content) {
        title.textContent = "Please enter something to verify";
        text.textContent =
          "Add a claim, link, image context, or message first.";
        result.classList.add("show");
        return;
      }

      const suspiciousWords = [
        "urgent",
        "100% guaranteed",
        "you won",
        "click now",
        "act now",
        "free money",
        "breaking",
        "secret",
        "guaranteed",
        "password"
      ];

      const lower = content.toLowerCase();

      const suspicious =
        suspiciousWords.some(word =>
          lower.includes(word)
        );

      if (suspicious) {

        title.textContent =
          "⚠️ Potentially Misleading";

        text.textContent =
          "This content contains signals that deserve extra checking. " +
          "Don't share personal information or spread the claim yet. " +
          "Look for independent, reliable sources.";

      } else {

        title.textContent =
          "🔎 Needs Verification";

        text.textContent =
          "TUSTIFY could not confirm this content from the information provided. " +
          "Check the original source, date, author, evidence, and independent sources before trusting it.";
      }

      result.classList.add("show");

      result.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });

    });

  }


  /* =========================
     LEARN HUB
     ========================= */

  document.querySelectorAll(".lesson").forEach(card => {

    const lessonButton =
      card.querySelector("button");

    const lessonId =
      card.dataset.lesson;

    if (!lessonButton || !lessonId) return;

    lessonButton.addEventListener("click", () => {

      const lesson = lessons[lessonId];

      if (!lesson) return;

      alert(
        lesson.title +
        "\n\n" +
        lesson.text
      );

    });

  });


  /* =========================
     LEVEL SYSTEM
     ========================= */

  function getLevel(xp) {

    if (xp >= 1500) return 5;
    if (xp >= 900) return 4;
    if (xp >= 500) return 3;
    if (xp >= 200) return 2;

    return 1;
  }


  /* =========================
     BADGES
     ========================= */

  function updateBadges() {

    const completed =
      user.completedChallenges.length;

    const badgeRules = [
      {
        name: "Verification Rookie",
        condition: completed >= 1
      },
      {
        name: "Fact Checker",
        condition: completed >= 2
      },
      {
        name: "Trust Defender",
        condition: completed >= 3
      },
      {
        name: "Critical Thinker",
        condition: user.xp >= 300
      },
      {
        name: "TUSTIFY Master",
        condition: user.xp >= 450
      }
    ];

    user.badges = badgeRules
      .filter(badge => badge.condition)
      .map(badge => badge.name);

    saveUser();
  }


  /* =========================
     PROFILE
     ========================= */

  function updateProfile() {

    updateBadges();

    const level =
      getLevel(user.xp);

    const profileName =
      document.getElementById("profileName");

    const xpValue =
      document.getElementById("xpValue");

    const levelValue =
      document.getElementById("levelValue");

    const badgeValue =
      document.getElementById("badgeValue");

    const progressText =
      document.getElementById("progressText");

    const progressBar =
      document.getElementById("progressBar");

    if (profileName) {
      profileName.textContent =
        user.name || "Guest";
    }

    if (xpValue) {
      xpValue.textContent =
        user.xp;
    }

    if (levelValue) {
      levelValue.textContent =
        "Level " + level;
    }

    if (badgeValue) {
      badgeValue.textContent =
        user.badges.length;
    }

    const nextLevelXP = {
      1: 200,
      2: 500,
      3: 900,
      4: 1500,
      5: 1500
    };

    const currentTarget =
      nextLevelXP[level];

    let progress = 100;

    if (level < 5) {
      const previousTarget = {
        1: 0,
        2: 200,
        3: 500,
        4: 900
      }[level];

      progress =
        ((user.xp - previousTarget) /
        (currentTarget - previousTarget)) * 100;

      progress =
        Math.max(0, Math.min(100, progress));
    }

    if (progressBar) {
      progressBar.style.width =
        progress + "%";
    }

    if (progressText) {

      if (level >= 5) {
        progressText.textContent =
          "Maximum level reached 🎉";
      } else {
        progressText.textContent =
          user.xp +
          " XP / " +
          currentTarget +
          " XP";
      }

    }

    const badgesGrid =
      document.getElementById("badgesGrid");

    if (badgesGrid) {

      badgesGrid.innerHTML = "";

      const allBadges = [
        "Verification Rookie",
        "Fact Checker",
        "Trust Defender",
        "Critical Thinker",
        "TUSTIFY Master"
      ];

      allBadges.forEach(badgeName => {

        const badge =
          document.createElement("div");

        badge.className =
          "badge";

        if (user.badges.includes(badgeName)) {
          badge.classList.add("unlocked");
        }

        badge.textContent =
          user.badges.includes(badgeName)
            ? "🏆 " + badgeName
            : "🔒 " + badgeName;

        badgesGrid.appendChild(badge);

      });

    }

  }


  /* =========================
     CHALLENGES
     ========================= */

  document.querySelectorAll("[data-challenge]").forEach(card => {

    const challengeId =
      card.dataset.challenge;

    const button =
      card.querySelector("button");

    if (!button || !challenges[challengeId]) return;

    button.addEventListener("click", () => {

      if (user.completedChallenges.includes(challengeId)) {

        alert(
          "You already completed this challenge! 🎉"
        );

        return;
      }

      const challenge =
        challenges[challengeId];

      const answer =
        prompt(
          challenge.question +
          "\n\n" +
          challenge.options
            .map((option, index) =>
              (index + 1) + ". " + option
            )
            .join("\n") +
          "\n\nEnter the number of your answer:"
        );

      if (answer === null) return;

      const selected =
        Number(answer) - 1;

      if (
        selected < 0 ||
        selected >= challenge.options.length
      ) {

        alert("Please choose a valid answer.");

        return;
      }

      if (selected === challenge.answer) {

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

      } else {

        alert(
          "Not quite. 🤔\n\n" +
          "Think about checking the source and evidence before trusting information."
        );

      }

    });

  });


  /* =========================
     SIGN UP
     ========================= */

  const signupForm =
    document.getElementById("signupForm");

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

      if (!nameInput) return;

      user.name =
        nameInput.value.trim() || "TUSTIFY User";

      user.email =
        emailInput?.value.trim() || "";

      saveUser();
      updateProfile();

      alert(
        "Welcome to TUSTIFY, " +
        user.name +
        "! 🎉"
      );

      document
        .getElementById("profile")
        ?.scrollIntoView({
          behavior: "smooth"
        });

    });

  }


  /* =========================
     LOGIN
     ========================= */

  const loginForm =
    document.getElementById("loginForm");

  if (loginForm) {

    loginForm.addEventListener("submit", event => {

      event.preventDefault();

      alert(
        "Demo login completed. Your TUSTIFY progress is stored locally on this device."
      );

    });

  }


  /* =========================
     INITIALIZE
     ========================= */

  updateBadges();
  updateProfile();

});
