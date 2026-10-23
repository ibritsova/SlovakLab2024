// Form messages follow the language picked in the switcher (dictionary set by script.js)
function t(key, fallback) {
  const i18n = window.slI18n;
  return (i18n && i18n.dict && i18n.dict[key]) || fallback;
}

// "Навчання у Словаччині" consultation form — sends via EmailJS and fires
// the Meta Pixel Lead event; fields: name, phone, email, messenger, comment.
function validateSkConsultForm(event) {
  event.preventDefault();

  document.getElementById("skNameError").textContent = "";
  document.getElementById("skEmailError").textContent = "";
  document.getElementById("skPhoneError").textContent = "";

  let valid = true;

  const name = document.getElementById("sk-name").value.trim();
  if (!name) {
    document.getElementById("skNameError").textContent = t("form-err-name", "Введіть ваше ім'я.");
    valid = false;
  }

  const email = document.getElementById("sk-email").value.trim();
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(email)) {
    document.getElementById("skEmailError").textContent = t("form-err-email", "Введіть коректну email-адресу.");
    valid = false;
  }

  const phone = document.getElementById("sk-phone").value.trim();
  const phoneDigits = phone.replace(/[\s\-().+]/g, "");
  if (!/^\d{7,15}$/.test(phoneDigits)) {
    document.getElementById("skPhoneError").textContent = t("form-err-phone", "Введіть коректний номер телефону.");
    valid = false;
  }

  if (!valid) return;

  const sendButton = document.getElementById("skConsultSendButton");
  const sendLabel = sendButton.textContent;
  sendButton.disabled = true;
  sendButton.textContent = t("form-sending", "Надсилаємо…");

  const messengerInput = document.querySelector('input[name="sk-messenger"]:checked');
  const messenger = messengerInput ? messengerInput.value : "не вказано";
  const notes = document.getElementById("sk-notes").value.trim();

  const params = {
    name:      name,
    email:     email,
    phone:     phone,
    childAge:  "",
    messenger: messenger,
    notes:     notes,
    message:   "Заявка на консультацію (блок «Навчання у Словаччині»). Бажаний месенджер: " + messenger + "." +
               (notes ? "\nКоментар: " + notes : ""),
    level:     "не вказано"
  };

  emailjs.send("service_jgex8hj", "template_w7m91ya", params)
    .then(function (response) {
      console.log("SK consult lead sent successfully", response);

      // Facebook Pixel conversion event
      if (typeof fbq === "function") fbq("track", "Lead");

      document.getElementById("skConsultForm").classList.add("form-hidden");
      document.getElementById("skConsultSuccess").style.display = "block";
    })
    .catch(function (err) {
      console.error("EmailJS error (SK consult form):", err);
      sendButton.disabled = false;
      sendButton.textContent = sendLabel;
      alert(t("form-send-error", "Помилка відправки. Спробуйте ще раз або напишіть нам на email: slovakklab@gmail.com") + "\n\n" + JSON.stringify(err));
    });
}

// Trial-lesson CTA on the courses page — same send logic and Lead event as
// the consultation form, minimal field set (name, phone, course of interest).
function validateTrialForm(event) {
  event.preventDefault();

  document.getElementById("trialNameError").textContent = "";
  document.getElementById("trialPhoneError").textContent = "";

  let valid = true;

  const name = document.getElementById("trial-name").value.trim();
  if (!name) {
    document.getElementById("trialNameError").textContent = t("form-err-name", "Введіть ваше ім'я.");
    valid = false;
  }

  const phone = document.getElementById("trial-phone").value.trim();
  const phoneDigits = phone.replace(/[\s\-().+]/g, "");
  if (!/^\d{7,15}$/.test(phoneDigits)) {
    document.getElementById("trialPhoneError").textContent = t("form-err-phone", "Введіть коректний номер телефону.");
    valid = false;
  }

  if (!valid) return;

  const sendButton = document.getElementById("trialSendButton");
  const sendLabel = sendButton.textContent;
  sendButton.disabled = true;
  sendButton.textContent = t("form-sending", "Надсилаємо…");

  const course = document.getElementById("trial-course").value;
  const messengerInput = document.querySelector('input[name="trial-messenger"]:checked');
  const messenger = messengerInput ? messengerInput.value : "не вказано";

  const params = {
    name:      name,
    email:     "",
    phone:     phone,
    childAge:  "",
    messenger: messenger,
    message:   "Заявка на пробний урок (сторінка курсів). Бажаний месенджер: " + messenger + ".",
    level:     course || "не вказано"
  };

  emailjs.send("service_jgex8hj", "template_w7m91ya", params)
    .then(function (response) {
      console.log("Trial lesson lead sent successfully", response);

      // Facebook Pixel conversion event
      if (typeof fbq === "function") fbq("track", "Lead");

      document.getElementById("trialForm").classList.add("form-hidden");
      document.getElementById("trialFormSuccess").hidden = false;
    })
    .catch(function (err) {
      console.error("EmailJS error (trial form):", err);
      sendButton.disabled = false;
      sendButton.textContent = sendLabel;
      alert(t("form-send-error", "Помилка відправки. Спробуйте ще раз або напишіть нам на email: slovakklab@gmail.com") + "\n\n" + JSON.stringify(err));
    });
}

// Single event listener — no onclick needed on the button
document.addEventListener("DOMContentLoaded", function () {
  const skConsultForm = document.getElementById("skConsultForm");
  if (skConsultForm) skConsultForm.addEventListener("submit", validateSkConsultForm);

  const trialForm = document.getElementById("trialForm");
  if (trialForm) trialForm.addEventListener("submit", validateTrialForm);
});
