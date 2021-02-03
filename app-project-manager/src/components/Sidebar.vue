<template>
  <div class="pm-sidebar">
    <div class="pm-sidebar-user">
      <it-avatar
        color="#3051ff"
        :text="`${authUser.name} ${authUser.lastName}`"
        size="60px"
      />
      <h4>{{ authUser.name }} {{ authUser.lastName }}</h4>
      <it-tag>ID {{ authUser.id }}</it-tag>
    </div>
    <router-link to="/">
      Dashboard
    </router-link>
    <router-link to="/create">
      Create
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Sidebar',
  props: {
    authUser: {
      type: Object,
      required: true
    }
  }
})

</script>

<style lang="scss">
.pm-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: $sidebar-width;
  height: 100%;
  border-right: 1px solid $color-border;
  z-index: 1;
  overflow-x: hidden;
  background: $color-general;

  a {
    display: block;
    padding: 10px 0px;
    font-weight: bold;
    color: $color-font-main;
    border-bottom: 1px solid $color-general-darker;
    border-top: 1px solid $color-general-darker;

    &:hover {
      background: $color-accent;
      color: $color-general;
    }

    &.router-link-exact-active {
      color: $color-main-lighter;
      background: $color-general-darker;
    }
  }
}

.pm-sidebar-user {
  width: 100%;
  padding: 20px 0px;
  display: inline-block;

  h4 {
    margin: 0 auto;
    padding: 10px;
  }
}
</style>
