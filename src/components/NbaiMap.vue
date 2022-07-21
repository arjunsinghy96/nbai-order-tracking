<template>
  <div class="map-container" id="map"></div>
</template>

<script>
import nextbillion from "nbmap-gl";
import { decodePolyline } from "nbmap-gl/src/maps/decoder";

export default {
  name: "NbaiMap",
  props: {
    center: {
      lat: 28.6139,
      lng: 77.209,
    },
    zoom: Number,
  },
  data() {
    return {
      map: null,
      origin: null,
      destination: null,
      originMarker: null,
      destinationMarker: null,
      deliveryExecutiveMarker: null,
      interval: null,
    };
  },
  methods: {
    _addMarker: function (loc, icon) {
      const marker = new nextbillion.maps.Marker({
        position: loc,
        map: this.map,
      });
      const markerElement = marker.getElement();
      markerElement.style.backgroundImage = null;
      markerElement.innerHTML = `<i class="fa-solid ${icon}"></i>`;

      return marker;
    },
    _addOriginMarker: function (loc) {
      if (this.originMarker === null) {
        console.log("hey");
        this.originMarker = this._addMarker(loc, "fa-store");
      }
    },
    _removeOriginMarker: function () {
      if (this.originmarker !== null) {
        this.originMarker.remove();
        this.originMarker = null;
      }
    },
    _addDestinationMarker: function (loc) {
      if (this.destinationMarker === null) {
        this.destinationmarker = this._addMarker(loc, "fa-location-dot");
      }
    },
    _removeDestinationMarker: function () {
      if (this.destinationMarker !== null) {
        this.destinationMarker.remove();
        this.destinationMarker = null;
      }
    },
    _addDeliveryMarker: function (loc) {
      if (this.deliveryExecutiveMarker === null) {
        this.deliveryExecutiveMarker = this._addMarker(
          loc,
          "text-orange-700 fa-motorcycle"
        );
      }
    },
    _removeDeliveryMarker: function () {
      if (this.deliveryExecutiveMarker !== null) {
        this.deliveryExecutiveMarker.remove();
        this.deliveryExecutiveMarker = null;
      }
    },
    _renderMap: function () {
      this.map = new nextbillion.maps.Map(document.getElementById("map"), {
        zoom: this.zoom || 12,
        center: this.center,
      });
      this.map.on("click", this.mapClicked);
    },
    renderMarker: function (loc) {
      console.log(loc);
      const marker = new nextbillion.maps.Marker({
        position: loc,
        map: this.map,
      });
      return marker;
    },
    udpateDuration: async function (currentLocation) {
      const directions = await nextbillion.api.Directions({
        origin: currentLocation,
        destination: this.destination,
        steps: true,
      });
      this.$emit("update-path-duration", directions.routes[0].duration);
    },
    startDelivery: function (coords) {
      let index = 0;
      this.interval = setInterval(() => {
        const loc = coords[index];
        index += 3;
        this.moveDeliveryMarker(loc);
        this.udpateDuration(loc);
        if (index >= coords.length) {
          clearInterval(this.interval);
          this.interval = null;
        }
      }, 800);
    },
    _moveMarker: function (markerRef, loc) {
      if (markerRef !== null) {
        markerRef.moveTo(loc);
      }
    },
    _fitBounds: function (bounds, options) {
      if (!options) {
        options = {};
      }
      options.padding = 100;
      this.map.map.fitBounds(bounds, options);
    },
    moveDeliveryMarker: function (loc) {
      this._moveMarker(this.deliveryExecutiveMarker, loc);
    },
    mapClicked: function (event) {
      this.$emit("update-location", event.lngLat);
    },
    renderDirections: async function (origin, destination) {
      const directions = await nextbillion.api.Directions({
        origin,
        destination,
        steps: true,
      });

      const coords = decodePolyline(directions.routes[0].geometry, 5);
      console.log(coords);
      const path = [coords.map((item) => ({ lat: item[0], lng: item[1] }))];

      new nextbillion.maps.Polyline({
        path: path,
        strokeColor: "#f59e0b",
        strokeWeight: 5,
        map: this.map,
      });

      this._addOriginMarker(origin);
      this._addDestinationMarker(destination);
      this._addDeliveryMarker(path[0][0]);

      this._fitBounds([origin, destination], {});

      this.origin = origin;
      this.destination = destination;
      this.$emit("update-path-duration", directions.routes[0].duration);
      this.startDelivery(path[0]);
    },
  },
  mounted() {
    this._renderMap();
  },
};
</script>

<style scoped lang="postcss">
.map-container {
  @apply w-full min-h-full;
}
</style>

<style lang="postcss">
.mapboxgl-marker {
  @apply h-5 w-5 text-lg;
}
</style>
