<template>
  <!-- Auth Modal -->
  <div class="fixed z-10 inset-0 overflow-y-auto" id="modal" :class="hiddenClass">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity" @click="close">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="relative z-20 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="py-4 text-left px-6">
          <!-- Title -->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Your Account</p>
            <!-- Modal Close Button -->
            <div class="modal-close cursor-pointer z-50" @click="close">
              <i class="fas fa-times"></i>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                href="#"
                class="block rounded py-3 px-4 transition"
                :class="
                  activeTab === 'login'
                    ? 'text-white bg-blue-600'
                    : 'hover:text-white hover:bg-blue-400'
                "
                @click.prevent="activeTab = 'login'"
                >Login</a
              >
            </li>
            <li class="flex-auto text-center">
              <a
                href="#"
                class="block rounded py-3 px-4 transition"
                :class="
                  activeTab === 'register'
                    ? 'text-white bg-blue-600'
                    : 'hover:text-white hover:bg-blue-400'
                "
                @click.prevent="activeTab = 'register'"
                >Register</a
              >
            </li>
          </ul>

          <!-- Login Form -->
          <form v-if="activeTab === 'login'" @submit.prevent="submitLogin">
            <!-- Email -->
            <div class="mb-3">
              <label class="inline-block mb-2">Email</label>
              <input
                v-model="loginForm.email"
                type="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email"
              />
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label class="inline-block mb-2">Password</label>
              <input
                v-model="loginForm.password"
                type="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password"
              />
            </div>
            <button
              type="submit"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            >
              Submit
            </button>
          </form>

          <!-- Registration Form -->
          <form v-if="activeTab === 'register'" @submit.prevent="submitRegister">
            <!-- Name -->
            <div class="mb-3">
              <label class="inline-block mb-2">Name</label>
              <input
                v-model="registerForm.name"
                type="text"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Name"
              />
            </div>
            <!-- Email -->
            <div class="mb-3">
              <label class="inline-block mb-2">Email</label>
              <input
                v-model="registerForm.email"
                type="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email"
              />
            </div>
            <!-- Age -->
            <div class="mb-3">
              <label class="inline-block mb-2">Age</label>
              <input
                v-model.number="registerForm.age"
                type="number"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
              />
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label class="inline-block mb-2">Password</label>
              <input
                v-model="registerForm.password"
                type="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password"
              />
            </div>
            <!-- Confirm Password -->
            <div class="mb-3">
              <label class="inline-block mb-2">Confirm Password</label>
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Confirm Password"
              />
            </div>
            <!-- Country -->
            <div class="mb-3">
              <label class="inline-block mb-2">Country</label>
              <select
                v-model="registerForm.country"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
              >
                <option value="USA">USA</option>
                <option value="Mexico">Mexico</option>
                <option value="Germany">Germany</option>
              </select>
            </div>
            <!-- TOS -->
            <div class="mb-3 pl-6">
              <input
                v-model="registerForm.acceptedTos"
                type="checkbox"
                class="w-4 h-4 float-left -ml-6 mt-1 rounded"
              />
              <label class="inline-block">Accept terms of service</label>
            </div>
            <button
              type="submit"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useModalStore } from "../stores/modal";

export default {
  name: "Auth",
  data() {
    return {
      activeTab: "login",
      loginForm: {
        email: "",
        password: "",
      },
      registerForm: {
        name: "",
        email: "",
        age: null,
        password: "",
        confirmPassword: "",
        country: "USA",
        acceptedTos: false,
      },
    };
  },
  computed: {
    ...mapState(useModalStore, ["hiddenClass"]),
  },
  methods: {
    ...mapActions(useModalStore, ["close"]),
    submitLogin() {
      // TODO: brancher sur votre API d'authentification
      console.log("Login submit:", this.loginForm);
    },
    submitRegister() {
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        console.warn("Les mots de passe ne correspondent pas.");
        return;
      }
      if (!this.registerForm.acceptedTos) {
        console.warn("Vous devez accepter les conditions d'utilisation.");
        return;
      }
      // TODO: brancher sur votre API d'inscription
      console.log("Register submit:", this.registerForm);
    },
  },
};
</script>
