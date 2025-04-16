import { useState, useEffect } from "react";

interface ReelSectionProps {
  userId?: string;
}

export default function ReelSection({ userId }: ReelSectionProps) {
  const [reels, setReels] = useState([]);

  useEffect(() => {
    if (userId) {
      fetch(`/api/reels/${userId}`)
        .then((res) => res.json())
        .then((data) => setReels(data.reels));
    }
  }, [userId]);

  return (
    <div id="reels" className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Reels</h2>
      <div className="grid grid-cols-1 gap-4 mt-2">
        {reels.map((reel: any) => (
          <video key={reel.id} controls className="rounded">
            <source src={reel.media_url} type="video/mp4" />
          </video>
        ))}
      </div>
    </div>
  );
}
