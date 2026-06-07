import { useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import { supabase } from '../lib/supabase';
import type { Member, Part, MemberFormData } from '../types';
import type { Database } from '../types/supabase';

type LionRow = Database['public']['Tables']['lions']['Row'];

const PARTS: Part[] = ['Frontend', 'Backend', 'Design'];

const BADGES: Record<Part, string[]> = {
  Frontend: ['React', 'TypeScript', 'Vue', 'Next.js'],
  Backend: ['Spring', 'Node.js', 'Django', 'Express'],
  Design: ['Figma', 'Design System', 'Sketch', 'Adobe XD'],
};

// DB Row -> 앱에서 사용하는 Member 타입으로 변환
function rowToMember(row: LionRow): Member {
  return {
    id: row.id,
    name: row.name,
    part: row.part as Part,
    intro: row.intro,
    bio: row.bio ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    website: row.website ?? undefined,
    skills: row.skills ?? [],
    quote: row.quote ?? undefined,
    badge: row.badge ?? undefined,
    picture: row.picture ?? undefined,
  };
}

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

async function fetchRandomUsers(count: number): Promise<Omit<Member, 'id'>[]> {
  const res = await fetch(`https://randomuser.me/api/?results=${count}&nat=us,gb,ca,au,nz`);
  const data: RandomUserApiResponse = await res.json();
  return data.results.map((u) => {
    const part = PARTS[Math.floor(Math.random() * PARTS.length)];
    const badges = BADGES[part];
    const badge = badges[Math.floor(Math.random() * badges.length)];
    return {
      name: `${u.name.first} ${u.name.last}`,
      part,
      intro: `${u.location.city}, ${u.location.country}`,
      bio: `${u.location.city}에서 ${part}으로 활동하고 있습니다.`,
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
  error: string | null;
  formData: MemberFormData;
  setFormData: Dispatch<SetStateAction<MemberFormData>>;
  addRandom: (count: number) => Promise<void>;
  removeLast: () => Promise<void>;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useMembers(): UseMembersReturn {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    part: 'Frontend',
    intro: '',
  });

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('lions')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error('[fetchMembers]', error);
      setError(error.message);
    } else if (data) {
      setMembers(data.map(rowToMember));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const addRandom = useCallback(async (count: number) => {
    setLoading(true);
    const randomMembers = await fetchRandomUsers(count);
    const inserts = randomMembers.map((m) => ({
      name: m.name,
      part: m.part as string,
      intro: m.intro,
      bio: m.bio ?? null,
      email: m.email ?? null,
      phone: m.phone ?? null,
      picture: m.picture ?? null,
      badge: m.badge ?? null,
      skills: m.skills ?? [],
    }));
    const { data, error } = await supabase.from('lions').insert(inserts).select();
    if (error) {
      console.error('[addRandom]', error);
      setError(error.message);
    } else if (data) {
      setMembers((prev) => [...prev, ...data.map(rowToMember)]);
    }
    setLoading(false);
  }, []);

  const removeLast = useCallback(async () => {
    if (members.length === 0) return;
    const lastId = members[members.length - 1].id;
    const { error } = await supabase.from('lions').delete().eq('id', lastId);
    if (error) {
      console.error('[removeLast]', error);
      setError(error.message);
    } else {
      setMembers((prev) => prev.slice(0, -1));
    }
  }, [members]);

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const part = formData.part;
      const badge = BADGES[part][0];
      const insert = {
        name: formData.name,
        part: part as string,
        intro: formData.intro || '아직 소개가 없습니다.',
        bio: formData.intro || null,
        email: null,
        phone: null,
        badge,
        skills: [],
        picture: `https://picsum.photos/seed/${Date.now()}/400/280`,
      };
      const { data, error } = await supabase.from('lions').insert([insert]).select().single();
      if (error) {
        console.error('[handleFormSubmit]', error);
        setError(error.message);
      } else if (data) {
        setMembers((prev) => [...prev, rowToMember(data)]);
        setFormData({ name: '', part: 'Frontend', intro: '' });
      }
    },
    [formData],
  );

  const refresh = useCallback(async () => {
    await fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    loading,
    error,
    formData,
    setFormData,
    addRandom,
    removeLast,
    handleFormSubmit,
    refresh,
  };
}
