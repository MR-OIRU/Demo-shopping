export interface UserItem {
  id: string;
  username: string;
  email: string;
  role: string;
  phone?: string | null;
  profileUrl?: string | null;
}
