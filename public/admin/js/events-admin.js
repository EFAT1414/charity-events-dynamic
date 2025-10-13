const tokenEl = document.getElementById('token');
const list = document.getElementById('list');
const msg = document.getElementById('msg');
const form = document.getElementById('eventForm');

async function api(path, opts={}) {
  const headers = Object.assign({'Content-Type':'application/json'}, opts.headers||{});
  const token = tokenEl.value.trim();
  if (token) headers['X-ADMIN-TOKEN'] = token;
  const res = await fetch(path, {...opts, headers});
  if (!res.ok) throw await res.json().catch(()=>({error:'Request failed'}));
  return res.json().catch(()=>({ok:true}));
}

function formDataObject(form) {
  const o = Object.fromEntries(new FormData(form).entries());
  ['id','org_id','category_id','suspended','goal_amount','raised_amount','price'].forEach(k => {
    if (o[k] === '' || o[k] == null) return;
    o[k] = Number(o[k]);
  });
  return o;
}

async function loadEvents() {
  const res = await fetch('/api/events?status=all');
  const arr = await res.json();
  list.innerHTML = arr.map(e => `
    <div class="col-md-4 mb-3">
      <div class="card h-100 shadow-sm">
        <img class="card-img-top" src="${e.image_url || '/img/demo.png'}" alt="">
        <div class="card-body">
          <h5 class="card-title">${e.name}</h5>
          <div class="small-muted">${e.event_date} • ${e.location}</div>
          <div class="mt-2"><span class="badge ${e.status==='upcoming'?'bg-success':'bg-secondary'}">${e.status}</span>
            ${e.suspended ? '<span class="badge bg-danger ms-1">suspended</span>' : ''}
          </div>
          <button class="btn btn-sm btn-outline-primary mt-2" onclick='fillForm(${JSON.stringify(e).replace(/'/g,"&#39;")})'>Edit</button>
        </div>
      </div>
    </div>`).join('');
}

window.fillForm = (e) => {
  const fields = ['id','org_id','category_id','name','description','location','event_date','start_time','end_time','price','goal_amount','raised_amount','suspended','image_url'];
  fields.forEach(f => (form.elements[f] || {}).value = (e[f] ?? ''));
  msg.innerHTML = '';
};

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  try {
    const o = formDataObject(form);
    await api('/api/admin/events', { method:'POST', body: JSON.stringify(o) });
    msg.innerHTML = '<div class="alert alert-success">Created.</div>';
    form.reset(); loadEvents();
  } catch (e) {
    msg.innerHTML = `<div class="alert alert-danger">${e.error||'Failed'}</div>`;
  }
});

document.getElementById('btnUpdate').onclick = async () => {
  try {
    const o = formDataObject(form);
    if (!o.id) { msg.innerHTML = '<div class="alert alert-warning">Provide Event ID to update.</div>'; return; }
    await api('/api/admin/events/'+o.id, { method:'PUT', body: JSON.stringify(o) });
    msg.innerHTML = '<div class="alert alert-success">Updated.</div>';
    loadEvents();
  } catch (e) { msg.innerHTML = `<div class="alert alert-danger">${e.error||'Failed'}</div>`; }
};

document.getElementById('btnDelete').onclick = async () => {
  try {
    const id = form.elements['id'].value;
    if (!id) { msg.innerHTML = '<div class="alert alert-warning">Provide Event ID to delete.</div>'; return; }
    await api('/api/admin/events/'+id, { method:'DELETE' });
    msg.innerHTML = '<div class="alert alert-success">Deleted.</div>';
    form.reset(); loadEvents();
  } catch (e) { msg.innerHTML = `<div class="alert alert-danger">${e.error||'Failed'}</div>`; }
};

loadEvents();
