"use client";

import Image from "next/image";
import Footer from "@/components/common/footer";
import { useRouter } from "next/navigation";

import { readUser } from "./actions/readUser";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = await readUser(username, password);

    if (user) {
      // check user role, then push route to appropriate page depending on role
      const userRole = user.user_role.toLowerCase();
      console.log(userRole);

      switch (userRole) {
        case "admin":
          router.push("/admin");
          break;
        case "inquirer":
          router.push("/inquirer");
          break;
        case "personnel":
          router.push("/personnel");
          break;
        case "dispatcher":
          router.push("/dispatcher");
          break;
        default:
          alert("Invalid username or password");
      }
    } else {
      // show error message
      alert("Invalid username or password");
    }

  };

  return (
    <>
    <div className="bg-black/65 bg-[url(/images/ust.jpg)] bg-blend-overlay bg-center">
      <div className="h-160 grid grid-cols-6 content-center inset-x-0 max-w-max mx-auto">
        <div className="h-100 left-content col-span-2 col-start-2">
          <Image
            src="/images/stthomas.jpg"
            alt="St. Thomas"
            width={400}
            height={400}
            className="object-cover object-center h-full rounded-l-2xl"
          />
        </div>

        <div className="right-content col-span-2 col-start-4 content-center justify-self-center w-full bg-white/75 rounded-r-2xl">
          <div className="title py-3">
            <h1 className="text-5xl font-bold justify-self-center font-main">
              THINQ
            </h1>
            <p className="justify-self-center font-sub">
              Welcome to Thomasian Inquirer
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-2/3 flex flex-col py-5 justify-self-center"
          >
            <label htmlFor="username" className="py-1 font-sub">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="outline mb-2 rounded-xs p-1 bg-black/10"
              onChange={(e) => setUsername(e.target.value)}
            />

            <label htmlFor="password" className="py-1 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="outline mb-2 rounded-xs p-1 bg-black/10"
              onChange={(e) => setPassword(e.target.value)}
            />

            <a href="" className="text-xs underline italic">
              Forgot Password?
            </a>

            <button
              type="submit"
              className="mx-auto w-50 mt-8 bg-white hover:bg-gray-100 font-semibold py-2 px-4 rounded shadow cursor-pointer"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}