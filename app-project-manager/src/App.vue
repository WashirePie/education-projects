<template>
  <!-- Equal's font & iconset import -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined"
  >
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap"
  >

  <div class="pm-dragbar" />

  <Sidebar
    :auth-user="user"
  />

  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Sidebar from '@/components/Sidebar.vue'

export default defineComponent({
  name: 'Dashboard',
  components: {
    Sidebar
  },
  setup ()
  {
    const user = {
      name: 'Simon',
      lastName: 'Schödler',
      id: '#58166'
    }

    return { user }
  }
})
</script>

<style lang="scss">
// TODO: Move to global scss file @root-rules
html, body { padding: 0; }
body { margin: 0 }

h1, h2, h3, h4, h5, p, a {
  color: $color-font-main;
}

// TODO: Move to global scss file @electron-stuff
::-webkit-scrollbar {
  display: none;
  background-color: $color-general;
  width: 10px
}

::-webkit-scrollbar-thumb:window-inactive,
::-webkit-scrollbar-thumb {
  background: $color-general-darker;
  border-radius: 5px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.pm-main {
  $value: 30px;
  margin-left: $sidebar-width + $value;
  margin-top: $value;
  margin-right: $value;
}

.pm-dragbar {
  margin-left: $sidebar-width;
  height: $dragbar-height;
  background: $color-dragbar;
  -webkit-app-region: drag;
}
</style>
