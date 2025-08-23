'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface FormData {
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    password: string;
    country: string;
}

interface FormErrors {
    firstname?: string;
    lastname?: string;
    phone?: string;
    email?: string;
    password?: string;
    country?: string;
}

const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Spain", "Italy",
    "Japan", "China", "India", "Brazil", "Mexico", "South Africa", "Egypt", "Nigeria",
    "Argentina", "Chile", "Colombia", "Peru", "Russia", "Ukraine", "Poland", "Sweden",
    "Norway", "Finland", "Denmark", "Ireland", "Netherlands", "Belgium", "Switzerland", "Austria",
    "Greece", "Portugal", "Turkey", "Saudi Arabia", "United Arab Emirates", "Israel", "Iran",
    "Pakistan", "Bangladesh", "Indonesia", "Malaysia", "Thailand", "Vietnam", "Philippines",
    "South Korea", "Singapore", "New Zealand"
];

const SignupForm: React.FC = () => {

    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        firstname: '',
        lastname: '',
        phone: '',
        email: '',
        password: '',
        country: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState("");


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = (): boolean => {
        let newErrors: FormErrors = {};
        if (!formData.firstname) newErrors.firstname = 'First name is required';
        if (!formData.lastname) newErrors.lastname = 'Last name is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
        }
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.country) newErrors.country = 'Country is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async () => {
        if (!formData.firstname || !formData.lastname || !formData.email || !formData.phone || !formData.password || !formData.country) {
            setError("All fields are required!");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/v1/vertix/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Signup failed");
            }

            alert("Registration successful!");
            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCountryChange = (e: { target: { id: any; value: any; }; }) => {
        const { id, value } = e.target;
        // setFormData(prevData => ({ ...prevData, [id]: value }));
        setFormData(prev => ({ ...prev, country: e.target.value }));
    };

    const onClick = () => {
        router.push('/login')
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Create an Account</h2>
                <form onSubmit={handleSignup} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name..</label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                className="w-full text-black px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.firstname && <p className="mt-1 text-sm text-red-500">{errors.firstname}</p>}
                        </div>
                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name..</label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                className="w-full text-black px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.lastname && <p className="mt-1 text-sm text-red-500">{errors.lastname}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone..</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full text-black px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email..</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full text-black px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password..</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full text-black px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country..</label>
                        <select
                            id="country"
                            value={formData.country}
                            onChange={handleCountryChange}
                            className="bg-white p-2 px-2 rounded-sm text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>Select a country</option>
                            {countries.map((country, index) => (
                                <option key={index} value={country}>{country}</option>
                            ))}
                        </select>
                        {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                {message && (
                    <p className={`mt-4 text-center text-black text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
                <button className='text-black cursor-pointer' onClick={onClick}>Signin</button>
            </div>
        </div>
    );
};

export default SignupForm;