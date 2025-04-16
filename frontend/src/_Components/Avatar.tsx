import { useState } from "react";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=eee&color=888&size=128";

export default function Avatar({
  src,
  alt,
  size = 32,
  className = "",
}: {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_AVATAR);

  return (
    <img
      src={imgSrc}
      alt={alt || "Profile"}
      className={`rounded-full border-2 border-white bg-gray-100 object-cover ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
      onError={() => setImgSrc(DEFAULT_AVATAR)}
    />
  );
}
