<template>
  <div class="sidebar">
    <h2>Vessels</h2>

    <!-- Dropdown Menu for Add/Update -->
    <div class="dropdown">
      <button class="dropdown-btn">Add/Update</button>
      <div class="dropdown-content">
        <button @click="showAddVesselForm">Add New Vessel</button>
        <button @click="showUpdateVesselForm" :disabled="!selectedVessel">
          Update Vessel
        </button>
      </div>
    </div>

    <!-- Add Vessel Form -->
    <div v-if="showAddForm" class="add-vessel-form">
      <h3>Add New Vessel</h3>
      <input v-model="newVessel.name" placeholder="Vessel Name" class="input-field" />
      <input
        v-model="newVessel.latitude"
        type="number"
        placeholder="Latitude"
        class="input-field"
      />
      <input
        v-model="newVessel.longitude"
        type="number"
        placeholder="Longitude"
        class="input-field"
      />
      <button @click="addVessel">Add Vessel</button>
    </div>

    <!-- Update Vessel Form -->
    <div v-if="showUpdateForm" class="update-vessel-form">
      <h3>Update Vessel</h3>
      <input
        v-model="selectedVessel.name"
        placeholder="Vessel Name"
        class="input-field"
      />
      <input
        v-model="selectedVessel.latitude"
        type="number"
        placeholder="Latitude"
        class="input-field"
      />
      <input
        v-model="selectedVessel.longitude"
        type="number"
        placeholder="Longitude"
        class="input-field"
      />
      <button @click="updateVessel">Update Vessel</button>
    </div>

    <input
      v-model="searchQuery"
      placeholder="Search for a vessel..."
      class="search-bar"
    />

    <ul>
      <li
        v-for="vessel in filteredVessels"
        :key="vessel.name"
        @click="selectVessel(vessel)"
      >
        {{ vessel.name }}
        <button @click="deleteVessel(vessel.name)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "VesselSidebar",
  props: {
    vessels: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: "",
      newVessel: {
        name: "",
        latitude: null,
        longitude: null,
      },
      selectedVessel: null,
      showAddForm: false, 
      showUpdateForm: false,
    };
  },
  computed: {
    filteredVessels() {
      if (!this.vessels || !Array.isArray(this.vessels)) {
        return [];
      }
      return this.vessels.filter(
        (vessel) =>
          vessel.name &&
          vessel.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    selectVessel(vessel) {
      this.selectedVessel = vessel;
      this.$emit("vessel-selected", vessel);
    },

    addVessel() {
      if (
        !this.newVessel.name ||
        this.newVessel.latitude === null ||
        this.newVessel.longitude === null
      ) {
        alert("Please fill in all fields.");
        return;
      }

      this.$emit("add-vessel", this.newVessel);
      this.newVessel = { name: "", latitude: null, longitude: null };
      this.showAddForm = false;
    },

    deleteVessel(vesselName) {
      this.$emit("delete-vessel", vesselName);
    },

    updateVessel() {
      if (
        !this.selectedVessel.name ||
        this.selectedVessel.latitude === null ||
        this.selectedVessel.longitude === null
      ) {
        alert("Please fill in all fields.");
        return;
      }

      this.$emit("update-vessel", this.selectedVessel);

      this.selectedVessel = null;
      this.showUpdateForm = false;
    },

    showAddVesselForm() {
      this.showAddForm = true;
      this.showUpdateForm = false; // Hide Update form if Add form is shown
    },

    showUpdateVesselForm() {
      if (this.selectedVessel) {
        this.showUpdateForm = true;
        this.showAddForm = false; // Hide Add form if Update form is shown
      }
    },
  },
};
</script>

<style scoped>
/* Dropdown Button */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-btn {
  padding: 10px;
  margin: 5px;
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  z-index: 1;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  padding: 5px 0;
}

.dropdown-content button {
  padding: 10px;
  width: 100%;
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.dropdown-content button:hover {
  background-color: #f0f0f0;
}

.dropdown:hover .dropdown-content {
  display: block;
}

/* Form Styling */
.add-vessel-form,
.update-vessel-form {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.input-field {
  padding: 10px;
  margin: 5px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  margin: 5px 0;
  cursor: pointer;
}

button:hover {
  background-color: #f0f0f0;
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
</style>
