import {
  BarChart3,
  Briefcase,
  LayoutTemplate,
  ShoppingCart,
  Megaphone,
  CreditCard,
  Cpu,
  SlidersHorizontal,
  Users,
  ScrollText,
} from "lucide-react";
import { NavItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
  {
    id: "analytics",
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    id: "industry-services",
    label: "Industry & Services",
    href: "/industry-services",
    icon: Briefcase,
  },
  {
    id: "industry-templates",
    label: "Industry Templates",
    href: "/industry-templates",
    icon: LayoutTemplate,
  },
  {
    id: "orders",
    label: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    id: "campaigns",
    label: "Campaigns",
    href: "/campaigns",
    icon: Megaphone,
  },
  {
    id: "plans",
    label: "Plans",
    href: "/plans",
    icon: CreditCard,
  },
  {
    id: "integrations",
    label: "Integrations",
    href: "/integrations",
    icon: Cpu,
  },
  {
    id: "custom-fields",
    label: "Custom Fields",
    href: "/custom-fields",
    icon: SlidersHorizontal,
  },
  {
    id: "user-management",
    label: "User Management",
    href: "/user-management",
    icon: Users,
  },
  {
    id: "system-logs",
    label: "System Logs",
    href: "/system-logs",
    icon: ScrollText,
  },
];
