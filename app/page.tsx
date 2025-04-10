import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { createClient } from '@/utils/supabase/server'

export default function Home() {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center">
      <Title/>
      <Buttons/>
    </div>
  );
}

function Title() {
  return (
    <div className="flex flex-col items-center absolute top-1/3 text-center">
      <h1 className="text-5xl md:text-7xl font-bold defaulttext">
        welcome to debatify.
      </h1>
      <div className="mt-3 h-1 w-1/4 bg-gray-800 dark:bg-white rounded-full opacity-80" />
    </div>
  );
}
async function Buttons() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  // Conditional rendering based on data being available
  return (
    <>
      {data?.user ? (
        <div className="flex items-center mt-12">
          <Link href='/main' className="submitbutton w-48">
            <span>get searching</span>
            <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
      ) : (
        <div className="flex items-center mt-12">
          <Link href='/account/login' className="submitbutton w-48">
            <span>login/signup</span>
            <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
          <Link href='/main' className="submitbutton w-48 ml-6">
            <span>use as guest</span>
            <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>)}
    </>
  );
}
