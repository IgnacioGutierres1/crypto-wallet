<template>
  <header class="header-container">
    <div class="header-container__sidebar"></div>
    <div class="header-container__nav">
      <router-link to="/" class="header-container__link">Inicio</router-link>
      <router-link to="/OperationsView" class="header-container__link"
        >Operaciones</router-link
      >
    </div>
    <div class="header__avatar">
      <img src="../assets/avatar.png" class="header__avatar-img" />
    </div>
  </header>
</template>
<script>
export default {
  name: "HeaderComponent",
};
</script>
<style scoped>
.header-container {
  display: grid;
  margin: 10px 10px 50px 10px;
  padding: 0 5px;
  border-radius: 10px;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: 3rem;
  align-items: center;
  background: linear-gradient(45deg, #1a1c35, #1f2d5a, #1f2061);
}

.header-container__nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.header-container__link {
  text-decoration: none;
  padding: 13px 10px;
  color: white;
}

.header-container__link:hover {
  background: rgba(243, 243, 243, 0.664);
}

.header__avatar {
  justify-self: end;
}

.header__avatar-img {
  width: 30px;
  justify-self: end;
}
</style>
