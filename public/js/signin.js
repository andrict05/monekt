const formSigninEl = document.querySelector('#form-signin');
const inputEmailEl = document.querySelector('#email');
const inputPasswordEl = document.querySelector('#password');
const buttonSigninEl = document.querySelector('#button-signin');
const alertEl = document.querySelector('[role="alert"]');

let alertTimeout = null;

const showAlertMessage = (
  type = 'info',
  title = 'Something went wrong',
  message = 'Unexpected  error occurred!',
  duration = 5,
) => {
  alertEl.classList.remove('alert-hidden');
  alertEl.setAttribute('data-type', type);
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
  const signinResponse = await fetch('api/v1/users/signin', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const signinResponseData = await signinResponse.json();
  if (signinResponse.status === 200 && signinResponse.ok === true) {
    inputEmailEl.value = inputPasswordEl.value = '';
    return window.location.replace('/');
  }
  showAlertMessage(
    'error',
    signinResponseData.messageTitle,
    signinResponseData.message,
    10,
  );
};

formSigninEl.addEventListener('submit', handleFormSigninSubmit);
