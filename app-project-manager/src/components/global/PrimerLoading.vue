<template>

  <div
    class="Primer--Loadingbar bg-green"
    :class="{
      'Primer--Loadingbar--start': start
    }"
    :style="{
      width: progress + '%',
      height: height + 'px'
    }"
  ></div>
  
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: 'PrimerLoadingbar',
  setup() 
  {
    const progress = ref<number>(0)
    const height =   ref<number>(4)
    const start =    ref<boolean>(false)

    watch(progress, (newValue: number) =>
    {
      if (newValue === 100)
      {
        setTimeout(() => 
        {
          progress.value = 0
          height.value = 4
        }, 600)
      }
    })

    return { progress, height, start }
  }
})
</script>

<style lang="scss">

.Primer--Loadingbar {
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 9999;
  transition: all .3s, height .3s .3s;

  & .--start {
    transition: all 3s linear, height .3s .3s !important;
  }
}

</style>