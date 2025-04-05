<template>
  <div class="sidebar">
    <h2>Vessels</h2>

    <!-- Add Button (Visible only if form is closed) -->
    <button
      v-if="!showAddForm"
      class="icon-btn add-btn"
      @click="showAddVesselForm"
      title="Add Vessel"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="white"
        viewBox="0 0 16 16"
      >
        <path d="M8 1v14M1 8h14" stroke="white" stroke-width="2" />
      </svg>
    </button>

    <!-- Add Vessel Form -->
    <transition name="slide-fade">
      <div v-if="showAddForm" class="form-container">
        <div class="form-header">
          <h3>Add New Vessel</h3>
          <button class="close-btn" @click="showAddForm = false">×</button>
        </div>
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
    </transition>

    <!-- Update Vessel Form -->
    <transition name="slide-fade">
      <div v-if="showUpdateForm" class="form-container">
        <div class="form-header">
          <h3>Update Vessel</h3>
          <button class="close-btn" @click.stop="closeUpdateForm">×</button>
        </div>
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
    </transition>

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
        class="vessel-item"
      >
        <div class="vessel-name-container">
          <span class="vessel-name">{{ vessel.name }}</span>
          <div class="actions">
            <!-- Update (pen) button next to name -->
            <button
              v-if="!showUpdateForm"
              class="icon-btn update-btn"
              @click.stop="showUpdateVesselForm(vessel)"
              :disabled="!vessel"
              title="Update"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
                width="20"
                height="20"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </button>

            <!-- Delete (trash icon) -->
            <button
              class="icon-btn delete-btn"
              @click.stop="deleteVessel(vessel.name)"
              title="Delete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
                width="20"
                height="20"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
        </div>
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

    closeUpdateForm() {
      this.showUpdateForm = false;
    },

    // This method opens the update form for a specific vessel
    showUpdateVesselForm(vessel) {
      this.selectedVessel = vessel;

      // Show the update form
      this.showUpdateForm = true;
      this.showAddForm = false; // Hide Add form if Update form is shown
    },
  },
};
</script>

<style scoped>
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.icon-btn:hover {
  background-color: #eee;
}

.add-btn {
  background-color: #007bff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  margin-bottom: 10px;
}

.add-btn svg {
  stroke: white;
}

.vessel-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.vessel-name-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.vessel-name {
  flex-grow: 1;
}

.actions {
  display: flex;
  gap: 10px;
}

/* Form Slide Transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.form-container {
  background: rgb(115, 179, 243);
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(255, 255, 255, 0.82);
  margin-bottom: 20px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
}
</style>
