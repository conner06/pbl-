import { useState } from 'react';

export function useFilter(members) {
  const [filterPart, setFilterPart] = useState('전체');
  const [sortBy, setSortBy] = useState('latest');
  const [searchName, setSearchName] = useState('');

  // 여러 상태(필터 + 정렬 + 검색)가 조합되어 최종 displayed 목록이 결정됨
  // 데이터 흐름: members(원본) → filter → sort → displayed(화면에 표시될 것)
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
