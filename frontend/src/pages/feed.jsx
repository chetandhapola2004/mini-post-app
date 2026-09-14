import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { HeartIcon, TrashIcon, PlusIcon, ImageIcon } from '../components/Icons';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('minipost_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchPosts = () => {
    setLoading(true);
    axios
      .get('https://mern-feed-backend.onrender.com/post')
      .then((res) => {
        if (res.data && Array.isArray(res.data.post)) {
          // Sort or reverse so newest posts appear first
          setPosts(res.data.post.slice().reverse());
        } else if (Array.isArray(res.data)) {
          setPosts(res.data.slice().reverse());
        }
      })
      .catch((err) => {
        console.error('Error fetching posts:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleLike = (id) => {
    setLikedPosts((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('minipost_likes', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const confirmDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`https://mern-feed-backend.onrender.com/post/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
      alert('Error deleting post. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="feed-container">
      {/* Feed Header */}
      <div className="feed-header-section">
        <div className="feed-header-left">
          <div className="feed-meta-badge">
            <span className="badge-bullet"></span>
            <span>Community Gallery</span>
          </div>
          <h1 className="feed-main-title">Recent Stories</h1>
          <p className="feed-main-sub">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} shared by creators
          </p>
        </div>

        <Link to="/create-post" className="feed-create-btn">
          <PlusIcon size={16} />
          <span>New Post</span>
        </Link>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="feed-skeleton-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="feed-skeleton-card">
              <div className="skeleton-img"></div>
              <div className="skeleton-body">
                <div className="skeleton-line skeleton-title"></div>
                <div className="skeleton-line skeleton-sub"></div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="feed-masonry-grid">
          {posts.map((post) => {
            const isLiked = !!likedPosts[post._id];
            const isConfirmingDelete = deleteConfirmId === post._id;

            return (
              <article key={post._id} className="feed-post-card">
                <div className="feed-post-media">
                  <img
                    src={post.image}
                    alt={post.caption || 'Post image'}
                    className="feed-post-img"
                    loading="lazy"
                  />
                  <div className="feed-post-overlay">
                    <button
                      className={`btn-media-action btn-heart ${isLiked ? 'is-liked' : ''}`}
                      onClick={() => toggleLike(post._id)}
                      aria-label="Like post"
                    >
                      <HeartIcon size={18} filled={isLiked} />
                    </button>
                  </div>
                </div>

                <div className="feed-post-details">
                  {post.caption ? (
                    <p className="feed-post-caption">{post.caption}</p>
                  ) : (
                    <p className="feed-post-caption caption-untitled">Untitled moment</p>
                  )}

                  <div className="feed-post-footer">
                    <span className="post-timestamp">Shared to feed</span>

                    {/* Delete trigger */}
                    {isConfirmingDelete ? (
                      <div className="delete-confirm-group">
                        <span className="confirm-text">Delete?</span>
                        <button
                          className="btn-confirm-yes"
                          disabled={deletingId === post._id}
                          onClick={() => confirmDelete(post._id)}
                        >
                          {deletingId === post._id ? '...' : 'Yes'}
                        </button>
                        <button
                          className="btn-confirm-no"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn-card-delete"
                        onClick={() => setDeleteConfirmId(post._id)}
                        title="Delete post"
                        aria-label="Delete post"
                      >
                        <TrashIcon size={15} />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="feed-empty-state">
          <div className="empty-icon-box">
            <ImageIcon size={32} />
          </div>
          <h2 className="empty-state-title">No posts yet</h2>
          <p className="empty-state-desc">
            Be the first creator to share a photograph and start the collection.
          </p>
          <Link to="/create-post" className="empty-state-btn">
            <PlusIcon size={16} />
            <span>Create the first post</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Feed;