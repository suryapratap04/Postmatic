import { useState, useEffect } from "react";
import { api } from "../utils/api"; // Assuming you have a utility function to handle API calls

interface Comment {
  id: string;
  user: string;
  text: string;
  created_at: string;
}

interface CommentSectionProps {
  mediaId: string; // Pass the media ID to fetch related comments
}

export default function CommentSection({ mediaId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    // Fetch comments when the component is mounted or mediaId changes
    const fetchComments = async () => {
      try {
        const response = await api(`/comments/${mediaId}`, "GET");
        setComments(response.comments); // Assuming the response contains an array of comments
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    fetchComments();
  }, [mediaId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return; // Don't submit if the comment is empty

    try {
      // Assuming you send the comment to your API endpoint
      const response = await api(`/comments/${mediaId}`, "POST", {
        text: newComment,
      });

      // Add the new comment to the list (or refetch comments)
      setComments([response.comment, ...comments]);
      setNewComment(""); // Clear the input field after submission
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div className="comment-section">
      <h3 className="text-xl mb-4">Comments</h3>

      {/* Display comments */}
      <div className="comments-list mb-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item mb-3">
              <strong>{comment.user}</strong>: {comment.text}
              <p className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      {/* Comment form */}
      <form
        onSubmit={handleCommentSubmit}
        className="comment-form flex space-x-4"
      >
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Add a comment..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Comment
        </button>
      </form>
    </div>
  );
}
