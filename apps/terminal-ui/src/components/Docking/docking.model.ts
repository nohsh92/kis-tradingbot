export const defaultDockingModel = {
  global: {},
  layout: {
    type: "row",
    children: [
      {
        type: "tabset",
        weight: 30,
        children: [{ type: "tab", name: "Watchlist", component: "watchlist" }],
      },
      {
        type: "tabset",
        weight: 40,
        children: [{ type: "tab", name: "Chart", component: "chart" }],
      },
      {
        type: "tabset",
        weight: 30,
        children: [{ type: "tab", name: "Orders", component: "orders" }],
      },
    ],
  },
} as const;

export function normalizeDockingLayout(layout: Record<string, unknown>): Record<string, unknown> {
  if (!layout || typeof layout !== "object") {
    return { ...defaultDockingModel };
  }

  return layout;
}
