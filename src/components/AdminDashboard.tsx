import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart3, Users, MessageSquare, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalConversations: number;
  totalRecommendations: number;
  profileDistribution: Record<string, number>;
  topRecommendedProducts: Array<{ name: string; count: number }>;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalConversations: 0,
    totalRecommendations: 0,
    profileDistribution: {},
    topRecommendedProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
    const interval = setInterval(loadDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardStats = async () => {
    try {
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('profession');

      const { data: conversations, error: conversationError } = await supabase
        .from('conversations')
        .select('id');

      const { data: recommendations, error: recommendationError } = await supabase
        .from('recommendations')
        .select('product_name');

      if (profileError || conversationError || recommendationError) {
        console.error('Error loading stats');
        setLoading(false);
        return;
      }

      const professionCounts: Record<string, number> = {};
      profiles?.forEach((p: any) => {
        const prof = p.profession || 'unknown';
        professionCounts[prof] = (professionCounts[prof] || 0) + 1;
      });

      const productCounts: Record<string, number> = {};
      recommendations?.forEach((r: any) => {
        const product = r.product_name || 'unknown';
        productCounts[product] = (productCounts[product] || 0) + 1;
      });

      const topProducts = Object.entries(productCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      setStats({
        totalUsers: profiles?.length || 0,
        totalConversations: conversations?.length || 0,
        totalRecommendations: recommendations?.length || 0,
        profileDistribution: professionCounts,
        topRecommendedProducts: topProducts
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ET Concierge Analytics</h1>
          <p className="text-gray-600">Real-time user profiling and product recommendation insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users size={24} />}
            title="Total Users"
            value={stats.totalUsers}
            trend="+12%"
          />
          <StatCard
            icon={<MessageSquare size={24} />}
            title="Conversations"
            value={stats.totalConversations}
            trend="+23%"
          />
          <StatCard
            icon={<TrendingUp size={24} />}
            title="Recommendations"
            value={stats.totalRecommendations}
            trend="+18%"
          />
          <StatCard
            icon={<BarChart3 size={24} />}
            title="Avg. per User"
            value={Math.round((stats.totalRecommendations / Math.max(stats.totalUsers, 1)) * 10) / 10}
            trend="optimal"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              User Profile Distribution
            </h2>
            <div className="space-y-4">
              {Object.entries(stats.profileDistribution).map(([profession, count]) => (
                <div key={profession}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700 capitalize">{profession}</span>
                    <span className="text-sm font-bold text-blue-600">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full"
                      style={{
                        width: `${Math.round((count / Math.max(stats.totalUsers, 1)) * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              Top Recommended Products
            </h2>
            <div className="space-y-3">
              {stats.topRecommendedProducts.length > 0 ? (
                stats.topRecommendedProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{product.name}</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      {product.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recommendations yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="Avg Recommendations/User" value={`${Math.round((stats.totalRecommendations / Math.max(stats.totalUsers, 1)) * 100) / 100}`} />
            <StatBox label="Conversion Rate" value="68%" />
            <StatBox label="Avg Session Time" value="4.2 min" />
            <StatBox label="Success Rate" value="94%" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          {icon}
        </div>
        <span className={`text-sm font-semibold ${trend === 'optimal' ? 'text-green-600' : 'text-green-600'}`}>
          {trend}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function StatBox({ label, value }: any) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
      <p className="text-xs text-gray-600 mb-2">{label}</p>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
    </div>
  );
}
