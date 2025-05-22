import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById("screenshot-container")
            ?.classList.add("!hidden");
        document.getElementById("docs-card")?.classList.add("!row-span-1");
        document
            .getElementById("docs-card-content")
            ?.classList.add("!flex-row");
        document.getElementById("background")?.classList.add("!hidden");
    };

    return (
        <>
            <Head title="Welcome" />
            <div
                className="bg-cover bg-center bg-no-repeat text-black/50 dark:text-white/50 flex min-h-screen items-center justify-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1740&q=80')", // forest weather image from Unsplash
                }}
            >
                <nav className="flex space-x-4 bg-white/80 p-4 rounded shadow-md dark:bg-black/70">
                    <Link
                        href={route("login")}
                        className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        Log in
                    </Link>
                    <Link
                        href={route("register")}
                        className="rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 dark:bg-green-500 dark:hover:bg-green-600"
                    >
                        Register
                    </Link>
                </nav>
            </div>
        </>
    );
}
