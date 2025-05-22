import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Dashboard() {
    const { weatherData, city } = usePage().props;
    const [searchCity, setSearchCity] = useState(city);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        window.location.href = `/dashboard?city=${encodeURIComponent(
            searchCity
        )}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Welcome to Your Dashboard
                    </h2>
                    {/* <div className="text-sm text-gray-600">
                        Last login: {new Date().toLocaleDateString()}
                    </div> */}
                    <a
                        href="/weather/create"
                        className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                        + Create Weather
                    </a>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Search Form */}
                    <div className="mb-6 bg-white rounded-xl shadow-md p-6">
                        <form onSubmit={handleSubmit} className="flex gap-4">
                            <input
                                type="text"
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                placeholder="Enter city name (e.g., London)"
                                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ${
                                    isLoading
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {isLoading ? "Loading..." : "Get Weather"}
                            </button>
                        </form>
                    </div>

                    {/* Weather Display */}
                    {isLoading ? (
                        <div className="bg-white rounded-xl shadow-md p-6 text-gray-600">
                            Loading weather data...
                        </div>
                    ) : weatherData?.error ? (
                        <div className="bg-red-100 text-red-800 p-4 rounded-lg">
                            Error: {weatherData.error}. Please try another city.
                        </div>
                    ) : weatherData?.main ? (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Weather in {weatherData.name},{" "}
                                {weatherData.sys.country}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Temperature */}
                                <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-center mb-2">
                                        {weatherData.weather[0].icon && (
                                            <img
                                                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                                                alt="Weather Icon"
                                                className="w-12 h-12"
                                            />
                                        )}
                                    </div>
                                    <p className="text-gray-600 font-semibold">
                                        Temperature
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {weatherData.main.temp}°C
                                    </p>
                                    <p className="text-gray-500 capitalize">
                                        {weatherData.weather[0].description}
                                    </p>
                                </div>

                                {/* Feels Like */}
                                <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-gray-600 font-semibold">
                                        Feels Like
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {weatherData.main.feels_like}°C
                                    </p>
                                </div>

                                {/* Humidity */}
                                <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-gray-600 font-semibold">
                                        Humidity
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {weatherData.main.humidity}%
                                    </p>
                                </div>

                                {/* Wind Speed */}
                                <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-gray-600 font-semibold">
                                        Wind Speed
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {weatherData.wind.speed} m/s
                                    </p>
                                </div>

                                {/* Pressure */}
                                <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-gray-600 font-semibold">
                                        Pressure
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {weatherData.main.pressure} hPa
                                    </p>
                                </div>

                                {/* Visibility */}
                                {weatherData.visibility && (
                                    <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-gray-600 font-semibold">
                                            Visibility
                                        </p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {weatherData.visibility / 1000} km
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-6 text-gray-600">
                            No weather data available. Please search for a city.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
