const params = new URLSearchParams(location.search);
const id = Number(params.get('id'));
const eventIdInput = document.getElementById('event_id');
const eventSummary = document.getElementById('eventSummary');
const form = document.getElementById('regForm');
const msg = document.getElementById('msg');

async function loadEvent() {
  if (!id) {
    eventSummary.textContent = 'Missing event id.';
    form.style.display = 'none';
    return;
  }
  const r = await fetch('/api/events/' + id);
  if (!r.ok) { eventSummary.textContent = 'Event not found.'; form.style.display='none'; return; }
  const e = await r.json();
  eventIdInput.value = e.id;
  eventSummary.innerHTML = `<strong>${e.name}</strong> — ${e.event_date} • ${e.location} (${Number(e.price) === 0 ? 'Free' : '$'+Number(e.price).toFixed(2)})`;
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  data.event_id = Number(data.event_id);
  data.tickets = Number(data.tickets);
  const res = await fetch('/api/registrations', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.ok) {
    msg.innerHTML = `<div class="alert alert-success">Thanks! Your tickets are confirmed.</div>`;
    form.reset();
  } else {
    const err = await res.json().catch(()=>({error:'Error'}));
    msg.innerHTML = `<div class="alert alert-danger">Could not register: ${err.error || 'Unknown error'}</div>`;
  }
});

loadEvent();
