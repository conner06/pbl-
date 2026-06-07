export type Part = 'Frontend' | 'Backend' | 'Design';

export interface Member {
  id: number;
  name: string;
  part: Part;
  intro: string;
  bio?: string;
  email?: string;
  phone?: string;
  website?: string;
  skills?: string[];
  quote?: string;
  badge?: string;
  picture?: string;
}

export interface MemberFormData {
  name: string;
  part: Part;
  intro: string;
}
