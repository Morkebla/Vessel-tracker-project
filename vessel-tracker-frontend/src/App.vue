<template>
  <div id="app">
    <div class="container">
      <div class="sidebar">
        <div class="sidebar-content">
          <VesselSidebar
            :vessels="vessels"
            @vessel-selected="handleVesselSelected"
            @add-vessel="handleAddVessel"
            @delete-vessel="handleDeleteVessel"
            @update-vessel="handleUpdateVessel"
          />
        </div>
      </div>

      <div class="map-container">
        <GoogleMap
          ref="googleMap"
          :center="{ lat: 50.812583, lng: -1.194861 }"
          :zoom="7"
          :apiKey="apiKey"
          :vessels="vessels"
        />
      </div>
    </div>
  </div>
</template>

<script>
import GoogleMap from "./components/GoogleMap.vue";
import VesselSidebar from "./components/VesselSidebar.vue";

export default {
  name: "App",
  components: {
    GoogleMap,
    VesselSidebar,
  },
  data() {
    return {
      apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
      vessels: [],
      selectedVessel: null,
    };
  },
  methods: {
    async fetchVessels() {
      try {
        const response = await fetch("http://localhost:5000/api/vessels");
        this.vessels = await response.json();
      } catch (error) {
        console.error("Error fetching vessels:", error);
      }
    },

    handleAddVessel(newVessel) {
      fetch("http://localhost:5000/api/vessels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVessel),
      })
        .then((response) => response.json())
        .then((data) => {
          this.vessels.push(data);
          console.log("Vessel added:", data);
        })
        .catch((error) => {
          console.error("Error adding vessel:", error);
        });
    },

    handleVesselSelected(vessel) {
      if (this.selectedVessel) {
        this.selectedVessel.name = this.selectedVesselName;
      }

      this.selectedVessel = vessel;
      this.selectedVesselName = vessel.name;

      if (this.$refs.googleMap) {
        this.$refs.googleMap.setCenter({ lat: vessel.latitude, lng: vessel.longitude });
        this.$refs.googleMap.setZoom(5); // Set zoom level to 5
      }
    },

    handleDeleteVessel(vesselName) {
      const confirmed = window.confirm(
        `Are you sure you want to delete the vessel: ${vesselName}?`
      );

      if (confirmed) {
        fetch(`http://localhost:5000/api/vessels/${vesselName}`, {
          method: "DELETE",
        })
          .then(() => {
            this.vessels = this.vessels.filter((vessel) => vessel.name !== vesselName);
            console.log(`Vessel ${vesselName} deleted`);
          })
          .catch((error) => {
            console.error("Error deleting vessel:", error);
          });
      } else {
        console.log("Vessel deletion canceled");
      }
    },

    handleUpdateVessel(updatedVessel) {
      const vesselName = this.selectedVesselName;

      // Make the API request to update the vessel using the current name
      fetch(`http://localhost:5000/api/vessels/${vesselName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVessel),
      })
        .then((response) => {
          if (response.status === 404) {
            throw new Error(`Vessel with name "${vesselName}" not found.`);
          }
          return response.json();
        })
        .then((data) => {
          // Find the index of the vessel and update it reactively in the local data array
          const index = this.vessels.findIndex((vessel) => vessel.name === vesselName);
          if (index !== -1) {
            this.$set(this.vessels, index, data);
          }

          console.log("Vessel updated:", data);

          this.selectedVessel = data; // Update the selected vessel to reflect changes
        })
        .catch((error) => {
          console.error("Error updating vessel:", error);
        });
    },
  },

  mounted() {
    this.fetchVessels();
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  width: 100vw;
  height: 100vh;
}

.container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.sidebar {
  width: 330px;
  background-color: #f8f9fa;
  height: 100%;
  border-right: 1px solid #ccc;
  position: relative;
  padding: 0 20px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
}

.search-bar {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 12px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

li:hover {
  background-color: #e9ecef;
}

.map-container {
  flex-grow: 1;
  height: 100%;
  position: relative;
}
</style>
