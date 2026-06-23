import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { LogOut, MessageSquare, AlertCircle, Plus, Edit2, Trash2, ExternalLink, ArrowUpRight } from 'lucide-react';
import { portfolioAPI, messagesAPI, projectAPI, experienceAPI, skillAPI, caseStudyAPI, achievementAPI, certificationAPI } from '@/utils/api';
import { ThemeToggle } from '../components/Navbar';

const ADMIN_API_BASE = import.meta.env.VITE_API_URL?.trim() || '';
const getAdminToken = () => localStorage.getItem('portfolioToken') || localStorage.getItem('authToken') || localStorage.getItem('adminToken');

const DEFAULT_ABOUT_HIGHLIGHTS = [
  {
    id: 1,
    title: 'Full Stack Developer',
    description: 'Expert in React, Node.js, Next.js, and MongoDB for building scalable applications',
    icon: 'Code',
  },
  {
    id: 2,
    title: 'Blockchain & Web3',
    description: 'Proficient in Solidity smart contracts, Web3.js, and decentralized solutions',
    icon: 'Lightbulb',
  },
  {
    id: 3,
    title: 'AI & Machine Learning',
    description: 'Applied experience with TensorFlow, scikit-learn, and OpenAI APIs',
    icon: 'Users',
  },
  {
    id: 4,
    title: 'Innovative Problem Solver',
    description: 'Building cutting-edge solutions for governance, finance, and verification systems',
    icon: 'Target',
  },
];

interface AdminDashboardProps {
  onUpdate?: () => void;
}

interface DashboardUpdatePayload {
  portfolio?: any;
}

