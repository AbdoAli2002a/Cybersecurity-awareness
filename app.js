// Password Strength Meter (client-side only)
(function passwordStrengthMeter() {
  const passwordInput = document.getElementById("passwordInput");
  const meterFill = document.getElementById("meterFill");
  const strengthLabel = document.getElementById("strengthLabel");

  if (!passwordInput || !meterFill || !strengthLabel) return;

  const checks = {
    length: document.getElementById("check-length"),
    upper: document.getElementById("check-upper"),
    lower: document.getElementById("check-lower"),
    number: document.getElementById("check-number"),
    symbol: document.getElementById("check-symbol"),
  };

  function evaluatePassword(value) {
    return {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /\d/.test(value),
      symbol: /[^A-Za-z0-9]/.test(value),
    };
  }

  passwordInput.addEventListener("input", (event) => {
    const value = event.target.value;
    const result = evaluatePassword(value);
    const passed = Object.values(result).filter(Boolean).length;

    Object.entries(result).forEach(([key, ok]) => {
      checks[key].classList.toggle("ok", ok);
    });

    let label = "-";
    let color = "#94a3b8";
    let width = 0;

    if (value) {
      label = "ضعيفة";
      color = "#dc2626";
      width = Math.max(20, passed * 20);
    }

    if (passed >= 3) {
      label = "متوسطة";
      color = "#f59e0b";
      width = 66;
    }

    if (passed >= 4 && value.length >= 10) {
      label = "قوية";
      color = "#16a34a";
      width = 100;
    }

    meterFill.style.width = width + "%";
    meterFill.style.backgroundColor = color;
    strengthLabel.style.color = color;
    strengthLabel.textContent = "الحالة: " + label;
  });
})();

// Phishing Simulator
(function phishingSimulator() {
  const phishMeta = document.getElementById("phishMeta");
  const phishSubject = document.getElementById("phishSubject");
  const phishBody = document.getElementById("phishBody");
  const realBtn = document.getElementById("realBtn");
  const phishingBtn = document.getElementById("phishingBtn");
  const nextBtn = document.getElementById("nextBtn");
  const scoreLine = document.getElementById("scoreLine");

  const modal = document.getElementById("resultModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  const redFlagsList = document.getElementById("redFlagsList");
  const closeModalBtn = document.getElementById("closeModalBtn");

  if (
    !phishMeta ||
    !phishSubject ||
    !phishBody ||
    !realBtn ||
    !phishingBtn ||
    !nextBtn ||
    !scoreLine ||
    !modal ||
    !modalTitle ||
    !modalText ||
    !redFlagsList ||
    !closeModalBtn
  ) {
    return;
  }

  const scenarios = [
    {
      channel: "EMAIL",
      from: "security@paypa1-support.com",
      subject: "إجراء عاجل: حسابك سيُعلّق خلال ساعتين",
      body:
        "مرحبًا،\nتم رصد نشاط غير طبيعي.\nاضغط فورًا لتأكيد بياناتك:\nhttp://paypal-verify-urgent-check.ru",
      phishing: true,
      flags: [
        "نطاق مرسل مزيف أو مكتوب بطريقة مشابهة للجهة الأصلية.",
        "لغة استعجال وتهديد لإرباك المستخدم.",
        "الرابط غير رسمي ويقود لنطاق غير موثوق.",
      ],
    },
    {
      channel: "SMS",
      from: "MyBank",
      subject: "تنبيه أمني",
      body:
        "تم تسجيل دخول جديد. إذا لم تكن أنت، اتصل فورًا بالرقم الرسمي خلف البطاقة.",
      phishing: false,
      flags: [
        "لا يتضمن رابطًا مشبوهًا.",
        "يوجه المستخدم لقناة رسمية معروفة.",
        "لا يطلب كلمة مرور أو رمز تحقق.",
      ],
    },
    {
      channel: "EMAIL",
      from: "invoice@supp0rt-billing.net",
      subject: "فاتورة متأخرة - آخر تحذير",
      body:
        "عزيزي العميل،\nلدينا فاتورة متأخرة ويجب السداد خلال 30 دقيقة لتجنب الإيقاف.\nسدد الآن عبر الرابط.",
      phishing: true,
      flags: [
        "عنوان مرسل غير رسمي أو مريب.",
        "ضغط زمني غير منطقي (30 دقيقة فقط).",
        "طلب الدفع السريع دون تفاصيل فاتورة موثوقة.",
      ],
    },
  ];

  let current = 0;
  let total = 0;
  let correct = 0;

  function renderScenario() {
    const item = scenarios[current];
    phishMeta.textContent = "النوع: " + item.channel + " | من: " + item.from;
    phishSubject.textContent = item.subject;
    phishBody.textContent = item.body;
    realBtn.disabled = false;
    phishingBtn.disabled = false;
    nextBtn.hidden = true;
  }

  function showModal() {
    modal.hidden = false;
  }

  function hideModal() {
    modal.hidden = true;
  }

  function answer(userThinksPhishing) {
    const item = scenarios[current];
    const isRight = userThinksPhishing === item.phishing;
    total += 1;
    if (isRight) correct += 1;

    modalTitle.textContent = isRight ? "إجابة صحيحة" : "إجابة غير صحيحة";
    modalText.textContent = item.phishing
      ? "هذه الرسالة احتيالية. العلامات الحمراء:"
      : "هذه الرسالة أقرب للشرعية. مؤشرات التقييم:";

    redFlagsList.innerHTML = "";
    item.flags.forEach((flag) => {
      const li = document.createElement("li");
      li.textContent = flag;
      redFlagsList.appendChild(li);
    });

    scoreLine.textContent = "النتيجة: " + correct + " / " + total;
    realBtn.disabled = true;
    phishingBtn.disabled = true;
    nextBtn.hidden = false;
    showModal();
  }

  function moveNext() {
    current += 1;
    if (current >= scenarios.length) {
      phishMeta.textContent = "انتهى التحدي";
      phishSubject.textContent = "أحسنت!";
      phishBody.textContent =
        "نتيجتك النهائية: " + correct + " من " + total + ". يمكنك تحديث الصفحة لإعادة التحدي.";
      realBtn.hidden = true;
      phishingBtn.hidden = true;
      nextBtn.hidden = true;
      return;
    }
    renderScenario();
  }

  realBtn.addEventListener("click", () => answer(false));
  phishingBtn.addEventListener("click", () => answer(true));
  nextBtn.addEventListener("click", moveNext);
  closeModalBtn.addEventListener("click", hideModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) hideModal();
  });

  renderScenario();
})();

