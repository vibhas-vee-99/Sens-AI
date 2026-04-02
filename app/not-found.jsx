import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">

            {/* GIF */}
            <img
                src="/not found sensai.gif"
                alt="Page not found"
                className="w-screen max-w-none h-[60vh] object-contain mb-6"
            />


            <Link href="/">
                <Button>Return Home</Button>
            </Link>
        </div>
    );
}
