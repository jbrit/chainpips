import React from "react";
import {
  AdvancedRealTimeChart,
  AdvancedRealTimeChartProps,
} from "react-ts-tradingview-widgets";

const Chart: React.FC<AdvancedRealTimeChartProps> = (props) => (
  <AdvancedRealTimeChart {...props} />
);

export default React.memo(Chart);