// Contact Form (demo validation only)
(function contactFormHandler() {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");

  if (!form || !feedback) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      feedback.textContent = "يرجى تعبئة الحقول المطلوبة بشكل صحيح قبل الإرسال.";
      feedback.style.color = "#dc2626";
      return;
    }

    feedback.textContent =
      "تم استلام طلبك بنجاح (نسخة تجريبية). الخطوة التالية: ربط النموذج بواجهة API آمنة على الخادم.";
    feedback.style.color = "#16a34a";
    form.reset();
  });
})();

// Scam Chatbot Simulator
(function scamChatbotSimulator() {
  const chatBox = document.getElementById("scamChatBox");
  const input = document.getElementById("scamInput");
  const sendBtn = document.getElementById("scamSendBtn");
  const feedback = document.getElementById("scamFeedback");
  if (!chatBox || !input || !sendBtn || !feedback) return;

  const scripts = [
    "مرحباً، أنا من الدعم الفني للبنك. تم رصد حركة مشبوهة في حسابك.",
    "لحمايتك نحتاج تأكيد رقم البطاقة وكود OTP الذي وصلك حالاً.",
    "إذا لم تؤكد الآن قد يتم إيقاف حسابك خلال دقائق.",
  ];

  const sensitivePatterns = [
    /\b\d{6}\b/, // OTP-like
    /\b\d{13,19}\b/, // Card-like
    /\botp\b/i,
    /رمز|كود|بطاقة|cvv|الرقم السري/i,
  ];

  let step = 0;
  let trapped = false;

  function addMessage(text, who) {
    const msg = document.createElement("div");
    msg.className = "chat-msg " + who;
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function botReply(userText) {
    if (trapped) return;
    const looksSensitive = sensitivePatterns.some((p) => p.test(userText));
    if (looksSensitive) {
      trapped = true;
      addMessage(
        "لقد وقعت في الفخ! إليك كيف كشفت لك نفسي: طلبت بيانات حساسة (OTP/بطاقة) مع استعجال وتخويف. لا تشارك هذه المعلومات أبداً.",
        "bot"
      );
      feedback.style.color = "#dc2626";
      feedback.textContent = "تنبيه تدريبي: المحتال الحقيقي يستغل الخوف والاستعجال للحصول على البيانات.";
      return;
    }

    step += 1;
    if (step < scripts.length) {
      addMessage(scripts[step], "bot");
      return;
    }

    addMessage(
      "أحسنت. لم تشارك معلومات حساسة وتعاملت بحذر. الخطوة الصحيحة: إنهاء المحادثة والاتصال بالجهة الرسمية مباشرة.",
      "bot"
    );
    feedback.style.color = "#16a34a";
    feedback.textContent = "نتيجة ممتازة: اكتشفت الهندسة الاجتماعية دون الوقوع بالفخ.";
  }

  sendBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, "user");
    input.value = "";
    botReply(text);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });

  addMessage(scripts[0], "bot");
})();

