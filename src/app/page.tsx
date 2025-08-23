'use client';

import { useRouter } from "next/navigation";



function Page() {

  const router = useRouter();

  const handlebutton = () =>{
    router.push('/login');
  }

  return (
    <>
      <div className="flex flex-col bg-blue-300 lg:h-[100vh] overflow-y-auto">
        <div className="lg:h-[9%]">
        </div>
        <div className="flex justify-center items-center bg-yellow-00 lg:h-[91%]">
          {/* <h1 className="font-semibold text-5xl bg-green-00">Vertix Tax Solutions</h1> */}
          <button className="cursor-pointer text-black" onClick={handlebutton}>Login</button>
        </div>
      </div>
    </>
  )
}

export default Page