const ROLE_META = {
  superadmin: {
    label: "Super Admin",
    badgeVariant: "destructive",
  },
  admin: {
    label: "Admin",
    badgeVariant: "default",
  },
  staff: {
    label: "Staff",
    badgeVariant: "secondary",
  },
} as const;

type RoleKey = keyof typeof ROLE_META;

export function getRoleMeta(role?: string | null) {
  if (!role) return null;
  const key = role as RoleKey;
  return ROLE_META[key] ?? { label: role, badgeVariant: "outline" as const };
}