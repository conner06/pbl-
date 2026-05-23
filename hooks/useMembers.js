import { useState, useCallback, useEffect } from 'react';
import kuromImg from '../assets/쿠로미.png';

const PARTS = ['Frontend', 'Backend', 'Design'];

const BADGES = {
  Frontend: ['React', 'TypeScript', 'Vue', 'Next.js'],
  Backend: ['Spring', 'Node.js', 'Django', 'Express'],
  Design: ['Figma', 'Design System', 'Sketch', 'Adobe XD'],
};

let nextId = 2;

const initialMembers = [
  {
    id: 1,
    name: '민규',
    part: 'Frontend',
    intro: '잘 부탁드립니다.',
    email: 'conner06conner@gmail.com',
    phone: '010-5095-6985',
    skills: ['HTML / CSS', 'JavaScript', 'React'],
    picture: kuromImg,
  },
];

async function fetchRandomUsers(count) {
  const res = await fetch(`https://randomuser.me/api/?results=${count}&nat=us,gb,ca,au,nz`);
  const data = await res.json();
  return data.results.map((u) => {
    const part = PARTS[Math.floor(Math.random() * PARTS.length)];
    const badges = BADGES[part];
    const badge = badges[Math.floor(Math.random() * badges.length)];
    const id = nextId++;
    return {
      id,
      name: `${u.name.first} ${u.name.last}`,
      part,
      intro: `${u.location.city}, ${u.location.country}`,
      bio: `${u.location.city} ${part} 활동하고 있습니다.`,
      email: u.email,
      phone: u.phone,
      picture: u.picture.large,
      badge,
      skills: [],
    };
  });
}

export function useMembers() {
  const [members, setMembers] = useState(initialMembers);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', part: 'Frontend', intro: '' });

  // useEffect: 컴포넌트가 처음 화면에 나타날 때 딱 한 번 자동으로 실행됨
  // API 호출 같은 "부작용"은 렌더링과 분리해서 여기서 처리
  const addRandom = useCallback(async (count) => {
    setLoading(true);
    const newMembers = await fetchRandomUsers(count);
    setMembers((prev) => [...prev, ...newMembers]);
    setLoading(false);
  }, []);

  useEffect(() => {
    addRandom(3); // 앱 시작 시 자동으로 랜덤 3명 불러오기
  }, [addRandom]);

  const removeLast = () => {
    setMembers((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const badge = BADGES[formData.part][0];
    const id = nextId++;
    const newMember = {
      id,
      name: formData.name,
      part: formData.part,
      intro: formData.intro || '아직 소개가 없습니다.',
      bio: formData.intro || '아직 소개가 없습니다.',
      email: '',
      phone: '',
      website: '',
      skills: [],
      quote: '',
      badge,
      picture: `https://picsum.photos/seed/${id}/400/280`,
      isMine: false,
    };
    setMembers((prev) => [...prev, newMember]);
    setFormData({ name: '', part: 'Frontend', intro: '' });
  };

  const refresh = () => {
    setMembers((prev) => [...prev]);
  };

  return {
    members,
    loading,
    formData,
    setFormData,
    addRandom,
    removeLast,
    handleFormSubmit,
    refresh,
  };
}
