export interface MonthlyData {
  month: string;
  created: number;
  solved: number;
  responseTime: number;
}

export interface TicketTypeData {
  name: string;
  value: number;
  color: string;
}

export interface MetricCard {
  title: string;
  value: string;
  change: number;
  changeType: "increase" | "decrease";
  icon: React.ReactNode;
  color: string;
}

// Sample data for the dashboard
export const monthlyData: MonthlyData[] = [
  { month: "Jan", created: 45, solved: 42, responseTime: 2.1 },
  { month: "Feb", created: 52, solved: 38, responseTime: 1.8 },
  { month: "Mar", created: 38, solved: 25, responseTime: 2.3 },
  { month: "Apr", created: 61, solved: 48, responseTime: 1.9 },
  { month: "May", created: 55, solved: 52, responseTime: 2.0 },
  { month: "Jun", created: 67, solved: 44, responseTime: 1.7 },
  { month: "Jul", created: 49, solved: 36, responseTime: 2.2 },
  { month: "Aug", created: 73, solved: 50, responseTime: 1.6 },
  { month: "Sep", created: 58, solved: 55, responseTime: 1.9 },
  { month: "Oct", created: 64, solved: 61, responseTime: 1.8 },
  { month: "Nov", created: 71, solved: 68, responseTime: 1.7 },
  { month: "Dec", created: 78, solved: 75, responseTime: 1.5 },
];

// Color mapping for ticket types
export const ticketTypeColors: Record<string, string> = {
  TICKET: "#8B5CF6",
  INCIDENT: "#EF4444",
  QUESTION: "#3B82F6",
  REQUEST: "#10B981",
  PROBLEM: "#F59E0B",
  SUGGESTION: "#8B5CF6",
  OTHER: "#6B7280",
};
