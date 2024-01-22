document.querySelector('#logout').addEventListener('click', (e) => {
  e.preventDefault();
  fetch('api/v1/users/logout', {
    method: 'POST',
  }).then((response) => {
    response.json().then((data) => {
      if (data.status) {
        location.href = '/';
      }
    });
  });
});
