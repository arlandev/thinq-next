import Image from "next/image";
import Footer from "@/components/common/footer";

export default function Home() {
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
            action="/"
            className="w-2/3 flex flex-col py-5 justify-self-center"
          >
            <label htmlFor="username" className="py-1 font-sub">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="outline mb-2 rounded-xs p-1 bg-black/10"
            />

            <label htmlFor="password" className="py-1 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="outline mb-2 rounded-xs p-1 bg-black/10"
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