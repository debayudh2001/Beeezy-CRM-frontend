import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments, createComment } from '../../features/comments/commentsSlice';
import { getFullName, formatRelativeTime } from '../../utils/helpers';
import Button from '../common/Button';
import Loader from '../common/Loader';

const CommentsList = ({ entityType, entityId }) => {
  const dispatch = useDispatch();
  const { comments, loading } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (entityType && entityId) {
      dispatch(fetchComments({ entityType, entityId }));
    }
  }, [dispatch, entityType, entityId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    await dispatch(createComment({
      entityType,
      entityId,
      text: newComment,
    }));
    setSubmitting(false);
    setNewComment('');
  };
  
  if (loading && comments.length === 0) {
    return <Loader size="sm" />;
  }
  
  return (
    <div className="space-y-4">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={submitting}
            disabled={!newComment.trim()}
          >
            Add Comment
          </Button>
        </div>
      </form>
      
      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                {comment.user?.firstName?.charAt(0)}{comment.user?.lastName?.charAt(0)}
              </div>
              
              {/* Comment Content */}
              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-sm text-gray-900">
                    {getFullName(comment.user)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatRelativeTime(comment.createdAt)}
                  </p>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsList;
