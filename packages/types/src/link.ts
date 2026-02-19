import { Icon } from '@tabler/icons-react';

export type Link = { link: string; label: string; icon?: Icon };
export type NavLink = Link & { subLinks?: Link[] | null };
