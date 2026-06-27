<template>
  <div class="min-h-screen bg-slate-50 flex font-sans">
    <!-- Sidebar / Patients List -->
    <aside class="w-80 bg-slate-900 text-white flex flex-col justify-between p-6 shrink-0">
      <div class="flex-1 flex flex-col min-h-0">
        <div class="flex items-center gap-3 mb-6">
          <img src="/logo.jpg" alt="Ortho Epilepsy Logo" class="w-10 h-10 rounded-lg object-cover" />
          <span class="text-lg font-bold leading-tight">Ortho Epilepsy Doctor</span>
        </div>

        <!-- Propose Suggestion Button -->
        <button 
          @click="showSuggestModal = true"
          class="w-full mb-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <SparklesIcon class="w-4 h-4 text-amber-300" />
          اقتراح اختبار أو نشاط جديد
        </button>

        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">قائمة المرضى المتابعين</h3>
        
        <div class="flex-1 overflow-y-auto space-y-2 pr-1">
          <button 
            v-for="p in patients" 
            :key="p.id"
            @click="selectPatient(p)"
            :class="[
              'w-full flex items-center justify-between p-3 rounded-xl transition-all text-right',
              selectedPatient?.id === p.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'bg-slate-800/50 hover:bg-slate-800 text-slate-300'
            ]"
          >
            <div class="flex items-center gap-3">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm', selectedPatient?.id === p.id ? 'bg-white text-primary-600' : 'bg-slate-700 text-primary-400']">
                {{ p.name.charAt(0) }}
              </div>
              <div>
                <h4 class="font-bold text-sm">{{ p.name }}</h4>
                <p class="text-xs text-slate-400 mt-0.5">{{ p.email }}</p>
              </div>
            </div>
            <ChevronLeftIcon class="w-4 h-4" />
          </button>
          <div v-if="patients.length === 0" class="text-slate-500 text-sm text-center py-6">
            لا يوجد مرضى مضافين بعد.
          </div>
        </div>
      </div>

      <div class="border-t border-slate-800 pt-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-primary-400">
            ط
          </div>
          <div>
            <h4 class="font-bold text-sm leading-tight">{{ user?.name }}</h4>
            <span class="text-xs text-slate-400">طبيب مختص: {{ user?.specialty || 'أعصاب وصوتيات' }}</span>
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

    <!-- Main Workspace -->
    <main class="flex-1 p-10 overflow-y-auto flex flex-col">
      <div v-if="!selectedPatient" class="flex-1 flex flex-col items-center justify-center text-slate-400">
        <UsersIcon class="w-20 h-20 text-slate-300 mb-4" />
        <h2 class="text-2xl font-bold">الرجاء اختيار مريض من القائمة لمراجعة ملفه الطبي</h2>
        <p class="mt-1 text-slate-500">ستظهر لك تفاصيل النوبات، قياسات القلب، وتنائج التقييم المعرفي هنا.</p>
      </div>

      <div v-else class="space-y-8">
        <!-- Patient Header -->
        <header class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div>
            <div class="flex items-center gap-3">
              <span class="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-bold rounded-full">ملف المريض المتابع</span>
            </div>
            <h1 class="text-3xl font-extrabold text-slate-900 mt-2">{{ selectedPatient.name }}</h1>
            <p class="text-slate-500 mt-1">البريد الإلكتروني للمريض: {{ selectedPatient.email }}</p>
          </div>
          <div class="flex gap-3">
            <button 
              @click="showAssignModal = true"
              class="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 flex items-center gap-2"
            >
              <ClipboardListIcon class="w-5 h-5" />
              إسناد اختبار معرفي
            </button>
            <button 
              @click="showRehabModal = true"
              class="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2"
            >
              <ActivityIcon class="w-5 h-5" />
              إسناد نشاط تأهيلي
            </button>
          </div>
        </header>

        <!-- Main Medical Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Column 1 & 2: Health charts and history -->
          <div class="lg:col-span-2 space-y-8">
            
            <!-- Cognitive Tests Results -->
            <section class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BrainIcon class="text-primary-500 w-6 h-6" />
                نتائج التقييمات والوظائف التنفيذية
              </h3>
              
              <div v-if="testResults.length > 0" class="space-y-4">
                <div v-for="res in testResults" :key="res.id" class="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 class="font-bold text-slate-900">{{ res.test.name_ar }}</h4>
                    <p class="text-xs text-slate-500 mt-1">
                      الوظيفة المقاسة: {{ translateFunction(res.test.executive_function) }}
                    </p>
                  </div>
                  <div class="flex gap-8 text-left">
                    <div>
                      <span class="text-xs text-slate-400 block">زمن الإنجاز</span>
                      <strong class="text-slate-800 text-sm">{{ res.duration_seconds }} ثانية</strong>
                    </div>
                    <div>
                      <span class="text-xs text-slate-400 block">الإجابات الصحيحة</span>
                      <strong class="text-emerald-600 text-sm">{{ res.score }}</strong>
                    </div>
                    <div>
                      <span class="text-xs text-slate-400 block">عدد الأخطاء</span>
                      <strong class="text-red-500 text-sm">{{ res.errors_count }}</strong>
                    </div>
                    <div>
                      <span class="text-xs text-slate-400 block">تاريخ التأدية</span>
                      <strong class="text-slate-500 text-xs">{{ formatDate(res.created_at) }}</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-slate-400">
                لم يؤدِ المريض أي اختبارات معرفية بعد.
              </div>
            </section>

            <!-- Rehab Activities Section -->
            <section class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ActivityIcon class="text-emerald-500 w-6 h-6" />
                البرنامج والأنشطة التأهيلية الحالية
              </h3>
              
              <div v-if="rehabAssignments.length > 0" class="space-y-4">
                <div v-for="res in rehabAssignments" :key="res.id" class="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <h4 class="font-bold text-slate-900">{{ res.activity.name_ar }}</h4>
                    <p class="text-xs text-slate-500 mt-1">التصنيف: {{ translateCategory(res.activity.category) }}</p>
                    <p v-if="res.notes" class="text-xs text-slate-400 mt-1 font-sans">ملاحظة: {{ res.notes }}</p>
                  </div>
                  <div>
                    <span :class="[
                      'px-2.5 py-1 text-xs font-bold rounded-full',
                      res.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    ]">
                      {{ res.status === 'completed' ? 'مكتمل' : 'قيد المتابعة' }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-slate-400">
                لم يتم تعيين أي نشاط تأهيلي لهذا المريض بعد.
              </div>
            </section>

            <!-- Seizure History -->
            <section class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ActivityIcon class="text-red-500 w-6 h-6" />
                سجل نوبات الصرع الأخيرة
              </h3>
              <div v-if="seizures.length > 0" class="space-y-4">
                <div v-for="s in seizures" :key="s.id" class="p-4 border-l-4 border-red-500 bg-red-50/30 rounded-xl flex justify-between items-center">
                  <div>
                    <span class="px-2.5 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                      {{ s.type === 1 ? 'نوبة كبرى' : s.type === 2 ? 'نوبة صغرى' : 'نوبة غير محددة' }}
                    </span>
                    <p class="text-slate-700 font-medium mt-2">{{ s.notes || 'لا توجد ملاحظات.' }}</p>
                  </div>
                  <div class="text-left">
                    <span class="text-xs text-slate-400 block">توقيت البدء</span>
                    <strong class="text-slate-800 text-sm block">{{ formatDate(s.start_time) }}</strong>
                    <span class="text-xs text-slate-500 block mt-1">المدة: {{ s.duration_seconds }} ثانية</span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-slate-400">
                لا توجد نوبات مسجلة في حساب المريض مؤخراً.
              </div>
            </section>
          </div>

          <!-- Column 3: Summary details & Heart Rate simulator -->
          <div class="space-y-8">
            <!-- Simulated Live Heart Rate -->
            <section class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
              <h3 class="text-sm font-bold text-slate-400 uppercase mb-4 text-right">نبضات القلب الحالية (من الساعة)</h3>
              <div class="flex items-center justify-center gap-4 py-6">
                <HeartIcon class="w-16 h-16 text-red-500 animate-pulse" />
                <div class="text-right">
                  <span class="text-5xl font-extrabold text-slate-900 tracking-tight">{{ heartRate }}</span>
                  <span class="text-xs text-slate-400 block">نبضة/دقيقة</span>
                </div>
              </div>
              <div class="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg">
                مستوى النبض طبيعي ومستقر
              </div>
            </section>

            <!-- Medication summary -->
            <section class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 class="text-sm font-bold text-slate-400 uppercase mb-4">الأدوية الموصوفة والالتزام</h3>
              <div v-if="medications.length > 0" class="space-y-3">
                <div v-for="med in medications" :key="med.id" class="p-3 bg-teal-50/40 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm">{{ med.name }}</h4>
                    <p class="text-xs text-slate-500 mt-0.5">الجرعة: {{ med.dosage }}</p>
                  </div>
                  <CheckCircle2Icon class="w-5 h-5 text-teal-600" />
                </div>
              </div>
              <div v-else class="text-center py-6 text-slate-400 text-sm">
                لم يتم إدخال أدوية للمريض بعد.
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>

    <!-- Assign Test Modal -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
        <header class="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-xl font-bold text-slate-900">جدولة تقييم معرفي جديد</h3>
          <button @click="showAssignModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </header>
        <form @submit.prevent="assignTest" class="p-6 space-y-4">
          <div v-if="assignError" class="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100">
            {{ assignError }}
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">اختر نوع التقييم المعرفي</label>
            <select v-model="selectedTestId" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500">
              <option value="" disabled>-- الرجاء اختيار اختبار --</option>
              <option v-for="t in availableTests" :key="t.id" :value="t.id">
                {{ t.name_ar }} ({{ translateFunction(t.executive_function) }})
              </option>
            </select>
          </div>

          <footer class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showAssignModal = false" class="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50">إلغاء</button>
            <button type="submit" :disabled="assigning" class="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl disabled:opacity-50">
              <span v-if="assigning">جاري الجدولة...</span>
              <span v-else>جدولة الآن</span>
            </button>
          </footer>
        </form>
      </div>
    </div>

    <!-- Assign Rehab Activity Modal -->
    <div v-if="showRehabModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
        <header class="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-xl font-bold text-slate-900">إسناد نشاط تاهيلي جديد</h3>
          <button @click="showRehabModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </header>
        <form @submit.prevent="assignRehab" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">اختر النشاط التأهيلي</label>
            <select v-model="selectedRehabId" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500">
              <option value="" disabled>-- الرجاء اختيار نشاط تاهيلي --</option>
              <option v-for="act in availableRehabs" :key="act.id" :value="act.id">
                {{ act.name_ar }} ({{ translateCategory(act.category) }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">توجيهات وملاحظات الطبيب للمريض</label>
            <textarea v-model="rehabNotes" rows="3" class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" placeholder="مثال: يرجى تكرار هذا التمرين 3 مرات يومياً..."></textarea>
          </div>

          <footer class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showRehabModal = false" class="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50">إلغاء</button>
            <button type="submit" :disabled="assigning" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl disabled:opacity-50">
              <span v-if="assigning">جاري الإسناد...</span>
              <span v-else>إسناد فوري</span>
            </button>
          </footer>
        </form>
      </div>
    </div>

    <!-- Suggestion Modal -->
    <div v-if="showSuggestModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
        <header class="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-xl font-bold text-slate-900">اقتراح إضافة اختبار/نشاط</h3>
          <button @click="showSuggestModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </header>
        <form @submit.prevent="submitSuggestion" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">نوع الاقتراح</label>
            <select v-model="sugForm.type" class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500">
              <option value="cognitive_test">اختبار معرفي إلكتروني</option>
              <option value="rehab_activity">برنامج ونشاط تأهيلي</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">الاسم بالعربية</label>
            <input v-model="sugForm.name_ar" type="text" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">الاسم بالإنجليزية</label>
            <input v-model="sugForm.name_en" type="text" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">الوصف بالعربية</label>
            <textarea v-model="sugForm.description_ar" rows="3" class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">الوصف بالإنجليزية</label>
            <textarea v-model="sugForm.description_en" rows="3" class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">
              {{ sugForm.type === 'cognitive_test' ? 'الوظيفة المقاسة (Function)' : 'التصنيف التأهيلي (Category)' }}
            </label>
            <input v-model="sugForm.category_or_function" type="text" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" :placeholder="sugForm.type === 'cognitive_test' ? 'working_memory' : 'speech'" />
          </div>

          <footer class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showSuggestModal = false" class="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50">إلغاء</button>
            <button type="submit" :disabled="assigning" class="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl disabled:opacity-50">
              <span v-if="assigning">جاري الإرسال...</span>
              <span v-else>إرسال للسوبر أدمن</span>
            </button>
          </footer>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import axios from 'axios';
import { 
  Users as UsersIcon, 
  LogOut as LogOutIcon, 
  ChevronLeft as ChevronLeftIcon, 
  ClipboardList as ClipboardListIcon, 
  Brain as BrainIcon, 
  Activity as ActivityIcon, 
  Heart as HeartIcon, 
  CheckCircle2 as CheckCircle2Icon,
  Sparkles as SparklesIcon
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const patients = ref([]);
const selectedPatient = ref(null);
const seizures = ref([]);
const testResults = ref([]);
const rehabAssignments = ref([]);
const medications = ref([]);
const availableTests = ref([]);
const availableRehabs = ref([]);

const showAssignModal = ref(false);
const showRehabModal = ref(false);
const showSuggestModal = ref(false);

const selectedTestId = ref('');
const selectedRehabId = ref('');
const rehabNotes = ref('');
const assigning = ref(false);
const assignError = ref('');

const sugForm = ref({
  type: 'cognitive_test',
  name_ar: '',
  name_en: '',
  description_ar: '',
  description_en: '',
  category_or_function: 'working_memory',
});

// Heart rate simulation
const heartRate = ref(74);
let hrInterval = null;

const startHRSimulation = () => {
  hrInterval = setInterval(() => {
    heartRate.value = Math.floor(Math.random() * (85 - 70 + 1)) + 70;
  }, 3000);
};

const stopHRSimulation = () => {
  if (hrInterval) clearInterval(hrInterval);
};

const fetchPatients = async () => {
  try {
    const response = await axios.get('/specialist/my-patients');
    patients.value = response.data;
  } catch (error) {
    console.error('Failed to fetch patients', error);
  }
};

const fetchAvailableTests = async () => {
  try {
    const response = await axios.get('/cognitive-tests');
    availableTests.value = response.data;
  } catch (error) {
    console.error('Failed to fetch tests', error);
  }
};

const fetchAvailableRehabs = async () => {
  try {
    const response = await axios.get('/rehab-activities');
    availableRehabs.value = response.data;
  } catch (error) {
    console.error('Failed to fetch rehabs', error);
  }
};

const selectPatient = async (patient) => {
  selectedPatient.value = patient;
  fetchPatientMedicalData(patient.id);
};

const fetchPatientMedicalData = async (patientId) => {
  try {
    const sResp = await axios.get(`/seizures?user_id=${patientId}`);
    seizures.value = sResp.data.filter(s => s.user_id === patientId);

    const rResp = await axios.get(`/specialist/patients/${patientId}/test-results`);
    testResults.value = rResp.data;

    const reResp = await axios.get(`/specialist/rehab/assigned/${patientId}`);
    rehabAssignments.value = reResp.data;

    const mResp = await axios.get(`/medications?user_id=${patientId}`);
    medications.value = mResp.data.filter(m => m.user_id === patientId);
  } catch (error) {
    console.error('Failed to load patient records', error);
  }
};

const assignTest = async () => {
  assignError.value = '';
  assigning.value = true;
  try {
    await axios.post('/specialist/tests/assign', {
      patient_id: selectedPatient.value.id,
      test_id: selectedTestId.value
    });
    showAssignModal.value = false;
    selectedTestId.value = '';
    alert('تمت جدولة التقييم المعرفي للمريض بنجاح!');
  } catch (error) {
    assignError.value = error.response?.data?.message || 'فشل الجدولة.';
  } finally {
    assigning.value = false;
  }
};

const assignRehab = async () => {
  assigning.value = true;
  try {
    await axios.post('/specialist/rehab/assign', {
      patient_id: selectedPatient.value.id,
      activity_id: selectedRehabId.value,
      notes: rehabNotes.value
    });
    showRehabModal.value = false;
    selectedRehabId.value = '';
    rehabNotes.value = '';
    alert('تم إسناد النشاط التأهيلي بنجاح!');
    fetchPatientMedicalData(selectedPatient.value.id);
  } catch (error) {
    console.error('Failed to assign rehab', error);
  } finally {
    assigning.value = false;
  }
};

const submitSuggestion = async () => {
  assigning.value = true;
  try {
    await axios.post('/specialist/suggestions', sugForm.value);
    showSuggestModal.value = false;
    sugForm.value = {
      type: 'cognitive_test',
      name_ar: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      category_or_function: 'working_memory',
    };
    alert('تم إرسال اقتراحك لمدير النظام العام بنجاح!');
  } catch (error) {
    console.error('Failed to submit suggestion', error);
  } finally {
    assigning.value = false;
  }
};

const translateFunction = (func) => {
  const map = {
    'inhibitory_control': 'التحكم المثبط والانتباه الانتقائي',
    'working_memory': 'الذاكرة العاملة والتركيز',
    'response_inhibition': 'كبح الاستجابة الحركية',
    'cognitive_flexibility': 'المرونة المعرفية وحل المشكلات',
    'cognitive_flexibility_retrieval': 'المرونة المعرفية وسرعة الاسترجاع',
    'cognitive_switching_attention': 'التبديل الذهني والانتباه المشترك'
  };
  return map[func] || func;
};

const translateCategory = (cat) => {
  const map = {
    'speech': 'تأهيل النطق والتخاطب',
    'cognitive': 'تأهيل معرفي وإدراكي',
    'motor': 'تأهيل حركي وتشنجي'
  };
  return map[cat] || cat;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('ar-DZ', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

onMounted(() => {
  fetchPatients();
  fetchAvailableTests();
  fetchAvailableRehabs();
  startHRSimulation();
});

onBeforeUnmount(() => {
  stopHRSimulation();
});
</script>
