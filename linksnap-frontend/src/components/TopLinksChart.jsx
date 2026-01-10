import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../context/ThemeContext';

function TopLinksChart({ links = [] }) {
  const { darkMode } = useTheme();

  // Sort links by clicks and take top 5
  const topLinks = links
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)
    .map(link => ({
      name: link.slug || 'Unknown',
      clicks: link.clicks || 0,
      url: link.long || ''
    }));

  // Generate sample data if no links provided
  const chartData = topLinks.length > 0 ? topLinks : generateSampleData();

  const colors = ['#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={darkMode ? '#374151' : '#E5E7EB'} 
          vertical={false}
        />
        <XAxis 
          dataKey="name" 
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
          cursor={{ fill: darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.3)' }}
        />
        <Bar dataKey="clicks" radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Generate sample data
function generateSampleData() {
  return [
    { name: 'link1', clicks: 245 },
    { name: 'link2', clicks: 189 },
    { name: 'link3', clicks: 156 },
    { name: 'link4', clicks: 98 },
    { name: 'link5', clicks: 67 }
  ];
}

export default TopLinksChart;