// Voice Deepfake Audio Quiz (simulation using speech synthesis)
(function voiceDeepfakeQuiz() {
  const prompt = document.getElementById("audioPrompt");
  const playBtn = document.getElementById("playAudioBtn");
  const guessRealBtn = document.getElementById("guessRealAudioBtn");
  const guessFakeBtn = document.getElementById("guessFakeAudioBtn");
  const nextBtn = document.getElementById("nextAudioBtn");
  const result = document.getElementById("audioResult");
  if (!prompt || !playBtn || !guessRealBtn || !guessFakeBtn || !nextBtn || !result) return;

  const clips = [
    {
      label: "المقطع 1",
      text: "أنا أخوك، أنا في مشكلة كبيرة وأحتاج تحويلاً عاجلاً خلال عشر دقائق.",
      fake: true,
      tip: "لغة استعجال وضغط مالي مفاجئ بدون تحقق.",
    },
    {
      label: "المقطع 2",
      text: "مرحباً، هذا تذكير بموعد العائلة يوم الجمعة الساعة الثامنة مساءً.",
      fake: false,
      tip: "محتوى طبيعي بلا طلب مالي أو ضغط نفسي.",
    },
    {
      label: "المقطع 3",
      text: "حوّل المبلغ الآن ولا تخبر أحداً، هاتفي سينقطع بعد دقيقة.",
      fake: true,
      tip: "طلب سرية + استعجال = نمط احتيالي شائع.",
    },
  ];

  let idx = 0;
  let score = 0;
  let total = 0;

  function render() {
    const clip = clips[idx];
    prompt.textContent = clip.label + ": استمع ثم اختر هل التسجيل حقيقي أم مُصنّع.";
    nextBtn.hidden = true;
    guessRealBtn.disabled = false;
    guessFakeBtn.disabled = false;
  }

  playBtn.addEventListener("click", () => {
    const clip = clips[idx];
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(clip.text);
      u.lang = "ar-SA";
      u.rate = clip.fake ? 1.1 : 0.95;
      u.pitch = clip.fake ? 1.25 : 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } else {
      alert("المتصفح لا يدعم تشغيل المحاكاة الصوتية حالياً.");
    }
  });

  function answer(userSaysFake) {
    const clip = clips[idx];
    total += 1;
    const ok = userSaysFake === clip.fake;
    if (ok) score += 1;
    result.textContent =
      "النتيجة: " + score + " / " + total + " | " + (ok ? "إجابة صحيحة." : "إجابة غير صحيحة.") + " " + clip.tip;
    guessRealBtn.disabled = true;
    guessFakeBtn.disabled = true;
    nextBtn.hidden = false;
  }

  guessRealBtn.addEventListener("click", () => answer(false));
  guessFakeBtn.addEventListener("click", () => answer(true));
  nextBtn.addEventListener("click", () => {
    idx += 1;
    if (idx >= clips.length) {
      prompt.textContent = "انتهى الاختبار الصوتي. اتفق مع عائلتك على كلمة سر للتحقق من الهوية.";
      playBtn.hidden = true;
      guessRealBtn.hidden = true;
      guessFakeBtn.hidden = true;
      nextBtn.hidden = true;
      return;
    }
    render();
  });

  render();
})();

