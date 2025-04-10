import Link from 'next/link'
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Page(){
    return(
        <div className='flex flex-col min-h-screen'>
            <Link href='/' className='text text-yellow-500 flex p-12 '>
                <ArrowLeftIcon className="md:w-6" />
                <span className='ml-1'>Back</span>
            </Link>
            <h1 className='flex flex-col justify-center defaulttext items-center text-3xl'> Something went wrong. Maybe an expired authorization link?</h1> 
        </div>
    );
}