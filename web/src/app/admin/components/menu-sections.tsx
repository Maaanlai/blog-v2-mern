import { ElementType } from "react";
import {
  PiArchiveDuotone,
  PiChartLineUpDuotone,
  PiUsersDuotone,
} from "react-icons/pi";

interface MenuItem {
  header: string;
  section: {
    name: string;
    href: string;
    icon: ElementType;
    dropdownItems?: {
      name: string;
      href: string;
      badge?: string;
    }[];
  }[];
}

export const menu: MenuItem[] = [
  {
    header: "Overview",
    section: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: PiChartLineUpDuotone,
      },
    ],
  },

  {
    header: "Management",
    section: [
      {
        name: "Users",
        icon: PiUsersDuotone,
        href: "/admin/user",
      },
      {
        name: "Blogs",
        icon: PiArchiveDuotone,
        href: "/admin/blog",
      },
    ],
  },
];

export type { MenuItem };