// URL Unshortener & Inspector (safe simulation)
(function urlInspector() {
  const input = document.getElementById("shortUrlInput");
  const btn = document.getElementById("inspectUrlBtn");
  const result = document.getElementById("urlInspectorResult");
  if (!input || !btn || !result) return;

  const shortDomains = ["bit.ly", "tinyurl.com", "t.co", "rb.gy", "cutt.ly", "is.gd"];
  const suspiciousWords = ["login", "verify", "gift", "bonus", "bank", "secure-update", "otp"];

  btn.addEventListener("click", () => {
    const value = input.value.trim();
    if (!value) {
      result.textContent = "يرجى إدخال رابط أولاً.";
      return;
    }

    let parsed;
    try {
      parsed = new URL(value);
    } catch (e) {
      result.textContent = "صيغة الرابط غير صحيحة.";
      return;
    }

    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const path = (parsed.pathname + parsed.search).toLowerCase();
    const isShort = shortDomains.includes(host);
    const hasSuspiciousWord = suspiciousWords.some((w) => path.includes(w) || host.includes(w));

    if (isShort && hasSuspiciousWord) {
      result.innerHTML =
        "<strong>⚠️ عالي الخطورة:</strong> رابط مختصر مع كلمات حساسة. لا تفتحه مباشرة. افتحه فقط عبر جهاز معزول أو اطلب من الجهة الرسمية الرابط المباشر.";
      return;
    }

    if (isShort) {
      result.innerHTML =
        "<strong>تنبيه:</strong> هذا رابط مختصر. الوجهة الحقيقية غير ظاهرة بالكامل. افترض المخاطر حتى تتأكد من المصدر.";
      return;
    }

    if (hasSuspiciousWord) {
      result.innerHTML =
        "<strong>تنبيه متوسط:</strong> الرابط غير مختصر لكنه يحتوي كلمات احتيالية شائعة. تحقق من النطاق الرسمي قبل أي إدخال بيانات.";
      return;
    }

    result.innerHTML =
      "<strong>مبدئياً آمن:</strong> لا توجد مؤشرات عالية الخطورة في هذا الفحص السريع، لكن استمر في التحقق اليدوي من الجهة المرسلة.";
  });
})();

// Password Cracking Time Simulator
(function crackingTimeSimulator() {
  const input = document.getElementById("crackInput");
  const btn = document.getElementById("crackCalcBtn");
  const result = document.getElementById("crackResult");
  if (!input || !btn || !result) return;

  function charsetSize(value) {
    let size = 0;
    if (/[a-z]/.test(value)) size += 26;
    if (/[A-Z]/.test(value)) size += 26;
    if (/\d/.test(value)) size += 10;
    if (/[^A-Za-z0-9]/.test(value)) size += 33;
    return size || 1;
  }

  function humanizeSeconds(seconds) {
    if (seconds < 1) return seconds.toFixed(4) + " ثانية";
    const units = [
      ["سنة", 31536000],
      ["يوم", 86400],
      ["ساعة", 3600],
      ["دقيقة", 60],
      ["ثانية", 1],
    ];
    let remain = Math.floor(seconds);
    const parts = [];
    units.forEach(([name, amount]) => {
      if (remain >= amount && parts.length < 2) {
        const n = Math.floor(remain / amount);
        remain -= n * amount;
        parts.push(n + " " + name);
      }
    });
    return parts.join(" و ");
  }

  btn.addEventListener("click", () => {
    const value = input.value;
    if (!value) {
      result.textContent = "أدخل كلمة مرور تجريبية للحساب.";
      return;
    }

    const space = charsetSize(value);
    const combinations = Math.pow(space, value.length);
    const guessesPerSecond = 1e10; // high-end attacker estimate
    const avgSeconds = combinations / guessesPerSecond / 2;

    const weakPattern = /^(123456|password|qwerty|111111|000000)$/i.test(value);
    if (weakPattern) {
      result.innerHTML = "<strong>تم كسرها تقريباً فوراً:</strong> 0.0001 ثانية (أو أقل).";
      return;
    }

    result.innerHTML =
      "<strong>الزمن التقديري للكسر:</strong> " +
      humanizeSeconds(avgSeconds) +
      "<br><strong>النصيحة:</strong> استخدم عبارة مرور طويلة وفريدة مع تفعيل 2FA.";
  });
})();

// Digital Footprint Simulator
(function digitalFootprintSimulator() {
  const form = document.getElementById("footprintForm");
  const report = document.getElementById("footprintReport");
  if (!form || !report) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const answers = ["q1", "q2", "q3", "q4"].map((k) => data.get(k));
    if (answers.some((v) => !v)) {
      report.textContent = "أكمل جميع الأسئلة أولاً للحصول على التقرير.";
      return;
    }

    const riskScore = answers.filter((v) => v === "yes").length;
    let level = "منخفض";
    let color = "#16a34a";
    if (riskScore >= 2) {
      level = "متوسط";
      color = "#f59e0b";
    }
    if (riskScore >= 3) {
      level = "مرتفع";
      color = "#dc2626";
    }

    report.innerHTML =
      "<strong>تقرير الأثر الرقمي:</strong> مستوى التعرض لديك <span style='color:" +
      color +
      ";font-weight:700'>" +
      level +
      "</span>." +
      "<br>يمكن للمهاجم جمع هذه المعلومات لبناء هجوم مخصص أو تخمين أسئلة الأمان." +
      "<br><strong>الإجراءات المقترحة:</strong> تقليل النشر العلني، إخفاء تاريخ الميلاد، وتغيير أسئلة الأمان إلى إجابات غير قابلة للتخمين.";
  });
})();

