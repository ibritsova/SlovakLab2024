function validateForm(event) {
  event.preventDefault();

  // Clear previous errors
  document.getElementById("usernameError").textContent = "";
  document.getElementById("emailError").textContent  = "";
  document.getElementById("phoneError").textContent  = "";

  let valid = true;

  const username = document.getElementById("name").value.trim();
  if (!username) {
    document.getElementById("usernameError").textContent = "Введіть ваше ім'я.";
    valid = false;
  }

  const email = document.getElementById("email").value.trim();
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(email)) {
    document.getElementById("emailError").textContent = "Введіть коректну email-адресу.";
    valid = false;
  }

  // Allow spaces, dashes, parentheses — strip them before checking digits
  const phone = document.getElementById("phone").value.trim();
  const phoneDigits = phone.replace(/[\s\-().+]/g, "");
  if (!/^\d{7,15}$/.test(phoneDigits)) {
    document.getElementById("phoneError").textContent = "Введіть коректний номер телефону.";
    valid = false;
  }

  if (!valid) return;

  const sendButton = document.getElementById("sendButton");
  sendButton.disabled = true;
  sendButton.textContent = "Надсилаємо…";

  const childAgeField = document.getElementById("child-age");

  const params = {
    name:     username,
    email:    email,
    phone:    phone,
    childAge: childAgeField ? childAgeField.value.trim() : "",
    message:  document.getElementById("notes").value,
    level:    document.getElementById("level").value
  };

  emailjs.send("service_jgex8hj", "template_w7m91ya", params)
    .then(function (response) {
      console.log("Email sent successfully", response);

      // Facebook Pixel conversion event
      if (typeof fbq === "function") fbq("track", "Lead");

      document.getElementById("registrationForm").classList.add("form-hidden");
      document.getElementById("registration-title").classList.add("form-hidden");
      document.getElementById("successMessage").style.display = "block";
      history.pushState(null, "", "#thank-you");
    })
    .catch(function (err) {
      console.error("EmailJS error:", err);
      sendButton.disabled = false;
      sendButton.textContent = "Надіслати";
      alert("Помилка відправки. Спробуйте ще раз або напишіть нам на email: slovakklab@gmail.com\n\nДеталі: " + JSON.stringify(err));
    });
}

// "Навчання у Словаччині" consultation form — same send logic and Lead
// event as the main form, minimal field set (name, phone, email only).
function validateSkConsultForm(event) {
  event.preventDefault();

  document.getElementById("skNameError").textContent = "";
  document.getElementById("skEmailError").textContent = "";
  document.getElementById("skPhoneError").textContent = "";

  let valid = true;

  const name = document.getElementById("sk-name").value.trim();
  if (!name) {
    document.getElementById("skNameError").textContent = "Введіть ваше ім'я.";
    valid = false;
  }

  const email = document.getElementById("sk-email").value.trim();
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(email)) {
    document.getElementById("skEmailError").textContent = "Введіть коректну email-адресу.";
    valid = false;
  }

  const phone = document.getElementById("sk-phone").value.trim();
  const phoneDigits = phone.replace(/[\s\-().+]/g, "");
  if (!/^\d{7,15}$/.test(phoneDigits)) {
    document.getElementById("skPhoneError").textContent = "Введіть коректний номер телефону.";
    valid = false;
  }

  if (!valid) return;

  const sendButton = document.getElementById("skConsultSendButton");
  sendButton.disabled = true;
  sendButton.textContent = "Надсилаємо…";

  const params = {
    name:     name,
    email:    email,
    phone:    phone,
    childAge: "",
    message:  "Заявка на консультацію (блок «Навчання у Словаччині»).",
    level:    "не вказано"
  };

  emailjs.send("service_jgex8hj", "template_w7m91ya", params)
    .then(function (response) {
      console.log("SK consult lead sent successfully", response);

      // Facebook Pixel conversion event — same Lead event as the main form
      if (typeof fbq === "function") fbq("track", "Lead");

      document.getElementById("skConsultForm").classList.add("form-hidden");
      document.getElementById("skConsultSuccess").style.display = "block";
    })
    .catch(function (err) {
      console.error("EmailJS error (SK consult form):", err);
      sendButton.disabled = false;
      sendButton.textContent = "Записатись на консультацію";
      alert("Помилка відправки. Спробуйте ще раз або напишіть нам на email: slovakklab@gmail.com\n\nДеталі: " + JSON.stringify(err));
    });
}

// Trial-lesson CTA on the courses page — same send logic and Lead event as
// the main form, minimal field set (name, phone, course of interest).
function validateTrialForm(event) {
  event.preventDefault();

  document.getElementById("trialNameError").textContent = "";
  document.getElementById("trialPhoneError").textContent = "";

  let valid = true;

  const name = document.getElementById("trial-name").value.trim();
  if (!name) {
    document.getElementById("trialNameError").textContent = "Введіть ваше ім'я.";
    valid = false;
  }

  const phone = document.getElementById("trial-phone").value.trim();
  const phoneDigits = phone.replace(/[\s\-().+]/g, "");
  if (!/^\d{7,15}$/.test(phoneDigits)) {
    document.getElementById("trialPhoneError").textContent = "Введіть коректний номер телефону.";
    valid = false;
  }

  if (!valid) return;

  const sendButton = document.getElementById("trialSendButton");
  sendButton.disabled = true;
  sendButton.textContent = "Надсилаємо…";

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

      // Facebook Pixel conversion event — same Lead event as the main form
      if (typeof fbq === "function") fbq("track", "Lead");

      document.getElementById("trialForm").classList.add("form-hidden");
      document.getElementById("trialFormSuccess").hidden = false;
    })
    .catch(function (err) {
      console.error("EmailJS error (trial form):", err);
      sendButton.disabled = false;
      sendButton.textContent = "Відправити";
      alert("Помилка відправки. Спробуйте ще раз або напишіть нам на email: slovakklab@gmail.com\n\nДеталі: " + JSON.stringify(err));
    });
}

// Single event listener — no onclick needed on the button
document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("registrationForm");
  if (registrationForm) registrationForm.addEventListener("submit", validateForm);

  const skConsultForm = document.getElementById("skConsultForm");
  if (skConsultForm) skConsultForm.addEventListener("submit", validateSkConsultForm);

  const trialForm = document.getElementById("trialForm");
  if (trialForm) trialForm.addEventListener("submit", validateTrialForm);
});
