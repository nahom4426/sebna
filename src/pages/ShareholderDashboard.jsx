import React, { useEffect, useMemo, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { useAuthStore } from "@/stores/authStore";
import { getMyShareStats } from "@/pages/admin/users/api/ShareStatsApi";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/solid";

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

const statusConfig = (statusRaw) => {
  const status = String(statusRaw || "").trim().toUpperCase();
  if (status === "FULLY_PAID") {
    return {
      label: "Fully Paid",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircleIcon,
    };
  }
  if (status === "OUTSTANDING") {
    return {
      label: "Outstanding",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: ExclamationTriangleIcon,
    };
  }
  return {
    label: "No Shares",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: MinusCircleIcon,
  };
};

const ProgressBar = ({ value }) => {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <Typography variant="small" className="text-gray-600 font-medium">
          Payment Progress
        </Typography>
        <Typography variant="small" className="text-gray-700 font-semibold">
          {formatPercent(safe)}
        </Typography>
      </div>
      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sebna-navy to-sebna-orange transition-all duration-700"
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
};

const CardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
    <div className="h-4 w-28 rounded-full bg-gray-200 mb-3" />
    <div className="h-9 w-40 rounded-xl bg-gray-200" />
  </div>
);

const ShareholderDashboard = () => {
  const auth = useAuthStore((state) => state.auth);
  const user = auth?.user;

  const initialStats =
    user?.shareStats ||
    user?.shareStatsDto ||
    user?.share_stats ||
    user?.shareStatsResponse ||
    null;

  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(!initialStats);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchLive = async () => {
      if (!auth?.accessToken) return;
      const isInitial = !initialStats;
      if (isInitial) setLoading(true);
      else setRefreshing(true);

      try {
        const res = await getMyShareStats();
        if (!mounted) return;
        if (res?.success) {
          setStats(res.data);
        }
      } finally {
        if (!mounted) return;
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchLive();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.accessToken]);

  const welcomeName =
    user?.userName || user?.firstName || user?.email || user?.mobilePhone || "Shareholder";

  const profileImage = user?.profilePicture || user?.imageData || "";

  const initials = useMemo(() => {
    const parts = [user?.firstName, user?.fatherName, user?.grandFatherName]
      .filter(Boolean)
      .map((p) => String(p).trim());
    const base = parts.length > 0 ? parts : [welcomeName];
    return base
      .join(" ")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join("");
  }, [user?.firstName, user?.fatherName, user?.grandFatherName, welcomeName]);

  const remaining = Number(stats?.amountRemaining);
  const remainingPositive = Number.isFinite(remaining) ? remaining > 0 : false;

  const increaseAmount = Number(stats?.valueIncreaseAmount);
  const increasePositive = Number.isFinite(increaseAmount) ? increaseAmount >= 0 : true;

  const status = statusConfig(stats?.paymentStatus);
  const StatusIcon = status.icon;

  return (
    <div className="mt-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            {profileImage ? (
              <img
                src={profileImage}
                alt={welcomeName}
                className="h-14 w-14 rounded-2xl object-cover border border-gray-200 shadow-sm"
              />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-sebna-navy to-sebna-orange text-white flex items-center justify-center font-bold border border-white/40 shadow-sm">
                {initials || "S"}
              </div>
            )}
            {refreshing && (
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full border-2 border-sebna-navy border-t-transparent animate-spin" />
              </div>
            )}
          </div>
          <div>
            <Typography variant="h4" className="text-gray-900">
              Welcome, {welcomeName}
            </Typography>
            <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${status.color}`}>
              <StatusIcon className="w-4 h-4" />
              {status.label}
            </div>
          </div>
        </div>

        {refreshing && (
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="h-2 w-64 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sebna-navy to-sebna-orange animate-loading-bar" />
              </div>
              <Typography variant="small" className="mt-2 text-center text-gray-600 animate-pulse">
                Updating share stats...
              </Typography>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <Typography variant="h6" className="text-gray-900 font-semibold">
              Payment (Cost Basis)
            </Typography>

            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl p-6 border border-gray-100 bg-gray-50/60">
                <Typography variant="small" className="text-gray-600 font-medium">
                  Shares owned
                </Typography>
                <Typography variant="h4" className="mt-2 text-gray-900 font-bold">
                  {formatInteger(stats?.sharesBoughtAmount)}
                </Typography>
              </div>

              <div className="rounded-2xl p-6 border border-gray-100 bg-gray-50/60">
                <Typography variant="small" className="text-gray-600 font-medium">
                  Purchase price/share
                </Typography>
                <Typography variant="h4" className="mt-2 text-gray-900 font-bold">
                  {formatCurrency(stats?.purchasePricePerShare)}
                </Typography>
              </div>

              <div className="rounded-2xl p-6 border border-gray-100 bg-gray-50/60">
                <Typography variant="small" className="text-gray-600 font-medium">
                  Total cost (cost basis)
                </Typography>
                <Typography variant="h4" className="mt-2 text-gray-900 font-bold">
                  {formatCurrency(stats?.totalCost)}
                </Typography>
              </div>

              <div className={`rounded-2xl p-6 border ${remainingPositive ? "border-amber-200" : "border-green-200"} bg-white`}>
                <Typography variant="small" className="text-gray-600 font-medium">
                  Remaining
                </Typography>
                <Typography variant="h4" className="mt-2 text-gray-900 font-bold">
                  {formatCurrency(stats?.amountRemaining)}
                </Typography>
                <Typography variant="small" className={`mt-2 font-semibold ${remainingPositive ? "text-amber-700" : "text-green-700"}`}>
                  {remainingPositive ? "Payment outstanding" : "All paid"}
                </Typography>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl p-6 border border-gray-100 bg-gray-50/60">
                <Typography variant="small" className="text-gray-600 font-medium">
                  Paid
                </Typography>
                <Typography variant="h4" className="mt-2 text-gray-900 font-bold">
                  {formatCurrency(stats?.amountPaid)}
                </Typography>
              </div>

              <div className="rounded-2xl p-6 border border-gray-100 bg-gray-50/60">
                <Typography variant="small" className="text-gray-600 font-medium">
                  Status
                </Typography>
                <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${status.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {status.label}
                </div>
              </div>

              <div className="rounded-2xl p-6 border border-gray-100 bg-gray-50/60">
                <ProgressBar value={stats?.paymentProgressPercent} />
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <Typography variant="h6" className="text-gray-900 font-semibold">
              Value / Performance (Market)
            </Typography>

            <div className="mt-3 text-gray-700">
              <Typography variant="small" className="text-gray-600">
                You bought at {formatCurrency(stats?.purchasePricePerShare)}. Current price is {formatCurrency(stats?.pricePerShare)}.
              </Typography>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl p-6 border border-gray-100 bg-gray-50/60">
                <Typography variant="small" className="text-gray-600 font-medium">
                  Current price/share
                </Typography>
                <Typography variant="h4" className="mt-2 text-gray-900 font-bold">
                  {formatCurrency(stats?.pricePerShare)}
                </Typography>
              </div>

              <div className="rounded-2xl p-6 border border-gray-100 bg-gray-50/60">
                <Typography variant="small" className="text-gray-600 font-medium">
                  Current market value
                </Typography>
                <Typography variant="h4" className="mt-2 text-gray-900 font-bold">
                  {formatCurrency(stats?.currentMarketValue)}
                </Typography>
              </div>

              <div className="rounded-2xl p-6 border border-gray-100 bg-gray-50/60">
                <Typography variant="small" className="text-gray-600 font-medium">
                  Increase amount
                </Typography>
                <Typography variant="h4" className={`mt-2 font-bold ${increasePositive ? "text-green-700" : "text-red-700"}`}>
                  {increasePositive ? "+" : ""}{formatCurrency(stats?.valueIncreaseAmount)}
                </Typography>
              </div>

              <div className="rounded-2xl p-6 border border-gray-100 bg-gray-50/60">
                <Typography variant="small" className="text-gray-600 font-medium">
                  Increase %
                </Typography>
                <Typography variant="h4" className={`mt-2 font-bold ${increasePositive ? "text-green-700" : "text-red-700"}`}>
                  {increasePositive ? "+" : ""}{formatPercent(stats?.valueIncreasePercent)}
                </Typography>
              </div>
            </div>

            <div className="mt-4">
              <Typography variant="small" className="text-gray-600">
                Market value: {formatCurrency(stats?.currentMarketValue)}
              </Typography>
              <Typography variant="small" className="text-gray-600">
                Increase: {increasePositive ? "+" : ""}{formatCurrency(stats?.valueIncreaseAmount)} ({increasePositive ? "+" : ""}{formatPercent(stats?.valueIncreasePercent)})
              </Typography>
            </div>
          </div>
        </>
      )}
    </div>
  );
 };

export default ShareholderDashboard;
