(function () {
  var form = document.getElementById('waitlist');
  if (!form) return;
  var input = document.getElementById('email');
  var button = form.querySelector('button');
  var status = document.getElementById('form-status');
  var fineprint = document.getElementById('fineprint');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    button.disabled = true;
    input.disabled = true;
    button.textContent = 'Joining…';
    status.textContent = '';
    status.classList.remove('error');

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: input.value.trim() })
    }).then(function (res) {
      if (!res.ok) throw new Error(res.status);
      form.hidden = true;
      fineprint.hidden = true;
      status.classList.add('success');
      status.textContent = "You're on the list. We'll email you once.";
    }).catch(function () {
      button.disabled = false;
      input.disabled = false;
      button.textContent = 'Get early access';
      status.classList.add('error');
      status.textContent = 'Something went wrong — please try again, or email hello@cameraduel.com.';
    });
  });
})();
