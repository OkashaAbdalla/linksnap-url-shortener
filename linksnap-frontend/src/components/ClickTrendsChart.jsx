import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

function ClickTrendsChart({ data = [] }) {
  const { darkMode } = useTheme();

  // Generate sample data if none provided
  const chartData = data.length > 0 ? data : generateSampleData();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={darkMode ? '#374151' : '#E5E7EB'} 
          vertical={false}
        />
        <XAxis 
          dataKey="date" 
          stroke={darkMode ? '#9CA3AF' : '#6B7280'}
          style={{ fontSize: '12px' }}
          tickLine={false}
        />
        <YAxis 
          stroke={darkMode ? '#9CA3AF' : '#6B7280'}
          style={{ fontSize: '12px' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
            border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
            borderRadius: '8px',
            color: darkMode ? '#F9FAFB' : '#111827'
          }}
          labelStyle={{ color: darkMode ? '#D1D5DB' : '#6B7280' }}
        />
        <Area 
          type="monotone" 
          dataKey="clicks" 
          stroke="#06B6D4" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorClicks)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Generate sample data for last 30 days
function generateSampleData() {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      clicks: Math.floor(Math.random() * 50) + 10
    });
  }
  
  return data;
}

export default ClickTrendsChart;
