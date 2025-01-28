<template>
  <div class="about">
    <h1>Compra y Venta de CryptoActivos</h1>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "OperationsView",
  data() {
    return {};
  },
  methods: {
    ...mapActions("cryptostore", ["fetchCryptos"]),
  },
  computed: {
    ...mapGetters("cryptostore", ["getCryptos"]),
  },
  created() {
    this.fetchCryptos();
  },
};
</script>
