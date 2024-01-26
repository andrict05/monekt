const HOSTNAME = `http://localhost/`;

(async () => {
  const response = await fetch(HOSTNAME + "api/v1/users/authenticated", {
    credentials: "include",
  });
  const data = await response.json();
  const user = data?.data?.user;
  if (user) {
    window.location.href = "/home.html";
  }
})();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const langSelectEl = document.querySelector("#select__language");
const loadingOverlayEl = document.querySelector(".overlay");
const msgBoxEl = document.querySelector(".msg-box");

const cookies = document.cookie.split("; ");
const langCookie = cookies.find((cookie) => cookie.startsWith("lang="));
langSelectEl.value = langCookie ? langCookie.split("=")[1] : "en-UK";

let current = "login";
let displaying = false;

const showLogin = () => {
  current = "login";
  document.querySelector(".signup").classList.add("hidden");
  document.querySelector(".login").classList.remove("hidden");
  document.querySelector('a[href="?login"]').classList.add("hidden");
};

const showSignup = () => {
  current = "signup";
  document.querySelector(".signup").classList.remove("hidden");
  document.querySelector(".login").classList.add("hidden");
  document.querySelector('a[href="?login"]').classList.remove("hidden");
};

const showLoading = (show = false) => {
  loadingOverlayEl.classList[show ? "remove" : "add"]("hidden");
};

if (urlParams.get("login") !== null) {
  showLogin();
  window.history.replaceState({}, "test", window.location.href.split("?")?.[0]);
}
if (urlParams.get("signup") !== null) {
  showSignup();
  window.history.pushState({}, "test", window.location.href.split("?")?.[0]);
}

let timeout;
const displayMessage = (message, type = "info", time = 5) => {
  if (type === "info") {
    msgBoxEl.style.setProperty("--msg-color", "var(--color-primary)");
  } else if (type === "error") {
    msgBoxEl.style.setProperty("--msg-color", "var(--color-error)");
  }
  msgBoxEl.querySelector("#msg-text").textContent = message;
  msgBoxEl.classList.remove("msg-hidden");
  if (displaying) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    msgBoxEl.classList.add("msg-hidden");
    displaying = false;
  }, time * 1000);
  displaying = true;
};

document.querySelector('a[href="?login"]')?.addEventListener("click", (e) => {
  e.preventDefault();
  showLogin();
});

document.querySelector('a[href="?signup"]')?.addEventListener("click", (e) => {
  e.preventDefault();
  showSignup();
});

document.querySelector(".form--login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const emailEl = document.getElementById("login_email");
  const passwordEl = document.getElementById("login_password");
  const emailValidEl = emailEl.parentElement.previousElementSibling;
  if (!validator.isEmail(emailEl.value)) {
    emailValidEl.querySelector(".validation__text").textContent =
      "Please enter a valid email.";
    emailValidEl.classList.remove("hidden");
  } else {
    emailValidEl.classList.add("hidden");
  }
  const pwValidEl = passwordEl.parentElement.previousElementSibling;
  if (!passwordEl.value) {
    pwValidEl.querySelector(".validation__text").textContent =
      "Please enter your password.";
    pwValidEl.classList.remove("hidden");
  } else {
    pwValidEl.classList.add("hidden");
  }
  showLoading(true);
  const response = await fetch(HOSTNAME + "api/v1/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: emailEl.value,
      password: passwordEl.value,
    }),
  });
  const data = await response.json();
  showLoading(false);
  if (response.status !== 200) {
    displayMessage(data.message, "error");
    return;
  }
  // window.localStorage.setItem('jwt', data.token);
  const user = data.data.data;
  window.location.href = "/home.html";
});