// Smart Home Security Blueprint
(function smartHomeBlueprint() {
  const buttons = Array.from(document.querySelectorAll(".device-btn"));
  const info = document.getElementById("deviceInfo");
  if (!buttons.length || !info) return;

  const data = {
    router: {
      title: "الراوتر",
      risk: "الثغرة الشائعة: كلمة المرور الافتراضية admin/admin.",
      fix: "الحماية: تغيير اسم الشبكة وكلمة المرور، تعطيل WPS، وتحديث النظام دورياً.",
    },
    camera: {
      title: "كاميرا المراقبة",
      risk: "الثغرة الشائعة: فتح الوصول من الإنترنت دون حماية قوية.",
      fix: "الحماية: تفعيل 2FA، تعطيل الوصول الخارجي غير الضروري، وتغيير كلمة مرور الكاميرا.",
    },
    tv: {
      title: "التلفزيون الذكي",
      risk: "الثغرة الشائعة: تطبيقات غير موثوقة أو صلاحيات زائدة.",
      fix: "الحماية: تحميل التطبيقات من المتجر الرسمي فقط ومراجعة الأذونات.",
    },
    lock: {
      title: "القفل الرقمي",
      risk: "الثغرة الشائعة: رمز قصير أو متكرر بين أفراد المنزل.",
      fix: "الحماية: رمز طويل وفريد، وتمكين سجلات التنبيه عند أي محاولة فاشلة.",
    },
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.device;
      const item = data[key];
      if (!item) return;
      info.innerHTML =
        "<strong>" +
        item.title +
        "</strong><br>" +
        item.risk +
        "<br>" +
        item.fix;
    });
  });
})();

// Wi-Fi Honeypot Simulator
(function wifiHoneypotSimulator() {
  const unsafeBtn = document.getElementById("wifiUnsafeBtn");
  const safeBtn = document.getElementById("wifiSafeBtn");
  const timeline = document.getElementById("wifiTimeline");
  if (!unsafeBtn || !safeBtn || !timeline) return;

  function renderSteps(steps) {
    timeline.innerHTML = "";
    steps.forEach((step, index) => {
      setTimeout(() => {
        const li = document.createElement("li");
        li.textContent = step;
        timeline.appendChild(li);
      }, index * 600);
    });
  }

  unsafeBtn.addEventListener("click", () => {
    renderSteps([
      "اتصلت بشبكة: Free_Cafe_WiFi",
      "المهاجم يراقب طلبات HTTP غير المشفرة.",
      "تم التقاط بيانات تصفح وصفحات تسجيل دخول مزيفة.",
      "خطر مرتفع: يمكن سرقة الجلسة أو خداعك بصفحة مزورة.",
    ]);
  });

  safeBtn.addEventListener("click", () => {
    renderSteps([
      "تم تفعيل VPN قبل الاتصال بالشبكة.",
      "تم تشفير الاتصال بين جهازك وخادم VPN.",
      "المهاجم يرى اتصالاً مشفراً فقط دون محتوى التصفح.",
      "المخاطر انخفضت بشكل كبير، مع ضرورة تجنب الروابط المشبوهة أيضاً.",
    ]);
  });
})();

// Gamification Core (points, badges, leaderboard)
const gamificationState = (function gamificationStateManager() {
  const key = "cyberFortressGameStateV1";
  const defaultState = { points: 0, badge: "مبتدئ رقمي", solved: {} };
  let state;
  try {
    state = JSON.parse(localStorage.getItem(key)) || defaultState;
  } catch (e) {
    state = defaultState;
  }

  function badgeForPoints(points) {
    if (points >= 120) return "الحصن المنيع";
    if (points >= 70) return "خبير تصيد";
    if (points >= 30) return "حارس رقمي";
    return "مبتدئ رقمي";
  }

  function save() {
    state.badge = badgeForPoints(state.points);
    localStorage.setItem(key, JSON.stringify(state));
  }

  function addPoints(amount, reasonKey) {
    if (reasonKey && state.solved[reasonKey]) return;
    state.points += amount;
    if (reasonKey) state.solved[reasonKey] = true;
    save();
  }

  save();
  return { state, addPoints };
})();

