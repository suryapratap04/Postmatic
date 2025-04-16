import CommentSection from "./CommentSection";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function MediaFeed() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { user } = context;
  const [media, setMedia] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetch(`/api/feed/${user.id}`)
        .then((response) => response.json())
        .then((data) => setMedia(data))
        .catch((error) => console.error(error));
    }
  }, [user]);

  return (
    <div>
      <h2 className="text-2xl">Media Feed</h2>
      {media.length > 0 ? (
        <ul>
          {media.map((item) => (
            <li key={item.id} className="mb-6">
              <div className="media-item">
                <p>{item.caption}</p>
                {/* Render CommentSection for each media */}
                <CommentSection mediaId={item.id} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No media found.</p>
      )}
    </div>
  );
}
