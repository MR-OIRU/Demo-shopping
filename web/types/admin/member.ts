export type MemberListItem = {
  id: string;
  role: string;
  profile: string;
  username: string;
  email: string;
  phone: string;
  lastLogin: string;
  created: string;
  status: string;
};

export interface MemberItem {
  id: string;
  username: string;
  email: string;
  role: string;
  phone?: string | null;
  profileUrl?: string | null;
}
