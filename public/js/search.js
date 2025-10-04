async function loadCategories() {
  const sel = document.querySelector('select[name="category"]');
  sel.innerHTML = '<option value="">Any</option>';
  const res = await fetch('/api/categories');
  const cats = await res.json();
  for (const c of cats) {
    const opt = document.createElement('option');
    opt.value = c.slug;
    opt.textContent = c.name;
    sel.appendChild(opt);
  }
}

const card = (e) => `
  <div class="col-md-4 mb-3">
    <div class="card h-100 shadow-sm">
      <img class="card-img-top" src="${e.image_url || '/img/demo.png'}" alt="${e.name}">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${e.name}</h5>
        <p class="card-text small mb-1"><strong>Date:</strong> ${e.event_date}</p>
        <p class="card-text small mb-1"><strong>Location:</strong> ${e.location}</p>
        <span class="badge badge-info mb-2">${e.category_name}</span>
        <span class="badge badge-${e.status === 'upcoming' ? 'success' : 'secondary'} mb-2">${e.status}</span>
        <a href="/event.html?id=${e.id}" class="btn btn-outline-primary mt-auto">View Details</a>
      </div>
    </div>
  </div>`;

const form = document.getElementById('search-form');
const results = document.getElementById('results');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const params = new URLSearchParams([...data.entries()].filter(([,v]) => v));
  const res = await fetch('/api/events?' + params.toString());
  const arr = await res.json();
  results.innerHTML = arr.length ? arr.map(card).join('') : '<div class="col-12 text-muted">No events found.</div>';
});

document.getElementById('reset').addEventListener('click', () => {
  form.reset();
  results.innerHTML = '';
});

loadCategories();
