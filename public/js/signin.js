const formSigninEl = document.querySelector('#form-signin');
const inputEmailEl = document.querySelector('#email');
const inputPasswordEl = document.querySelector('#password');
const buttonSigninEl = document.querySelector('#button-signin');
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

const handleFormSigninSubmit = async (e) => {
  e.preventDefault();
  const email = inputEmailEl.value;
  const password = inputPasswordEl.value;
  console.log({ email, password });
};

formSigninEl.addEventListener('submit', handleFormSigninSubmit);