(function gamificationWidgets() {
  const pointsEl = document.getElementById("playerPoints");
  const badgeEl = document.getElementById("playerBadge");
  const boardEl = document.getElementById("leaderboardList");
  const shareBtn = document.getElementById("shareBadgeBtn");
  if (!pointsEl || !badgeEl || !boardEl || !shareBtn) return;

  function render() {
    pointsEl.textContent = "النقاط: " + gamificationState.state.points;
    badgeEl.textContent = "الشارة الحالية: " + gamificationState.state.badge;
    const mockBoard = [
      { name: "أنت", score: gamificationState.state.points },
      { name: "مستخدم واعٍ", score: 95 },
      { name: "حارس العائلة", score: 72 },
      { name: "فريق ناشئ آمن", score: 54 },
    ].sort((a, b) => b.score - a.score);
    boardEl.innerHTML = mockBoard
      .map((p, i) => (i + 1) + ". " + p.name + " - " + p.score + " نقطة")
      .join("<br>");
  }

  shareBtn.addEventListener("click", async () => {
    const text =
      "🏅 إنجـازي في الحصن الرقمي: " +
      gamificationState.state.badge +
      " | " +
      gamificationState.state.points +
      " نقطة";
    try {
      await navigator.clipboard.writeText(text);
      alert("تم نسخ الإنجاز للحافظة. يمكنك مشاركته على لينكد إن.");
    } catch (e) {
      alert(text);
    }
  });

  render();
  window.renderGamification = render;
})();

// Daily Challenge
(function dailyChallenge() {
  const q = document.getElementById("dailyChallengeQuestion");
  const feedback = document.getElementById("dailyChallengeFeedback");
  const buttons = Array.from(document.querySelectorAll(".challenge-option"));
  if (!q || !feedback || !buttons.length) return;

  const challenges = [
    {
      q: "وصلك بريد بعنوان: تم إيقاف حسابك البنكي خلال 10 دقائق. ما العلامة الأخطر؟",
      options: ["شعار البنك موجود", "أسلوب الاستعجال والتهديد", "الرسالة قصيرة"],
      correct: 1,
      key: "daily-1",
    },
    {
      q: "أي خيار أكثر أماناً عند المقاهي؟",
      options: ["شبكة Free_WiFi", "بيانات الهاتف أو VPN", "أي شبكة بكلمة مرور"],
      correct: 1,
      key: "daily-2",
    },
    {
      q: "طلب منك شخص يدّعي أنه دعم فني كود OTP. ماذا تفعل؟",
      options: ["أرسله بسرعة", "تتجاهل وتبلغ الجهة الرسمية", "تشاركه نصف الكود"],
      correct: 1,
      key: "daily-3",
    },
  ];

  const todayIndex = new Date().getDate() % challenges.length;
  const today = challenges[todayIndex];
  q.textContent = today.q;
  buttons.forEach((btn, i) => {
    btn.textContent = today.options[i];
    btn.addEventListener("click", () => {
      const key = "challenge-" + today.key + "-" + new Date().toDateString();
      if (i === today.correct) {
        feedback.style.color = "#16a34a";
        feedback.textContent = "إجابة صحيحة! +10 نقاط.";
        gamificationState.addPoints(10, key);
      } else {
        feedback.style.color = "#dc2626";
        feedback.textContent = "إجابة غير صحيحة. راقب الاستعجال وطلبات البيانات الحساسة.";
      }
      if (window.renderGamification) window.renderGamification();
    });
  });
})();

// Scenario Adventure
(function scenarioAdventure() {
  const textEl = document.getElementById("scenarioText");
  const btnA = document.getElementById("scenarioChoiceA");
  const btnB = document.getElementById("scenarioChoiceB");
  const result = document.getElementById("scenarioResult");
  if (!textEl || !btnA || !btnB || !result) return;

  const scenes = [
    {
      text: "وصلتك رسالة من مديرك يطلب تحويل مبلغ فوراً إلى حساب جديد. ماذا تفعل؟",
      a: "أنفذ الطلب فوراً",
      b: "أتأكد بمكالمة رسمية قبل أي تحويل",
      good: "b",
      tip: "تحقق خارج القناة نفسها يمنع احتيال انتحال المدير.",
    },
    {
      text: "صديق يطلب كود التحقق لأنه (بالخطأ) وصل إلى هاتفك.",
      a: "أرسل الكود لمساعدته",
      b: "أرفض وأطلب منه استعادة الحساب رسمياً",
      good: "b",
      tip: "كود التحقق مفتاح حسابك ولا يُشارك مع أحد.",
    },
  ];

  let idx = 0;
  function render() {
    const s = scenes[idx];
    textEl.textContent = s.text;
    btnA.textContent = s.a;
    btnB.textContent = s.b;
    result.textContent = "";
  }
  function choose(which) {
    const s = scenes[idx];
    const key = "scenario-" + idx;
    if (which === s.good) {
      result.style.color = "#16a34a";
      result.textContent = "قرار ممتاز. " + s.tip + " (+8 نقاط)";
      gamificationState.addPoints(8, key);
    } else {
      result.style.color = "#dc2626";
      result.textContent = "قرار خطر. " + s.tip;
    }
    if (window.renderGamification) window.renderGamification();
    idx = (idx + 1) % scenes.length;
    setTimeout(render, 1200);
  }
  btnA.addEventListener("click", () => choose("a"));
  btnB.addEventListener("click", () => choose("b"));
  render();
})();

