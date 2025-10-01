import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import colors from "tailwindcss/colors";

import { getDailyRevenueInPeriod } from "@/api/get-daily-revenue-in-period";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-ranger-picker";

export function RevenueChart() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

 const { data: dailyRevenueInPeriod } = useQuery({
  queryKey: ["metrics", "daily-revenue-in-period", dateRange],
  queryFn: () => {
    return getDailyRevenueInPeriod({
      from: dateRange?.from,
      to: dateRange?.to,
    });
  },
});

const chartData = useMemo(() => {
  return dailyRevenueInPeriod?.map((chartItem) => {
    const [day, month] = chartItem.date.split('/').map(Number);
    const year = dateRange?.from?.getFullYear() || new Date().getFullYear();
    
    return {
      date: new Date(year, month - 1, day).toISOString(),
      receipt: chartItem.receipt / 100,
    };
  });
}, [dailyRevenueInPeriod, dateRange]);

  return (
    <Card className="col-span-6">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Revenue in the period
          </CardTitle>
          <CardDescription>Daily revenue in the period</CardDescription>
        </div>

        <div className="flex items-center gap-3">
          <Label>Period</Label>
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
      </CardHeader>
      <CardContent>
        {chartData ? (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} style={{ fontSize: 12 }}>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                dy={16}
                stroke="#888"
                tickFormatter={(value: string) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                stroke="#888"
                axisLine={false}
                tickLine={false}
                width={80}
                tickFormatter={(value: number) =>
                  value.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
              />
              <CartesianGrid vertical={false} className="stroke-muted" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Date
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {new Date(payload[0].payload.date).toLocaleDateString("en-US")}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Revenue
                            </span>
                            <span className="font-bold">
                              {Number(payload[0].value).toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                stroke={colors.violet[500]}
                type="linear"
                strokeWidth={2}
                dataKey="receipt"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[240px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}