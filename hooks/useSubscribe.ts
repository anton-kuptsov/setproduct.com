import { type FormEvent, useState } from "react";

export function useSubscribe() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("Email") as string;
    const website = formData.get("website") as string;

    try {
      const csrfRes = await fetch("/api/csrf");
      const csrf = await csrfRes.json();

      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          website,
          _token: csrf.token,
          _timestamp: csrf.timestamp,
        }),
      });
      setIsSubscribed(true);
    } catch {
      setIsSubscribed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubscribed, isSubmitting, handleSubscribe };
}
