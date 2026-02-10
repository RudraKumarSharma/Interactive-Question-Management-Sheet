import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { Topic } from "@/types/sheet";

const DIFFICULTY_COLORS = {
  Easy: "hsl(160 84% 39%)",
  Medium: "hsl(38 92% 50%)",
  Hard: "hsl(0 84% 60%)",
};

const PIE_COLORS = ["hsl(16 100% 66%)", "hsl(210 20% 75%)"];

interface StatsChartsProps {
  topics: Topic[];
}

const StatsCharts = ({ topics }: StatsChartsProps) => {
  const topicBarData = useMemo(() => {
    return topics.map((t) => {
      const total = t.subTopics.reduce((s, st) => s + st.questions.length, 0);
      const done = t.subTopics.reduce(
        (s, st) => s + st.questions.filter((q) => q.completed).length,
        0,
      );
      return {
        name: t.title.length > 12 ? t.title.slice(0, 12) + "…" : t.title,
        Completed: done,
        Remaining: total - done,
      };
    });
  }, [topics]);

  const difficultyData = useMemo(() => {
    const counts = {
      Easy: { done: 0, total: 0 },
      Medium: { done: 0, total: 0 },
      Hard: { done: 0, total: 0 },
    };
    for (const t of topics) {
      for (const st of t.subTopics) {
        for (const q of st.questions) {
          counts[q.difficulty].total++;
          if (q.completed) counts[q.difficulty].done++;
        }
      }
    }
    return Object.entries(counts).map(([name, { done, total }]) => ({
      name,
      Completed: done,
      Remaining: total - done,
    }));
  }, [topics]);

  const overallPieData = useMemo(() => {
    const total = topics.reduce(
      (s, t) => s + t.subTopics.reduce((s2, st) => s2 + st.questions.length, 0),
      0,
    );
    const done = topics.reduce(
      (s, t) =>
        s +
        t.subTopics.reduce(
          (s2, st) => s2 + st.questions.filter((q) => q.completed).length,
          0,
        ),
      0,
    );
    return [
      { name: "Completed", value: done },
      { name: "Remaining", value: total - done },
    ];
  }, [topics]);

  const total = overallPieData[0].value + overallPieData[1].value;
  const pct =
    total > 0 ? Math.round((overallPieData[0].value / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Overall Pie Chart */}
      <div className="bg-card border rounded-xl p-4">
        <h3 className="text-sm font-heading font-semibold text-foreground mb-2">
          Overall Progress
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={overallPieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
                strokeWidth={2}
                stroke="hsl(var(--background))"
              >
                {overallPieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Legend
                formatter={(value: string) => (
                  <span className="text-xs text-foreground">{value}</span>
                )}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--primary)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "hsl(0 0% 0%)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
                  opacity: 1,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-lg font-bold font-heading text-primary">
          {pct}%
        </p>
      </div>

      {/* By Difficulty Bar Chart */}
      <div className="bg-card border rounded-xl p-4">
        <h3 className="text-sm font-heading font-semibold text-foreground mb-2">
          By Difficulty
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={difficultyData} barGap={2}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--primary)",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
                  opacity: 1,
                }}
                labelStyle={{ color: "hsl(0 0% 0%)" }}
                itemStyle={{ color: "hsl(0 0% 0%)" }}
              />
              <Bar
                dataKey="Completed"
                stackId="a"
                fill="hsl(16 100% 66%)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="Remaining"
                stackId="a"
                fill="hsl(210 20% 75%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* By Topic Bar Chart */}
      <div className="bg-card border rounded-xl p-4 md:col-span-1">
        <h3 className="text-sm font-heading font-semibold text-foreground mb-2">
          By Topic
        </h3>
        <div className="h-48 overflow-x-auto">
          <div style={{ minWidth: Math.max(300, topicBarData.length * 40) }}>
            <ResponsiveContainer width="100%" height={192}>
              <BarChart data={topicBarData} barGap={1}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 8, fill: "hsl(var(--foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  width={25}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--primary)",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
                    opacity: 1,
                  }}
                  labelStyle={{ color: "hsl(0 0% 0%)" }}
                  itemStyle={{ color: "hsl(0 0% 0%)" }}
                />
                <Bar dataKey="Completed" stackId="a" fill="hsl(16 100% 66%)" />
                <Bar
                  dataKey="Remaining"
                  stackId="a"
                  fill="hsl(210 20% 75%)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCharts;
