<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-primary-950 via-slate-900 to-primary-900 px-4">
    <!-- Premium Card -->
    <div class="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
      <!-- Decorative Glows -->
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary-400 rounded-full blur-3xl opacity-20"></div>
      <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-300 rounded-full blur-3xl opacity-20"></div>

      <!-- Header -->
      <div class="text-center mb-8 relative z-10">
        <div class="inline-flex rounded-2xl mb-4 overflow-hidden border-2 border-primary-400/50 shadow-lg">
          <img src="/logo.jpg" alt="Ortho Epilepsy Logo" class="w-20 h-20 object-cover" />
        </div>
        <h1 class="text-3xl font-extrabold text-white tracking-wide">Ortho Epilepsy</h1>
        <p class="text-slate-300 mt-2">منصة الإدارة والتقييم المعرفي للصرع</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6 relative z-10">
        <div v-if="error" class="bg-red-500/20 border border-red-500/30 text-red-200 text-sm p-3 rounded-lg flex items-center gap-2">
          <AlertCircleIcon class="w-5 h-5 flex-shrink-0" />
          <span>{{ error }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">البريد الإلكتروني</label>
          <div class="relative">
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
              <MailIcon class="w-5 h-5" />
            </span>
            <input 
              v-model="email" 
              type="email" 
              required
              class="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">كلمة المرور</label>
          <div class="relative">
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
              <LockIcon class="w-5 h-5" />
            </span>
            <input 
              v-model="password" 
              type="password" 
              required
              class="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          <Loader2Icon v-if="loading" class="w-5 h-5 animate-spin" />
          <span v-else>تسجيل الدخول</span>
        </button>
      </form>

      <!-- Footer Info -->
      <div class="text-center mt-6 text-sm text-slate-400 relative z-10 border-t border-white/10 pt-4">
        تأكد من استخدام بيانات الاعتماد الممنوحة لك.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { 
  Mail as MailIcon, 
  Lock as LockIcon, 
  AlertCircle as AlertCircleIcon, 
  Loader2 as Loader2Icon 
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    const user = await authStore.login(email.value, password.value);
    
    // Redirect based on role
    if (user.role === 'super_admin') {
      router.push('/admin');
    } else if (user.role === 'clinic_admin') {
      router.push('/clinic');
    } else if (user.role === 'specialist') {
      router.push('/specialist');
    } else {
      error.value = 'هذه المنصة مخصصة للمشرفين والعيادات والأطباء فقط.';
      await authStore.logout();
    }
  } catch (err) {
    error.value = err || 'فشل تسجيل الدخول.';
  } finally {
    loading.value = false;
  }
};
</script>
