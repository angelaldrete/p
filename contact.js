document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");
  const successMsg = document.getElementById("successMessage");

  if (!form) return;

  document.addEventListener("languageChanged", () => {
    const btn = document.querySelector(".submit-btn");
    const lang = localStorage.getItem("preferred-language") || "es";
    if (btn && !btn.disabled)
      btn.textContent = translations[lang]?.contact_form_submit;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector(".submit-btn");
    const lang = localStorage.getItem("preferred-language") || "es";
    const originalText = btn.textContent;

    btn.textContent = translations[lang]?.contact_form_sending || "Enviando...";
    btn.disabled = true;

    const formData = new FormData(form);
    formData.append("_gotcha", "");
    formData.append("_language", lang);

    try {
      const res = await fetch("https://formspree.io/f/mjgejyrn", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        form.style.display = "none";
        successMsg.style.display = "block";
        if (typeof gtag !== "undefined")
          gtag("event", "form_submission", { event_category: "contact" });
      } else throw new Error("Error");
    } catch (err) {
      feedback.style.display = "block";
      feedback.className = "form-feedback error";
      feedback.textContent =
        translations[lang]?.contact_form_error || "Error. Intenta de nuevo.";
      btn.textContent = originalText;
      btn.disabled = false;
      setTimeout(() => (feedback.style.display = "none"), 5000);
    }
  });

  document.querySelectorAll(".faq-item").forEach((item) =>
    item.addEventListener("click", function () {
      this.classList.toggle("active");
    }),
  );
});
