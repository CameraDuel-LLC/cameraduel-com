/* Beta gate for CameraDuel.
 *
 * HONESTY NOTE — this is a "members-only door," not real security. A static
 * page can't keep a secret: the write-up and any links below already exist in
 * the page source. This passcode only hashes what the visitor types so the code
 * itself isn't sitting here in plaintext. The REAL access control is TestFlight
 * / Google Play testing itself — the invite list or the link you choose to
 * share. Don't put anything here that would be harmful if a stranger read it.
 *
 * ── To change the passcode ──────────────────────────────────────────────
 *   Entry is case-insensitive (the code is lowercased before hashing), so
 *   hash the LOWERCASE form of your code:
 *       printf '%s' 'yourcode' | shasum -a 256
 *   Paste the hex into EXPECTED_HASH. (Default passcode: first-flock)
 *
 * ── To turn on the install buttons ──────────────────────────────────────
 *   Set TESTFLIGHT_URL and/or ANDROID_URL below. While a URL is empty, that
 *   button renders as a muted "— coming soon" pill instead of a live link.
 */
(function () {
  var EXPECTED_HASH = '4b34405b5e108098830c768c56e0294f31090837ad67f82b4e5cd4ef4b783648'; // first-flock
  var TESTFLIGHT_URL = ''; // e.g. 'https://testflight.apple.com/join/XXXXXXXX'
  var ANDROID_URL = '';    // e.g. your Play internal-testing opt-in URL

  var UNLOCK_KEY = 'cd_beta_ok';
  var gate = document.getElementById('gate');
  var beta = document.getElementById('beta');
  var form = document.getElementById('gateform');
  var input = document.getElementById('code');
  var err = document.getElementById('gate-err');

  function toHex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) {
      return b.toString(16).padStart(2, '0');
    }).join('');
  }

  function pill(label, url) {
    if (url) return '<a class="storebtn live" href="' + url + '">' + label + '</a>';
    return '<span class="storebtn soon">' + label + ' — coming soon</span>';
  }

  function unlock() {
    if (gate) gate.hidden = true;
    if (beta) beta.hidden = false;
    var el = document.getElementById('storebtns');
    if (el) el.innerHTML = pill('iOS · TestFlight', TESTFLIGHT_URL) + pill('Android', ANDROID_URL);
  }

  // Stay unlocked across refreshes within the same tab session.
  try { if (sessionStorage.getItem(UNLOCK_KEY) === '1') unlock(); } catch (e) {}

  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    err.textContent = '';
    var val = (input.value || '').trim().toLowerCase();
    if (!val) return;
    if (!(window.crypto && window.crypto.subtle)) {
      err.textContent = 'This browser can’t check the code — email admin@cameraduel.com.';
      return;
    }
    window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(val)).then(function (buf) {
      if (toHex(buf) === EXPECTED_HASH) {
        try { sessionStorage.setItem(UNLOCK_KEY, '1'); } catch (e) {}
        unlock();
      } else {
        err.textContent = 'That code didn’t work. Double-check it, or email admin@cameraduel.com.';
        input.select();
      }
    });
  });
})();
