'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { realEstateAPI, appsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { 
  BarChart3, TrendingUp, Users, Home, DollarSign, Clock,
  Building, MapPin, RefreshCw, ArrowLeft
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface AgentStats {
  agent_id: number;
  first_name: string;
  last_name: string;
  email: string;
  total_listings: number;
  active_listings: number;
  avg_listing_price: number | null;
  inquiries: {
    total: number;
    responded: number;
    avg_response_hours: number | null;
  };
  showings: {
    total: number;
    completed: number;
    interested_buyers: number;
  };
  offers: {
    total: number;
    accepted: number;
    total_sales_volume: number;
    avg_offer_amount: number | null;
  };
}

interface MarketData {
  summary: {
    total_listings: number;
    active_listings: number;
    avg_price: number;
    avg_sqft: number;
    avg_bedrooms: number;
    avg_bathrooms: number;
  };
  priceByType: Array<{ property_type: string; count: number; avg_price: number; min_price: number; max_price: number }>;
  priceByCity: Array<{ city: string; count: number; avg_price: number; min_price: number; max_price: number }>;
  daysOnMarket: Array<{ property_type: string; avg_days_on_market: number }>;
  pricePerSqft: Array<{ property_type: string; avg_price_per_sqft: number }>;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const params = useParams();
  const appId = parseInt(params.id as string);
  const { user, isAuthenticated } = useAuthStore();
  
