import React, { useState } from "react";
import Button from "components/utils/button";
import {
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Users,
  Activity,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface MetricCard {
  title: string;
  value: string;
  change: number;
  changeType: "increase" | "decrease";
  icon: React.ReactNode;
  color: string;
}

interface MonthlyData {
  month: string;
  created: number;
  solved: number;
  responseTime: number;
}

interface TicketTypeData {
  name: string;
  value: number;
  color: string;
}

// Sample data for the dashboard
const monthlyData: MonthlyData[] = [
  { month: "Jan", created: 45, solved: 42, responseTime: 2.1 },
  { month: "Feb", created: 52, solved: 48, responseTime: 1.8 },
  { month: "Mar", created: 38, solved: 35, responseTime: 2.3 },
  { month: "Apr", created: 61, solved: 58, responseTime: 1.9 },
  { month: "May", created: 55, solved: 52, responseTime: 2.0 },
  { month: "Jun", created: 67, solved: 64, responseTime: 1.7 },
  { month: "Jul", created: 49, solved: 46, responseTime: 2.2 },
  { month: "Aug", created: 73, solved: 70, responseTime: 1.6 },
  { month: "Sep", created: 58, solved: 55, responseTime: 1.9 },
  { month: "Oct", created: 64, solved: 61, responseTime: 1.8 },
  { month: "Nov", created: 71, solved: 68, responseTime: 1.7 },
  { month: "Dec", created: 78, solved: 75, responseTime: 1.5 },
];

const ticketTypeData: TicketTypeData[] = [
  { name: "Technical Issues", value: 35, color: "#8B5CF6" },
  { name: "Feature Requests", value: 25, color: "#10B981" },
  { name: "Bug Reports", value: 20, color: "#F59E0B" },
  { name: "General Support", value: 15, color: "#EF4444" },
  { name: "Billing", value: 5, color: "#3B82F6" },
];

const metrics: MetricCard[] = [
  {
    title: "Created Tickets",
    value: "847",
    change: 12.5,
    changeType: "increase",
    icon: <MessageSquare size={24} />,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Unresolved Tickets",
    value: "23",
    change: 8.2,
    changeType: "decrease",
    icon: <AlertCircle size={24} />,
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Solved Tickets",
    value: "824",
    change: 15.3,
    changeType: "increase",
    icon: <CheckCircle size={24} />,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Avg First Response",
    value: "1.8h",
    change: 5.7,
    changeType: "decrease",
    icon: <Clock size={24} />,
    color: "from-purple-500 to-purple-600",
  },
];

export default function ViewOrganisation() {
  const [selectedPeriod, setSelectedPeriod] = useState("year");

  const handleExportCSV = () => {
    // TODO: Implement CSV export functionality
    console.log("Exporting CSV...");
  };

  const formatChangeValue = (change: number) => {
    return change > 0 ? `+${change}%` : `${change}%`;
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-white/60 mt-1">
              Analytics and performance metrics
            </p>
          </div>
          <Button
            buttonText="Export CSV"
            onPress={handleExportCSV}
            className="bg-white/10 hover:bg-white/20"
            icon={<Download size={20} />}
          />
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center`}
                >
                  {metric.icon}
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    metric.changeType === "increase"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {metric.changeType === "increase" ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )}
                  <span>{formatChangeValue(metric.change)}</span>
                </div>
              </div>

              <div className="mb-2">
                <h3 className="text-2xl font-bold text-white">
                  {metric.value}
                </h3>
                <p className="text-white/60 text-sm">{metric.title}</p>
              </div>

              <p className="text-xs text-white/40">Compared to last month</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Average Ticket Created Chart */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Average Tickets Created
                </h3>
                <p className="text-white/60 text-sm">
                  Monthly ticket creation and resolution trends
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  <span className="text-white/60 text-sm">Created</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-white/60 text-sm">Solved</span>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="created"
                  fill="#A78BFA"
                  radius={[4, 4, 0, 0]}
                  name="Created Tickets"
                />
                <Bar
                  dataKey="solved"
                  fill="#34D399"
                  radius={[4, 4, 0, 0]}
                  name="Solved Tickets"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Response Time Trend */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Response Time Trend
                </h3>
                <p className="text-white/60 text-sm">
                  Average first response time by month
                </p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  label={{
                    value: "Hours",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle", fill: "#9CA3AF" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Ticket Types Distribution */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white">
                Ticket Types Distribution
              </h3>
              <p className="text-white/60 text-sm">
                Breakdown of tickets by category
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ticketTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ticketTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white">
                Performance Metrics
              </h3>
              <p className="text-white/60 text-sm">
                Key performance indicators
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle size={20} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Resolution Rate</p>
                    <p className="text-white/60 text-sm">
                      Tickets resolved successfully
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">97.3%</p>
                  <p className="text-white/60 text-sm">+2.1% vs last month</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Clock size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      Avg Resolution Time
                    </p>
                    <p className="text-white/60 text-sm">
                      Time to close tickets
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-400">4.2h</p>
                  <p className="text-white/60 text-sm">-0.8h vs last month</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Users size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      Customer Satisfaction
                    </p>
                    <p className="text-white/60 text-sm">
                      Based on ticket ratings
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-400">4.8/5</p>
                  <p className="text-white/60 text-sm">+0.2 vs last month</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Recent Activity
              </h3>
              <p className="text-white/60 text-sm">
                Latest ticket updates and actions
              </p>
            </div>
            <Button
              buttonText="View All"
              variant="secondary"
              onPress={() => console.log("View all activity")}
              className="bg-white/10 hover:bg-white/20"
            />
          </div>

          <div className="space-y-4">
            {[
              {
                action: "Ticket #847 resolved",
                time: "2 minutes ago",
                type: "resolved",
              },
              {
                action: "New ticket #848 created",
                time: "15 minutes ago",
                type: "created",
              },
              {
                action: "Agent assigned to ticket #846",
                time: "1 hour ago",
                type: "assigned",
              },
              {
                action: "Ticket #845 escalated",
                time: "2 hours ago",
                type: "escalated",
              },
              {
                action: "Ticket #844 closed",
                time: "3 hours ago",
                type: "closed",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === "resolved"
                      ? "bg-green-500/20"
                      : activity.type === "created"
                      ? "bg-blue-500/20"
                      : activity.type === "assigned"
                      ? "bg-purple-500/20"
                      : activity.type === "escalated"
                      ? "bg-orange-500/20"
                      : "bg-gray-500/20"
                  }`}
                >
                  <Activity
                    size={16}
                    className={
                      activity.type === "resolved"
                        ? "text-green-400"
                        : activity.type === "created"
                        ? "text-blue-400"
                        : activity.type === "assigned"
                        ? "text-purple-400"
                        : activity.type === "escalated"
                        ? "text-orange-400"
                        : "text-gray-400"
                    }
                  />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-white/60 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