// Senior-friendly mode and read-aloud
(function seniorModeAndReadAloud() {
  const toggle = document.getElementById("seniorModeToggle");
  const readBtn = document.getElementById("readPageBtn");
  const stopBtn = document.getElementById("stopReadingBtn");
  const status = document.getElementById("readStatus");
  if (!toggle) return;

  const modeKey = "seniorModeEnabled";
  const enabled = localStorage.getItem(modeKey) === "1";
  document.body.classList.toggle("senior-mode", enabled);
  toggle.textContent = enabled ? "إيقاف وضع كبار السن" : "وضع كبار السن";

  toggle.addEventListener("click", () => {
    const now = !document.body.classList.contains("senior-mode");
    document.body.classList.toggle("senior-mode", now);
    localStorage.setItem(modeKey, now ? "1" : "0");
    toggle.textContent = now ? "إيقاف وضع كبار السن" : "وضع كبار السن";
  });

  if (!readBtn || !stopBtn || !status) return;
  readBtn.addEventListener("click", () => {
    if (!("speechSynthesis" in window)) {
      status.style.color = "#dc2626";
      status.textContent = "المتصفح لا يدعم القراءة الصوتية حالياً.";
      return;
    }
    const text =
      "مرحباً بك في الحصن الرقمي. تذكّر: لا تشارك كود التحقق ولا تضغط الروابط المشبوهة وتحقق دائماً من المصدر الرسمي.";
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ar-SA";
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
    status.style.color = "#16a34a";
    status.textContent = "تم تشغيل القراءة الصوتية.";
  });
  stopBtn.addEventListener("click", () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    status.style.color = "#475569";
    status.textContent = "تم إيقاف القراءة الصوتية.";
  });
})();

// Custom Checklist generator + print
(function customChecklist() {
  const form = document.getElementById("checklistForm");
  const out = document.getElementById("customChecklistResult");
  const printBtn = document.getElementById("printChecklistBtn");
  if (!form || !out || !printBtn) return;

  function buildChecklist(device, apps, usage) {
    const items = [
      "فعّل المصادقة الثنائية في البريد والحسابات الأساسية.",
      "استخدم مدير كلمات مرور مع عبارة مرور قوية.",
      "حدّث النظام والتطبيقات بشكل دوري.",
    ];
    if (device === "android" || device === "ios") items.push("عطّل التثبيت من مصادر غير موثوقة على الهاتف.");
    if (device === "windows" || device === "mac") items.push("فعّل جدار الحماية ومضاد الفيروسات مع فحص أسبوعي.");
    if (usage === "senior") items.push("فعّل وضع كبار السن وراجع الروابط مع شخص موثوق قبل الضغط.");
    if (usage === "startup") items.push("طبّق سياسات صلاحيات الفريق ومراجعة الوصول للملفات المشتركة.");
    if (apps.includes("واتساب")) items.push("فعّل قفل التطبيق ببصمة وتحقق بخطوتين في واتساب.");
    if (apps.includes("فيسبوك") || apps.includes("انستجرام")) items.push("راجع جلسات تسجيل الدخول المشبوهة دورياً.");
    if (apps.includes("البنك")) items.push("لا تحفظ بيانات البطاقة في المتصفح وفعل إشعارات العمليات البنكية.");
    return items;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const device = document.getElementById("deviceType").value;
    const apps = document.getElementById("appsUsed").value.toLowerCase();
    const usage = document.getElementById("usageStyle").value;
    if (!device || !usage) {
      out.textContent = "يرجى اختيار نوع الجهاز وطبيعة الاستخدام.";
      return;
    }
    const items = buildChecklist(device, apps, usage);
    out.innerHTML = "<strong>قائمة التدقيق المخصصة:</strong><ul>" + items.map((i) => "<li>" + i + "</li>").join("") + "</ul>";
    gamificationState.addPoints(6, "custom-checklist");
    if (window.renderGamification) window.renderGamification();
  });

  printBtn.addEventListener("click", () => window.print());
})();

