// src/components/AttendanceChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AttendanceChart() {
  // example static data for demo
  const data = {
    labels: ['CS101', 'CS102', 'MA101', 'PH101'],
    datasets: [
      {
        label: 'Present (%)',
        data: [80, 65, 90, 75]
      }
    ]
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <Bar data={data} />
    </div>
  );
}
