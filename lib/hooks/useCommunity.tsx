"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUserContext } from './UserContext';
import { CommunityGroup, GroupMember, Post, Comment } from '../../types';

// Create context for community data
interface CommunityContextType {
  groups: CommunityGroup[];
  userGroups: CommunityGroup[];
  joinedGroups: string[];
  posts: Post[];
  comments: Map<string, Comment[]>;
  isLoading: boolean;
  error: string | null;
  createGroup: (group: Partial<CommunityGroup>) => Promise<CommunityGroup | null>;
  joinGroup: (groupId: string) => Promise<boolean>;
  leaveGroup: (groupId: string) => Promise<boolean>;
  createPost: (post: Partial<Post>) => Promise<Post | null>;
  deletePost: (postId: string) => Promise<boolean>;
  likePost: (postId: string) => Promise<boolean>;
  unlikePost: (postId: string) => Promise<boolean>;
  createComment: (comment: Partial<Comment>) => Promise<Comment | null>;
  deleteComment: (commentId: string) => Promise<boolean>;
  likeComment: (commentId: string) => Promise<boolean>;
  getGroupPosts: (groupId: string) => Post[];
  getTrendingPosts: () => Post[];
  getPostComments: (postId: string) => Comment[];
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

// Generate sample data
const generateSampleGroups = (): CommunityGroup[] => {
  return [
    {
      id: 'group-1',
      name: 'Fit Together',
      description: 'A community for fitness enthusiasts to share tips, workouts, and progress.',
      createdBy: 'user-1',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      membersCount: 142,
      isPrivate: false,
      image: 'https://placehold.co/400x200/668CFF/FFFFFF?text=Fit+Together',
      tags: ['fitness', 'motivation', 'community']
    },
    {
      id: 'group-2',
      name: 'Weight Loss Warriors',
      description: 'Support group for those on a weight loss journey. Share your struggles and victories!',
      createdBy: 'user-2',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      membersCount: 87,
      isPrivate: false,
      image: 'https://placehold.co/400x200/FF6680/FFFFFF?text=Weight+Loss+Warriors',
      tags: ['weight-loss', 'support', 'diet']
    },
    {
      id: 'group-3',
      name: 'Marathon Runners',
      description: 'For runners training for marathons and other long-distance events.',
      createdBy: 'user-3',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      membersCount: 56,
      isPrivate: false,
      image: 'https://placehold.co/400x200/66FF80/000000?text=Marathon+Runners',
      tags: ['running', 'marathon', 'training']
    },
    {
      id: 'group-4',
      name: 'Yoga & Mindfulness',
      description: 'Connect with others interested in yoga, meditation, and mindful movement.',
      createdBy: 'user-4',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      membersCount: 112,
      isPrivate: false,
      image: 'https://placehold.co/400x200/D4A5FF/000000?text=Yoga+%26+Mindfulness',
      tags: ['yoga', 'meditation', 'wellness']
    },
    {
      id: 'group-5',
      name: 'Home Workout Heroes',
      description: 'No gym? No problem! Share your home workout routines and equipment recommendations.',
      createdBy: 'user-5',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      membersCount: 73,
      isPrivate: false,
      image: 'https://placehold.co/400x200/FFD166/000000?text=Home+Workout+Heroes',
      tags: ['home-workout', 'no-equipment', 'fitness']
    }
  ];
};

const generateSamplePosts = (groups: CommunityGroup[]): Post[] => {
  const posts: Post[] = [];
  
  // Add posts for each group
  groups.forEach(group => {
    // Add multiple posts per group
    for (let i = 0; i < 3; i++) {
      posts.push({
        id: `post-${group.id}-${i}`,
        userId: `user-${Math.floor(Math.random() * 10) + 1}`,
        groupId: group.id,
        content: `This is a sample post in the ${group.name} group. #${group.tags ? group.tags[0] : 'fitness'}`,
        mediaUrls: i % 2 === 0 ? [`https://placehold.co/600x400/668CFF/FFFFFF?text=Post+${i+1}`] : [],
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 10),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000),
        type: i % 3 === 0 ? 'workout' : i % 3 === 1 ? 'progress' : 'text',
        privacy: 'public'
      });
    }
  });
  
  // Add some general posts not in groups
  for (let i = 0; i < 5; i++) {
    posts.push({
      id: `post-general-${i}`,
      userId: `user-${Math.floor(Math.random() * 10) + 1}`,
      content: `This is a general community post. #fitness #health`,
      mediaUrls: i % 2 === 0 ? [`https://placehold.co/600x400/66FF80/000000?text=Fitness+Post+${i+1}`] : [],
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000),
      type: i % 4 === 0 ? 'achievement' : i % 4 === 1 ? 'question' : 'text',
      privacy: 'public'
    });
  }
  
  return posts;
};

