import Link from "next/link";

interface NavbarProps {
  navBarLink?: string;
  navBarLinkName?: string;
}

export default function NavBar({ navBarLink, navBarLinkName }: NavbarProps) {
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
          {navBarLink && navBarLinkName && (
            <Link
              href={navBarLink}
              className="font-bold transition-all duration-300 hover:text-zinc-500"
            >
              {navBarLinkName}
            </Link>
          )}
          <Link
            href="/"
            className="font-sub font-bold transition-all duration-300 hover:text-zinc-500"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}
