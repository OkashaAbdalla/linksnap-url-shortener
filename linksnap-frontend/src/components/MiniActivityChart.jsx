import { AreaChart, Area, ResponsiveContainer } from 'recharts';

function MiniActivityChart({ data = [], color = '#06B6D4', clicks = 0, darkMode }) {
  // Generate sample data if none provided
  const chartData = data.length > 0 ? data : generateSampleData();

  return (
    <div className="flex items-end gap-2 h-8 mb-3">
      <div className="flex-1 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color}
              strokeWidth={2}
              fillOpacity={1} 
              fill={`url(#gradient-${color})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <span className={`text-xs whitespace-nowrap ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {clicks} clicks
      </span>
    </div>
  );
}

// Generate sample activity data for last 12 periods
function generateSampleData() {
  return Array.from({ length: 12 }, (_, i) => ({
    value: Math.floor(Math.random() * 100) + 20
  }));
}

export default MiniActivityChart;
