"use client";
import SubscribedModal from "@/components/subscribed-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
        const response = await fetch('/api/subscribers', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
            setShowModal(true);
            setEmail('');
            toast.success("Subscribed successfully!");
        } else {
            toast.error(data.error || 'Failed to subscribe');
        }
        } catch {
        toast.error('Something went wrong. Please try again.');
        } finally {
        setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Input
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="h-11 bg-white shadow-none border-none rounded-xl"
            />
            <Button onClick={handleSubscribe} disabled={loading} className="h-11 px-6 rounded-xl">{loading ? "Subscribing" : "Subscribe"}</Button>
            </div>
            {showModal && (
                <SubscribedModal onClose={() => setShowModal(false)} />
            )}
        </>
    );
}