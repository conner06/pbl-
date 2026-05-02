const members = [
  {
    name: '민규',
    part: 'Frontend',
    intro: '웹 프론트엔드를 공부하고 있는 아기 사자입니다. 잘 부탁드립니다.',
    isMine: true
  }
];

const form = document.getElementById('addForm');
const toggleBtn = document.getElementById('toggleFormBtn');
const removeLastBtn = document.getElementById('removeLastBtn');
const add1 = document.getElementById('add1');
const add5 = document.getElementById('add5');
const reply = document.getElementById('reply');
const countNum = document.getElementById('countNum');
const summaryList = document.getElementById('summaryList');


toggleBtn.addEventListener('click', () => {
  form.classList.toggle('open');
});

removeLastBtn.addEventListener('click', () => {
  if (members.length > 0) {
    members.pop();
    render();
  }
});

const PARTS = ['Frontend', 'Backend', 'Design'];

async function fetchRandomUsers(count) {
  const res = await fetch(`https://randomuser.me/api/?results=${count}&nat=us,gb,ca,au,nz`);
  const data = await res.json();
  return data.results.map((u) => ({
    name: `${u.name.first} ${u.name.last}`,
    part: PARTS[Math.floor(Math.random() * PARTS.length)],
    intro: `${u.location.city}, ${u.location.country}`,
    picture: u.picture.medium,
    isMine: false,
  }));
}

add1.addEventListener('click', async () => {
  add1.disabled = true;
  const newMembers = await fetchRandomUsers(1);
  members.push(...newMembers);
  render();
  add1.disabled = false;
});

add5.addEventListener('click', async () => {
  add5.disabled = true;
  const newMembers = await fetchRandomUsers(5);
  members.push(...newMembers);
  render();
  add5.disabled = false;
});

reply.addEventListener('click', () => {
  render();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const m = {
    name: fd.get('name').trim(),
    part: fd.get('part'),
    intro: fd.get('intro').trim(),
    isMine: false
  };

  members.push(m);
  form.reset();
  form.classList.remove('open');
  render();
});


function render() {
  countNum.textContent = members.length;

  summaryList.innerHTML = '';

  members.forEach((m) => {
    const card = document.createElement('div');
    card.className = 'summary-card' + (m.isMine ? ' mine' : '');
    card.innerHTML = `
      <div class="profile-wrap">
        <img src="${m.picture || '쿠로미.png'}" alt="">
        <span class="badge">${m.part}</span>
      </div>
      <div><strong>${m.name}</strong></div>
      <div>${m.part}</div>
      <div>${m.intro}</div>
    `;
    summaryList.appendChild(card);
  });
}

render();
