<template>
  <div ref="map" style="height: 100%; width: 100%"></div>
</template>

<script>
// Tell ESLint that google is a global variable
/* global google */

export default {
  name: "GoogleMap",
  props: {
    vessels: {
      type: Array,
      default: () => [],
    },
    center: {
      type: Object,
      default: () => ({ lat: 0, lng: 0 }),
      required: true,
    },
    zoom: {
      type: Number,
      default: 8,
    },
    apiKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      map: null,
      markers: [],
    };
  },
  mounted() {
    console.log("Google map is being loaded");
    this.$nextTick(() => {
      this.loadGoogleMaps();
    });
  },
  watch: {
    vessels(newVessels) {
      this.updateMarkers(newVessels);
    },
    center(newCenter) {
      this.setCenter(newCenter);
    },
  },
  methods: {
    loadGoogleMaps() {
      if (typeof window !== "undefined" && !window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=googleMapInitCallback&loading=async`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        window.googleMapInitCallback = this.initMap.bind(this);
      } else if (typeof google !== "undefined") {
        this.initMap();
      } else {
        console.error("Google Maps API failed to load.");
      }
    },
    initMap() {
      if (this.$refs.map) {
        this.map = new google.maps.Map(this.$refs.map, {
          center: this.center,
          zoom: this.zoom,
        });

        this.updateMarkers(this.vessels);
      } else {
        console.error("Map reference not found.");
      }
    },

    updateMarkers(vessels) {
      if (typeof google === "undefined") {
        console.error("Google Maps API not loaded yet.");
        return;
      }

      this.clearMarkers();

      vessels.forEach((vessel) => {
        this.addMarker(vessel);
      });
    },

    addMarker(vessel) {
      if (typeof google === "undefined" || !google.maps) {
        console.error("Google Maps API is not available.");
        return;
      }

      if (vessel.latitude === undefined || vessel.longitude === undefined) {
        console.warn(`Invalid coordinates for vessel: ${vessel.name}`);
        return;
      }

      const position = { lat: vessel.latitude, lng: vessel.longitude };

      const markerIcon = {
        url: "/cargo-ship.png",
        scaledSize: { width: 30, height: 30 },
        origin: { x: 0, y: 0 },
        anchor: { x: 15, y: 15 },
      };

      // Ensure google.maps.Marker is available before using it
      if (google.maps.Marker) {
        const marker = new google.maps.Marker({
          position: position,
          map: this.map,
          title: vessel.name,
          icon: markerIcon,
          zIndex: 9999,
        });

        // Create a custom label (using a div overlay)
        const labelDiv = document.createElement("div");
        labelDiv.textContent = vessel.name;
        labelDiv.style.position = "absolute";
        labelDiv.style.background = "white";
        labelDiv.style.padding = "2px 5px";
        labelDiv.style.borderRadius = "5px";
        labelDiv.style.fontSize = "12px";
        labelDiv.style.fontWeight = "bold";
        labelDiv.style.color = "black";
        labelDiv.style.transform = "translate(-5%, -10px)";

        const labelOverlay = new google.maps.OverlayView();

        labelOverlay.onAdd = function () {
          const panes = this.getPanes();
          panes.floatPane.appendChild(labelDiv);

          this.draw = function () {
            const projection = this.getProjection();
            const position = marker.getPosition();
            const pixelPosition = projection.fromLatLngToDivPixel(position);
            labelDiv.style.left = `${pixelPosition.x - labelDiv.offsetWidth / 2}px`;
            labelDiv.style.top = `${pixelPosition.y - labelDiv.offsetHeight - 5}px`;
          };
        };

        labelOverlay.setMap(this.map);
        this.markers.push(marker);
      } else {
        console.error("google.maps.Marker is not available.");
      }
    },

    clearMarkers() {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];
    },

    setCenter(newCenter) {
      if (this.map) {
        this.map.setCenter(newCenter);
        console.log("Centering map to:", newCenter);
      } else {
        console.warn("Map is not initialized yet.");
      }
    },

    setZoom(newZoom) {
      if (this.map) {
        this.map.setZoom(newZoom);
      }
    },
  },
};
</script>

<style scoped></style>
