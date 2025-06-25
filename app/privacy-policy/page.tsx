import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-base leading-relaxed text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">
        Effective: June 2025 · Last Updated: June 25, 2025
      </p>

      <p className="mb-6">
        Hi. This is the privacy policy for <strong>Tech LinkUp</strong> — a
        space built for developers and tech folks to connect, explore events,
        and stay in the loop.
      </p>

      <p className="mb-6">We take your privacy seriously. Here’s what you should know:</p>

      <h2 className="text-xl font-semibold mt-10 mb-4">What We Collect</h2>
      <p className="mb-4">
        Right now, the only personal information we store is your{" "}
        <strong>location</strong> (if you allow it). This helps us surface
        relevant events near you.
      </p>
      <p className="mb-4">When we launch user accounts, we may collect:</p>
      <ul className="list-disc list-inside mb-6 space-y-1">
        <li>Your name</li>
        <li>Email address</li>
        <li>Profile photo</li>
        <li>Your location (still optional)</li>
      </ul>
      <p className="mb-6">
        {`We'll update this policy when those features go live, but we’re telling
        you now so you're aware.`}
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-4">Why We Collect It</h2>
      <ul className="list-disc list-inside mb-6 space-y-1">
        <li>To help you find tech events near you.</li>
        <li>
          To eventually personalize your experience when you create a profile
          or set reminders.
        </li>
        <li>
          {`To understand how the platform is used and where to improve (we use{" "}
          <strong>Umami</strong> for basic analytics — it's privacy-focused and
          doesn’t track you across the web).`}
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-10 mb-4">How Your Data Is Stored</h2>
      <p className="mb-4">
        We use <strong>Supabase</strong> to store any data you give us.
        Supabase handles storage securely on their end.
      </p>
      <p className="mb-4">
        That said, we don’t encrypt personal data ourselves just yet — it’s on
        our roadmap.
      </p>
      <p className="mb-6">
        We also use <strong>Umami</strong> for analytics. It doesn’t collect
        personally identifiable information, and we don’t use cookies for
        tracking.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-4">Your Rights</h2>
      <ul className="list-disc list-inside mb-6 space-y-1">
        <li>You can ask us to delete your data anytime.</li>
        <li>You can choose not to share your location.</li>
        <li>
          When signup is available, you’ll be able to update or remove your
          profile.
        </li>
      </ul>
      <p className="mb-6">We don’t sell or trade your data. Ever.</p>

      <h2 className="text-xl font-semibold mt-10 mb-4">Third Parties</h2>
      <p className="mb-6">
        We may add services like Google Search Console or email reminders in
        the future. If that happens, we’ll update this policy and let you know
        what data (if any) those services interact with.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-4">Questions?</h2>
      <p className="mb-6">
        Feel free to reach out to us directly. We’re here to build something
        good — not sneak around with your information.
      </p>
    </main>
  );
}