  const [app, setApp] = useState<any>(null);
  const [agents, setAgents] = useState<AgentStats[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'market' | 'agents'>('market');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (token && !user) return;
    fetchData();
  }, [isAuthenticated, user, appId, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appResponse = await appsAPI.getById(appId);
      setApp(appResponse.data);

      const [agentRes, marketRes] = await Promise.all([
        realEstateAPI.getAgentPerformance(appId),
        realEstateAPI.getMarketAnalytics(appId)
      ]);

      setAgents(agentRes.data?.agents || []);
      setMarketData(marketRes.data || null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const formatNumber = (num: number | null, decimals = 0) => {
    if (num === null) return '-';
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(num);
  };

  return (
    <AppLayout appId={params.id as string} appName={app?.name || 'App'}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/app/${appId}/reports/dashboard`)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-purple-600" />
                Analytics & Reports
              </h1>
              <p className="text-sm text-gray-600">
                Market trends and agent performance for {app?.name || 'your app'}
              </p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="secondary"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('market')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'market' 
                  ? 'border-purple-600 text-purple-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="h-4 w-4 inline mr-2" />
              Market Analytics
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'agents' 
                  ? 'border-purple-600 text-purple-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Agent Performance
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : activeTab === 'market' ? (
          /* Market Analytics Tab */
          <div className="space-y-6">
            {/* Market Summary */}
            {marketData?.summary && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs uppercase mb-1">
                    <Building className="h-4 w-4" />
                    Total Listings
                  </div>
                  <p className="text-2xl font-bold">{marketData.summary.total_listings}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-2 text-green-600 text-xs uppercase mb-1">
                    <Home className="h-4 w-4" />
                    Active
                  </div>
                  <p className="text-2xl font-bold text-green-600">{marketData.summary.active_listings}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-2 text-blue-600 text-xs uppercase mb-1">
                    <DollarSign className="h-4 w-4" />
                    Avg Price
                  </div>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(marketData.summary.avg_price)}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs uppercase mb-1">
                    Avg Sq Ft
                  </div>
                  <p className="text-2xl font-bold">{formatNumber(marketData.summary.avg_sqft)}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs uppercase mb-1">
                    Avg Beds
                  </div>
                  <p className="text-2xl font-bold">{formatNumber(marketData.summary.avg_bedrooms, 1)}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs uppercase mb-1">
                    Avg Baths
                  </div>
                  <p className="text-2xl font-bold">{formatNumber(marketData.summary.avg_bathrooms, 1)}</p>
                </div>
              </div>
            )}

            {/* Price by Property Type */}
            {marketData?.priceByType && marketData.priceByType.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Price by Property Type</h2>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                          <th className="pb-3">Type</th>
                          <th className="pb-3 text-right">Count</th>
                          <th className="pb-3 text-right">Avg Price</th>
                          <th className="pb-3 text-right">Min</th>
                          <th className="pb-3 text-right">Max</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {marketData.priceByType.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-3 capitalize font-medium">{item.property_type}</td>
                            <td className="py-3 text-right">{item.count}</td>
                            <td className="py-3 text-right text-blue-600 font-medium">{formatCurrency(item.avg_price)}</td>
                            <td className="py-3 text-right text-gray-500">{formatCurrency(item.min_price)}</td>
                            <td className="py-3 text-right text-gray-500">{formatCurrency(item.max_price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Price by City */}
            {marketData?.priceByCity && marketData.priceByCity.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    Price by Location
                  </h2>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                          <th className="pb-3">City</th>
                          <th className="pb-3 text-right">Listings</th>
                          <th className="pb-3 text-right">Avg Price</th>
                          <th className="pb-3 text-right">Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {marketData.priceByCity.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-3 font-medium">{item.city}</td>
                            <td className="py-3 text-right">{item.count}</td>
                            <td className="py-3 text-right text-blue-600 font-medium">{formatCurrency(item.avg_price)}</td>
                            <td className="py-3 text-right text-gray-500 text-sm">
                              {formatCurrency(item.min_price)} - {formatCurrency(item.max_price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Days on Market & Price per Sqft */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {marketData?.daysOnMarket && marketData.daysOnMarket.length > 0 && (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      Avg Days on Market
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {marketData.daysOnMarket.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="capitalize text-gray-700">{item.property_type}</span>
                          <span className="font-bold text-gray-900">{formatNumber(item.avg_days_on_market)} days</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {marketData?.pricePerSqft && marketData.pricePerSqft.length > 0 && (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Price per Sq Ft</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {marketData.pricePerSqft.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="capitalize text-gray-700">{item.property_type}</span>
                          <span className="font-bold text-blue-600">
                            {item.avg_price_per_sqft ? `$${formatNumber(item.avg_price_per_sqft, 2)}/sqft` : '-'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Agent Performance Tab */
          <div className="space-y-6">
            {agents.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium">No agents found</h3>
                <p className="text-sm text-gray-500">No agents with the agent role in this app</p>
              </div>
            ) : (
              agents.map((agent) => (
                <div key={agent.agent_id} className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {agent.first_name} {agent.last_name}
                        </h2>
                        <p className="text-sm text-gray-500">{agent.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(agent.offers.total_sales_volume)}
                        </p>
                        <p className="text-xs text-gray-500">Total Sales Volume</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {/* Listings */}
                      <div>
                        <h3 className="text-xs font-medium text-gray-500 uppercase mb-3">Listings</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total</span>
                            <span className="font-medium">{agent.total_listings}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Active</span>
                            <span className="font-medium text-green-600">{agent.active_listings}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Avg Price</span>
                            <span className="font-medium">{formatCurrency(agent.avg_listing_price)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Inquiries */}
                      <div>
                        <h3 className="text-xs font-medium text-gray-500 uppercase mb-3">Inquiries</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total</span>
                            <span className="font-medium">{agent.inquiries.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Responded</span>
                            <span className="font-medium text-green-600">{agent.inquiries.responded}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Avg Response</span>
                            <span className="font-medium">
                              {agent.inquiries.avg_response_hours 
                                ? `${formatNumber(agent.inquiries.avg_response_hours, 1)}h` 
                                : '-'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Showings */}
                      <div>
                        <h3 className="text-xs font-medium text-gray-500 uppercase mb-3">Showings</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total</span>
                            <span className="font-medium">{agent.showings.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Completed</span>
                            <span className="font-medium text-green-600">{agent.showings.completed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Interested</span>
                            <span className="font-medium text-blue-600">{agent.showings.interested_buyers}</span>
                          </div>
                        </div>
                      </div>

                      {/* Offers */}
                      <div>
                        <h3 className="text-xs font-medium text-gray-500 uppercase mb-3">Offers</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total</span>
                            <span className="font-medium">{agent.offers.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Accepted</span>
                            <span className="font-medium text-green-600">{agent.offers.accepted}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Avg Offer</span>
                            <span className="font-medium">{formatCurrency(agent.offers.avg_offer_amount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
