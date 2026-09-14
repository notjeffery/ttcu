import Image from "next/image";

// Login-page logo, sourced from public/login-logo.jpg (828x360).
// The container carries the image's exact aspect ratio, so the image
// scales to the available width on any device without cropping or gaps.
export default function LoginLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full aspect-[23/10] ${className}`}>
      <Image
        src="/login-logo.png"
        alt="ttcu"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}