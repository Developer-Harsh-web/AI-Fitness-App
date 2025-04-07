"use client";

import { useState } from 'react';
import { useCommunity } from '../../lib/hooks/useCommunity';
import { useUserContext } from '../../lib/hooks/UserContext';
import { CommunityGroup } from '../../types';
import Button from '../ui/Button';
import { Users, Plus, UserPlus, UserMinus, Search, ChevronRight, Lock, Loader2 } from 'lucide-react';

export function CommunityGroups() {
  const { 
    groups, 
    userGroups, 
    joinedGroups,
    isLoading,
    error,
    joinGroup,
    leaveGroup
  } = useCommunity();
  
  const { user } = useUserContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    tags: [] as string[]
  });
  const [selectedTag, setSelectedTag] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  
  // Filter groups by search query
  const filteredGroups = groups.filter(group => {
    const searchLower = searchQuery.toLowerCase();
    return (
      group.name.toLowerCase().includes(searchLower) ||
      (group.description && group.description.toLowerCase().includes(searchLower)) ||
      (group.tags && group.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  });
  
  // Handle joining a group
  const handleJoinGroup = async (groupId: string) => {
    setIsJoining(true);
    try {
      await joinGroup(groupId);
    } finally {
      setIsJoining(false);
    }
  };
  
  // Handle leaving a group
  const handleLeaveGroup = async (groupId: string) => {
    setIsJoining(true);
    try {
      await leaveGroup(groupId);
    } finally {
      setIsJoining(false);
    }
  };
  
  // Add a tag to new group
  const addTag = () => {
    if (selectedTag && !newGroupData.tags.includes(selectedTag)) {
      setNewGroupData({
        ...newGroupData,
        tags: [...newGroupData.tags, selectedTag]
      });
      setSelectedTag('');
    }
  };
  
  // Remove a tag from new group
  const removeTag = (tag: string) => {
    setNewGroupData({
      ...newGroupData,
      tags: newGroupData.tags.filter(t => t !== tag)
    });
  };
  
  // Get all unique tags from existing groups
  const allTags = Array.from(
    new Set(
      groups
        .flatMap(group => group.tags || [])
        .filter(Boolean)
    )
  );
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Community Groups</h2>
          <p className="text-gray-500 dark:text-gray-400">Connect with others on similar fitness journeys</p>
        </div>
        
        <Button 
          variant="primary"
          className="flex items-center gap-2"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4" />
          Create Group
        </Button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-red-800 dark:text-red-300">
          {error}
        </div>
      )}
      
      {/* Search bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <input
          type="search"
          className="block w-full p-3 pl-10 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search for groups by name, description, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* My groups section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Groups</h3>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        ) : userGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userGroups.map(group => (
              <GroupCard 
                key={group.id} 
                group={group} 
                isMember={true} 
                onJoin={handleJoinGroup} 
                onLeave={handleLeaveGroup}
                isLoading={isJoining}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No groups joined yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Join a group to connect with others on similar fitness journeys</p>
            <Button
              variant="outline"
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center"
            >
              Browse Groups <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
      
      {/* All groups section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Discover Groups</h3>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        ) : filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups
              .filter(group => !joinedGroups.includes(group.id)) // Only show groups the user hasn't joined
              .map(group => (
                <GroupCard 
                  key={group.id} 
                  group={group} 
                  isMember={joinedGroups.includes(group.id)} 
                  onJoin={handleJoinGroup} 
                  onLeave={handleLeaveGroup}
                  isLoading={isJoining}
                />
              ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No groups found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery 
                ? `No groups matching "${searchQuery}"` 
                : "There are no groups available at the moment"}
            </p>
          </div>
        )}
      </div>
      
      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create New Group</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={newGroupData.name}
                  onChange={(e) => setNewGroupData({...newGroupData, name: e.target.value})}
                  placeholder="Enter group name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={newGroupData.description}
                  onChange={(e) => setNewGroupData({...newGroupData, description: e.target.value})}
                  placeholder="Describe what this group is about"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <select
                    className="flex-grow p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                  >
                    <option value="">Select or type a tag</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    onClick={addTag}
                    disabled={!selectedTag}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newGroupData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    >
                      {tag}
                      <button
                        type="button"
                        className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 focus:outline-none"
                        onClick={() => removeTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="privacy-toggle"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={newGroupData.isPrivate}
                  onChange={(e) => setNewGroupData({...newGroupData, isPrivate: e.target.checked})}
                />
                <label htmlFor="privacy-toggle" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Make this group private
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Handle group creation
                  setShowCreateModal(false);
                  // createGroup(newGroupData) would be called here
                }}
                disabled={!newGroupData.name}
              >
                Create Group
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Group card component
interface GroupCardProps {
  group: CommunityGroup;
  isMember: boolean;
  onJoin: (groupId: string) => void;
  onLeave: (groupId: string) => void;
  isLoading: boolean;
}

function GroupCard({ group, isMember, onJoin, onLeave, isLoading }: GroupCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Group image */}
      <div className="h-32 bg-blue-100 dark:bg-blue-900/30 relative">
        {group.image ? (
          <img 
            src={group.image} 
            alt={group.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/400x200/668CFF/FFFFFF?text=${encodeURIComponent(group.name)}`;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
            <span className="text-white text-xl font-bold">{group.name.substring(0, 2).toUpperCase()}</span>
          </div>
        )}
        
        {group.isPrivate && (
          <div className="absolute top-2 right-2 bg-gray-900/70 rounded-full p-1.5">
            <Lock className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      
      {/* Group content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{group.name}</h3>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
          <Users className="w-4 h-4 mr-1" />
          <span>{group.membersCount} {group.membersCount === 1 ? 'member' : 'members'}</span>
        </div>
        
        {group.description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {group.description}
          </p>
        )}
        
        {/* Tags */}
        {group.tags && group.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {group.tags.map(tag => (
              <span 
                key={tag} 
                className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Join/Leave button */}
        <div className="mt-4">
          {isMember ? (
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-1.5"
              onClick={() => onLeave(group.id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserMinus className="w-4 h-4" />
              )}
              Leave Group
            </Button>
          ) : (
            <Button
              variant="primary"
              className="w-full flex items-center justify-center gap-1.5"
              onClick={() => onJoin(group.id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              Join Group
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 