<template>
  <div class="foot-logo">
    <img
      src="../assets/img/foot_logo@2x.png"
      width="140"
      height="17"
    />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";

export default defineComponent({
  name: "FooterLogo",
});
</script>

<style scoped lang="scss">
.foot-logo {
  text-align: center;
  margin: 20px 0;
}
</style>
