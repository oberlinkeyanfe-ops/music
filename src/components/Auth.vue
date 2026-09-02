<template>
  <!-- Auth Modal -->
  <div class="fixed z-10 inset-0 overflow-y-auto" id="modal" :class="hiddenClass">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" @click="modalStore.close()">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="relative z-20 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="py-4 text-left px-6">
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Votre compte</p>
            <div class="modal-close cursor-pointer z-50" @click="modalStore.close()">
              <i class="fas fa-times"></i>
            </div>
          </div>

          <!-- Onglets -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                href="#"
                class="block rounded py-3 px-4 transition"
                :class="tab === 'login' ? 'text-white bg-blue-600' : 'hover:text-white hover:bg-blue-400'"
                @click.prevent="tab = 'login'"
                >Connexion</a
              >
            </li>
            <li class="flex-auto text-center">
              <a
                href="#"
                class="block rounded py-3 px-4 transition"
                :class="tab === 'register' ? 'text-white bg-blue-600' : 'hover:text-white hover:bg-blue-400'"
                @click.prevent="tab = 'register'"
                >Inscription</a
              >
            </li>
          </ul>

          <div v-if="showAlert" class="text-white text-center font-bold p-4 mb-4" :class="alertVariant">
            {{ alertMessage }}
          </div>

          <!-- LOGIN -->
          <VForm v-if="tab === 'login'" :validation-schema="loginSchema" @submit="login">
            <div class="mb-3 text-left">
              <label class="inline-block mb-2">Email</label>
              <Field name="email" type="email" class="block w-full py-1.5 px-3 border border-gray-300 rounded" />
              <ErrorMessage class="text-red-600" name="email" />
            </div>
            <div class="mb-3 text-left">
              <label class="inline-block mb-2">Mot de passe</label>
              <Field name="password" type="password" class="block w-full py-1.5 px-3 border border-gray-300 rounded" />
              <ErrorMessage class="text-red-600" name="password" />
            </div>
            <button
              type="submit"
              :disabled="inSubmission"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            >
              Se connecter
            </button>
          </VForm>

          <!-- REGISTER -->
          <VForm v-if="tab === 'register'" :validation-schema="registerSchema" :initial-values="{ country: 'France' }" @submit="register">
            <div class="mb-3 text-left">
              <label class="inline-block mb-2">Nom</label>
              <Field name="name" type="text" class="block w-full py-1.5 px-3 border border-gray-300 rounded" />
              <ErrorMessage class="text-red-600" name="name" />
            </div>
            <div class="mb-3 text-left">
              <label class="inline-block mb-2">Email</label>
              <Field name="email" type="email" class="block w-full py-1.5 px-3 border border-gray-300 rounded" />
              <ErrorMessage class="text-red-600" name="email" />
            </div>
            <div class="mb-3 text-left">
              <label class="inline-block mb-2">Âge</label>
              <Field name="age" type="number" class="block w-full py-1.5 px-3 border border-gray-300 rounded" />
              <ErrorMessage class="text-red-600" name="age" />
            </div>
            <div class="mb-3 text-left">
              <label class="inline-block mb-2">Mot de passe</label>
              <Field name="password" type="password" class="block w-full py-1.5 px-3 border border-gray-300 rounded" />
              <ErrorMessage class="text-red-600" name="password" />
            </div>
            <div class="mb-3 text-left">
              <label class="inline-block mb-2">Confirmer le mot de passe</label>
              <Field name="confirmPassword" type="password" class="block w-full py-1.5 px-3 border border-gray-300 rounded" />
              <ErrorMessage class="text-red-600" name="confirmPassword" />
            </div>
            <div class="mb-3 text-left">
              <label class="inline-block mb-2">Pays</label>
              <Field name="country" as="select" class="block w-full py-1.5 px-3 border border-gray-300 rounded">
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Canada">Canada</option>
              </Field>
            </div>
            <div class="mb-3 pl-6 text-left">
              <Field name="tos" type="checkbox" value="1" class="w-4 h-4 float-left -ml-6 mt-1" />
              <label class="inline-block">J'accepte les conditions d'utilisation</label>
              <ErrorMessage class="text-red-600 block" name="tos" />
            </div>
            <button
              type="submit"
              :disabled="inSubmission"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            >
              S'inscrire
            </button>
          </VForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { Form as VForm, Field, ErrorMessage } from "vee-validate";
import { useModalStore } from "@/stores/modal";
import { useUserStore } from "@/stores/user";

export default {
  name: "Auth",
  components: { VForm, Field, ErrorMessage },
  data() {
    return {
      tab: "login",
      inSubmission: false,
      showAlert: false,
      alertVariant: "bg-blue-500",
      alertMessage: "Veuillez patienter...",
      loginSchema: {
        email: "required|email",
        password: "required|min:9|max:100",
      },
      registerSchema: {
        name: "required|min:3|max:100|alpha_spaces",
        email: "required|email",
        age: "required|minValue:18|maxValue:100",
        password: "required|min:9|max:100",
        confirmPassword: "confirmed:@password",
        country: "required",
        tos: "required",
      },
    };
  },
  computed: {
    ...mapState(useModalStore, ["hiddenClass"]),
  },
  methods: {
    ...mapActions(useUserStore, { registerUser: "register", authenticate: "authenticate" }),
    async register(values) {
      this.inSubmission = true;
      this.showAlert = true;
      this.alertVariant = "bg-blue-500";
      this.alertMessage = "Veuillez patienter, création de votre compte...";

      try {
        await this.registerUser(values);
      } catch {
        this.inSubmission = false;
        this.alertVariant = "bg-red-500";
        this.alertMessage = "Une erreur est survenue, veuillez réessayer.";
        return;
      }

      this.alertVariant = "bg-green-500";
      this.alertMessage = "Compte créé avec succès !";
      window.location.reload();
    },
    async login(values) {
      this.inSubmission = true;
      this.showAlert = true;
      this.alertVariant = "bg-blue-500";
      this.alertMessage = "Veuillez patienter, connexion en cours...";

      try {
        await this.authenticate(values);
      } catch {
        this.inSubmission = false;
        this.alertVariant = "bg-red-500";
        this.alertMessage = "Identifiants invalides.";
        return;
      }

      this.alertVariant = "bg-green-500";
      this.alertMessage = "Connexion réussie !";
      window.location.reload();
    },
  },
};
</script>
