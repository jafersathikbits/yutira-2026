/** fetch() wrapper for the app's JSON API: returns parsed data or throws an Error with the server's message. */
export async function api(url, { method = 'GET', body, ...rest } = {}) {
  const res = await fetch(url, {
    method,
    cache: 'no-store',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response (e.g. a proxy error page).
  }

  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } finally {
    window.location.href = '/login';
  }
}
