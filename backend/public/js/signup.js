if (window.location.search.indexOf('?lang=') === 0) {
  window.history.replaceState({}, document.title, window.location.pathname);
}

const formSignupEl = document.querySelector('#form-signup');
const inputUsernameEl = document.querySelector('#username');
const inputEmailEl = document.querySelector('#email');
const inputPasswordEl = document.querySelector('#password');
const inputConfirmPasswordEl = document.querySelector('#confirmPassword');
const inputMonthEl = document.querySelector('#month');
const inputDayEl = document.querySelector('#day');
const inputYearEl = document.querySelector('#year');
const inputGenderMaleEl = document.querySelector('#male');
const inputGenderFemaleEl = document.querySelector('#female');
const buttonSignupEl = document.querySelector('#button-signup');
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

const handleFormSignupSubmit = async (e) => {
  e.preventDefault();
  const username = inputUsernameEl.value;
  const email = inputEmailEl.value;
  const password = inputPasswordEl.value;
  const confirmPassword = inputConfirmPasswordEl.value;
  const month = inputMonthEl.value;
  const day = +inputDayEl.value + 1;
  const year = inputYearEl.value;
  const male = inputGenderMaleEl.checked;
  const female = inputGenderFemaleEl.checked;

  const signupResponse = await fetch('api/v1/users/signup', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      username,
      passwordConfirm: confirmPassword,
      gender: male ? 'male' : 'female',
      birthDate: new Date(`${year}-${month}-${day}`).toISOString(),
    }),
  });
  const signupResponseData = await signupResponse.json();
  if (signupResponse.status === 201 && signupResponse.ok === true) {
    return window.location.replace('/');
  }
  showAlertMessage(
    'error',
    signupResponseData.messageTitle,
    signupResponseData.message,
    10,
  );
};

formSignupEl.addEventListener('submit', handleFormSignupSubmit);