export default function AdminDashboard({ onUpdate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleContentUpdate = async (payload?: DashboardUpdatePayload) => {
    if (payload?.portfolio) {
      setPortfolio(payload.portfolio);
      setStats((currentStats: any) => ({
        ...currentStats,
        lastUpdated: payload.portfolio.lastUpdated || payload.portfolio.updatedAt || currentStats?.lastUpdated || null,
        updatedAt: payload.portfolio.updatedAt || currentStats?.updatedAt || null,
        viewCount: payload.portfolio.viewCount ?? currentStats?.viewCount ?? 0,
      }));
    }

    await loadOverviewData({ skipPortfolio: Boolean(payload?.portfolio) });
    onUpdate?.();
  };

  // Load data when activeTab changes
  useEffect(() => {
    if (activeTab === 'overview') {
      loadOverviewData();
    } else if (activeTab === 'messages') {
      loadMessagesData();
    }
  }, [activeTab]);

  const loadOverviewData = async ({ skipPortfolio = false }: { skipPortfolio?: boolean } = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load portfolio
      if (!skipPortfolio) {
        try {
          const result = await portfolioAPI.getPortfolio();
          setPortfolio(result?.data || result);
        } catch (err) {
          console.warn('Failed to load portfolio:', err);
        }
      }

      // Try to load stats
      try {
        const result = await portfolioAPI.getStats();
        setStats(result?.data || result?.stats || result);
      } catch (err) {
        console.warn('Failed to load stats:', err);
      }

      // Try to load messages
      try {
        const result = await messagesAPI.getAllMessages(1, 5);
        setMessages(result?.data || []);
      } catch (err) {
        console.warn('Failed to load messages:', err);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessagesData = async () => {
    try {
      setLoading(true);
      const result = await messagesAPI.getAllMessages(1, 50);
      setMessages(result?.data || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolioToken');
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminToken');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-surface border-b border-border p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your portfolio content</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              View site
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'about', label: 'About', icon: 'ℹ️' },
            { id: 'stats', label: 'Statistics', icon: '📈' },
            { id: 'projects', label: 'Projects', icon: '📁' },
            { id: 'achievements', label: 'Achievements', icon: '🏆' },
            { id: 'certifications', label: 'Certifications', icon: '📜' },
            { id: 'experience', label: 'Experience', icon: '💼' },
            { id: 'skills', label: 'Skills', icon: '⚙️' },
            { id: 'messages', label: 'Messages', icon: '💬' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {loading && (
          <div className="bg-yellow-500/10 border border-yellow-600 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
            Loading data...
          </div>
        )}

        {activeTab === 'overview' && <OverviewSection portfolio={portfolio} stats={stats} messages={messages} />}
        {activeTab === 'profile' && <ProfileSection portfolio={portfolio} onUpdate={handleContentUpdate} />}
        {activeTab === 'about' && <AboutSection portfolio={portfolio} onUpdate={handleContentUpdate} />}
        {activeTab === 'stats' && <StatsSection portfolio={portfolio} onUpdate={handleContentUpdate} />}
        {activeTab === 'projects' && <ProjectsSection onUpdate={handleContentUpdate} />}
        {activeTab === 'achievements' && <AchievementsSection onUpdate={handleContentUpdate} />}
        {activeTab === 'certifications' && <CertificationsSection />}
        {activeTab === 'experience' && <ExperienceSection onUpdate={handleContentUpdate} />}
        {activeTab === 'skills' && <SkillsSection onUpdate={handleContentUpdate} />}
        {activeTab === 'messages' && <MessagesSection messages={messages} onUpdate={handleContentUpdate} />}
      </div>
    </div>
  );
}

// Overview Section
function OverviewSection({ portfolio, stats, messages }: any) {
  const getLastUpdated = () => {
    if (!stats?.lastUpdated && !stats?.updatedAt) return 'N/A';
    try {
      const date = new Date(stats.lastUpdated || stats.updatedAt);
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Portfolio Views</p>
              <p className="text-2xl font-bold mt-2">{stats?.viewCount || 0}</p>
            </div>
            <span className="text-4xl">👁️</span>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Messages</p>
              <p className="text-2xl font-bold mt-2">{(messages && messages.length) || 0}</p>
            </div>
            <span className="text-4xl">💬</span>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Last Updated</p>
              <p className="text-2xl font-bold mt-2">{getLastUpdated()}</p>
            </div>
            <span className="text-4xl">🔄</span>
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Recent Messages
        </h3>
        <div className="space-y-2">
          {(messages && messages.length > 0) ? (
            messages.slice(0, 5).map((msg: any) => (
              <div key={msg._id} className="bg-surface-2 p-3 rounded flex items-center justify-between">
                <div>
                  <p className="font-semibold">{msg.name || 'Unknown'}</p>
                  <p className="text-muted-foreground text-sm">{(msg.message || '').substring(0, 50)}...</p>
                </div>
                <span className={`px-3 py-1 rounded text-xs ${msg.isRead ? 'bg-surface-3' : 'bg-blue-600 text-white'}`}>
                  {msg.isRead ? 'Read' : 'Unread'}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No messages yet or loading...</p>
          )}
        </div>
      </div>

      {/* Portfolio Info */}
      {portfolio && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Portfolio Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Name</p>
              <p className="text-foreground font-semibold">{portfolio.fullName || 'Not set'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Title</p>
              <p className="text-foreground font-semibold">{portfolio.title || 'Not set'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Email</p>
              <p className="text-foreground font-semibold">{portfolio.email || 'Not set'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Location</p>
              <p className="text-foreground font-semibold">{portfolio.location || 'Not set'}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// About Section
function AboutSection({ portfolio, onUpdate }: any) {
  const [aboutDescription, setAboutDescription] = useState(
    portfolio?.aboutDescription || 
    'I\'ve successfully worked on diverse projects from governance technologies with the Government of India\'s Viksit Bharat initiative to blockchain-based voting systems and AI-powered finance trackers. My focus is on creating scalable, secure, and user-centric solutions that combine cutting-edge technology with practical utility.\n\nWith GATE 2026 qualification (AIR 3460) and active involvement in leadership initiatives like SOUL Bihar & Jharkhand, I\'m committed to continuous learning and making a meaningful impact through technology and innovation.'
  );
  const [isLoadingDescription, setIsLoadingDescription] = useState(false);
  const [descriptionMessage, setDescriptionMessage] = useState('');
  const [aboutData, setAboutData] = useState<any[]>(portfolio?.aboutHighlights || DEFAULT_ABOUT_HIGHLIGHTS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', icon: '' });

  useEffect(() => {
    if (portfolio?.aboutDescription) {
      setAboutDescription(portfolio.aboutDescription);
    }
    if (Array.isArray(portfolio?.aboutHighlights) && portfolio.aboutHighlights.length > 0) {
      setAboutData(portfolio.aboutHighlights);
      return;
    }
    setAboutData(DEFAULT_ABOUT_HIGHLIGHTS);
  }, [portfolio]);

  const persistAboutHighlights = async (nextHighlights: any[]) => {
    await portfolioAPI.updatePortfolio({ aboutHighlights: nextHighlights });
    setAboutData(nextHighlights);
    if (onUpdate) {
      await onUpdate();
    }
  };

  const handleSaveDescription = async () => {
    setIsLoadingDescription(true);
    setDescriptionMessage('');
    try {
      const token = getAdminToken();
      if (!token) {
        setDescriptionMessage('❌ Authentication required');
        return;
      }

      const response = await fetch(`${ADMIN_API_BASE}/api/portfolio`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ aboutDescription }),
      });

      if (!response.ok) {
        throw new Error('Failed to update about description');
      }

      setDescriptionMessage('✅ About description updated successfully!');
      if (onUpdate) {
        await onUpdate();
      }
      setTimeout(() => setDescriptionMessage(''), 3000);
    } catch (error: any) {
      setDescriptionMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsLoadingDescription(false);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', icon: '' });
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({ title: item.title, description: item.description, icon: item.icon });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextHighlights = editingId
      ? aboutData.map(item => item.id === editingId ? { ...item, ...formData } : item)
      : [...aboutData, { id: Date.now(), ...formData }];

    try {
      await persistAboutHighlights(nextHighlights);
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '', icon: '' });
    } catch (error) {
      console.error('Failed to save about highlight:', error);
      alert('Failed to save highlight');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this highlight?')) {
      try {
        await persistAboutHighlights(aboutData.filter(item => item.id !== id));
      } catch (error) {
        console.error('Failed to delete about highlight:', error);
        alert('Failed to delete highlight');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* About Description Editor */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Edit About Description</h2>
        <p className="text-muted-foreground text-sm mb-4">This text appears in the main About section of your portfolio.</p>
        
        <textarea
          value={aboutDescription}
          onChange={(e) => setAboutDescription(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 bg-surface-2 border border-border-strong rounded text-foreground focus:border-blue-500 focus:outline-none resize-vertical"
          placeholder="Enter your about description..."
        />

        {descriptionMessage && (
          <div className={`mt-3 px-4 py-2 rounded text-sm ${descriptionMessage.includes('✅') ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-500/10 text-red-700 dark:text-red-400'}`}>
            {descriptionMessage}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSaveDescription}
            disabled={isLoadingDescription}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-foreground rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingDescription ? 'Saving...' : 'Save Description'}
          </button>
        </div>
      </div>

      {/* Highlights Manager */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">About Me Highlights</h2>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Highlight
          </button>
        </div>

        <div className="bg-blue-500/5 border border-blue-700/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-foreground/80">Edit the highlights that appear in your About Me section. Each highlight has a title, description, and icon.</p>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-lg p-6 space-y-4 mb-6">
            <input
              type="text"
              placeholder="Highlight Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
              required
            />
            <textarea
              placeholder="Highlight Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Icon Name (e.g., Code, Lightbulb, Users, Target)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-surface-3 hover:bg-surface-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {aboutData.map((item) => (
            <div key={item.id} className="bg-surface border border-border rounded-lg p-6 hover:border-border-strong transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
                <span className="text-2xl ml-2">{item.icon}</span>
              </div>
              <div className="flex gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Profile Section
function ProfileSection({ portfolio, onUpdate }: any) {
  const [formData, setFormData] = useState(portfolio || {
    fullName: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    resumeLink: '',
    socialLinks: { github: '', linkedin: '', twitter: '' },
    profileImage: null
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (portfolio) {
      setFormData({
        fullName: portfolio.fullName || '',
        title: portfolio.title || '',
        bio: portfolio.bio || '',
        email: portfolio.email || '',
        phone: portfolio.phone || '',
        location: portfolio.location || '',
        resumeLink: portfolio.resumeLink || '',
        socialLinks: {
          github: portfolio.socialLinks?.github || '',
          linkedin: portfolio.socialLinks?.linkedin || '',
          twitter: portfolio.socialLinks?.twitter || '',
        },
        profileImage: portfolio.profileImage || null
      });
    }
  }, [portfolio]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSocialUpdate = (platform: string, value: string) => {
    setFormData({
      ...formData,
      socialLinks: { ...formData.socialLinks, [platform]: value },
    });
  };

  const handleProfileImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      await portfolioAPI.uploadProfileImage(file);
      if (onUpdate) onUpdate();
      alert('Image uploaded successfully!');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await portfolioAPI.updatePortfolio(formData);
      const updatedPortfolio = response?.data || formData;
      setFormData({
        fullName: updatedPortfolio.fullName || '',
        title: updatedPortfolio.title || '',
        bio: updatedPortfolio.bio || '',
        email: updatedPortfolio.email || '',
        phone: updatedPortfolio.phone || '',
        location: updatedPortfolio.location || '',
        resumeLink: updatedPortfolio.resumeLink || '',
        socialLinks: {
          github: updatedPortfolio.socialLinks?.github || '',
          linkedin: updatedPortfolio.socialLinks?.linkedin || '',
          twitter: updatedPortfolio.socialLinks?.twitter || '',
        },
        profileImage: updatedPortfolio.profileImage || null
      });
      if (onUpdate) await onUpdate({ portfolio: updatedPortfolio });
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold">Edit Profile</h2>

      {/* Profile Header with Image */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <img
              src={formData.profileImage || '/images/profile.jpg'}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-xl"
            />
            <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-full cursor-pointer transition-colors shadow-lg">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                disabled={loading}
                className="hidden"
              />
              <span className="text-foreground text-xl">📸</span>
            </label>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground mb-2">{formData.fullName || 'Your Name'}</h1>
            <p className="text-blue-600 dark:text-blue-400 text-lg mb-2">{formData.title || 'Your Title'}</p>
            <p className="text-foreground/80 mb-4">{formData.location || 'Location'}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {formData.email && (
                <span className="px-3 py-1 bg-blue-600/20 text-blue-700 dark:text-blue-300 text-sm rounded-full border border-blue-500/30">
                  ✉️ {formData.email}
                </span>
              )}
              {formData.phone && (
                <span className="px-3 py-1 bg-purple-600/20 text-purple-700 dark:text-purple-300 text-sm rounded-full border border-purple-500/30">
                  ☎️ {formData.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border">
        {[
          { id: 'personal', label: '👤 Personal Info' },
          { id: 'contact', label: '📞 Contact' },
          { id: 'social', label: '🔗 Social Links' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground/80">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground/80">Professional Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g., Full Stack Developer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground/80">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={5}
                className="w-full bg-surface-2 border border-border-strong rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Tell us about yourself, your experience, and interests..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground/80">Resume Link (Google Drive)</label>
              <input
                type="url"
                value={formData.resumeLink}
                onChange={(e) => handleInputChange('resumeLink', e.target.value)}
                className="w-full bg-surface-2 border border-border-strong rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="https://drive.google.com/..."
              />
            </div>
          </motion.div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground/80">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground/80">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground/80">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full bg-surface-2 border border-border-strong rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="City, Country"
              />
            </div>
          </motion.div>
        )}

        {/* Social Links Tab */}
        {activeTab === 'social' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="bg-blue-500/5 border border-blue-700/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-foreground/80">Add links to your social media profiles. These will be displayed on your portfolio.</p>
            </div>

            {[
              { name: 'github', icon: '🐙', placeholder: 'https://github.com/username' },
              { name: 'linkedin', icon: '💼', placeholder: 'https://linkedin.com/in/username' },
              { name: 'twitter', icon: '𝕏', placeholder: 'https://twitter.com/username' },
            ].map(({ name, icon, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-2 text-foreground/80">
                  {icon} {name.charAt(0).toUpperCase() + name.slice(1)}
                </label>
                <input
                  type="url"
                  value={formData.socialLinks?.[name] || ''}
                  onChange={(e) => handleSocialUpdate(name, e.target.value)}
                  className="w-full bg-surface-2 border border-border-strong rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* Save Button */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-foreground font-semibold rounded-lg transition-all shadow-lg"
          >
            {loading ? '💾 Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// Messages Section
function MessagesSection({ messages, onUpdate }: any) {
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const getFormattedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const isMessageRead = (message: any) => Boolean(message?.isRead ?? message?.read);

  const handleMarkAsRead = async (id: string) => {
    try {
      setActionLoadingId(id);
      await messagesAPI.markAsRead(id);
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      alert('Failed to mark message as read');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      setActionLoadingId(id);
      await messagesAPI.deleteMessage(id);
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {(messages && messages.length > 0) ? (
        messages.map((msg: any) => (
          <div key={msg._id} className="bg-surface border border-border rounded-lg p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-lg">{msg.name || 'Unknown'}</h4>
                <p className="text-muted-foreground text-sm">{msg.email || 'No email'}</p>
              </div>
              <span className={`px-3 py-1 rounded text-xs ${isMessageRead(msg) ? 'bg-surface-3' : 'bg-blue-600 text-white'}`}>
                {isMessageRead(msg) ? 'Read' : 'Unread'}
              </span>
            </div>
            <p className="text-foreground/80 mb-3">{msg.message || 'No message content'}</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">{getFormattedDate(msg.createdAt)}</p>
              <div className="flex gap-2">
                {!isMessageRead(msg) && (
                  <button
                    onClick={() => handleMarkAsRead(msg._id)}
                    disabled={actionLoadingId === msg._id}
                    className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-800/60 disabled:cursor-not-allowed rounded text-sm transition-colors"
                  >
                    {actionLoadingId === msg._id ? 'Working...' : 'Mark Read'}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(msg._id)}
                  disabled={actionLoadingId === msg._id}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white hover:bg-red-700 disabled:bg-red-800/60 disabled:cursor-not-allowed rounded text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  {actionLoadingId === msg._id ? 'Working...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-surface border border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">No messages yet</p>
        </div>
      )}
    </motion.div>
  );
}

// Projects Section
function ProjectsSection({ onUpdate }: any) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    techStack: '',
    liveLink: '',
    githubLink: '',
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAllProjects();
      setProjects(response?.data || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      techStack: '',
      liveLink: '',
      githubLink: '',
    });
    setShowForm(true);
  };

  const handleEdit = (project: any) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      techStack: project.techStack?.join(', ') || '',
      liveLink: project.liveLink,
      githubLink: project.githubLink,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...formData,
        techStack: formData.techStack
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean),
      };

      if (editingId) {
        const response = await projectAPI.updateProject(editingId, data);
        setProjects((currentProjects) =>
          currentProjects.map((project) =>
            project._id === editingId ? response?.data || { ...project, ...data } : project
          )
        );
        alert('Project updated successfully!');
      } else {
        const response = await projectAPI.createProject(data);
        setProjects((currentProjects) => [response?.data || data, ...currentProjects]);
        alert('Project created successfully!');
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        techStack: '',
        liveLink: '',
        githubLink: '',
      });
      await loadProjects();
      if (onUpdate) await onUpdate();
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.deleteProject(id);
        setProjects((currentProjects) => currentProjects.filter((project) => project._id !== id));
        alert('Project deleted successfully!');
        await loadProjects();
        if (onUpdate) await onUpdate();
      } catch (err) {
        console.error('Failed to delete project:', err);
        alert('Failed to delete project');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Projects</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-lg p-6 space-y-4">
          <input
            type="text"
            placeholder="Project Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
            required
          />
          <textarea
            placeholder="Project Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="url"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Tech Stack (comma separated)"
            value={formData.techStack}
            onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
          />
          <input
            type="url"
            placeholder="Live Link"
            value={formData.liveLink}
            onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
          />
          <input
            type="url"
            placeholder="GitHub Link"
            value={formData.githubLink}
            onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-surface-3 hover:bg-surface-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading projects...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">{project.title}</h3>
              <p className="text-muted-foreground text-sm mb-2">{project.description}</p>
              <div className="flex gap-2 flex-wrap mb-3">
                {project.techStack?.map((tech: string) => (
                  <span key={tech} className="px-2 py-1 bg-blue-500/10 text-blue-800 dark:text-blue-200 text-xs rounded">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Experience Section
function ExperienceSection({ onUpdate }: any) {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrentRole: false,
    technologies: '',
    gradient: 'from-blue-500 to-cyan-500',
    color: 'blue',
  });

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const response = await experienceAPI.getAllExperience();
      setExperiences(response?.data || []);
    } catch (err) {
      console.error('Failed to load experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      title: '',
      company: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentRole: false,
      technologies: '',
      gradient: 'from-blue-500 to-cyan-500',
      color: 'blue',
    });
    setShowForm(true);
  };

  const handleEdit = (exp: any) => {
    setEditingId(exp._id);
    setFormData({
      title: exp.title,
      company: exp.company,
      description: exp.description || '',
      location: exp.location || '',
      startDate: exp.startDate?.split('T')[0] || '',
      endDate: exp.endDate?.split('T')[0] || '',
      isCurrentRole: exp.isCurrentRole || false,
      technologies: exp.technologies?.join(', ') || '',
      gradient: exp.gradient || 'from-blue-500 to-cyan-500',
      color: exp.color || 'blue',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        technologies: formData.technologies.split(',').map((t: string) => t.trim()),
      };

      if (editingId) {
        await experienceAPI.updateExperience(editingId, data);
        alert('Experience updated successfully!');
      } else {
        await experienceAPI.createExperience(data);
        alert('Experience created successfully!');
      }

      setShowForm(false);
      loadExperiences();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to save experience:', err);
      alert('Failed to save experience');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await experienceAPI.deleteExperience(id);
        alert('Experience deleted successfully!');
        loadExperiences();
        if (onUpdate) onUpdate();
      } catch (err) {
        console.error('Failed to delete experience:', err);
        alert('Failed to delete experience');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Experience</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Experience
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-lg p-6 space-y-4">
          <input
            type="text"
            placeholder="Job Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
          />
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
            disabled={formData.isCurrentRole}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isCurrentRole}
              onChange={(e) => setFormData({ ...formData, isCurrentRole: e.target.checked })}
              className="w-4 h-4"
            />
            <span>Currently working here</span>
          </label>
          <input
            type="text"
            placeholder="Technologies (comma separated)"
            value={formData.technologies}
            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
          />
          <select
            value={formData.gradient || 'from-blue-500 to-cyan-500'}
            onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
          >
            <option value="from-blue-500 to-cyan-500">Blue/Cyan</option>
            <option value="from-purple-500 to-pink-500">Purple/Pink</option>
            <option value="from-green-500 to-emerald-500">Green/Emerald</option>
            <option value="from-orange-500 to-red-500">Orange/Red</option>
            <option value="from-indigo-500 to-blue-500">Indigo/Blue</option>
            <option value="from-teal-500 to-blue-500">Teal/Blue</option>
          </select>
          <select
            value={formData.color || 'blue'}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
          >
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
            <option value="green">Green</option>
            <option value="orange">Orange</option>
            <option value="indigo">Indigo</option>
            <option value="teal">Teal</option>
          </select>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-surface-3 hover:bg-surface-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading experiences...</p>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp._id} className="bg-surface border border-border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold">{exp.title}</h3>
                  <p className="text-blue-600 dark:text-blue-400">{exp.company}</p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(exp.startDate).toLocaleDateString()} -{' '}
                    {exp.isCurrentRole ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-2">{exp.description}</p>
              {exp.technologies?.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-3">
                  {exp.technologies.map((tech: string) => (
                    <span key={tech} className="px-2 py-1 bg-green-500/10 text-green-800 dark:text-green-200 text-xs rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(exp)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Skills Section
function SkillsSection({ onUpdate }: any) {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    skillsData: '',
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const response = await skillAPI.getAllSkills();
      setSkills(response?.data || []);
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ category: '', skillsData: '' });
    setShowForm(true);
  };

  const handleEdit = (skill: any) => {
    setEditingId(skill._id);
    const skillsText = skill.skills
      ?.map((s: any) => `${s.name}:${s.proficiency}:${s.yearsOfExperience || 0}`)
      .join('|');
    setFormData({
      category: skill.category,
      skillsData: skillsText || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skills = formData.skillsData
        .split('|')
        .filter((s) => s.trim())
        .map((s) => {
          const [name, proficiency, yearsOfExperience] = s.split(':');
          return {
            name: name.trim(),
            proficiency: proficiency.trim(),
            yearsOfExperience: parseInt(yearsOfExperience) || 0,
          };
        });

      const data = {
        category: formData.category,
        skills,
      };

      if (editingId) {
        await skillAPI.updateSkill(editingId, data);
        alert('Skill category updated successfully!');
      } else {
        await skillAPI.createSkill(data);
        alert('Skill category created successfully!');
      }

      setShowForm(false);
      loadSkills();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to save skill:', err);
      alert('Failed to save skill');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this skill category?')) {
      try {
        await skillAPI.deleteSkill(id);
        alert('Skill category deleted successfully!');
        loadSkills();
        if (onUpdate) onUpdate();
      } catch (err) {
        console.error('Failed to delete skill:', err);
        alert('Failed to delete skill');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Skills</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Skill Category
        </button>
      </div>

      <div className="bg-blue-500/10 border border-blue-700 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
        <strong>Format:</strong> SkillName:proficiency:years (e.g., React:expert:5|TypeScript:advanced:4)
        <br />
        <strong>Proficiency:</strong> beginner, intermediate, advanced, expert
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-lg p-6 space-y-4">
          <input
            type="text"
            placeholder="Category Name (e.g., Frontend, Backend)"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
            required
          />
          <textarea
            placeholder="Skills (Format: Name:proficiency:years|Name:proficiency:years)"
            value={formData.skillsData}
            onChange={(e) => setFormData({ ...formData, skillsData: e.target.value })}
            rows={4}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500 font-mono text-sm"
            required
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-surface-3 hover:bg-surface-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading skills...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill) => (
            <div key={skill._id} className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-lg font-bold mb-3">{skill.category}</h3>
              <div className="space-y-2 mb-3">
                {skill.skills?.map((s: any) => (
                  <div key={s.name} className="text-sm">
                    <p className="text-foreground/80">
                      {s.name} <span className="text-muted-foreground">({s.proficiency})</span>
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(skill)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(skill._id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Statistics Section
function StatsSection({ portfolio, onUpdate }: any) {
  const [stats, setStats] = useState<any>({
    projectsCompleted: 50,
    yearsExperience: 5,
    usersImpacted: 100,
    technologiesCount: 15,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await portfolioAPI.getPortfolio();
      if (data?.data?.stats) {
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSaveStats = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const token = getAdminToken();
      if (!token) {
        setMessage('❌ Authentication required');
        return;
      }

      const response = await fetch(`${ADMIN_API_BASE}/api/portfolio`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stats }),
      });

      if (!response.ok) {
        throw new Error('Failed to update statistics');
      }

      setMessage('✅ Statistics updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatChange = (field: string, value: number) => {
    setStats((prev: any) => ({
      ...prev,
      [field]: Math.max(0, value),
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-surface border border-border rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-8">Edit Statistics</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Projects Completed */}
          <div>
            <label className="block text-sm font-medium mb-2">Projects Completed</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={stats.projectsCompleted || 50}
                onChange={(e) => handleStatChange('projectsCompleted', parseInt(e.target.value) || 0)}
                className="flex-1 px-4 py-2 bg-surface-2 border border-border-strong rounded text-foreground focus:border-blue-500 focus:outline-none"
              />
              <span className="text-muted-foreground">+</span>
            </div>
          </div>

          {/* Years Experience */}
          <div>
            <label className="block text-sm font-medium mb-2">Years Experience</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={stats.yearsExperience || 5}
                onChange={(e) => handleStatChange('yearsExperience', parseInt(e.target.value) || 0)}
                className="flex-1 px-4 py-2 bg-surface-2 border border-border-strong rounded text-foreground focus:border-blue-500 focus:outline-none"
              />
              <span className="text-muted-foreground">+</span>
            </div>
          </div>

          {/* Users Impacted */}
          <div>
            <label className="block text-sm font-medium mb-2">Users Impacted (in thousands)</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={stats.usersImpacted || 100}
                onChange={(e) => handleStatChange('usersImpacted', parseInt(e.target.value) || 0)}
                className="flex-1 px-4 py-2 bg-surface-2 border border-border-strong rounded text-foreground focus:border-blue-500 focus:outline-none"
              />
              <span className="text-muted-foreground">K+</span>
            </div>
          </div>

          {/* Technologies Count */}
          <div>
            <label className="block text-sm font-medium mb-2">Technologies Count</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={stats.technologiesCount || 15}
                onChange={(e) => handleStatChange('technologiesCount', parseInt(e.target.value) || 0)}
                className="flex-1 px-4 py-2 bg-surface-2 border border-border-strong rounded text-foreground focus:border-blue-500 focus:outline-none"
              />
              <span className="text-muted-foreground">+</span>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { number: `${stats.projectsCompleted}+`, label: 'Projects Completed' },
              { number: `${stats.yearsExperience}+`, label: 'Years Experience' },
              { number: `${stats.usersImpacted}K+`, label: 'Users Impacted' },
              { number: `${stats.technologiesCount}+`, label: 'Technologies' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 bg-surface-2 rounded-lg text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mt-4 px-4 py-2 rounded text-sm ${message.includes('✅') ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-500/10 text-red-700 dark:text-red-400'}`}>
            {message}
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveStats}
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-foreground rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Achievements Section
function AchievementsSection({ onUpdate }: any) {
  const formRef = useRef<HTMLFormElement>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    icon: 'Award',
    title: '',
    subtitle: '',
    description: '',
    details: [] as string[],
    gradient: 'from-blue-500 to-cyan-500',
    color: 'blue',
    order: 0,
    link: '',
  });
  const [detailInput, setDetailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const iconOptions = ['Award', 'Target', 'Users', 'Zap', 'Code', 'Megaphone'];
  const gradientOptions = [
    { label: 'Blue/Cyan', value: 'from-blue-500 to-cyan-500' },
    { label: 'Purple/Pink', value: 'from-purple-500 to-pink-500' },
    { label: 'Green/Emerald', value: 'from-green-500 to-emerald-500' },
    { label: 'Orange/Red', value: 'from-orange-500 to-red-500' },
  ];
  const colorOptions = ['blue', 'purple', 'green', 'orange'];

  useEffect(() => {
    loadAchievements();
  }, []);

  // Scroll to form when it's shown
  useEffect(() => {
    if (showForm && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showForm]);

  const loadAchievements = async () => {
    try {
      console.log('📥 Loading achievements...');
      const data = await achievementAPI.getAllAchievements();
      const achievementsArray = Array.isArray(data.data) ? data.data : [];
      console.log('✅ Loaded achievements:', achievementsArray.length, 'items');
      setAchievements(achievementsArray);
    } catch (error) {
      console.error('❌ Failed to load achievements:', error);
      setMessage('❌ Failed to load achievements');
      setAchievements([]);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      icon: 'Award',
      title: '',
      subtitle: '',
      description: '',
      details: [],
      gradient: 'from-blue-500 to-cyan-500',
      color: 'blue',
      order: 0,
      link: '',
    });
    setDetailInput('');
    setShowForm(true);
  };

  const handleEdit = (achievement: any) => {
    console.log('📝 Editing achievement:', achievement);
    setEditingId(achievement._id);
    // Ensure all fields are properly populated
    setFormData({
      icon: achievement.icon || 'Award',
      title: achievement.title || '',
      subtitle: achievement.subtitle || '',
      description: achievement.description || '',
      details: achievement.details || [],
      gradient: achievement.gradient || 'from-blue-500 to-cyan-500',
      color: achievement.color || 'blue',
      order: achievement.order || 0,
      link: achievement.link || '',
    });
    setDetailInput('');
    setShowForm(true);
  };

  const handleAddDetail = () => {
    if (detailInput.trim() && !formData.details.includes(detailInput.trim())) {
      setFormData((prev: any) => ({
        ...prev,
        details: [...prev.details, detailInput.trim()],
      }));
      setDetailInput('');
    }
  };

  const handleRemoveDetail = (detail: string) => {
    setFormData((prev: any) => ({
      ...prev,
      details: prev.details.filter((d: string) => d !== detail),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('portfolioToken') || localStorage.getItem('adminToken');
      if (!token) {
        setMessage('❌ Authentication required');
        setLoading(false);
        return;
      }

      console.log('📤 Submitting achievement:', { editingId, formData });

      if (editingId) {
        console.log('🔄 Updating achievement:', editingId);
        const response = await achievementAPI.updateAchievement(editingId, formData);
        console.log('✅ Update response:', response);
        setMessage('✅ Achievement updated successfully!');
      } else {
        console.log('➕ Creating new achievement');
        const response = await achievementAPI.createAchievement(formData);
        console.log('✅ Create response:', response);
        setMessage('✅ Achievement created successfully!');
      }

      setShowForm(false);
      setFormData({
        icon: 'Award',
        title: '',
        subtitle: '',
        description: '',
        details: [],
        gradient: 'from-blue-500 to-cyan-500',
        color: 'blue',
        order: 0,
        link: '',
      });
      await loadAchievements();
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('❌ Submit error:', error);
      setMessage(`❌ Error: ${error.message}`);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this achievement?')) return;

    try {
      const token = localStorage.getItem('portfolioToken') || localStorage.getItem('adminToken');
      if (!token) {
        setMessage('❌ Authentication required');
        return;
      }

      console.log('🗑️ Deleting achievement:', id);
      await achievementAPI.deleteAchievement(id);
      console.log('✅ Achievement deleted successfully');
      setMessage('✅ Achievement deleted successfully!');
      loadAchievements();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('❌ Delete error:', error);
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Leadership & Achievements</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Achievement
        </button>
      </div>

      {message && (
        <div className={`px-4 py-2 rounded text-sm ${message.includes('✅') ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-500/10 text-red-700 dark:text-red-400'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <form ref={formRef} onSubmit={handleSubmit} className="bg-surface border border-border rounded-lg p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Icon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Gradient</label>
              <select
                value={formData.gradient}
                onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
              >
                {gradientOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
            required
          />

          <div>
            <label className="text-sm font-medium mb-2 block">Details</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add detail and press Enter"
                value={detailInput}
                onChange={(e) => setDetailInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDetail())}
                className="flex-1 bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddDetail}
                className="px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.details.map((detail) => (
                <span key={detail} className="px-3 py-1 bg-blue-600 text-white rounded text-sm flex items-center gap-2">
                  {detail}
                  <button
                    type="button"
                    onClick={() => handleRemoveDetail(detail)}
                    className="text-xs hover:text-red-500"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <input
            type="number"
            placeholder="Order"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
          />

          <input
            type="url"
            placeholder="Link (e.g., https://example.com)"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-surface-3 hover:bg-surface-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {achievements.map((achievement) => (
          <div key={achievement._id} className="bg-surface border border-border rounded-lg p-4">
            <div className={`h-1 bg-gradient-to-r ${achievement.gradient} rounded mb-3`} />
            <h3 className="text-lg font-bold mb-1">{achievement.title}</h3>
            <p className="text-muted-foreground text-sm mb-2">{achievement.subtitle}</p>
            <p className="text-muted-foreground text-sm mb-3">{achievement.description}</p>
            {achievement.details && achievement.details.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {achievement.details.map((detail: string) => (
                  <span key={detail} className="px-2 py-1 bg-blue-600/30 rounded text-xs">
                    {detail}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(achievement)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(achievement._id)}
                className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Certifications Section
const EMPTY_CERTIFICATION = {
  title: '',
  issuer: '',
  platform: '',
  issueDate: '',
  credentialId: '',
  verifyUrl: '',
  description: '',
  modules: '',
  order: 0,
};

function CertificationsSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_CERTIFICATION);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const inputClass = 'w-full bg-surface-2 border border-border-strong rounded px-3 py-2 text-foreground focus:outline-none focus:border-blue-500';

  useEffect(() => {
    loadCertifications();
  }, []);

  useEffect(() => {
    if (showForm) {
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [showForm]);

  const loadCertifications = async () => {
    try {
      const data = await certificationAPI.getAllCertifications();
      setCertifications(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.error('Failed to load certifications:', error);
      setMessage('❌ Failed to load certifications');
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_CERTIFICATION, order: certifications.length + 1 });
    setShowForm(true);
  };

  const handleEdit = (cert: any) => {
    setEditingId(cert._id);
    setFormData({
      title: cert.title || '',
      issuer: cert.issuer || '',
      platform: cert.platform || '',
      issueDate: cert.issueDate || '',
      credentialId: cert.credentialId || '',
      verifyUrl: cert.verifyUrl || '',
      description: cert.description || '',
      modules: (cert.modules || []).join(', '),
      order: cert.order || 0,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const payload = {
      ...formData,
      order: Number(formData.order) || 0,
      modules: formData.modules.split(',').map((m) => m.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await certificationAPI.updateCertification(editingId, payload);
        setMessage('✅ Certification updated successfully!');
      } else {
        await certificationAPI.createCertification(payload);
        setMessage('✅ Certification created successfully!');
      }
      setShowForm(false);
      setFormData(EMPTY_CERTIFICATION);
      await loadCertifications();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) return;
    try {
      await certificationAPI.deleteCertification(id);
      setMessage('✅ Certification deleted successfully!');
      loadCertifications();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Certifications</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Certification
        </button>
      </div>

      {message && (
        <div className={`px-4 py-2 rounded text-sm ${message.includes('✅') ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-500/10 text-red-700 dark:text-red-400'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <form ref={formRef} onSubmit={handleSubmit} className="bg-surface border border-border rounded-lg p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputClass} required />
            <input type="text" placeholder="Issuer (e.g., Google)" value={formData.issuer} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} className={inputClass} required />
            <input type="text" placeholder="Platform (e.g., Coursera)" value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} className={inputClass} />
            <input type="date" value={formData.issueDate} onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} className={inputClass} />
            <input type="text" placeholder="Credential ID" value={formData.credentialId} onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })} className={inputClass} />
            <input type="url" placeholder="Verification URL" value={formData.verifyUrl} onChange={(e) => setFormData({ ...formData, verifyUrl: e.target.value })} className={inputClass} />
          </div>
          <textarea placeholder="Description" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputClass} />
          <input type="text" placeholder="Modules / skills (comma separated)" value={formData.modules} onChange={(e) => setFormData({ ...formData, modules: e.target.value })} className={inputClass} />
          <input type="number" placeholder="Order" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className={inputClass} />

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-surface-3 hover:bg-surface-3 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {certifications.map((cert) => (
          <div key={cert._id} className="bg-surface border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">
              {[cert.issuer, cert.platform, cert.issueDate].filter(Boolean).join(' · ')}
            </p>
            <h3 className="text-lg font-bold mb-2">{cert.title}</h3>
            {cert.description && <p className="text-muted-foreground text-sm mb-3">{cert.description}</p>}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleEdit(cert)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(cert._id)}
                className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              {cert.verifyUrl && (
                <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Verify
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
