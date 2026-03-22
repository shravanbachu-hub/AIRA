// // const API = '/api';

// // function getToken() { return localStorage.getItem('aira_token'); }
// // function setToken(t) { localStorage.setItem('aira_token', t); }
// // function clearToken() { localStorage.removeItem('aira_token'); }

// // async function apiFetch(path, opts = {}) {
// //   const token = getToken();
// //   const res = await fetch(API + path, {
// //     ...opts,
// //     headers: {
// //       'Content-Type': 'application/json',
// //       ...(token ? { Authorization: `Bearer ${token}` } : {}),
// //       ...(opts.headers || {}),
// //     },
// //   });
// //   const data = await res.json();
// //   if (!res.ok) throw { status: res.status, ...data };
// //   return data;
// // }

// // export async function login(email, password) {
// //   const data = await apiFetch('/login', {
// //     method: 'POST',
// //     body: JSON.stringify({ email, password }),
// //   });
// //   setToken(data.token);
// //   return data.user;
// // }

// // export async function register(name, email, phone, password) {
// //   return apiFetch('/register', {
// //     method: 'POST',
// //     body: JSON.stringify({ name, email, phone, password }),
// //   });
// // }

// // export async function forgotPassword(email) {
// //   return apiFetch('/forgot-password', {
// //     method: 'POST',
// //     body: JSON.stringify({ email }),
// //   });
// // }

// // export async function getMe() {
// //   return apiFetch('/me');
// // }

// // export async function logout() {
// //   clearToken();
// // }

// // // Admin
// // export async function getPending() {
// //   return apiFetch('/admin/pending');
// // }

// // export async function getApproved() {
// //   return apiFetch('/admin/approved');
// // }

// // export async function approveUser(email) {
// //   return apiFetch('/admin/approve', {
// //     method: 'POST',
// //     body: JSON.stringify({ email }),
// //   });
// // }

// // export async function rejectUser(email) {
// //   return apiFetch('/admin/reject', {
// //     method: 'POST',
// //     body: JSON.stringify({ email }),
// //   });
// // }

// // export async function removeUser(email) {
// //   return apiFetch('/admin/remove', {
// //     method: 'POST',
// //     body: JSON.stringify({ email }),
// //   });
// // }

// // export { getToken };





// const API = '/api';

// function getToken() { return localStorage.getItem('aira_token'); }
// function setToken(t) { localStorage.setItem('aira_token', t); }
// function clearToken() { localStorage.removeItem('aira_token'); }

// async function apiFetch(path, opts = {}) {
//   const token = getToken();
//   const res = await fetch(API + path, {
//     ...opts,
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...(opts.headers || {}),
//     },
//   });
//   const data = await res.json();
//   if (!res.ok) throw { status: res.status, ...data };
//   return data;
// }

// export async function login(email, password) {
//   const data = await apiFetch('/login', {
//     method: 'POST',
//     body: JSON.stringify({ email, password }),
//   });
//   setToken(data.token);
//   return data.user;
// }

// export async function register(name, email, phone, password) {
//   return apiFetch('/register', {
//     method: 'POST',
//     body: JSON.stringify({ name, email, phone, password }),
//   });
// }

// export async function forgotPassword(email) {
//   return apiFetch('/forgot-password', {
//     method: 'POST',
//     body: JSON.stringify({ email }),
//   });
// }

// export async function getMe() {
//   return apiFetch('/me');
// }

// export async function logout() {
//   clearToken();
// }

// // Challenge
// export async function submitChallenge(data) {
//   return apiFetch('/challenge', {
//     method: 'POST',
//     body: JSON.stringify(data),
//   });
// }

// // Admin
// export async function getPending() {
//   return apiFetch('/admin/pending');
// }

// export async function getApproved() {
//   return apiFetch('/admin/approved');
// }

// export async function approveUser(email) {
//   return apiFetch('/admin/approve', {
//     method: 'POST',
//     body: JSON.stringify({ email }),
//   });
// }

// export async function rejectUser(email) {
//   return apiFetch('/admin/reject', {
//     method: 'POST',
//     body: JSON.stringify({ email }),
//   });
// }

// export async function removeUser(email) {
//   return apiFetch('/admin/remove', {
//     method: 'POST',
//     body: JSON.stringify({ email }),
//   });
// }

// export { getToken };


const API = '/api';

function getToken() { return localStorage.getItem('aira_token'); }
function setToken(t) { localStorage.setItem('aira_token', t); }
function clearToken() { localStorage.removeItem('aira_token'); }

async function apiFetch(path, opts = {}) {
  const token = getToken();
  const res = await fetch(API + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

export async function login(email, password) {
  const data = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data.user;
}

export async function register(name, email, phone, password) {
  return apiFetch('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, phone, password }),
  });
}

export async function forgotPassword(email) {
  return apiFetch('/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function getMe() {
  return apiFetch('/me');
}

export async function logout() {
  clearToken();
}

// Challenge
export async function submitChallenge(data) {
  return apiFetch('/challenge', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Admin
export async function getPending() {
  return apiFetch('/admin/pending');
}

export async function getApproved() {
  return apiFetch('/admin/approved');
}

export async function getChallenges() {
  return apiFetch('/admin/challenges');
}

export async function approveUser(email) {
  return apiFetch('/admin/approve', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function rejectUser(email) {
  return apiFetch('/admin/reject', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function removeUser(email) {
  return apiFetch('/admin/remove', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function approveChallenge(id) {
  return apiFetch('/admin/challenge/approve', {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
}

export async function rejectChallenge(id) {
  return apiFetch('/admin/challenge/reject', {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
}

export { getToken };
