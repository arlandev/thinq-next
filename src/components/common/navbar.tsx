"use client";

import Link from "next/link";
import { clearUserSession, getUserSession } from "@/lib/session";
import { useEffect, useState } from "react";

interface NavbarProps {
  navBarLink?: string;
  navBarLinkName?: string;
}

export default function NavBar({ navBarLink, navBarLinkName }: NavbarProps) {
  const handleLogout = () => {
    clearUserSession();
    window.location.href = '/';
  };

  const [userSession, setUserSession] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const session = getUserSession();
    setUserSession(session);
  }, []);

  return (
    <nav className="flex flex-row bg-gray-100 py-4 drop-shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex">
          <Link
            href="/"
            className="transition:all font-main text-2xl font-medium tracking-wider duration-500 hover:text-zinc-500"
          >
            ThInq
          </Link>
        </div>
        <div className="font-sub flex flex-row items-center space-x-6">
          {/* Keep a stable span node to avoid hydration mismatches; fill content after mount */}
          <span className="text-sm text-gray-600">
            {isMounted && userSession ? (
              <>Welcome, {userSession.user_firstname} {userSession.user_lastname}</>
            ) : (
              ""
            )}
          </span>
          {navBarLink && navBarLinkName && (
            <Link
              href={navBarLink}
              className="font-bold transition-all duration-300 hover:text-zinc-500"
            >
              {navBarLinkName}
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="font-sub font-bold transition-all duration-300 hover:text-zinc-500"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
