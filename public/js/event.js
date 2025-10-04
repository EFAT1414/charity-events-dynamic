const root = document.getElementById('event-root');
const id = new URLSearchParams(location.search).get('id');

function progressBar(goal, raised) {
  const g = Number(goal||0), r = Number(raised||0);
  const pct = g > 0 ? Math.min(100, Math.round((r/g)*100)) : 0;
  return `
  <div>
    <div class="d-flex justify-content-between small mb-1">
      <span>Raised: $${r.toFixed(2)}</span>
      <span>Goal: $${g.toFixed(2)}</span>
    </div>
    <div class="progress">
      <div class="progress-bar" role="progressbar" style="width:${pct}%">${pct}%</div>
    </div>
  </div>`;
}

async function init() {
  const res = await fetch('/api/events/' + id);
  if (!res.ok) {
    root.innerHTML = '<div class="alert alert-danger">Event not found.</div>';
    return;
  }
  const e = await res.json();
  root.innerHTML = `
  <div class="row">
    <div class="col-md-7">
      <img class="img-fluid rounded mb-3" src="${e.image_url || '/img/demo.png'}" alt="${e.name}">
      <h1 class="h4">${e.name}</h1>
      <p class="mb-1"><strong>When:</strong> ${e.event_date} ${e.start_time}–${e.end_time}</p>
      <p class="mb-1"><strong>Where:</strong> ${e.location}</p>
      <p class="mb-1"><strong>Category:</strong> ${e.category_name}</p>
      <p class="mb-3"><strong>Organisation:</strong> ${e.org_name}${e.org_website ? ' • <a href="'+e.org_website+'" target="_blank" rel="noopener">Website</a>' : ''}</p>
      <p>${e.description}</p>

      <h2 class="h5 mt-4">Goal vs. Progress</h2>
      ${progressBar(e.goal_amount, e.raised_amount)}
    </div>
    <div class="col-md-5">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Tickets & Registration</h5>
          <p class="card-text"><strong>Price:</strong> ${Number(e.price) === 0 ? 'Free' : '$'+Number(e.price).toFixed(2)}</p>
          <form id="reg-form">
            <input type="hidden" name="event_id" value="${e.id}">
            <div class="form-group">
              <label>Name</label>
              <input name="name" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Tickets</label>
              <input type="number" name="tickets" min="1" max="20" value="1" class="form-control" required>
            </div>
            <button class="btn btn-primary btn-block" type="submit">Register</button>
          </form>
          <div id="msg" class="mt-3"></div>
        </div>
      </div>
    </div>
  </div>`;

  document.getElementById('reg-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    payload.event_id = Number(payload.event_id);
    payload.tickets = Number(payload.tickets);
    const res = await fetch('/api/registrations', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    const msg = document.getElementById('msg');
    if (res.ok) {
      msg.innerHTML = '<div class="alert alert-success">Thank you! Your registration has been received.</div>';
      ev.currentTarget.reset();
    } else {
      const err = await res.json().catch(()=>({error:'Error'}));
      msg.innerHTML = '<div class="alert alert-danger">Could not register: '+(err.error||'Unknown error')+'</div>';
    }
  });
}
init();
