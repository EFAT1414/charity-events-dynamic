const card = (e) => `
  <div class="col-md-4 mb-3">
    <div class="card h-100 shadow-sm">
      <img class="card-img-top" src="${e.image_url || '/img/demo.png'}" alt="${e.name}">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${e.name}</h5>
        <p class="card-text small mb-1"><strong>Date:</strong> ${e.event_date}</p>
        <p class="card-text small flex-grow-1"><strong>Location:</strong> ${e.location}</p>
        <a href="/event.html?id=${e.id}" class="btn btn-outline-primary mt-auto">View Details</a>
      </div>
    </div>
  </div>`;

async function load() {
  const res = await fetch('/api/events?status=upcoming');
  const upcoming = await res.json();
  document.getElementById('upcoming').innerHTML = upcoming.map(card).join('');

  const res2 = await fetch('/api/events?status=past');
  const past = await res2.json();
  document.getElementById('past').innerHTML = past.map(card).join('');
}
load();
