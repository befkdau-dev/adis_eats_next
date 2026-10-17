"use client";

import { formatETB } from "@/app/lib/order-utils";

const CHART_HEIGHT = 320;

function RevenueBarChart({ data }) {
  const width = 720;
  const height = 260;
  const left = 95;
  const right = 18;
  const top = 24;
  const bottom = 48;

  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const maxRevenue = Math.max(1, ...data.map((item) => item.revenue));
  const tickStep = maxRevenue / 4;
  const barWidth = Math.min(42, (plotWidth / data.length) * 0.55);

  return (
    <section className="rounded-2xl border border-[#e9e7dc] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#203b2d]">
          Revenue — last 7 days
        </h2>
        <p className="mt-1 text-sm text-gray-500">Unit: Ethiopian birr (ETB)</p>
      </div>

      <div className="h-[320px] w-full">
        <svg
          role="img"
          aria-labelledby="revenue-title revenue-description"
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <title id="revenue-title">
            Daily revenue for the last seven days
          </title>
          <desc id="revenue-description">
            A bar chart showing daily revenue in Ethiopian birr.
          </desc>

          {Array.from({ length: 5 }, (_, index) => {
            const value = tickStep * index;
            const y = top + plotHeight - (value / maxRevenue) * plotHeight;

            return (
              <g key={index}>
                <line
                  x1={left}
                  y1={y}
                  x2={width - right}
                  y2={y}
                  stroke="#e9e7dc"
                  strokeDasharray="4 4"
                />
                <text
                  x={left - 10}
                  y={y + 4}
                  fontSize="11"
                  textAnchor="end"
                  fill="#6b7280"
                >
                  {formatETB(value)}
                </text>
              </g>
            );
          })}

          {data.map((item, index) => {
            const slotWidth = plotWidth / data.length;
            const barHeight = (item.revenue / maxRevenue) * plotHeight;
            const x = left + slotWidth * index + (slotWidth - barWidth) / 2;
            const y = top + plotHeight - barHeight;

            return (
              <g key={item.day}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(0, barHeight)}
                  rx="4"
                  fill="#244b36"
                >
                  <title>
                    {item.label}: {formatETB(item.revenue)}
                  </title>
                </rect>
                <text
                  x={x + barWidth / 2}
                  y={height - 20}
                  fontSize="11"
                  textAnchor="middle"
                  fill="#6b7280"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="mb-2 text-left font-semibold text-[#203b2d]">
            Revenue chart data — ETB
          </caption>
          <thead className="bg-[#f7f8f3] text-gray-600">
            <tr>
              <th scope="col" className="px-3 py-2">
                Date
              </th>
              <th scope="col" className="px-3 py-2 text-right">
                Revenue (ETB)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e9e7dc]">
            {data.map((item) => (
              <tr key={item.day}>
                <th scope="row" className="px-3 py-2 font-medium text-gray-700">
                  {item.label}
                </th>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatETB(item.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function OrdersLineChart({ data }) {
  const width = 720;
  const height = 260;
  const left = 42;
  const right = 18;
  const top = 24;
  const bottom = 48;

  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const maxOrders = Math.max(1, ...data.map((item) => item.orders));
  const tickStep = Math.max(1, Math.ceil(maxOrders / 4));

  const points = data.map((item, index) => ({
    ...item,
    x:
      data.length === 1
        ? left + plotWidth / 2
        : left + (plotWidth * index) / (data.length - 1),
    y: top + plotHeight - (item.orders / maxOrders) * plotHeight,
  }));

  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");

  const ticks = [];
  for (let value = 0; value <= maxOrders; value += tickStep) {
    ticks.push(value);
  }
  if (ticks[ticks.length - 1] !== maxOrders) ticks.push(maxOrders);

  return (
    <section className="rounded-2xl border border-[#e9e7dc] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#203b2d]">
          Orders per day — last 7 days
        </h2>
        <p className="mt-1 text-sm text-gray-500">Unit: number of orders</p>
      </div>

      <div className="h-[320px] w-full">
        <svg
          role="img"
          aria-labelledby="orders-title orders-description"
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <title id="orders-title">
            Orders per day for the last seven days
          </title>
          <desc id="orders-description">
            A line chart showing the number of orders recorded each day.
          </desc>

          {ticks.map((value) => {
            const y = top + plotHeight - (value / maxOrders) * plotHeight;

            return (
              <g key={value}>
                <line
                  x1={left}
                  y1={y}
                  x2={width - right}
                  y2={y}
                  stroke="#e9e7dc"
                  strokeDasharray="4 4"
                />
                <text
                  x={left - 10}
                  y={y + 4}
                  fontSize="11"
                  textAnchor="end"
                  fill="#6b7280"
                >
                  {value}
                </text>
              </g>
            );
          })}

          <polyline
            points={linePoints}
            fill="none"
            stroke="#bd7137"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {points.map((point) => (
            <g key={point.day}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="#bd7137"
                stroke="white"
                strokeWidth="2"
              >
                <title>
                  {point.label}: {point.orders} orders
                </title>
              </circle>
              <text
                x={point.x}
                y={height - 20}
                fontSize="11"
                textAnchor="middle"
                fill="#6b7280"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="mb-2 text-left font-semibold text-[#203b2d]">
            Daily order chart data — number of orders
          </caption>
          <thead className="bg-[#f7f8f3] text-gray-600">
            <tr>
              <th scope="col" className="px-3 py-2">
                Date
              </th>
              <th scope="col" className="px-3 py-2 text-right">
                Orders
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e9e7dc]">
            {data.map((item) => (
              <tr key={item.day}>
                <th scope="row" className="px-3 py-2 font-medium text-gray-700">
                  {item.label}
                </th>
                <td className="px-3 py-2 text-right tabular-nums">
                  {item.orders}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function RevenueChart({ dailyRevenue, dailyOrders }) {
  return (
    <div className="space-y-6">
      <RevenueBarChart data={dailyRevenue} />
      <OrdersLineChart data={dailyOrders} />
    </div>
  );
}
