import Link from "next/link";

interface FooterProps {
  backgroundImage?: string;
  background?: string;
}

export default function Footer({ backgroundImage, background }: FooterProps) {
  return (
    <footer className="bg-zinc-100">
      <div className="mx-auto w-full max-w-screen-xl p-2 md:py-4">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            href="/"
            className="text-2xl font-medium tracking-wider transition-all duration-500 hover:text-zinc-500"
          >
            <span className="font-main self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              ThInq
            </span>
          </Link>
          <ul className="font-sub flex flex-wrap items-center text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <Link href="/about" className="mr-4 hover:underline md:mr-6">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