// Data Breach Alert (demo + API placeholder)
(function dataBreachAlert() {
  const emailInput = document.getElementById("breachEmailInput");
  const btn = document.getElementById("breachCheckBtn");
  const result = document.getElementById("breachResult");
  if (!emailInput || !btn || !result) return;

  const knownRiskDomains = ["yahoo.com", "hotmail.com", "linkedin.com", "adobe.com"];
  btn.addEventListener("click", async () => {
    const email = emailInput.value.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      result.textContent = "يرجى إدخال بريد إلكتروني صحيح.";
      return;
    }

    const domain = email.split("@")[1];
    const risky = knownRiskDomains.includes(domain);
    result.innerHTML =
      risky
        ? "<strong>تنبيه:</strong> هذا النطاق ظهر في تسريبات معروفة تاريخياً. غيّر كلمات المرور فوراً وفعّل 2FA."
        : "<strong>لا توجد مؤشرات عالية في الفحص المحلي.</strong> للحصول على نتيجة دقيقة لحظية، اربط الأداة بخدمة HIBP عبر API آمن في الخادم.";
  });
})();

// AI Cyber Assistant (heuristic local model)
(function aiCyberAssistant() {
  const input = document.getElementById("aiAssistantInput");
  const btn = document.getElementById("aiAssistantBtn");
  const out = document.getElementById("aiAssistantResult");
  if (!input || !btn || !out) return;

  const riskRules = [
    { pattern: /otp|كود|رمز التحقق|cvv|رقم البطاقة/i, reason: "طلب معلومات حساسة مباشرة." },
    { pattern: /عاجل|خلال دقائق|إيقاف الحساب|آخر فرصة/i, reason: "استعجال وتخويف لدفعك لقرار سريع." },
    { pattern: /رابط|bit\.ly|tinyurl|تحقق من حسابك/i, reason: "احتمال رابط تصيد أو إعادة توجيه مشبوهة." },
    { pattern: /اربح|جائزة|استثمار 200|مكافأة مجانية/i, reason: "وعود غير واقعية شائعة في الاحتيال." },
  ];

  btn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) {
      out.textContent = "ألصق رسالة أولاً لتحليلها.";
      return;
    }
    const hits = riskRules.filter((r) => r.pattern.test(text));
    const score = Math.min(100, hits.length * 30 + (text.length < 30 ? 10 : 0));
    if (score >= 60) {
      out.innerHTML =
        "<strong>التقييم: غالباً احتيالية (" +
        score +
        "%)</strong><br>" +
        hits.map((h) => "- " + h.reason).join("<br>") +
        "<br><strong>الإجراء:</strong> لا تضغط أي رابط وتحقق من الجهة عبر قناة رسمية.";
      return;
    }
    out.innerHTML =
      "<strong>التقييم: منخفض إلى متوسط الخطورة (" +
      score +
      "%)</strong><br>لا توجد مؤشرات قوية كافية، لكن استمر بالتحقق من الرابط والمرسل قبل التفاعل.";
  });
})();

// Scam Wall (local crowdsourcing demo)
(function scamWall() {
  const form = document.getElementById("scamWallForm");
  const list = document.getElementById("scamWallList");
  if (!form || !list) return;
  const key = "scamWallEntriesV1";
  let entries;
  try {
    entries = JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    entries = [];
  }

  function save() {
    localStorage.setItem(key, JSON.stringify(entries));
  }

  function render() {
    list.innerHTML = entries
      .map((e) => {
        return (
          "<div class='community-item'><strong>" +
          e.title +
          "</strong> (" +
          e.type +
          ")<br>" +
          e.description +
          (e.image ? "<br><img src='" + e.image + "' alt='بلاغ احتيال'>" : "") +
          "</div>"
        );
      })
      .join("");
    if (!entries.length) list.textContent = "لا توجد بلاغات بعد. كن أول من يضيف بلاغاً توعوياً.";
  }

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const title = document.getElementById("scamTitle").value.trim();
    const type = document.getElementById("scamType").value;
    const description = document.getElementById("scamDescription").value.trim();
    const imageFile = document.getElementById("scamImage").files[0];
    if (!title || !type || !description) return;

    const addEntry = (imageData) => {
      entries.unshift({ title, type, description, image: imageData || "" });
      entries = entries.slice(0, 20);
      save();
      render();
      form.reset();
      gamificationState.addPoints(12, "wall-" + title + "-" + type);
      if (window.renderGamification) window.renderGamification();
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => addEntry(reader.result);
      reader.readAsDataURL(imageFile);
    } else {
      addEntry("");
    }
  });

  render();
})();
