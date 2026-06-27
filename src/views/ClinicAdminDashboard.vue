<template>
  <div class="min-h-screen bg-slate-50 flex font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 text-white flex flex-col justify-between p-6 shrink-0">
      <div>
        <div class="flex items-center gap-3 mb-8">
          <img src="/logo.jpg" alt="Ortho Epilepsy Logo" class="w-10 h-10 rounded-lg object-cover" />
          <span class="text-lg font-bold leading-tight">Ortho Epilepsy Clinic</span>
        </div>
        <nav class="space-y-2">
          <button 
            @click="activeTab = 'specialists'" 
            :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-right', activeTab === 'specialists' ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50']"
          >
            <StethoscopeIcon class="w-5 h-5" />
            الطاقم الطبي (المختصين)
          </button>
          <button 
            @click="activeTab = 'patients'" 
            :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-right', activeTab === 'patients' ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50']"
          >
            <UsersIcon class="w-5 h-5" />
            المرضى والمتابعة
          </button>
          <button 
            @click="activeTab = 'settings'" 
            :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-right', activeTab === 'settings' ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50']"
          >
            <SettingsIcon class="w-5 h-5" />
            إعدادات العيادة
          </button>
        </nav>
      </div>

      <div class="border-t border-slate-800 pt-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-primary-400">
            ع
          </div>
          <div>
            <h4 class="font-bold text-sm leading-tight">{{ user?.name }}</h4>
            <span class="text-xs text-slate-400">مدير العيادة</span>
          </div>
        </div>
        <button 
          @click="handleLogout"
          class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
        >
          <LogOutIcon class="w-4 h-4" />
          تسجيل الخروج
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-10 overflow-y-auto">
      
      <!-- TAB 1: SPECIALISTS MANAGEMENT -->
      <div v-if="activeTab === 'specialists'">
        <header class="flex justify-between items-center mb-10">
          <div>
            <h1 class="text-3xl font-extrabold text-slate-900">إدارة الطاقم الطبي</h1>
            <p class="text-slate-500 mt-1">إضافة أطباء ومختصين جدد وتعديل اختصاصاتهم الطبية في العيادة</p>
          </div>
          <button 
            @click="showCreateModal = true"
            class="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 flex items-center gap-2"
          >
            <PlusIcon class="w-5 h-5" />
            تسجيل طبيب جديد
          </button>
        </header>

        <!-- Stats Grid -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div class="p-4 bg-primary-50 rounded-xl text-primary-600">
              <StethoscopeIcon class="w-8 h-8" />
            </div>
            <div>
              <span class="text-slate-400 text-sm">أطباء العيادة النشطين</span>
              <h2 class="text-3xl font-bold text-slate-800 mt-1">{{ specialists.length }}</h2>
            </div>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div class="p-4 bg-emerald-50 rounded-xl text-emerald-600">
              <ActivityIcon class="w-8 h-8" />
            </div>
            <div>
              <span class="text-slate-400 text-sm">مستوى الخدمة</span>
              <h2 class="text-3xl font-bold text-slate-800 mt-1">ممتاز</h2>
            </div>
          </div>
        </section>

        <!-- Specialists Table -->
        <section class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-slate-100">
            <h3 class="font-bold text-lg text-slate-800">قائمة الطاقم الطبي المسجل</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-right">
              <thead class="bg-slate-50 text-slate-400 text-sm font-semibold border-b border-slate-100">
                <tr>
                  <th class="px-6 py-4">اسم المختص/الطبيب</th>
                  <th class="px-6 py-4">البريد الإلكتروني</th>
                  <th class="px-6 py-4">الاختصاص الطبي</th>
                  <th class="px-6 py-4">تاريخ التسجيل</th>
                  <th class="px-6 py-4">الحالة</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr v-for="spec in specialists" :key="spec.id" class="hover:bg-slate-50/50 transition-all">
                  <td class="px-6 py-4 font-bold text-slate-900">{{ spec.name }}</td>
                  <td class="px-6 py-4 text-slate-500">{{ spec.email }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 bg-primary-50 text-primary-800 text-xs font-bold rounded-lg border border-primary-200">
                      {{ spec.specialty || 'غير محدد' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-slate-500">{{ formatDate(spec.created_at) }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                      نشط
                    </span>
                  </td>
                </tr>
                <tr v-if="specialists.length === 0">
                  <td colspan="5" class="px-6 py-10 text-center text-slate-400">لا يوجد أطباء مسجلين في العيادة بعد. اضغط على "تسجيل طبيب جديد" للبدء.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- TAB 2: PATIENTS & LINKAGES -->
      <div v-if="activeTab === 'patients'">
        <header class="flex justify-between items-center mb-10">
          <div>
            <h1 class="text-3xl font-extrabold text-slate-900">إدارة المرضى وتعيين الأطباء</h1>
            <p class="text-slate-500 mt-1">عرض المرضى المسجلين وربطهم مباشرة بالأطباء المعالجين والمختصين في العيادة</p>
          </div>
          <button 
            @click="openCreatePatientModal"
            class="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 flex items-center gap-2"
          >
            <PlusIcon class="w-5 h-5" />
            تسجيل مريض جديد
          </button>
        </header>

        <section class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-slate-100">
            <h3 class="font-bold text-lg text-slate-800">قائمة مرضى العيادة والروابط الطبية</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-right">
              <thead class="bg-slate-50 text-slate-400 text-sm font-semibold border-b border-slate-100">
                <tr>
                  <th class="px-6 py-4">اسم المريض</th>
                  <th class="px-6 py-4">البريد الإلكتروني</th>
                  <th class="px-6 py-4">رقم الطوارئ</th>
                  <th class="px-6 py-4">الأطباء المعالجون</th>
                  <th class="px-6 py-4 text-center">إسناد طبيب</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr v-for="patient in patients" :key="patient.id" class="hover:bg-slate-50/50 transition-all">
                  <td class="px-6 py-4 font-bold text-slate-900">{{ patient.name }}</td>
                  <td class="px-6 py-4 text-slate-500">{{ patient.email }}</td>
                  <td class="px-6 py-4 text-slate-500 font-mono">{{ patient.emergency_contact || '-' }}</td>
                  <td class="px-6 py-4">
                    <div class="flex flex-wrap gap-1.5">
                      <span 
                        v-for="spec in patient.specialists" 
                        :key="spec.id"
                        class="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded"
                      >
                        {{ spec.name }} ({{ spec.specialty || 'مختص' }})
                      </span>
                      <span v-if="!patient.specialists || patient.specialists.length === 0" class="text-xs text-red-500 font-bold">
                        لم يتم ربطه بأي طبيب بعد
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <button 
                      @click="openLinkModal(patient)"
                      class="px-4 py-1.5 text-xs bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-all"
                    >
                      تعيين طبيب معالج
                    </button>
                  </td>
                </tr>
                <tr v-if="patients.length === 0">
                  <td colspan="5" class="px-6 py-10 text-center text-slate-400">لا يوجد مرضى مسجلين في العيادة حتى الآن.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- TAB 3: SETTINGS -->
      <div v-if="activeTab === 'settings'">
        <header class="mb-10">
          <h1 class="text-3xl font-extrabold text-slate-900">إعدادات العيادة والملف الشخصي</h1>
          <p class="text-slate-500 mt-1">عرض بيانات عيادتك وتحديث معلومات حساب المدير</p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Clinic Info (Read-only) -->
          <section class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BuildingIcon class="w-5 h-5 text-primary-500" />
              بيانات العيادة المسجلة
            </h3>
            
            <div class="space-y-4" v-if="clinicInfo">
              <div>
                <label class="block text-sm font-medium text-slate-500">اسم العيادة</label>
                <div class="mt-1 text-slate-900 font-bold">{{ clinicInfo.name }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-500">العنوان</label>
                <div class="mt-1 text-slate-900">{{ clinicInfo.address || 'غير محدد' }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-500">رقم الهاتف</label>
                <div class="mt-1 text-slate-900">{{ clinicInfo.phone || 'غير محدد' }}</div>
              </div>
              <div class="pt-4 border-t border-slate-100">
                <label class="block text-sm font-medium text-slate-500 mb-2">حالة الاشتراك</label>
                <div class="flex items-center gap-3">
                  <span :class="['px-3 py-1 text-sm font-bold rounded-full', clinicInfo.subscription_status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800']">
                    {{ clinicInfo.subscription_status === 'active' ? 'نشط' : 'غير نشط' }}
                  </span>
                  <span class="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                    الباقة: {{ clinicInfo.subscription_plan === 'premium' ? 'متقدمة' : 'قياسية' }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-slate-400 text-sm">جاري تحميل بيانات العيادة...</div>
          </section>

          <!-- Profile Settings -->
          <section class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <UserCogIcon class="w-5 h-5 text-primary-500" />
              تحديث حساب المدير
            </h3>
            
            <form @submit.prevent="updateProfile" class="space-y-5">
              <div v-if="profileMessage" :class="['p-4 rounded-xl text-sm font-medium', profileError ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700']">
                {{ profileMessage }}
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">اسم المدير</label>
                <input v-model="profileForm.name" type="text" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني (لتسجيل الدخول)</label>
                <input v-model="profileForm.email" type="email" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">كلمة المرور الجديدة</label>
                <input v-model="profileForm.password" type="password" placeholder="اتركه فارغاً إذا لم ترغب بتغييره" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
                <p class="text-xs text-slate-400 mt-1">يجب أن تتكون من 8 أحرف على الأقل في حال تغييرها.</p>
              </div>

              <div class="pt-2">
                <button type="submit" :disabled="submittingProfile" class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-all disabled:opacity-50">
                  <span v-if="submittingProfile">جاري التحديث...</span>
                  <span v-else>حفظ التغييرات</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>

    </main>

    <!-- Create Specialist Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
        <header class="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-xl font-bold text-slate-900">تسجيل طبيب جديد</h3>
          <button @click="showCreateModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </header>
        <form @submit.prevent="createSpecialist" class="p-6 space-y-4">
          <div v-if="modalError" class="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100">
            {{ modalError }}
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">اسم الطبيب بالكامل</label>
            <input v-model="form.name" type="text" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" placeholder="الدكتور..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">البريد الإلكتروني</label>
            <input v-model="form.email" type="email" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" placeholder="name@clinic.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">الاختصاص الطبي</label>
            <select v-model="form.specialty" class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500">
              <option value="أرطوفونيا وتخاطب (Speech Therapist)">أرطوفونيا وتخاطب (Speech Therapist)</option>
              <option value="طبيب أعصاب (Neurologist)">طبيب أعصاب (Neurologist)</option>
              <option value="أخصائي نفسي (Psychologist)">أخصائي نفسي (Psychologist)</option>
              <option value="أخصائي تاهيل حركي">أخصائي تاهيل حركي</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">كلمة المرور المؤقتة</label>
            <input v-model="form.password" type="password" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" placeholder="••••••••" />
          </div>

          <footer class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showCreateModal = false" class="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50">إلغاء</button>
            <button type="submit" :disabled="submitting" class="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl disabled:opacity-50">
              <span v-if="submitting">جاري الإرسال...</span>
              <span v-else>حفظ وتفعيل</span>
            </button>
          </footer>
        </form>
      </div>
    </div>

    <!-- Link Patient to Specialist Modal -->
    <div v-if="showLinkModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
        <header class="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-xl font-bold text-slate-900">ربط المريض: {{ activePatient?.name }} بمختص</h3>
          <button @click="showLinkModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </header>
        <form @submit.prevent="linkPatientSpecialist" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">اختر الطبيب المعالج</label>
            <select v-model="linkForm.specialist_id" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500">
              <option v-for="spec in specialists" :key="spec.id" :value="spec.id">
                {{ spec.name }} - ({{ spec.specialty }})
              </option>
            </select>
          </div>

          <footer class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showLinkModal = false" class="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50">إلغاء</button>
            <button type="submit" :disabled="submitting" class="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl disabled:opacity-50">
              <span v-if="submitting">جاري الربط...</span>
              <span v-else>ربط مباشر</span>
            </button>
          </footer>
        </form>
      </div>
    </div>

    <!-- Create Patient Modal -->
    <div v-if="showCreatePatientModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
        <header class="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-xl font-bold text-slate-900">تسجيل مريض جديد</h3>
          <button @click="showCreatePatientModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </header>
        <form @submit.prevent="createPatient" class="p-6 space-y-4">
          <div v-if="modalError" class="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100">
            {{ modalError }}
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">اسم المريض بالكامل</label>
            <input v-model="patientForm.name" type="text" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" placeholder="الاسم الكامل للمريض" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">البريد الإلكتروني</label>
            <input v-model="patientForm.email" type="email" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" placeholder="patient@test.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">كلمة المرور الافتراضية</label>
            <input v-model="patientForm.password" type="password" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" placeholder="••••••••" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">رقم هاتف الطوارئ (اختياري)</label>
            <input v-model="patientForm.emergency_contact" type="text" class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" placeholder="0555xxxxxx" />
          </div>

          <footer class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showCreatePatientModal = false" class="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50">إلغاء</button>
            <button type="submit" :disabled="submitting" class="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl disabled:opacity-50">
              <span v-if="submitting">جاري التسجيل...</span>
              <span v-else>حفظ وتأكيد</span>
            </button>
          </footer>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import axios from 'axios';
import { 
  Stethoscope as StethoscopeIcon, 
  LogOut as LogOutIcon, 
  Plus as PlusIcon, 
  Activity as ActivityIcon,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Building as BuildingIcon,
  UserCog as UserCogIcon
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const activeTab = ref('specialists');
const specialists = ref([]);
const patients = ref([]);
const clinicInfo = ref(null);

const profileForm = ref({
  name: '',
  email: '',
  password: ''
});
const profileMessage = ref('');
const profileError = ref(false);
const submittingProfile = ref(false);

const showCreateModal = ref(false);
const showLinkModal = ref(false);
const showCreatePatientModal = ref(false);
const submitting = ref(false);
const modalError = ref('');

const patientForm = ref({
  name: '',
  email: '',
  password: '',
  emergency_contact: '',
});

const activePatient = ref(null);

const form = ref({
  name: '',
  email: '',
  password: '',
  specialty: 'أرطوفونيا وتخاطب (Speech Therapist)',
});

const linkForm = ref({
  specialist_id: '',
});

const fetchSpecialists = async () => {
  try {
    const response = await axios.get('/clinic/specialists');
    specialists.value = response.data;
  } catch (error) {
    console.error('Failed to fetch specialists', error);
  }
};

const fetchPatients = async () => {
  try {
    const response = await axios.get('/clinic/patients');
    patients.value = response.data;
  } catch (error) {
    console.error('Failed to fetch patients', error);
  }
};

const fetchClinicInfo = async () => {
  try {
    const response = await axios.get('/clinic/info');
    clinicInfo.value = response.data;
  } catch (error) {
    console.error('Failed to fetch clinic info', error);
  }
};

const updateProfile = async () => {
  profileMessage.value = '';
  submittingProfile.value = true;
  profileError.value = false;
  try {
    const res = await axios.put('/clinic/profile', profileForm.value);
    profileMessage.value = res.data.message || 'تم تحديث الملف الشخصي بنجاح.';
    // Update local store with new data
    authStore.user.name = res.data.user.name;
    authStore.user.email = res.data.user.email;
    profileForm.value.password = ''; // clear password field
  } catch (error) {
    profileError.value = true;
    profileMessage.value = error.response?.data?.message || 'فشل في تحديث الملف الشخصي.';
  } finally {
    submittingProfile.value = false;
  }
};

const createSpecialist = async () => {
  modalError.value = '';
  submitting.value = true;
  try {
    await axios.post('/clinic/specialists', form.value);
    showCreateModal.value = false;
    form.value = {
      name: '',
      email: '',
      password: '',
      specialty: 'أرطوفونيا وتخاطب (Speech Therapist)',
    };
    fetchSpecialists();
  } catch (error) {
    modalError.value = error.response?.data?.message || 'فشل إدخال البيانات.';
  } finally {
    submitting.value = false;
  }
};

const openLinkModal = (patient) => {
  activePatient.value = patient;
  linkForm.value = {
    specialist_id: specialists.value.length > 0 ? specialists.value[0].id : '',
  };
  showLinkModal.value = true;
};

const linkPatientSpecialist = async () => {
  submitting.value = true;
  try {
    await axios.post('/clinic/link-patient-specialist', {
      patient_id: activePatient.value.id,
      specialist_id: linkForm.value.specialist_id,
    });
    showLinkModal.value = false;
    fetchPatients();
  } catch (error) {
    console.error('Failed to link patient to specialist', error);
  } finally {
    submitting.value = false;
  }
};

const openCreatePatientModal = () => {
  modalError.value = '';
  patientForm.value = {
    name: '',
    email: '',
    password: '',
    emergency_contact: '',
  };
  showCreatePatientModal.value = true;
};

const createPatient = async () => {
  modalError.value = '';
  submitting.value = true;
  try {
    await axios.post('/clinic/patients', patientForm.value);
    showCreatePatientModal.value = false;
    fetchPatients();
  } catch (error) {
    modalError.value = error.response?.data?.message || 'فشل تسجيل المريض الجديد.';
  } finally {
    submitting.value = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ar-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

onMounted(() => {
  fetchSpecialists();
  fetchPatients();
  fetchClinicInfo();
  
  if (user.value) {
    profileForm.value.name = user.value.name;
    profileForm.value.email = user.value.email;
  }
});
</script>
