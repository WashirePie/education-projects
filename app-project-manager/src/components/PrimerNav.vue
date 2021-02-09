<template>
  <div class="Header">

    <div class="Header-item">
      <a class="Header-link f4 d-flex flex-items-center">
        <AppIcon/>
        <span>ProjectManager</span>
      </a>
    </div>

    <!-- <div class="Header-item">
      <input type="search" class="form-control input-dark" />
    </div> -->

    <div class="Header-item">
      Routes
    </div>

    <div class="Header-item">
      <router-link
        class="Header-link"
        to="/"
      >Dash</router-link>
    </div>

    <div class="Header-item">
      <router-link
        class="Header-link"
        to="/new"
      >New</router-link>
    </div>

    <div class="Header-item Header-item--full">
      <!-- <a href="#" class="Header-link">About</a> -->
    </div>

    <div class="Header-item mr-0">
      <img
        class="avatar"
        height="20"
        alt="@octocat"
        src="@/assets/logo.png"
        width="20"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/components/octicons/AppIcon.vue'

export default defineComponent({
  components: {
    AppIcon
  }
})
</script>
