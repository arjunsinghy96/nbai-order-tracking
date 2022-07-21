<template>
  <div class="h-screen flex flex-col flex-1">
    <div class="h-full flex flex-1 flex-grow">
      <NbaiMap
        @update-location="updateUserLocation"
        @update-path-duration="updatePathDuration"
        ref="nbaimap"
      ></NbaiMap>
    </div>
    <div class="flex flex-col items-center w-full content-center h-40">
      <div class="duration">
        <div class="flex flex-col text-xl font-bold">{{ duration }}</div>
        <div class="text-sm">mins</div>
      </div>
      <div
        v-if="homeAddress.address !== undefined"
        class="w-full text-center text-sm text-gray-500 p-4"
      >
        Delivering to - {{ homeAddress.address.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import NbaiMap from "@/components/NbaiMap.vue";

export default {
  name: "TrackOrderView",
  components: {
    NbaiMap,
  },
  data() {
    return {
      duration: 0,
      haveLocation: true,
      storeAddress: {},
      homeAddress: {},
    };
  },
  methods: {
    updatePathDuration: function (duration) {
      this.duration = Math.floor(duration / 60);
    },
    renderDirections: async function () {
      this.$refs.nbaimap.renderDirections(
        this.storeAddress.position,
        this.homeAddress.position
      );
    },
  },
  mounted() {
    const storeAddress = JSON.parse(localStorage.getItem("Store"));
    const homeAddress = JSON.parse(localStorage.getItem("Home"));

    if (storeAddress === null || homeAddress === null) {
      this.$router.push({ name: "home" });
      return;
    }
    this.storeAddress = storeAddress;
    this.homeAddress = homeAddress;
    this.renderDirections();
  },
};
</script>

<style scoped lang="postcss">
.duration {
  @apply bg-white -mt-8 z-50 text-center shadow-md;
  @apply border-4 rounded-full border border-orange-500 mx-auto w-16 h-16 p-2;
}

button {
  @apply p-1 bg-orange-500 rounded m-2 text-white;
}
</style>
