import React, { useMemo } from "react";
import {
  Typography,
  Button,
} from "@material-tailwind/react";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  BanknotesIcon,
  ChartBarIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { useAuthStore } from "@/stores/authStore";
import { isSuperAdmin } from "@/utils/rbacUtils";
import { chartsConfig } from "@/configs";
import { useDashboardReport } from "@/hooks/useDashboardReport";

const RANGE_LABELS = {
  week: "than last week",
  month: "than last month",
};

const formatInteger = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
};

const formatCurrency = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
};

const formatPercent = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n)}%`;
};

const formatNumber = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n);
};

const KPI_ICONS = [BanknotesIcon, UsersIcon, ChatBubbleLeftRightIcon, ChartBarIcon, ArrowTrendingUpIcon];
const KPI_COLORS = ["bg-gradient-to-r from-blue-500 to-cyan-500", 
                   "bg-gradient-to-r from-purple-500 to-pink-500", 
                   "bg-gradient-to-r from-green-500 to-emerald-500", 
                   "bg-gradient-to-r from-orange-500 to-red-500", 
                   "bg-gradient-to-r from-indigo-500 to-purple-500"];

const normalizeChangePercent = (v) => {
  if (v === null || v === undefined) return "";
  const str = String(v).trim();
  if (!str) return "";
  if (/^[+-]/.test(str)) return str;
  const num = Number(str.replace("%", ""));
  if (Number.isFinite(num)) return `${num >= 0 ? "+" : ""}${num}%`;
  return str;
};

const makeBarChart = ({ title, points }) => {
  const categories = (points || []).map((p) => p.label);
  const data = (points || []).map((p) => Number(p.value) || 0);

  return {
    color: "white",
    title,
    description: "",
    footer: "",
    chart: {
      type: "bar",
      height: 280,
      series: [
        {
          name: title,
          data,
        },
      ],
      options: {
        ...chartsConfig,
        colors: ["#2563eb"],
        plotOptions: {
          bar: {
            columnWidth: "20%",
            borderRadius: 6,
          },
        },
        xaxis: {
          ...chartsConfig.xaxis,
          categories,
        },
      },
    },
  };
};

const makePieChart = ({ title, slices }) => {
  const labels = (slices || []).map((s) => s.label);
  const series = (slices || []).map((s) => Number(s.value) || 0);

  return {
    color: "white",
    title,
    description: "",
    footer: "",
    chart: {
      type: "donut",
      height: 280,
      series,
      options: {
        ...chartsConfig,
        labels,
        legend: {
          ...chartsConfig.legend,
          show: true,
          position: "bottom",
        },
        dataLabels: {
          enabled: true,
        },
      },
    },
  };
};

// Modern Loading Skeleton Components
const CardSkeleton = ({ index }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2">
        <div className={`h-3 w-24 rounded-full bg-gradient-to-r ${KPI_COLORS[index]} opacity-20`}></div>
        <div className="h-8 w-32 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className={`h-12 w-12 rounded-xl ${KPI_COLORS[index]} opacity-20`}></div>
    </div>
    <div className="flex items-center space-x-2">
      <div className="h-4 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-4 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
    </div>
  </div>
);

const ChartSkeleton = ({ isPie = false }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="h-6 w-32 mb-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
    <div className={`${isPie ? "flex items-center justify-center" : ""}`}>
      <div className={`h-64 ${isPie ? "w-64 rounded-full" : "w-full"} bg-gray-200 dark:bg-gray-700 rounded-lg`}></div>
    </div>
  </div>
);

const RangeSelectorSkeleton = () => (
  <div className="flex items-center justify-end gap-2 animate-pulse">
    <div className="h-10 w-20 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
    <div className="h-10 w-20 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
  </div>
);

export function Home() {
  const auth = useAuthStore((state) => state.auth);
  const roleName = auth?.user?.roleName;
  const superAdmin = isSuperAdmin(roleName);

  const { range, setRange, data, loading, isInitialLoad } = useDashboardReport("week");

  const compareLabel = RANGE_LABELS[range] || "than last period";

  const finance = data?.finance || null;
  const financeRemaining = Number(finance?.costBasisTotalRemainingAmount);
  const remainingPositive = Number.isFinite(financeRemaining) ? financeRemaining > 0 : false;

  const cards = useMemo(() => {
    const list = Array.isArray(data?.cards) ? data.cards : [];
    return list.slice(0, 5).map((card, idx) => {
      const Icon = KPI_ICONS[idx % KPI_ICONS.length];
      const change = normalizeChangePercent(card?.changePercent);
      const changeNum = Number(String(card?.changePercent ?? "").replace("%", ""));
      const isNegative = Number.isFinite(changeNum) ? changeNum < 0 : String(change).startsWith("-");
      const footerColor = isNegative ? "text-red-500" : "text-green-500";
      const bgColor = KPI_COLORS[idx % KPI_COLORS.length];

      return {
        color: "white",
        iconBg: bgColor,
        icon: Icon,
        title: card?.title ?? "",
        value: card?.value ?? "-",
        footer: {
          color: footerColor,
          value: change,
          label: compareLabel,
        },
      };
    });
  }, [data?.cards, compareLabel]);

  const barCharts = useMemo(() => {
    const list = Array.isArray(data?.barSeries) ? data.barSeries : [];
    return list.map((s) => makeBarChart(s));
  }, [data?.barSeries]);

  const pieCharts = useMemo(() => {
    const list = Array.isArray(data?.pieSeries) ? data.pieSeries : [];
    const withoutShareholderPaymentStatus = list.filter(
      (p) => String(p?.key || "").trim().toLowerCase() !== "shareholder_payment_status"
    );
    const filtered = superAdmin
      ? withoutShareholderPaymentStatus
      : withoutShareholderPaymentStatus.filter(
          (p) => String(p?.title || "").trim().toLowerCase() !== "login_success"
        );
    return filtered.map((p) => makePieChart(p));
  }, [data?.pieSeries, superAdmin]);

  const shareholderPaymentStatus = useMemo(() => {
    const list = Array.isArray(data?.pieSeries) ? data.pieSeries : [];
    const series = list.find((p) => String(p?.key || "").trim().toLowerCase() === "shareholder_payment_status");
    if (!series) return null;

    return makePieChart({
      title: "Fully Paid vs Outstanding",
      slices: series?.slices || series?.data || series?.points,
    });
  }, [data?.pieSeries]);

  const usersDaily = barCharts.find((c) => String(c.title).trim().toLowerCase() === "users_daily") || barCharts[0];
  const postsDaily = barCharts.find((c) => String(c.title).trim().toLowerCase() === "posts_daily") || barCharts[1];

  const postsByCategory = pieCharts.find((c) => String(c.title).trim().toLowerCase() === "posts_by_category") || pieCharts[0];
  const messagesByType = pieCharts.find((c) => String(c.title).trim().toLowerCase() === "messages_by_type") || pieCharts[1];
  const loginSuccess = pieCharts.find((c) => String(c.title).trim().toLowerCase() === "login_success");

  // Show loading skeletons
  if (isInitialLoad && loading) {
    return (
      <div className="mt-12 space-y-8">
        <RangeSelectorSkeleton />
        <div className="grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(5)].map((_, i) => (
            <CardSkeleton key={i} index={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <div className="grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
          <ChartSkeleton isPie />
          <ChartSkeleton isPie />
          {superAdmin && <ChartSkeleton isPie />}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      {/* Header with Range Selector */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <Button
            size="sm"
            variant={range === "week" ? "filled" : "text"}
            color={range === "week" ? "blue" : "gray"}
            className={`rounded-lg transition-all duration-300 ${
              range === "week" 
                ? "shadow-md shadow-blue-500/20" 
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => setRange("week")}
          >
            Week
          </Button>
          <Button
            size="sm"
            variant={range === "month" ? "filled" : "text"}
            color={range === "month" ? "blue" : "gray"}
            className={`rounded-lg transition-all duration-300 ${
              range === "month" 
                ? "shadow-md shadow-blue-500/20" 
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => setRange("month")}
          >
            Month
          </Button>
        </div>
      </div>

      {/* Loading indicator for subsequent loads */}
      {loading && data && (
        <div className="mb-6 flex items-center justify-center">
          <div className="relative">
            <div className="h-2 w-64 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-loading-bar"></div>
            </div>
            <Typography variant="small" className="mt-2 text-center text-gray-600 dark:text-gray-400 animate-pulse">
              Updating dashboard data...
            </Typography>
          </div>
        </div>
      )}

      {/* Finance KPI Cards (Top Row) */}
      {finance && (
        <div className="mb-10">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <Typography variant="small" className="font-medium text-gray-600 dark:text-gray-400">
                    Price per share (current)
                  </Typography>
                  <Typography variant="h3" className="mt-2 text-gray-900 dark:text-white font-bold">
                    {formatCurrency(finance.pricePerShare)}
                  </Typography>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                  <CurrencyDollarIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <Typography variant="small" className="font-medium text-gray-600 dark:text-gray-400">
                    Total shares sold
                  </Typography>
                  <Typography variant="h3" className="mt-2 text-gray-900 dark:text-white font-bold">
                    {formatInteger(finance.totalSharesSold)}
                  </Typography>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <Typography variant="small" className="font-medium text-gray-600 dark:text-gray-400">
                    Remaining (cost basis)
                  </Typography>
                  <Typography variant="h3" className="mt-2 text-gray-900 dark:text-white font-bold">
                    {formatCurrency(finance.costBasisTotalRemainingAmount)}
                  </Typography>
                  <Typography variant="small" className={`mt-2 font-medium ${remainingPositive ? "text-amber-600" : "text-green-600"}`}>
                    {remainingPositive ? "Outstanding remains" : "All fully paid"}
                  </Typography>
                </div>
                <div className={`p-3 rounded-xl shadow-lg ${remainingPositive ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-green-500 to-emerald-500"}`}>
                  {remainingPositive ? (
                    <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                  ) : (
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <Typography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
              Accounting KPIs
            </Typography>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">Expected (cost basis)</div>
                <div className="mt-2 text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(finance.costBasisTotalExpectedAmount)}</div>
              </div>

              <div className="rounded-xl p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">Deposited</div>
                <div className="mt-2 text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(finance.totalDepositedAmount)}</div>
              </div>

              <div className="rounded-xl p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">Remaining (cost basis)</div>
                <div className="mt-2 text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(finance.costBasisTotalRemainingAmount)}</div>
              </div>

              <div className="rounded-xl p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">Collection rate %</div>
                <div className="mt-2 text-lg font-bold text-gray-900 dark:text-white">{formatPercent(finance.collectionRatePercent)}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <Typography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
              Valuation KPIs
            </Typography>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">Market total value</div>
                <div className="mt-2 text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(finance.marketTotalValue)}</div>
              </div>

              <div className="rounded-xl p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">Unrealized gain amount</div>
                <div className="mt-2 text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(finance.marketUnrealizedGainAmount)}</div>
              </div>

              <div className="rounded-xl p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">Unrealized gain %</div>
                <div className="mt-2 text-lg font-bold text-gray-900 dark:text-white">{formatPercent(finance.marketUnrealizedGainPercent)}</div>
              </div>

              <div className="rounded-xl p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">Fully paid shareholders</div>
                <div className="mt-2 text-lg font-bold text-gray-900 dark:text-white">{formatInteger(finance.fullyPaidShareholdersCount)}</div>
              </div>

              <div className="rounded-xl p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">Outstanding shareholders</div>
                <div className="mt-2 text-lg font-bold text-gray-900 dark:text-white">{formatInteger(finance.outstandingShareholdersCount)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map(({ icon, title, footer, iconBg, ...rest }, idx) => (
          <div 
            key={title} 
            className="group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <StatisticsCard
              {...rest}
              title={title}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              icon={
                <div className={`${iconBg} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {React.createElement(icon, {
                    className: "w-6 h-6 text-white",
                  })}
                </div>
              }
              footer={
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${footer.color.includes('red') ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <Typography className="font-medium text-blue-gray-600 dark:text-gray-400">
                      <strong className={footer.color}>{footer.value}</strong>
                      &nbsp;{footer.label}
                    </Typography>
                  </div>
                </div>
              }
            />
          </div>
        ))}
      </div>

      {/* Bar Charts Section */}
      <div className="mb-8">
        <Typography variant="h5" className="mb-6 text-gray-900 dark:text-white font-semibold">
          Activity Trends
        </Typography>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {usersDaily && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <StatisticsChart {...usersDaily} />
            </div>
          )}
          {postsDaily && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <StatisticsChart {...postsDaily} />
            </div>
          )}
        </div>
      </div>

      {/* Pie Charts Section */}
      <div className="mb-8">
        <Typography variant="h5" className="mb-6 text-gray-900 dark:text-white font-semibold">
          Distribution Analysis
        </Typography>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {shareholderPaymentStatus && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <StatisticsChart {...shareholderPaymentStatus} />
            </div>
          )}
          {postsByCategory && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <StatisticsChart {...postsByCategory} />
            </div>
          )}
          {messagesByType && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <StatisticsChart {...messagesByType} />
            </div>
          )}
          {superAdmin && loginSuccess && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <StatisticsChart {...loginSuccess} />
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {!loading && !data && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
            <ChartBarIcon className="w-12 h-12 text-gray-400" />
          </div>
          <Typography variant="h5" className="mb-2 text-gray-900 dark:text-white">
            No Dashboard Data
          </Typography>
          <Typography className="text-gray-600 dark:text-gray-400">
            Unable to load dashboard metrics. Please try again later.
          </Typography>
        </div>
      )}
    </div>
  );
}

export default Home;