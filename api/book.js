const querystring = require('querystring');

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const contentType = req.headers['content-type'] || '';
      try {
        if (contentType.includes('application/json')) {
          resolve(JSON.parse(body || '{}'));
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          resolve(querystring.parse(body));
        } else {
          // fallback: attempt to parse as urlencoded
          resolve(querystring.parse(body));
        }
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', err => reject(err));
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    return res.end('Method Not Allowed');
  }

  let formData;
  try {
    formData = await parseBody(req);
  } catch (err) {
    console.error('Error parsing form body', err);
    res.statusCode = 400;
    return res.end('Invalid form data');
  }

  // Simple spam/honeypot check
  if (formData['bot-field']) {
    // silently succeed
    res.writeHead(302, { Location: '/bookaservice/?success=1' });
    return res.end();
  }

  const FORMSPREE_ID = process.env.FORMSPREE_ID;
  if (!FORMSPREE_ID) {
    console.error('FORMSPREE_ID not configured');
    res.statusCode = 500;
    return res.end('Form service not configured');
  }

  const endpoint = `https://formspree.io/f/${FORMSPREE_ID}`;

  // Build payload to Formspree. They accept JSON.
  const payload = {
    name: formData.name || '',
    email: formData.email || formData._replyto || '',
    phone: formData.phone || '',
    service_type: formData.service_type || '',
    message: formData.message || ''
  };

  try {
    const fetchRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (fetchRes.ok) {
      // redirect back to the booking page with success flag
      res.writeHead(302, { Location: '/bookaservice/?success=1' });
      return res.end();
    } else {
      const text = await fetchRes.text();
      console.error('Formspree error', fetchRes.status, text);
      res.writeHead(302, { Location: '/bookaservice/?success=0' });
      return res.end();
    }
  } catch (err) {
    console.error('Error submitting to Formspree', err);
    res.writeHead(302, { Location: '/bookaservice/?success=0' });
    return res.end();
  }
};
