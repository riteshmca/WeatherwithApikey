import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";

export default function Weather({ auth }) {
    // State for API data
    const [locations, setLocations] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiResponse, setApiResponse] = useState(null);
    const [apiError, setApiError] = useState(null);

    // State for forms and UI
    const [editing, setEditing] = useState(false);
    const [selectedWeatherId, setSelectedWeatherId] = useState(null);
    const [showCreateLocationModal, setShowCreateLocationModal] =
        useState(false);
    const [showDebugInfo, setShowDebugInfo] = useState(false);

    // Weather form state
    const [weatherForm, setWeatherForm] = useState({
        location_id: "",
        temperature: "",
        humidity: "",
        wind_speed: "",
        precipitation: "",
    });
    const [weatherErrors, setWeatherErrors] = useState({});

    // Location form state
    const [locationForm, setLocationForm] = useState({
        location_name: "",
        location_latitude: "",
        location_longitude: "",
    });
    const [locationErrors, setLocationErrors] = useState({});

    // Fetch data from API
    const fetchData = () => {
        setLoading(true);
        setApiError(null);

        fetch("/api/weather", {
            headers: {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP status ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setApiResponse(data);
                setLocations(data.locations || []);
                setWeatherData(data.weatherData || []);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setApiError(`Error fetching data: ${err.message}`);
                console.error("API Error:", err);
            });
    };

    // Test API specifically
    const testApi = () => {
        setLoading(true);
        setApiError(null);

        fetch("/api/weather/debug", {
            headers: {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP status ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setApiResponse(data);
                setShowDebugInfo(true);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setApiError(`Error testing API: ${err.message}`);
                console.error("API Test Error:", err);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle weather form change
    const handleWeatherChange = (e) => {
        setWeatherForm({
            ...weatherForm,
            [e.target.name]: e.target.value,
        });
    };

    // Handle location form change
    const handleLocationChange = (e) => {
        setLocationForm({
            ...locationForm,
            [e.target.name]: e.target.value,
        });
    };

    // Reset forms
    const resetWeatherForm = () => {
        setWeatherForm({
            location_id: "",
            temperature: "",
            humidity: "",
            wind_speed: "",
            precipitation: "",
        });
        setWeatherErrors({});
    };

    const resetLocationForm = () => {
        setLocationForm({
            location_name: "",
            location_latitude: "",
            location_longitude: "",
        });
        setLocationErrors({});
    };

    // Handle weather form submit
    const handleWeatherSubmit = (e) => {
        e.preventDefault();
        setWeatherErrors({});
        const method = editing ? "PUT" : "POST";
        const url = editing
            ? `/api/weather/${selectedWeatherId}`
            : "/api/weather";

        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]'
                ).content,
            },
            credentials: "include",
            body: JSON.stringify(weatherForm),
        })
            .then(async (res) => {
                if (res.ok) return res.json();
                const data = await res.json();
                throw data;
            })
            .then(() => {
                resetWeatherForm();
                setEditing(false);
                setSelectedWeatherId(null);
                fetchData();
            })
            .catch((err) => {
                setWeatherErrors(err.errors || {});
            });
    };

    // Handle location form submit
    const handleLocationSubmit = async (e) => {
        e.preventDefault();
        setLocationErrors({});

        try {
            const response = await fetch("/api/location", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                },
                credentials: "include",
                body: JSON.stringify(locationForm),
            });

            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            // Success case
            resetLocationForm();
            setShowCreateLocationModal(false);
            fetchData(); // Refresh the locations list

            // Show success message
            setApiResponse({
                status: "success",
                message: "Location created successfully",
                location: data.location,
            });
            setShowDebugInfo(true);
        } catch (error) {
            console.error("Location creation error:", error);

            if (error.errors) {
                setLocationErrors(error.errors);
            } else {
                setApiError(error.message || "Failed to create location");
            }
        }
    };

    const addSponser = async (sponserData) => {
        try {
            const response = await axios.post(
                `${URL}/sponser/add-sponser`,
                sponserData
            );

            if (response.status === 200) {
                console.log("Sponser added successfully:", response.data);
                // You can perform additional actions if needed
            } else {
                console.error("Failed to add sponser:", response.data);
                // Handle the error appropriately
            }
        } catch (error) {
            console.error("An error occurred while adding sponser:", error);
            // Handle the error appropriately
        }
    };

    // Edit weather
    const editWeather = (weather) => {
        setEditing(true);
        setSelectedWeatherId(weather.id);
        setWeatherForm({
            location_id: weather.location_id,
            temperature: weather.temperature,
            humidity: weather.humidity,
            wind_speed: weather.wind_speed,
            precipitation: weather.precipitation,
        });
    };

    // Delete weather
    const deleteWeather = (id) => {
        if (
            window.confirm(
                "Are you sure you want to delete this weather record?"
            )
        ) {
            fetch(`/api/weather/${id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "include",
            })
                .then(() => fetchData())
                .catch(() => alert("Error deleting weather record"));
        }
    };

    // Cancel edit
    const cancelEdit = () => {
        setEditing(false);
        setSelectedWeatherId(null);
        resetWeatherForm();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">
                                    {editing
                                        ? "Edit Weather Data"
                                        : "Add Weather Data"}
                                </h2>
                                <div>
                                    <PrimaryButton
                                        onClick={testApi}
                                        className="mr-4"
                                    >
                                        Test API
                                    </PrimaryButton>
                                    <PrimaryButton
                                        onClick={() =>
                                            setShowCreateLocationModal(true)
                                        }
                                        className="ml-4"
                                    >
                                        Add New Location
                                    </PrimaryButton>
                                </div>
                            </div>

                            {/* Debug Info */}
                            {apiError && (
                                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                    <h3 className="font-bold">API Error:</h3>
                                    <p>{apiError}</p>
                                </div>
                            )}

                            {showDebugInfo && apiResponse && (
                                <div className="mb-6 p-4 bg-blue-100 border border-blue-400 rounded">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold">
                                            API Debug Information:
                                        </h3>
                                        <button
                                            onClick={() =>
                                                setShowDebugInfo(false)
                                            }
                                            className="text-blue-700"
                                        >
                                            Hide
                                        </button>
                                    </div>
                                    <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-64">
                                        {JSON.stringify(apiResponse, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {/* Weather Form */}
                            <form
                                onSubmit={handleWeatherSubmit}
                                className="mb-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel
                                            htmlFor="location_id"
                                            value="Location"
                                        />
                                        <select
                                            id="location_id"
                                            name="location_id"
                                            value={weatherForm.location_id}
                                            onChange={handleWeatherChange}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">
                                                Select a location
                                            </option>
                                            {locations.map((location) => (
                                                <option
                                                    key={location.id}
                                                    value={location.id}
                                                >
                                                    {location.location_name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={weatherErrors.location_id}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="temperature"
                                            value="Temperature"
                                        />
                                        <TextInput
                                            id="temperature"
                                            type="text"
                                            name="temperature"
                                            value={weatherForm.temperature}
                                            className="mt-1 block w-full"
                                            onChange={handleWeatherChange}
                                        />
                                        <InputError
                                            message={weatherErrors.temperature}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="humidity"
                                            value="Humidity"
                                        />
                                        <TextInput
                                            id="humidity"
                                            type="text"
                                            name="humidity"
                                            value={weatherForm.humidity}
                                            className="mt-1 block w-full"
                                            onChange={handleWeatherChange}
                                        />
                                        <InputError
                                            message={weatherErrors.humidity}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="wind_speed"
                                            value="Wind Speed"
                                        />
                                        <TextInput
                                            id="wind_speed"
                                            type="text"
                                            name="wind_speed"
                                            value={weatherForm.wind_speed}
                                            className="mt-1 block w-full"
                                            onChange={handleWeatherChange}
                                        />
                                        <InputError
                                            message={weatherErrors.wind_speed}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="precipitation"
                                            value="Precipitation"
                                        />
                                        <TextInput
                                            id="precipitation"
                                            type="text"
                                            name="precipitation"
                                            value={weatherForm.precipitation}
                                            className="mt-1 block w-full"
                                            onChange={handleWeatherChange}
                                        />
                                        <InputError
                                            message={
                                                weatherErrors.precipitation
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-end mt-4">
                                    {editing && (
                                        <SecondaryButton
                                            onClick={cancelEdit}
                                            className="mr-2"
                                        >
                                            Cancel
                                        </SecondaryButton>
                                    )}
                                    <PrimaryButton
                                        type="submit"
                                        className="ml-4"
                                    >
                                        {editing
                                            ? "Update Weather"
                                            : "Add Weather"}
                                    </PrimaryButton>
                                </div>
                            </form>

                            {/* Weather Data Table */}
                            <h3 className="text-xl font-semibold mb-4">
                                Weather Records ({weatherData.length})
                            </h3>
                            {weatherData.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-4 border-b">
                                                    Location
                                                </th>
                                                <th className="py-2 px-4 border-b">
                                                    Temperature
                                                </th>
                                                <th className="py-2 px-4 border-b">
                                                    Humidity
                                                </th>
                                                <th className="py-2 px-4 border-b">
                                                    Wind Speed
                                                </th>
                                                <th className="py-2 px-4 border-b">
                                                    Precipitation
                                                </th>
                                                <th className="py-2 px-4 border-b">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {weatherData.map((weather) => (
                                                <tr key={weather.id}>
                                                    <td className="py-2 px-4 border-b">
                                                        {locations.find(
                                                            (loc) =>
                                                                loc.id ===
                                                                weather.location_id
                                                        )?.location_name ||
                                                            "Unknown"}
                                                    </td>
                                                    <td className="py-2 px-4 border-b">
                                                        {weather.temperature}
                                                    </td>
                                                    <td className="py-2 px-4 border-b">
                                                        {weather.humidity}
                                                    </td>
                                                    <td className="py-2 px-4 border-b">
                                                        {weather.wind_speed}
                                                    </td>
                                                    <td className="py-2 px-4 border-b">
                                                        {weather.precipitation}
                                                    </td>
                                                    <td className="py-2 px-4 border-b">
                                                        <PrimaryButton
                                                            onClick={() =>
                                                                editWeather(
                                                                    weather
                                                                )
                                                            }
                                                            className="mr-2"
                                                        >
                                                            Edit
                                                        </PrimaryButton>
                                                        <DangerButton
                                                            onClick={() =>
                                                                deleteWeather(
                                                                    weather.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </DangerButton>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-4 border border-gray-200 rounded text-center">
                                    No weather records found.
                                </div>
                            )}

                            {/* Create Location Modal */}
                            {showCreateLocationModal && (
                                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                    <div className="bg-white rounded-lg p-8 w-full max-w-md">
                                        <h2 className="text-xl font-semibold mb-4">
                                            Add New Location
                                        </h2>
                                        <form onSubmit={handleLocationSubmit}>
                                            <div className="mb-4">
                                                <InputLabel
                                                    htmlFor="location_name"
                                                    value="Location Name"
                                                />
                                                <TextInput
                                                    id="location_name"
                                                    type="text"
                                                    name="location_name"
                                                    value={
                                                        locationForm.location_name
                                                    }
                                                    className="mt-1 block w-full"
                                                    onChange={
                                                        handleLocationChange
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        locationErrors.location_name
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <InputLabel
                                                    htmlFor="location_latitude"
                                                    value="Latitude"
                                                />
                                                <TextInput
                                                    id="location_latitude"
                                                    type="text"
                                                    name="location_latitude"
                                                    value={
                                                        locationForm.location_latitude
                                                    }
                                                    className="mt-1 block w-full"
                                                    onChange={
                                                        handleLocationChange
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        locationErrors.location_latitude
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <InputLabel
                                                    htmlFor="location_longitude"
                                                    value="Longitude"
                                                />
                                                <TextInput
                                                    id="location_longitude"
                                                    type="text"
                                                    name="location_longitude"
                                                    value={
                                                        locationForm.location_longitude
                                                    }
                                                    className="mt-1 block w-full"
                                                    onChange={
                                                        handleLocationChange
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        locationErrors.location_longitude
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <SecondaryButton
                                                    onClick={() => {
                                                        setShowCreateLocationModal(
                                                            false
                                                        );
                                                        resetLocationForm();
                                                    }}
                                                    className="mr-2"
                                                >
                                                    Cancel
                                                </SecondaryButton>
                                                <PrimaryButton type="submit">
                                                    Add Location
                                                </PrimaryButton>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
