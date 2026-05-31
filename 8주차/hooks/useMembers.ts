import { useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import kuromImg from '../assets/쿠로미.png';
import type { Member, Part, MemberFormData } from '../types';

const PARTS: Part[] = ['Frontend', 'Backend', 'Design'];

const BADGES: Record<Part, string[]> = {
  Frontend: ['React', 'TypeScript', 'Vue', 'Next.js'],
  Backend: ['Spring', 'Node.js', 'Django', 'Express'],
  Design: ['Figma', 'Design System', 'Sketch', 'Adobe XD'],
};

let nextId = 2;

const initialMembers: Member[] = [
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

interface RandomUserResult {
  name: { first: string; last: string };
  location: { city: string; country: string };
  email: string;
  phone: string;
  picture: { large: string };
}

interface RandomUserApiResponse {
  results: RandomUserResult[];
}

async function fetchRandomUsers(count: number): Promise<Member[]> {
  const res = await fetch(`https://randomuser.me/api/?results=${count}&nat=us,gb,ca,au,nz`);
  const data: RandomUserApiResponse = await res.json();
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

export interface UseMembersReturn {
  members: Member[];
  loading: boolean;
  formData: MemberFormData;
  setFormData: Dispatch<SetStateAction<MemberFormData>>;
  addRandom: (count: number) => Promise<void>;
  removeLast: () => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  refresh: () => void;
}

export function useMembers(): UseMembersReturn {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<MemberFormData>({ name: '', part: 'Frontend', intro: '' });

  const addRandom = useCallback(async (count: number) => {
    setLoading(true);
    const newMembers = await fetchRandomUsers(count);
    setMembers((prev) => [...prev, ...newMembers]);
    setLoading(false);
  }, []);

  useEffect(() => {
    addRandom(3);
  }, [addRandom]);

  const removeLast = () => {
    setMembers((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const badge = BADGES[formData.part][0];
    const id = nextId++;
    const newMember: Member = {
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
