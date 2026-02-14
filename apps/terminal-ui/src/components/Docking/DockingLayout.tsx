import * as React from "react";
import { Layout, Model } from "flexlayout-react";
import "flexlayout-react/style/light.css";

import { defaultDockingModel } from "./docking.model";

type DockingLayoutProps = {
  modelJson?: Record<string, unknown>;
  onModelChange?: (modelJson: Record<string, unknown>) => void;
};

export function DockingLayout({ modelJson = defaultDockingModel, onModelChange }: DockingLayoutProps): JSX.Element {
  const [model] = React.useState(() => Model.fromJson(modelJson));

  const factory = React.useCallback((node: { getComponent: () => string }) => {
    switch (node.getComponent()) {
      case "watchlist":
        return <div data-panel="watchlist">Watchlist panel</div>;
      case "chart":
        return <div data-panel="chart">Chart panel</div>;
      case "orders":
        return <div data-panel="orders">Orders panel</div>;
      default:
        return <div data-panel="unknown">Unknown panel</div>;
    }
  }, []);

  React.useEffect(() => {
    if (!onModelChange) return;
    const listener = () => onModelChange(model.toJson());
    model.addChangeListener(listener);
    return () => model.removeChangeListener(listener);
  }, [model, onModelChange]);

  return <Layout model={model} factory={factory} />;
}
