'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

function Page() {

    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const onClick = () =>{
        router.push('/signup');
    }

    return (
        <>
            <div className="bg-gray-300 lg:h-[100vh] flex justify-center items-center">
                <div className="bg-white shadow-lg lg:h-[60%] lg:w-[40%] lg:rounded-lg flex flex-col items-center justify-center">
                    <div className="p-3 w-[50%] flex flex-col">
                        <label htmlFor="email" className="block text-gray-700 mb-2">
                            Email..
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-[100%] px-4 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="mb-6 p-3 w-[50%] flex flex-col">
                        <label htmlFor="password" className="block text-gray-700 mb-2">
                            Password..
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-[100%] px-4 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 lg:hover:bg-indigo-700 lg:w-[45%] lg:h-[10%] lg:rounded-lg cursor-pointer" onClick={onClick}>Login</button>
                </div>
            </div>
        </>
    )
}
export default Page;