"use client";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";

export interface AdminNavButtonTypes {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  path: string;
  name: string;
  disabled?: boolean;
}

const AdminNavButton = ({
  icon: Icon,
  path,
  name,
  disabled,
}: AdminNavButtonTypes) => {
  const pathName = usePathname();
  const isActive = pathName === path;

  return (
    <Link
      href={path}
      aria-disabled={disabled}
      className={`flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-lg text-sm transition-all duration-200
        ${isActive 
          ? "bg-indigo-600 text-white shadow-sm" 
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
      `}
    >
      {Icon && <Icon size={16} />}

      <span className="font-medium text-sm md:text-base">
        {name}
      </span>
    </Link>
  );
};

export default AdminNavButton;