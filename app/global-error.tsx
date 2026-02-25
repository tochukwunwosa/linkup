"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f4f2",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: "16px",
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid rgba(0,0,0,0.07)",
            padding: "40px 32px",
            textAlign: "center",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          {/* Brand */}
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#64748b",
              marginBottom: "24px",
            }}
          >
            TechLinkUp
          </p>

          {/* Icon circle */}
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(249,115,22,0.12))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#1a1b25",
              marginBottom: "12px",
            }}
          >
            Critical Error
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              lineHeight: "1.6",
              marginBottom: "28px",
            }}
          >
            A critical error occurred and the app could not load. Please try
            refreshing the page.
          </p>

          {/* Dev detail */}
          {process.env.NODE_ENV === "development" && (
            <div
              style={{
                backgroundColor: "#f5f4f2",
                borderRadius: "8px",
                border: "1px solid rgba(0,0,0,0.06)",
                padding: "12px",
                marginBottom: "24px",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  fontFamily: "monospace",
                  color: "#ef4444",
                  wordBreak: "break-all",
                }}
              >
                <strong>Error:</strong> {error.message}
              </p>
              {error.digest && (
                <p
                  style={{
                    fontSize: "11px",
                    fontFamily: "monospace",
                    color: "#64748b",
                    marginTop: "6px",
                  }}
                >
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 20px",
                borderRadius: "12px",
                backgroundColor: "#0066cc",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "14px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 20px",
                borderRadius: "12px",
                backgroundColor: "#ffffff",
                color: "#4a4a5a",
                fontWeight: 600,
                fontSize: "14px",
                border: "1px solid rgba(0,0,0,0.12)",
                textDecoration: "none",
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