document
  .querySelector(".form--signup")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const usernameEl = document.getElementById("signup__username");
    const emailEl = document.getElementById("signup__email");
    const passwordEl = document.getElementById("signup__password");
    const confirmPasswordEl = document.getElementById(
      "signup__confirm-password",
    );
    const monthEl = document.querySelector("#signup__month");
    const dayEl = document.querySelector("#signup__day");
    const yearEl = document.querySelector("#signup__year");

    const usernameValidationEl = usernameEl.nextElementSibling;
    if (!validator.isAlphanumeric(usernameEl.value)) {
      usernameValidationEl.querySelector(".validation__text").textContent =
        "Please enter a valid username.";
      usernameValidationEl.classList.remove("hidden");
      return;
    } else {
      usernameValidationEl.classList.add("hidden");
    }
    const emailValidationEl = emailEl.nextElementSibling;
    if (!validator.isEmail(emailEl.value)) {
      emailValidationEl.querySelector(".validation__text").textContent =
        "Please enter a valid email.";
      emailValidationEl.classList.remove("hidden");
      return;
    } else {
      emailValidationEl.classList.add("hidden");
    }

    const passwordValidationEl =
      passwordEl.nextElementSibling.nextElementSibling;
    if (
      !validator.isStrongPassword(passwordEl.value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 0,
        pointsPerRepeat: 0,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
      })
    ) {
      passwordValidationEl.querySelector(".validation__text").textContent =
        "Password must contain small and capital letters, numbers and special characters.";
      passwordValidationEl.classList.remove("hidden");
      return;
    } else {
      passwordValidationEl.classList.add("hidden");
    }

    const confirmPasswordValidationEl = confirmPasswordEl.nextElementSibling;
    if (confirmPasswordEl.value !== passwordEl.value) {
      confirmPasswordValidationEl.querySelector(
        ".validation__text",
      ).textContent = "Passwords do not match.";
      confirmPasswordValidationEl.classList.remove("hidden");
      return;
    } else {
      confirmPasswordValidationEl.classList.add("hidden");
    }

    const date = `${yearEl.value}-${monthEl.value < 10 ? "0" : ""}${
      monthEl.value
    }-${dayEl.value < 10 ? "0" : ""}${dayEl.value}`;
    if (!validator.isDate(date)) {
      displayMessage("Please enter a valid date.", "error");
      return;
    }
    const gender = document.querySelector('input[name="gender"]:checked')
      .previousElementSibling.textContent;
    const formData = {
      email: emailEl.value,
      password: passwordEl.value,
      passwordConfirm: confirmPasswordEl.value,
      username: usernameEl.value,
      birthDate: new Date(date).toISOString(),
      gender,
    };
    const response = await fetch(HOSTNAME + "api/v1/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (response.status === 201) {
      window.location.href = "/";
    } else {
      displayMessage("Something went wrong.", "error");
    }
  });

document.querySelector("#signup__password").addEventListener("keyup", (e) => {
  const pwStrengthEl = document.querySelector(".password-strength");
  if (pwStrengthEl.classList.contains("hidden")) {
    pwStrengthEl.classList.remove("hidden");
  }
  const strengthTextEl = pwStrengthEl.querySelector(".strength-text");
  const strengthEl = pwStrengthEl.querySelector(".strength-fill");
  const score = validator.isStrongPassword(
    document.querySelector("#signup__password").value,
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: true,
      pointsPerUnique: 0,
      pointsPerRepeat: 0,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    },
  );
  strengthEl.style.width = `${(score / 40) * 100}%`;
  if (score <= 10) {
    strengthTextEl.textContent = "Weak";
    pwStrengthEl.style.setProperty("--strength-color", "var(--color-error)");
  } else if (score <= 20) {
    strengthTextEl.textContent = "Poor";
    pwStrengthEl.style.setProperty("--strength-color", "var(--color-pw-poor)");
  } else if (score <= 30) {
    strengthTextEl.textContent = "Good";
    pwStrengthEl.style.setProperty("--strength-color", "var(--color-pw-good)");
  } else if (score <= 40) {
    strengthTextEl.textContent = "Excellent";
    pwStrengthEl.style.setProperty(
      "--strength-color",
      "var(--color-pw-excellent)",
    );
  }
});

langSelectEl.addEventListener("change", (e) => {
  document.cookie = `lang=${langSelectEl.value};`;
  window.location.reload();
});
