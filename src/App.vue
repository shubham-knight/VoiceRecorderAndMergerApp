<template>
  <div id="app">
    <h1>Expedite Commerce Voice recorder App</h1>
    <nav>
      <button @click="loadPage('HomePage')">Home</button>
      <button @click="loadPage('RecorderPage')">Recorder</button>
    </nav>
    <div>
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      currentComponent: null,
    };
  },
  methods: {
    async loadPage(page) {
      // Dynamically load the component
      this.currentComponent = (await import(`@/views/${page}.vue`)).default;
    },
  },
};
</script>

<style>
/* General App Styling */
#app {
  text-align: center;
  font-family: "Roboto", Arial, sans-serif;
  color: #333;
  margin: 0;
  padding: 0;
}

/* Navigation Bar Styling */
nav {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 20px auto;
  max-width: 500px;
}

/* Button Styling */
button {
  background-color: #4caf50; /* Modern green shade */
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 10px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Button Hover Effect */
button:hover {
  background-color: #45a049;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Button Active Effect */
button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsive Layout for Smaller Screens */
@media (max-width: 768px) {
  nav {
    flex-direction: column;
    padding: 10px;
  }
  button {
    margin: 10px 0;
    width: 80%;
  }
}
</style>
