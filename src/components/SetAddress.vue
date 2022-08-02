<template>
  <div class="h-screen flex flex-1 flex-col">
    <div class="header">Set {{ addressKey }} Address</div>
    <div class="flex flex-col items-center content-center h-32">
      <div
        v-if="!addressSet"
        class="flex w-full px-5 my-auto content-center justify-center"
      >
        <div class="input z-index-50">
          <input
            ref="search"
            id="searchbox"
            @blur="blured"
            @focus.prevent="focused"
            class="input-box"
            v-model="q"
          />
          <div
            style="z-index: 9999"
            class="absolute max-w-lg bg-white shadow"
            v-show="showSuggestions"
          >
            <div class="autocomplete">
              <div
                v-for="place in suggestions"
                :key="place"
                @click="flyToLocation(place)"
              >
                {{ place.address.label }}
              </div>
            </div>
          </div>
        </div>
        <button class="ml-5 p-2 text-white bg-orange-500 rounded-md" @click="discover">
          Search
        </button>
      </div>
      <div v-else class="flex my-auto px-5">
        <div class="flex-1 flex-grow content-center justify-center items-center my-auto">
          {{ address.address.label }}
        </div>
        <button
          class="ml-5 p-2 my-auto text-white bg-orange-500 rounded-md"
          @click="confirmLocation"
        >
          Confirm
        </button>
        <button
          class="ml-5 my-auto p-2 text-white bg-orange-500 rounded-md"
          @click="resetLocation"
        >
          Change
        </button>
      </div>
    </div>
    <div class="h-full flex flex-1 flex-grow bg-grey-500">
      <NbaiMap
        @update-location="setNewAddress"
        ref="map"
        v-if="haveLocation"
        :center="userLocation"
        :zoom="14"
      ></NbaiMap>
    </div>
  </div>
</template>

<script>
import NbaiMap from "@/components/NbaiMap.vue";
import axios from "axios";
export default {
  name: "SetAddress",
  components: {
    NbaiMap,
  },
  props: {
    addressKey: {
      type: String,
      default: "Home",
    },
  },
  data() {
    return {
      addressSet: false,
      address: {},
      showSuggestions: false,
      suggestions: [],
      q: "",
      haveLocation: false,
      userLocation: {
        lat: null,
        lng: null,
      },
      marker: null,
    };
  },
  methods: {
    confirmLocation: function () {
      localStorage.removeItem(this.addressKey);
      localStorage.setItem(this.addressKey, JSON.stringify(this.address));
      this.$emit("address-set");
    },
    resetLocation: function () {
      if (this.marker) {
        this.marker.remove();
      }
      this.addressSet = false;
      this.address = null;
    },
    renderMarker: function (loc) {
      if (this.marker) {
        this.marker.remove();
      }
      this.marker = this.$refs.map.renderMarker(loc);
    },
    setNewAddress: function (event) {
      this.renderMarker({ lat: event.lat, lng: event.lng });
      this._reverseGeoCode(event);
    },
    _reverseGeoCode: async function (loc) {
      const resp = await axios.get("https://api.nextbillion.io/h/revgeocode", {
        params: {
          key: import.meta.env.VITE_NEXTBILLION_API_KEY,
          at: `${loc.lat},${loc.lng}`,
        },
      });
      this.address = resp.data.items[0].title;
      this.addressSet = true;
    },
    flyToLocation: function (place) {
      this.address = place;
      this.addressSet = true;
      this.showSuggestions = false;
      this.$refs.map.map.flyTo({
        center: place.position,
        zoom: 14,
      });
      this.renderMarker(place.position);
    },
    discover: async function () {
      const resp = await axios.get("https://api.nextbillion.io/h/discover", {
        params: {
          key: import.meta.env.VITE_NEXTBILLION_API_KEY,
          q: this.q,
          at: `${this.userLocation.lat},${this.userLocation.lng}`,
        },
      });
      this.suggestions = resp.data.items;
      this.showSuggestions = true;
    },
    geolocationSuccess: function (geolocation) {
      this.haveLocation = true;
      const { latitude, longitude } = geolocation.coords;
      this.userLocation.lat = latitude;
      this.userLocation.lng = longitude;
    },
  },
  mounted() {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(this.geolocationSuccess);
    }
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
