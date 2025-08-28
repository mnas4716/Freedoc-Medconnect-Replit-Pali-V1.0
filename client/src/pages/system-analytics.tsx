import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Clock,
  Calendar,
  ArrowLeft,
  Download,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function SystemAnalytics() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("7d");

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!user || (user as any).role !== "admin")) {
      toast({
        title: "Unauthorized",
        description: "Admin access required",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/admin-login";
      }, 500);
    }
  }, [user, isLoading, toast]);

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalUsers: 1847,
      userGrowth: 12.5,
      activeUsers: 1234,
      totalConsultations: 5632,
      consultationGrowth: 8.3,
      completionRate: 92.8,
      avgResponseTime: "4.2 hours",
      patientSatisfaction: 4.7
    },
    consultationsByService: [
      { service: "Prescriptions", count: 2341, percentage: 41.6 },
      { service: "Medical Certificates", count: 1456, percentage: 25.9 },
      { service: "Telehealth", count: 987, percentage: 17.5 },
      { service: "Mental Health", count: 654, percentage: 11.6 },
      { service: "Pathology", count: 194, percentage: 3.4 }
    ],
    weeklyTrends: [
      { day: "Mon", consultations: 87, users: 156 },
      { day: "Tue", consultations: 93, users: 178 },
      { day: "Wed", consultations: 78, users: 145 },
      { day: "Thu", consultations: 102, users: 189 },
      { day: "Fri", consultations: 95, users: 167 },
      { day: "Sat", consultations: 45, users: 89 },
      { day: "Sun", consultations: 32, users: 67 }
    ],
    doctorPerformance: [
      { name: "Dr. Sarah Smith", consultations: 147, rating: 4.9, responseTime: "2.1h" },
      { name: "Dr. Michael Johnson", consultations: 132, rating: 4.8, responseTime: "3.4h" },
      { name: "Dr. Emma Williams", consultations: 89, rating: 4.7, responseTime: "4.8h" },
      { name: "Dr. James Brown", consultations: 156, rating: 4.6, responseTime: "5.2h" },
      { name: "Dr. Olivia Davis", consultations: 98, rating: 4.9, responseTime: "2.8h" }
    ]
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500 text-white p-4 rounded-lg w-fit mx-auto mb-4">
            <div className="h-8 w-8 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
          </div>
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-white/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin-dashboard">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-freedoc-blue">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-freedoc-dark">System Analytics</h1>
                  <p className="text-sm text-slate-600">Platform insights and performance metrics</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-freedoc-dark mt-2">
                    {analyticsData.overview.totalUsers.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600 text-sm font-medium">
                      +{analyticsData.overview.userGrowth}%
                    </span>
                  </div>
                </div>
                <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl">
                  <Users className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Consultations</p>
                  <p className="text-3xl font-bold text-freedoc-dark mt-2">
                    {analyticsData.overview.totalConsultations.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600 text-sm font-medium">
                      +{analyticsData.overview.consultationGrowth}%
                    </span>
                  </div>
                </div>
                <div className="bg-green-100 text-green-600 p-4 rounded-2xl">
                  <Activity className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Completion Rate</p>
                  <p className="text-3xl font-bold text-freedoc-dark mt-2">
                    {analyticsData.overview.completionRate}%
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600 text-sm font-medium">
                      Excellent
                    </span>
                  </div>
                </div>
                <div className="bg-purple-100 text-purple-600 p-4 rounded-2xl">
                  <BarChart3 className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Avg Response Time</p>
                  <p className="text-3xl font-bold text-freedoc-dark mt-2">
                    {analyticsData.overview.avgResponseTime}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600 text-sm font-medium">
                      Improving
                    </span>
                  </div>
                </div>
                <div className="bg-orange-100 text-orange-600 p-4 rounded-2xl">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="services" className="data-[state=active]:bg-freedoc-blue data-[state=active]:text-white">
              Service Breakdown
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-freedoc-blue data-[state=active]:text-white">
              Weekly Trends
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-freedoc-blue data-[state=active]:text-white">
              Doctor Performance
            </TabsTrigger>
            <TabsTrigger value="satisfaction" className="data-[state=active]:bg-freedoc-blue data-[state=active]:text-white">
              Patient Satisfaction
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-freedoc-dark">Consultations by Service Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.consultationsByService.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${
                          index === 0 ? 'from-blue-400 to-blue-600' :
                          index === 1 ? 'from-green-400 to-green-600' :
                          index === 2 ? 'from-purple-400 to-purple-600' :
                          index === 3 ? 'from-orange-400 to-orange-600' :
                          'from-red-400 to-red-600'
                        }`}></div>
                        <div>
                          <p className="font-semibold text-freedoc-dark">{service.service}</p>
                          <p className="text-sm text-slate-600">{service.percentage}% of total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-freedoc-dark">{service.count.toLocaleString()}</p>
                        <p className="text-sm text-slate-600">consultations</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-freedoc-dark">Weekly Activity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-4">
                  {analyticsData.weeklyTrends.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-gradient-to-t from-freedoc-blue to-blue-400 rounded-lg p-4 mb-2" 
                           style={{ height: `${(day.consultations / 102) * 120 + 40}px` }}>
                        <div className="text-white text-sm font-semibold">{day.consultations}</div>
                      </div>
                      <p className="text-sm font-medium text-slate-700">{day.day}</p>
                      <p className="text-xs text-slate-500">{day.users} users</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-freedoc-dark">Doctor Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.doctorPerformance.map((doctor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold">
                          {doctor.name.split(' ')[1].charAt(0)}{doctor.name.split(' ')[2].charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-freedoc-dark">{doctor.name}</p>
                          <p className="text-sm text-slate-600">Rating: ⭐ {doctor.rating}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-8 text-center">
                        <div>
                          <p className="text-2xl font-bold text-freedoc-dark">{doctor.consultations}</p>
                          <p className="text-sm text-slate-600">Consultations</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-freedoc-dark">{doctor.responseTime}</p>
                          <p className="text-sm text-slate-600">Avg Response</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="satisfaction" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-freedoc-dark">Patient Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-freedoc-dark mb-4">
                    {analyticsData.overview.patientSatisfaction}
                  </div>
                  <p className="text-xl text-slate-600">Overall Rating</p>
                  <div className="flex justify-center space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-2xl text-yellow-400">⭐</span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-600">92.8%</div>
                    <p className="text-green-700 font-medium">Completion Rate</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600">4.2h</div>
                    <p className="text-blue-700 font-medium">Avg Response Time</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-600">98.1%</div>
                    <p className="text-purple-700 font-medium">Would Recommend</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}