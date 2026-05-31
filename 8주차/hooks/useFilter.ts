import { useSearchParams } from 'react-router-dom';
import type { Member, Part } from '../types';

export interface UseFilterReturn {
  filterPart: string;
  setFilterPart: (part: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  searchName: string;
  setSearchName: (name: string) => void;
  displayed: Member[];
}

export function useFilter(members: Member[]): UseFilterReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterPart = searchParams.get('part') || '전체';
  const sortBy = searchParams.get('sort') || 'latest';
  const searchName = searchParams.get('q') || '';

  const setFilterPart = (part: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (part === '전체') {
        next.delete('part');
      } else {
        next.set('part', part);
      }
      return next;
    });
  };

  const setSortBy = (sort: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (sort === 'latest') {
        next.delete('sort');
      } else {
        next.set('sort', sort);
      }
      return next;
    });
  };

  const setSearchName = (name: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!name) {
        next.delete('q');
      } else {
        next.set('q', name);
      }
      return next;
    });
  };

  let displayed = members.filter((m) => {
    if (filterPart !== '전체' && m.part !== (filterPart as Part)) return false;
    if (searchName && !m.name.toLowerCase().includes(searchName.toLowerCase())) return false;
    return true;
  });

  if (sortBy === 'part') {
    displayed = [...displayed].sort((a, b) => a.part.localeCompare(b.part));
  }

  return {
    filterPart,
    setFilterPart,
    sortBy,
    setSortBy,
    searchName,
    setSearchName,
    displayed,
  };
}
