const members = [
  {
    name: '민규',
    part: 'Frontend',
    skills: ['HTML/CSS', 'JavaScript', 'React'],
    oneLine: '안녕하세요, 프론트엔드 파트 민규입니다.',
    intro: '웹 프론트엔드를 공부하고 있는 아기 사자입니다. 잘 부탁드립니다.',
    email: 'conner06conner@gmail.com',
    phone: '010-5095-6985',
    website: 'https://.',
    motto: "시험 아직도 안끝남!",
    isMine: true
  }
];

const club = '멋쟁이사자처럼';

const toggleBtn = document.getElementById('toggleFormBtn');
const form = document.getElementById('addForm');
const cancelBtn = document.getElementById('cancelBtn');
const removeBtn = document.getElementById('removeLastBtn');
const countNum = document.getElementById('countNum');
const summaryList = document.getElementById('summaryList');
const detailList = document.getElementById('detailList');

toggleBtn.addEventListener('click', () => {
  form.classList.toggle('open');
});

cancelBtn.addEventListener('click', () => {
  form.classList.remove('open');
  form.reset();
});

removeBtn.addEventListener('click', () => {
  if (members.length === 0) return;
  members.pop();
  render();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const m = {
    name: fd.get('name').trim(),
    part: fd.get('part'),
    skills: fd.get('skills').split(',').map(s => s.trim()).filter(Boolean),
    oneLine: fd.get('oneLine').trim(),
    intro: fd.get('intro').trim(),
    email: fd.get('email').trim(),
    phone: fd.get('phone').trim(),
    website: fd.get('website').trim(),
    motto: fd.get('motto').trim(),
    isMine: false
  };
  if (m.skills.length < 3) {
    alert('관심 기술은 최소 3개 이상 입력해주세요.');
    return;
  }
  members.push(m);
  form.reset();
  form.classList.remove('open');
  render();
});

function render() {
  countNum.textContent = members.length;

  summaryList.innerHTML = '';
  detailList.innerHTML = '';

  members.forEach((m) => {

    const card = document.createElement('div');
    card.className = 'summary-card' + (m.isMine ? ' mine' : '');
    card.innerHTML = `
      <div class="profile-wrap">
        <img src="/Users/parkminkyu/Desktop/멋사/pbl-til/3주차/쿠로미.png" alt="">
        <span class="badge">${m.skills[0] || ''}</span>
      </div>
      <div><strong>${m.name}</strong></div>
      <div>${m.part}</div>
      <div>${m.oneLine}</div>
    `;
    summaryList.appendChild(card);

    const detail = document.createElement('div');
    detail.className = 'detail-card';
    detail.innerHTML = `
      <h3>${m.name}</h3>
      <div>소속 파트: ${m.part}</div>
      <div>동아리명: ${club}</div>
      <p>${m.intro}</p>
      <div>관심 기술</div>
      <ul>${m.skills.map(s => `<li>${s}</li>`).join('')}</ul>
      <div>이메일: ${m.email || '-'}</div>
      <div>전화번호: ${m.phone || '-'}</div>
      <div>웹사이트: ${m.website || '-'}</div>
      <div>한 마디: ${m.motto || '-'}</div>
    `;
    detailList.appendChild(detail);
  });
}

render();
