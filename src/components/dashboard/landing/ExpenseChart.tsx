import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LineChart, BarChart3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowDown,
  ArrowDown2,
  Calendar,
  Filter,
  Money2,
} from "iconsax-reactjs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const data = [
  { date: "Sep 25", spend: 3200, budget: 2800 },
  { date: "Sep 26", spend: 3600, budget: 3400 },
  { date: "Sep 27", spend: 2100, budget: 3900 },
  { date: "Sep 28", spend: 4100, budget: 4400 },
  { date: "Sep 29", spend: 2800, budget: 4200 },
  { date: "Sep 30", spend: 5200, budget: 4800 },
  { date: "Oct 1", spend: 3400, budget: 3200 },
  { date: "Oct 2", spend: 4200, budget: 5800 },
  { date: "Oct 3", spend: 3900, budget: 4600 },
  { date: "Oct 4", spend: 6800, budget: 6400 },
  { date: "Oct 5", spend: 5100, budget: 7200 },
  { date: "Oct 6", spend: 4600, budget: 5400 },
  { date: "Oct 7", spend: 3800, budget: 4100 },
  { date: "Oct 8", spend: 5600, budget: 5200 },
  { date: "Oct 9", spend: 4200, budget: 3900 },
  { date: "Oct 10", spend: 3200, budget: 2800 },
  { date: "Oct 12", spend: 5800, budget: 6200 },
  { date: "Oct 13", spend: 4400, budget: 4800 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-foreground text-background px-4 py-3 rounded-lg shadow-lg">
        <p className="font-medium mb-2">{label}</p>
        <p className="text-sm font-semibold">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const ExpenseChart = () => {
  const [activeTab, setActiveTab] = useState<"expenseTrigger" | "cashFlow">(
    "expenseTrigger"
  );
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  return (
    <Card className="p-5">
      <div className="flex items-center mb-6 relative">
        <Tabs
          className="flex gap-2"
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "expenseTrigger" | "cashFlow")
          }
        >
          <TabsList>
            <TabsTrigger value="expenseTrigger">Expense Overview</TabsTrigger>
            <TabsTrigger value="cashFlow">Cash Flow</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-chart-spend" />
            <span className="text-sm">Spend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-chart-budget" />
            <span className="text-sm">Budget</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"sm"}>
                <Filter className="w-4 h-4 mr-2" />
                Filter
                <ArrowDown2 />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 h-fit">
              <DropdownMenuItem>
                <Money2 /> Amount
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar /> Date
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Money2 /> Spend
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Money2 /> Budget
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex rounded-2xl">
            <Button
              variant={chartType === "line" ? "outline" : "ghostNavy"}
              size="sm"
              onClick={() => setChartType("line")}
              className="rounded-r-none"
            >
              <LineChart className="w-4 h-4" />
              Line
            </Button>
            <Button
              variant={chartType === "bar" ? "outline" : "ghostNavy"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setChartType("bar")}
            >
              <BarChart3 className="w-4 h-4" />
              Bar
            </Button>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={252}>
        {chartType === "bar" ? (
          <BarChart data={data} barGap={2}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "var(--muted)" }}
            />
            <Bar
              dataKey="spend"
              fill="var(--chart-spend)"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
            <Bar
              dataKey="budget"
              fill="var(--chart-budget)"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
          </BarChart>
        ) : (
          <RechartsLineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="spend"
              stroke="var(--chart-spend)"
              strokeWidth={2}
              dot={{ fill: "var(--chart-spend)", r: 0 }}
            />
            <Line
              type="monotone"
              dataKey="budget"
              stroke="var(--chart-budget)"
              strokeWidth={2}
              dot={{ fill: "var(--chart-budget)", r: 0 }}
            />
          </RechartsLineChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
};