const generateSampleComments = (posts: Post[]): Map<string, Comment[]> => {
  const commentsMap = new Map<string, Comment[]>();
  
  posts.forEach(post => {
    const commentCount = post.comments || 0;
    const comments: Comment[] = [];
    
    for (let i = 0; i < commentCount; i++) {
      comments.push({
        id: `comment-${post.id}-${i}`,
        postId: post.id,
        userId: `user-${Math.floor(Math.random() * 10) + 1}`,
        content: `This is comment #${i+1} on this post. ${i % 3 === 0 ? '💪' : i % 3 === 1 ? '👍' : '🔥'}`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000),
        likes: Math.floor(Math.random() * 10)
      });
    }
    
    commentsMap.set(post.id, comments);
  });
  
  return commentsMap;
};

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUserContext();
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Map<string, Comment[]>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        
        // Check for existing data in localStorage
        if (typeof window !== 'undefined') {
          const storedGroups = localStorage.getItem('community_groups');
          const storedPosts = localStorage.getItem('community_posts');
          const storedJoinedGroups = localStorage.getItem(`joined_groups_${user?.id}`);
          
          let groupsData: CommunityGroup[] = [];
          let postsData: Post[] = [];
          let joinedGroupsData: string[] = [];
          
          if (storedGroups && storedPosts) {
            groupsData = JSON.parse(storedGroups);
            postsData = JSON.parse(storedPosts).map((post: any) => ({
              ...post,
              createdAt: new Date(post.createdAt)
            }));
            
            if (storedJoinedGroups) {
              joinedGroupsData = JSON.parse(storedJoinedGroups);
            }
          } else {
            // Generate sample data
            groupsData = generateSampleGroups();
            postsData = generateSamplePosts(groupsData);
            
            // Store to localStorage
            localStorage.setItem('community_groups', JSON.stringify(groupsData));
            localStorage.setItem('community_posts', JSON.stringify(postsData));
            
            // If user is logged in, randomly join some groups for demo
            if (user?.id) {
              const randomGroups = groupsData
                .sort(() => 0.5 - Math.random())
                .slice(0, 2)
                .map(g => g.id);
              
              joinedGroupsData = randomGroups;
              localStorage.setItem(`joined_groups_${user.id}`, JSON.stringify(joinedGroupsData));
            }
          }
          
          // Generate comments
          const commentsData = generateSampleComments(postsData);
          
          setGroups(groupsData);
          setPosts(postsData);
          setComments(commentsData);
          setJoinedGroups(joinedGroupsData);
        }
      } catch (error) {
        console.error('Error initializing community data:', error);
        setError('Failed to load community data');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, [user?.id]);
  
  // Get user's groups
  const userGroups = groups.filter(group => joinedGroups.includes(group.id));
  
  // Create a new group
  const createGroup = useCallback(async (groupData: Partial<CommunityGroup>): Promise<CommunityGroup | null> => {
    if (!user?.id) return null;
    
    try {
      setIsLoading(true);
      
      // Create new group object
      const newGroup: CommunityGroup = {
        id: `group-${Date.now()}`,
        name: groupData.name || 'New Group',
        description: groupData.description || '',
        createdBy: user.id,
        createdAt: new Date(),
        membersCount: 1, // Creator is first member
        isPrivate: groupData.isPrivate || false,
        image: groupData.image || `https://placehold.co/400x200/668CFF/FFFFFF?text=${encodeURIComponent(groupData.name || 'New Group')}`,
        tags: groupData.tags || []
      };
      
      // Update state
      setGroups(prevGroups => [...prevGroups, newGroup]);
      setJoinedGroups(prevJoined => [...prevJoined, newGroup.id]);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        const updatedGroups = [...groups, newGroup];
        localStorage.setItem('community_groups', JSON.stringify(updatedGroups));
        
        const updatedJoined = [...joinedGroups, newGroup.id];
        localStorage.setItem(`joined_groups_${user.id}`, JSON.stringify(updatedJoined));
      }
      
      return newGroup;
    } catch (error) {
      console.error('Error creating group:', error);
      setError('Failed to create group');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [groups, joinedGroups, user]);
  
  // Join a group
  const joinGroup = useCallback(async (groupId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      setIsLoading(true);
      
      // Check if already joined
      if (joinedGroups.includes(groupId)) {
        return true;
      }
      
      // Update joined groups
      const updatedJoined = [...joinedGroups, groupId];
      setJoinedGroups(updatedJoined);
      
      // Update group member count
      const updatedGroups = groups.map(group => 
        group.id === groupId 
          ? { ...group, membersCount: group.membersCount + 1 } 
          : group
      );
      setGroups(updatedGroups);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`joined_groups_${user.id}`, JSON.stringify(updatedJoined));
        localStorage.setItem('community_groups', JSON.stringify(updatedGroups));
      }
      
      return true;
    } catch (error) {
      console.error('Error joining group:', error);
      setError('Failed to join group');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [groups, joinedGroups, user]);
  
  // Leave a group
  const leaveGroup = useCallback(async (groupId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      setIsLoading(true);
      
      // Check if already joined
      if (!joinedGroups.includes(groupId)) {
        return true;
      }
      
      // Update joined groups
      const updatedJoined = joinedGroups.filter(id => id !== groupId);
      setJoinedGroups(updatedJoined);
      
      // Update group member count
      const updatedGroups = groups.map(group => 
        group.id === groupId 
          ? { ...group, membersCount: Math.max(0, group.membersCount - 1) } 
          : group
      );
      setGroups(updatedGroups);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`joined_groups_${user.id}`, JSON.stringify(updatedJoined));
        localStorage.setItem('community_groups', JSON.stringify(updatedGroups));
      }
      
      return true;
    } catch (error) {
      console.error('Error leaving group:', error);
      setError('Failed to leave group');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [groups, joinedGroups, user]);
  
  // Create a new post
  const createPost = useCallback(async (postData: Partial<Post>): Promise<Post | null> => {
    if (!user?.id) return null;
    
    try {
      setIsLoading(true);
      
      // Create new post object
      const newPost: Post = {
        id: `post-${Date.now()}`,
        userId: user.id,
        groupId: postData.groupId,
        content: postData.content || '',
        mediaUrls: postData.mediaUrls || [],
        likes: 0,
        comments: 0,
        createdAt: new Date(),
        updatedAt: undefined,
        type: postData.type || 'text',
        workoutId: postData.workoutId,
        privacy: postData.privacy || 'public'
      };
      
      // Update state
      setPosts(prevPosts => [newPost, ...prevPosts]);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        const updatedPosts = [newPost, ...posts];
        localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
      }
      
      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [posts, user]);
  
  // Delete a post
  const deletePost = useCallback(async (postId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      setIsLoading(true);
      
      // Find the post
      const post = posts.find(p => p.id === postId);
      
      // Check if user owns the post
      if (!post || post.userId !== user.id) {
        setError('You can only delete your own posts');
        return false;
      }
      
      // Update state
      setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      
      // Remove associated comments
      const newComments = new Map(comments);
      newComments.delete(postId);
      setComments(newComments);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        const updatedPosts = posts.filter(p => p.id !== postId);
        localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [comments, posts, user]);
  
  // Like a post
  const likePost = useCallback(async (postId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      // Update state
      const updatedPosts = posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 } 
          : post
      );
      setPosts(updatedPosts);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
      }
      
      return true;
    } catch (error) {
      console.error('Error liking post:', error);
      setError('Failed to like post');
      return false;
    }
  }, [posts, user]);
  
  // Unlike a post
  const unlikePost = useCallback(async (postId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      // Update state
      const updatedPosts = posts.map(post => 
        post.id === postId 
          ? { ...post, likes: Math.max(0, post.likes - 1) } 
          : post
      );
      setPosts(updatedPosts);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
      }
      
      return true;
    } catch (error) {
      console.error('Error unliking post:', error);
      setError('Failed to unlike post');
      return false;
    }
  }, [posts, user]);
  
  // Create a comment
  const createComment = useCallback(async (commentData: Partial<Comment>): Promise<Comment | null> => {
    if (!user?.id || !commentData.postId) return null;
    
    try {
      // Create new comment object
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        postId: commentData.postId,
        userId: user.id,
        content: commentData.content || '',
        createdAt: new Date(),
        likes: 0
      };
      
      // Get existing comments for the post
      const existingComments = comments.get(commentData.postId) || [];
      const updatedComments = new Map(comments);
      updatedComments.set(commentData.postId, [...existingComments, newComment]);
      
      // Update comments state
      setComments(updatedComments);
      
      // Update post comment count
      const updatedPosts = posts.map(post => 
        post.id === commentData.postId 
          ? { ...post, comments: (post.comments || 0) + 1 } 
          : post
      );
      setPosts(updatedPosts);
      
      // We would save to localStorage here in a real app
      
      return newComment;
    } catch (error) {
      console.error('Error creating comment:', error);
      setError('Failed to create comment');
      return null;
    }
  }, [comments, posts, user]);
  
  // Delete a comment
  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      // Find the comment and its post
      let foundComment: Comment | undefined;
      let postId: string | undefined;
      
      comments.forEach((commentList, pId) => {
        const comment = commentList.find(c => c.id === commentId);
        if (comment) {
          foundComment = comment;
          postId = pId;
        }
      });
      
      // Check if comment exists and user owns it
      if (!foundComment || !postId || foundComment.userId !== user.id) {
        setError('You can only delete your own comments');
        return false;
      }
      
      // Update comments state
      const existingComments = comments.get(postId) || [];
      const updatedPostComments = existingComments.filter(c => c.id !== commentId);
      
      const updatedComments = new Map(comments);
      updatedComments.set(postId, updatedPostComments);
      setComments(updatedComments);
      
      // Update post comment count
      const updatedPosts = posts.map(post => 
        post.id === postId 
          ? { ...post, comments: Math.max(0, (post.comments || 0) - 1) } 
          : post
      );
      setPosts(updatedPosts);
      
      // We would save to localStorage here in a real app
      
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment');
      return false;
    }
  }, [comments, posts, user]);
  
  // Like a comment
  const likeComment = useCallback(async (commentId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      // Find the comment and its post
      let foundComment: Comment | undefined;
      let postId: string | undefined;
      
      comments.forEach((commentList, pId) => {
        const comment = commentList.find(c => c.id === commentId);
        if (comment) {
          foundComment = comment;
          postId = pId;
        }
      });
      
      // Check if comment exists
      if (!foundComment || !postId) {
        return false;
      }
      
      // Update comment likes
      const existingComments = comments.get(postId) || [];
      const updatedPostComments = existingComments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 } 
          : comment
      );
      
      const updatedComments = new Map(comments);
      updatedComments.set(postId, updatedPostComments);
      setComments(updatedComments);
      
      // We would save to localStorage here in a real app
      
      return true;
    } catch (error) {
      console.error('Error liking comment:', error);
      setError('Failed to like comment');
      return false;
    }
  }, [comments, user]);
  
  // Get posts for a specific group
  const getGroupPosts = useCallback((groupId: string) => {
    return posts
      .filter(post => post.groupId === groupId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [posts]);
  
  // Get trending posts
  const getTrendingPosts = useCallback(() => {
    // Sort by engagement (likes + comments)
    return [...posts]
      .sort((a, b) => (b.likes + (b.comments || 0)) - (a.likes + (a.comments || 0)))
      .slice(0, 10);
  }, [posts]);
  
  // Get comments for a post
  const getPostComments = useCallback((postId: string) => {
    return comments.get(postId) || [];
  }, [comments]);
  
  return (
    <CommunityContext.Provider
      value={{
        groups,
        userGroups,
        joinedGroups,
        posts,
        comments,
        isLoading,
        error,
        createGroup,
        joinGroup,
        leaveGroup,
        createPost,
        deletePost,
        likePost,
        unlikePost,
        createComment,
        deleteComment,
        likeComment,
        getGroupPosts,
        getTrendingPosts,
        getPostComments
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

// Hook to use the community context
export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
}; 