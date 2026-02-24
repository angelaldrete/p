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

    if (typeof grecaptcha !== "undefined") {
      const captchaResponse = grecaptcha.getResponse();
      if (!captchaResponse) {
        alert("Por favor completa el reCAPTCHA");
        return;
      }
    }

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
      } else {
        const data = await res.json();
        console.error("Formspree error:", data);

        if (data.error && data.error.includes("captcha")) {
          throw new Error("captcha_error");
        } else {
          throw new Error("form_error");
        }
      }
    } catch (err) {
      feedback.style.display = "block";
      feedback.className = "form-feedback error";

      let errorMessage =
        translations[lang]?.contact_form_error || "Error. Intenta de nuevo.";

      if (err.message === "captcha_error") {
        errorMessage =
          "Error de validación del captcha. Por favor intenta de nuevo.";
        // Resetear reCAPTCHA
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.reset();
        }
      }

      feedback.textContent = errorMessage;
      btn.textContent = originalText;
      btn.disabled = false;

      setTimeout(() => (feedback.style.display = "none"), 5000);
    }
  });

  // FAQ accordion functionality
  document.querySelectorAll(".faq-item h3").forEach((title) => {
    title.addEventListener("click", function () {
      this.parentElement.classList.toggle("active");
    });
  });
});
