<template>
  <div class="chart-container">
    <canvas class="chart-item" ref="doughnutPortfolioChart"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  width: 300px;
  height: 300px;
  margin: auto;
}

.chart-item {
  width: 100%;
  height: 100%;
}

:root {
  --test: #f7941a;
}
</style>

<script>
import {
  Chart,
  ArcElement,
  Legend,
  Tooltip,
  DoughnutController,
} from "chart.js";

import { mapGetters } from "vuex";

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

  computed: {
    ...mapGetters("cryptostore", ["updateBalance"]),
  },

  methods: {
    createChart() {
      const crypto = Object.keys(this.portfolio);
      const cryptoAmount = Object.values(this.portfolio);
      const cryptoBalance = crypto.map(function (coin, index) {
        return this.updateBalance(cryptoAmount[index], coin);
      }, this);
      const cryptoColor = {
        BTC: "#f7931a",
        ETH: "#3c3c3d",
        USDT: "#26a17b",
        BNB: "#f3ba2f",
        ADA: "#0033ad",
        XRP: "#25aae1",
        SOL: "#66f9a1",
        DOGE: "#c2a633",
        DOT: "#e6007a",
      };

      const backgroundColor = crypto.map(function (cryptoName) {
        return cryptoColor[cryptoName];
      });

      console.log(
        "Cryptos que llegan a portfolio:",
        crypto,
        "Montos:",
        cryptoBalance
      );

      this.chart = new Chart(this.$refs.doughnutPortfolioChart, {
        type: "doughnut",
        data: {
          labels: crypto,
          datasets: [
            {
              data: cryptoBalance,
              backgroundColor,
              borderColor: "#fff",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          cutout: "60%",
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
