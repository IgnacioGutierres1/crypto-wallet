<template>
  <canvas ref="doughnutPortfolioChart"></canvas>
</template>

<script>
import {
  Chart,
  ArcElement,
  Legend,
  Tooltip,
  DoughnutController,
} from "chart.js";

Chart.register(ArcElement, Legend, Tooltip, DoughnutController);

export default {
  name: "PortfolioChart",
  props: {
    portfolio: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      chart: null,
    };
  },

  methods: {
    createChart() {
      const crypto = Object.keys(this.portfolio);
      const cryptoAmount = Object.values(this.portfolio);

      console.log(
        "Cryptos que llegan a portfolio:",
        crypto,
        "Montos:",
        cryptoAmount
      );

      this.chart = new Chart(this.$refs.doughnutPortfolioChart, {
        type: "doughnut",
        data: {
          labels: crypto,
          datasets: [
            {
              data: cryptoAmount,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
              borderColor: "#fff",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    },
  },
  watch: {
    portfolio: {
      deep: true,
      handler() {
        if (this.chart) {
          this.chart.destroy();
        }
        this.createChart();
      },
    },
  },
  mounted() {
    this.createChart();
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
};
</script>
