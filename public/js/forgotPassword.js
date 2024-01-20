const formResetPasswordEl = document.querySelector('#form-reset-password');
const inputEmailEl = document.querySelector('#email');
const inputPasswordEl = document.querySelector('#password');
const buttonRessetEl = document.querySelector('#button-reset');
const alertEl = document.querySelector('[role="alert"]');

let alertTimeout = null;

const showAlertMessage = (
  title = 'Something went wrong',
  message = 'Unexpected  error occurred!',
  duration = 5,
) => {
  alertEl.classList.remove('alert-hidden');
  alertEl.querySelector('[role="alert-title"]').textContent = title;
  alertEl.querySelector('[role="alert-message"]').textContent = message;
  alertTimeout && clearTimeout(alertTimeout);
  alertTimeout = setTimeout(() => {
    alertEl.classList.add('alert-hidden');
  }, duration * 1000);
};

const handleFormResetPasswordSubmit = async (e) => {
  e.preventDefault();
  const email = inputEmailEl.value;
  const password = inputPasswordEl.value;
  console.log({ email, password });
};

formResetPasswordEl.addEventListener('submit', handleFormResetPasswordSubmit);