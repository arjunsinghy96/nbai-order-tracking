<template>
  <SetAddress ref="address" @addressSet="addressSet" :addressKey="addressKey" />
</template>

<script>
import SetAddress from "@/components/SetAddress.vue";

export default {
  name: "SetAddressPage",
  components: {
    SetAddress,
  },
  prop: {
    addressKey: "Home",
  },
  data() {
    return {
      addressKey: "Home",
    };
  },
  methods: {
    addressSet: function () {
      if (this.addressKey === "Home") {
        this.$refs.address.resetLocation();
        this.addressKey = "Store";
      } else {
        this.$router.push({ name: "order-tracking" });
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.header {
  @apply h-16 bg-orange-500 text-white px-5 py-2 flex flex-col justify-center text-lg font-bold;
}
.input {
  @apply w-full max-w-lg border border-orange-500 bg-white rounded-md;
}

.input-box {
  @apply text-gray-700 bg-white w-full py-2 px-10 outline-none z-50;
  border-radius: 2rem;
}
.autocomplete div {
  @apply py-3 px-10 text-left cursor-pointer;
}
</style>
