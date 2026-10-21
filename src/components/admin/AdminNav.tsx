"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const ITEMS: { href: string; label: string; icon: IconName; adminOnly?: boolean }[] = [
  { href: "/admin", label: "Dashboard", icon: "clock" },
  { href: "/admin/orders", label: "Orders", icon: "truck" },
  { href: "/admin/products", label: "Products", icon: "flame" },
  { href: "/admin/categories", label: "Categories", icon: "filter" },
  { href: "/admin/cities", label: "Cities & delivery", icon: "pin", adminOnly: true },
  { href: "/admin/reviews", label: "Reviews", icon: "star" },
  { href: "/admin/guides", label: "Guides & recipes", icon: "leaf" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "mail" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "gift" },
  { href: "/admin/settings", label: "Site settings", icon: "globe", adminOnly: true },
  { href: "/admin/users", label: "Team", icon: "shield", adminOnly: true },
];

export function AdminNav({ role }: { role: "admin" | "staff" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = ITEMS.filter((item) => !item.adminOnly || role === "admin");

  const list = (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-paper/10 text-paper" : "text-paper/65 hover:bg-paper/5 hover:text-paper",
              )}
            >
              <Icon name={item.icon} size={17} />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-paper/80 lg:hidden"
        aria-expanded={open}
      >
        <Icon name="menu" size={18} /> Menu
      </button>
      <nav className={cn("mt-4 lg:block", open ? "block" : "hidden")} aria-label="Admin">
        {list}
      </nav>
    </>
  );
}
