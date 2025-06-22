import React from 'react';
import { Chart, LinearScale, CategoryScale, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Enregistrement des échelles nécessaires
Chart.register(LinearScale, CategoryScale, BarElement);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Ventes',
      data: [65, 59, 80, 81, 56],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
  ],
};

const options = {
  scales: {
    x: {
      type: 'category', // Utilisation de l'échelle de catégorie pour l'axe des x
    },
    y: {
      beginAtZero: true,
    },
  },
};


function UserEvolutionChart() {
    return <Bar data={data} options={options} />;
};

export default UserEvolutionChart;