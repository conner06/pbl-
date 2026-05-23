import { useSearchParams } from 'react-router-dom';

export function useFilter(members) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterPart = searchParams.get('part') || '전체';
  const sortBy = searchParams.get('sort') || 'latest';
  const searchName = searchParams.get('q') || '';

  const setFilterPart = (part) => {
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

  const setSortBy = (sort) => {
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

  const setSearchName = (name) => {
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
    if (filterPart !== '전체' && m.part !== filterPart) return false;
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
