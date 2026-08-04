import Image from "next/image";

// Login-page logo, sourced from public/login-logo.png.
// Renders as a full-bleed background image filling its parent container
// (the top space on the login page) rather than a small centered icon.
export default function LoginLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        src="/login-logo.png"
        alt="ttcu"
        fill
        priority
        className="object-cover"
      />
    </div>
  );
}