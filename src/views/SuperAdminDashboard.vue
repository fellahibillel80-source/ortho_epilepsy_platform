<template>
  <div class="min-h-screen bg-slate-50 flex font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 text-white flex flex-col justify-between p-6 shrink-0">
      <div>
        <div class="flex items-center gap-3 mb-8">
          <img src="/logo.jpg" alt="Ortho Epilepsy Logo" class="w-10 h-10 rounded-lg object-cover" />
          <span class="text-lg font-bold leading-tight">Ortho Epilepsy Admin</span>
        </div>
        <nav class="space-y-2">
          <button 
            @click="activeTab = 'clinics'" 
            :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-right', activeTab === 'clinics' ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50']"
          >
            <Building2Icon class="w-5 h-5" />
            العيادات والاشتراكات
          </button>
          <button 
            @click="activeTab = 'bank'" 
            :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-right', activeTab === 'bank' ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50']"
          >
            <LayersIcon class="w-5 h-5" />
            بنك الاختبارات والأنشطة
          </button>
          <button 
            @click="activeTab = 'suggestions'" 
            :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-right', activeTab === 'suggestions' ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50']"
          >
            <SparklesIcon class="w-5 h-5" />
            اقتراحات الأطباء
            <span v-if="pendingSuggestionsCount > 0" class="mr-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {{ pendingSuggestionsCount }}
            </span>
          </button>
        </nav>
      </div>

      <div class="border-t border-slate-800 pt-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-primary-400">
            م
          </div>
          <div>
            <h4 class="font-bold text-sm leading-tight">{{ user?.name }}</h4>
            <span class="text-xs text-slate-400">المشرف العام</span>
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
      
      <!-- TAB 1: CLINICS & SUBSCRIPTIONS -->
      <div v-if="activeTab === 'clinics'">
        <header class="flex justify-between items-center mb-10">
          <div>
            <h1 class="text-3xl font-extrabold text-slate-900">إدارة العيادات والاشتراكات</h1>
            <p class="text-slate-500 mt-1">إضافة عيادات جديدة ومراقبة وتعديل الحالة المالية والاشتراكات النشطة</p>
          </div>
          <button 
            @click="showCreateModal = true"
            class="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 flex items-center gap-2"
          >
            <PlusIcon class="w-5 h-5" />
            إضافة عيادة جديدة
          </button>
        </header>

        <!-- Stats Grid -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div class="p-4 bg-primary-50 rounded-xl text-primary-600">
              <Building2Icon class="w-8 h-8" />
            </div>
            <div>
              <span class="text-slate-400 text-sm">إجمالي العيادات</span>
              <h2 class="text-3xl font-bold text-slate-800 mt-1">{{ clinics.length }}</h2>
            </div>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div class="p-4 bg-emerald-50 rounded-xl text-emerald-600">
              <UsersIcon class="w-8 h-8" />
            </div>
            <div>
              <span class="text-slate-400 text-sm">الحسابات النشطة</span>
              <h2 class="text-3xl font-bold text-slate-800 mt-1">{{ activeAccountsCount }}</h2>
            </div>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div class="p-4 bg-amber-50 rounded-xl text-amber-600">
              <CreditCardIcon class="w-8 h-8" />
            </div>
            <div>
              <span class="text-slate-400 text-sm">الاشتراكات الممتازة</span>
              <h2 class="text-3xl font-bold text-slate-800 mt-1">{{ premiumClinicsCount }}</h2>
            </div>
          </div>
        </section>

        <!-- Clinics Table -->
        <section class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-slate-100">
            <h3 class="font-bold text-lg text-slate-800">قائمة العيادات واشتراكاتها</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-right">
              <thead class="bg-slate-50 text-slate-400 text-sm font-semibold border-b border-slate-100">
                <tr>
                  <th class="px-6 py-4">اسم العيادة</th>
                  <th class="px-6 py-4">العنوان والهاتف</th>
                  <th class="px-6 py-4">الباقة الحالية</th>
                  <th class="px-6 py-4">الحالة والانتهاء</th>
                  <th class="px-6 py-4 text-center">الاشتراك المالي</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr v-for="clinic in clinics" :key="clinic.id" class="hover:bg-slate-50/50 transition-all">
                  <td class="px-6 py-4 font-bold text-slate-900">
                    <div class="font-bold">{{ clinic.name }}</div>
                    <div class="text-xs text-slate-400 font-normal mt-0.5">{{ clinic.users_count || 0 }} مختصين مسجلين</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm">{{ clinic.address || 'غير محدد' }}</div>
                    <div class="text-xs text-slate-400 mt-0.5">{{ clinic.phone || '-' }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="['px-2.5 py-1 rounded-full text-xs font-bold', clinic.subscription_plan === 'premium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800']">
                      {{ clinic.subscription_plan === 'premium' ? 'متقدم Premium' : 'قياسي Standard' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-1.5">
                      <span :class="['w-2 h-2 rounded-full', clinic.subscription_status === 'active' ? 'bg-emerald-500' : 'bg-red-500']"></span>
                      <span class="text-sm font-semibold">
                        {{ clinic.subscription_status === 'active' ? 'نشط' : clinic.subscription_status === 'suspended' ? 'معلق' : 'منتهي' }}
                      </span>
                    </div>
                    <div class="text-xs text-slate-400 mt-1">ينتهي في: {{ formatDate(clinic.subscription_ends_at) || 'غير محدد' }}</div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <button 
                      @click="openSubscriptionModal(clinic)"
                      class="px-4 py-1.5 text-xs bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-slate-700 font-bold rounded-lg border border-slate-200 transition-all"
                    >
                      تعديل الاشتراك
                    </button>
                  </td>
                </tr>
                <tr v-if="clinics.length === 0">
                  <td colspan="5" class="px-6 py-10 text-center text-slate-400">لا توجد عيادات مسجلة بعد. اضغط على "إضافة عيادة جديدة" للبدء.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- TAB 2: TESTS & ACTIVITIES BANK -->
      <div v-if="activeTab === 'bank'" class="space-y-10">
        <header>
          <h1 class="text-3xl font-extrabold text-slate-900">بنك الاختبارات والأنشطة التأهيلية</h1>
          <p class="text-slate-500 mt-1">تحديث محتوى الاختبارات المعرفية وسيناريوهات التأهيل الصوتي والحركي للنظام العام</p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Cognitive Tests Bank -->
          <section class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div class="flex justify-between items-center border-b pb-4">
              <h3 class="font-bold text-lg text-slate-800 flex items-center gap-2">
                <BookmarkIcon class="w-5 h-5 text-primary-500" />
                الاختبارات الطبية المعرفية
              </h3>
              <button 
                @click="openBankModal('test')"
                class="px-3 py-1.5 text-xs bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg flex items-center gap-1"
              >
                <PlusIcon class="w-4 h-4" /> إضافة اختبار
              </button>
            </div>
            
            <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              <div v-for="test in tests" :key="test.id" class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div class="flex justify-between">
                  <h4 class="font-bold text-slate-950">{{ test.name_ar }} <span class="text-xs text-slate-400 font-normal font-sans">({{ test.name_en }})</span></h4>
                  <span class="text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded font-semibold">{{ test.executive_function }}</span>
                </div>
                <p class="text-xs text-slate-500 mt-2 leading-relaxed">{{ test.description_ar || 'لا يوجد وصف عربي.' }}</p>
              </div>
            </div>
          </section>

          <!-- Rehab Activities Bank -->
          <section class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div class="flex justify-between items-center border-b pb-4">
              <h3 class="font-bold text-lg text-slate-800 flex items-center gap-2">
                <ActivityIcon class="w-5 h-5 text-emerald-500" />
                البرامج والنشاطات التأهيلية
              </h3>
              <button 
                @click="openBankModal('rehab')"
                class="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1"
              >
                <PlusIcon class="w-4 h-4" /> إضافة نشاط
              </button>
            </div>
            
            <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              <div v-for="act in rehabActivities" :key="act.id" class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div class="flex justify-between">
                  <h4 class="font-bold text-slate-950">{{ act.name_ar }} <span class="text-xs text-slate-400 font-normal font-sans">({{ act.name_en }})</span></h4>
                  <span class="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">{{ act.category }}</span>
                </div>
                <p class="text-xs text-slate-500 mt-2 leading-relaxed">{{ act.description_ar || 'لا يوجد وصف عربي.' }}</p>
              </div>
              <div v-if="rehabActivities.length === 0" class="text-slate-400 text-sm text-center py-6">
                لا توجد أنشطة مسجلة بعد.
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- TAB 3: SPECIALIST SUGGESTIONS -->
      <div v-if="activeTab === 'suggestions'">
        <header class="mb-10">
          <h1 class="text-3xl font-extrabold text-slate-900">اقتراحات الأطباء والمختصين</h1>
          <p class="text-slate-500 mt-1">مراجعة الأنشطة والاختبارات المقترحة من طاقم العيادات والموافقة على إدراجها في النظام العام</p>
        </header>

        <section class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-slate-100">
            <h3 class="font-bold text-lg text-slate-800">قائمة الاقتراحات المستلمة</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-right">
              <thead class="bg-slate-50 text-slate-400 text-sm font-semibold border-b border-slate-100">
                <tr>
                  <th class="px-6 py-4">المقترح والنوع</th>
                  <th class="px-6 py-4">المقترح بواسطة</th>
                  <th class="px-6 py-4">الوظيفة / التصنيف</th>
                  <th class="px-6 py-4">الحالة</th>
                  <th class="px-6 py-4 text-center">القرار والإجراء</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr v-for="sug in suggestions" :key="sug.id" class="hover:bg-slate-50/50 transition-all">
                  <td class="px-6 py-4 font-bold text-slate-900">
                    <div>{{ sug.name_ar }} <span class="text-xs text-slate-400 font-normal">({{ sug.name_en }})</span></div>
                    <div class="text-xs text-slate-500 font-normal mt-1 leading-relaxed max-w-sm">{{ sug.description_ar }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="font-bold text-sm">{{ sug.specialist?.name }}</div>
                    <div class="text-xs text-slate-400">{{ sug.specialist?.email }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="['px-2 py-0.5 text-xs font-semibold rounded', sug.type === 'cognitive_test' ? 'bg-primary-100 text-primary-800' : 'bg-emerald-100 text-emerald-800']">
                      {{ sug.type === 'cognitive_test' ? 'اختبار معرفي' : 'نشاط تأهيلي' }}
                    </span>
                    <div class="text-xs text-slate-400 mt-1 font-mono">{{ sug.category_or_function }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="[
                      'px-2 py-0.5 rounded-full text-xs font-bold',
                      sug.status === 'approved' ? 'bg-green-100 text-green-800' : sug.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    ]">
                      {{ sug.status === 'approved' ? 'مقبول' : sug.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <div v-if="sug.status === 'pending'" class="flex items-center justify-center gap-2">
                      <button 
                        @click="resolveSuggestion(sug.id, 'approve')"
                        class="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                        title="موافقة وإدراج في النظام"
                      >
                        <CheckIcon class="w-4 h-4" />
                      </button>
                      <button 
                        @click="resolveSuggestion(sug.id, 'reject')"
                        class="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                        title="رفض"
                      >
                        <XIcon class="w-4 h-4" />
                      </button>
                    </div>
                    <div v-else class="text-xs text-slate-400">-</div>
                  </td>
                </tr>
                <tr v-if="suggestions.length === 0">
                  <td colspan="5" class="px-6 py-10 text-center text-slate-400">لا توجد اقتراحات مستلمة من الأطباء حتى الآن.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

    </main>

    <!-- Create Clinic Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100">
        <header class="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-xl font-bold text-slate-900">إضافة عيادة جديدة</h3>
          <button @click="showCreateModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </header>
        <form @submit.prevent="createClinic" class="p-6 space-y-4">
          <div v-if="modalError" class="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100">
            {{ modalError }}
          </div>

          <h4 class="font-bold text-primary-700 text-sm border-b pb-1">بيانات العيادة</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1">اسم العيادة</label>
              <input v-model="form.clinic_name" type="text" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1">رقم الهاتف</label>
              <input v-model="form.phone" type="text" class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">العنوان</label>
            <input v-model="form.address" type="text" class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" />
          </div>

          <h4 class="font-bold text-primary-700 text-sm border-b pb-1 pt-2">بيانات حساب المدير للعيادة</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1">اسم المدير</label>
              <input v-model="form.admin_name" type="text" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1">البريد الإلكتروني</label>
              <input v-model="form.admin_email" type="email" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">كلمة المرور الافتراضية</label>
            <input v-model="form.admin_password" type="password" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" />
          </div>

          <footer class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showCreateModal = false" class="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50">إلغاء</button>
            <button type="submit" :disabled="submitting" class="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl disabled:opacity-50">
              <span v-if="submitting">جاري الحفظ...</span>
              <span v-else>حفظ وإرسال</span>
            </button>
          </footer>
        </form>
      </div>
    </div>

    <!-- Edit Subscription Modal -->
    <div v-if="showSubscriptionModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
        <header class="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-xl font-bold text-slate-900">تعديل اشتراك: {{ activeClinic?.name }}</h3>
          <button @click="showSubscriptionModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </header>
        <form @submit.prevent="updateSubscription" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">حالة الاشتراك المالي</label>
            <select v-model="subForm.subscription_status" class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500">
              <option value="active">نشط / مفعل</option>
              <option value="suspended">موقوف مؤقتاً</option>
              <option value="expired">منتهي الصلاحية</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">نوع باقة الاشتراك</label>
            <select v-model="subForm.subscription_plan" class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500">
              <option value="standard">باقة قياسية Standard</option>
              <option value="premium">باقة متقدمة Premium</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">تاريخ نهاية الاشتراك</label>
            <input v-model="subForm.subscription_ends_at" type="date" class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" />
          </div>

          <footer class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showSubscriptionModal = false" class="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50">إلغاء</button>
            <button type="submit" :disabled="submitting" class="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl disabled:opacity-50">
              <span v-if="submitting">جاري الحفظ...</span>
              <span v-else>حفظ التغييرات</span>
            </button>
          </footer>
        </form>
      </div>
    </div>

    <!-- Create Test or Rehab Modal -->
    <div v-if="showBankModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
        <header class="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-xl font-bold text-slate-900">إضافة {{ bankType === 'test' ? 'اختبار معرفي جديد' : 'نشاط تأهيلي جديد' }}</h3>
          <button @click="showBankModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </header>
        <form @submit.prevent="submitToBank" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">الاسم بالعربية</label>
            <input v-model="bankForm.name_ar" type="text" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">الاسم بالإنجليزية</label>
            <input v-model="bankForm.name_en" type="text" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">الوصف بالعربية</label>
            <textarea v-model="bankForm.description_ar" rows="3" class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">الوصف بالإنجليزية</label>
            <textarea v-model="bankForm.description_en" rows="3" class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-1">
              {{ bankType === 'test' ? 'الوظيفة التنفيذية (Executive Function)' : 'التصنيف التأهيلي' }}
            </label>
            <input v-model="bankForm.category_or_function" type="text" required class="w-full px-3 py-2 border rounded-xl focus:ring-primary-500" :placeholder="bankType === 'test' ? 'working_memory' : 'speech'" />
          </div>

          <footer class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showBankModal = false" class="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50">إلغاء</button>
            <button type="submit" :disabled="submitting" class="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl disabled:opacity-50">
              <span v-if="submitting">جاري الحفظ...</span>
              <span v-else>حفظ في البنك</span>
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
  Building2 as Building2Icon, 
  LogOut as LogOutIcon, 
  Plus as PlusIcon, 
  Users as UsersIcon, 
  Activity as ActivityIcon,
  Layers as LayersIcon,
  Sparkles as SparklesIcon,
  CreditCard as CreditCardIcon,
  Bookmark as BookmarkIcon,
  Check as CheckIcon,
  X as XIcon
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const activeTab = ref('clinics');
const clinics = ref([]);
const tests = ref([]);
const rehabActivities = ref([]);
const suggestions = ref([]);

const showCreateModal = ref(false);
const showSubscriptionModal = ref(false);
const showBankModal = ref(false);
const submitting = ref(false);
const modalError = ref('');

const activeClinic = ref(null);
const bankType = ref('test'); // 'test' or 'rehab'

const form = ref({
  clinic_name: '',
  address: '',
  phone: '',
  admin_name: '',
  admin_email: '',
  admin_password: '',
});

const subForm = ref({
  subscription_status: 'active',
  subscription_plan: 'standard',
  subscription_ends_at: '',
});

const bankForm = ref({
  name_ar: '',
  name_en: '',
  description_ar: '',
  description_en: '',
  category_or_function: '',
});

const activeAccountsCount = computed(() => {
  return clinics.value.reduce((acc, c) => acc + (c.users_count || 0), 0) + 1;
});

const premiumClinicsCount = computed(() => {
  return clinics.value.filter(c => c.subscription_plan === 'premium').length;
});

const pendingSuggestionsCount = computed(() => {
  return suggestions.value.filter(s => s.status === 'pending').length;
});

const fetchClinics = async () => {
  try {
    const response = await axios.get('/admin/clinics');
    clinics.value = response.data;
  } catch (error) {
    console.error('Failed to fetch clinics', error);
  }
};

const fetchBankData = async () => {
  try {
    const testResponse = await axios.get('/cognitive-tests');
    tests.value = testResponse.data;

    const rehabResponse = await axios.get('/rehab-activities');
    rehabActivities.value = rehabResponse.data;
  } catch (error) {
    console.error('Failed to fetch bank data', error);
  }
};

const fetchSuggestions = async () => {
  try {
    const response = await axios.get('/suggestions');
    suggestions.value = response.data;
  } catch (error) {
    console.error('Failed to fetch suggestions', error);
  }
};

const createClinic = async () => {
  modalError.value = '';
  submitting.value = true;
  try {
    await axios.post('/admin/clinics', form.value);
    showCreateModal.value = false;
    form.value = {
      clinic_name: '',
      address: '',
      phone: '',
      admin_name: '',
      admin_email: '',
      admin_password: '',
    };
    fetchClinics();
  } catch (error) {
    modalError.value = error.response?.data?.message || 'فشل إدخال البيانات.';
  } finally {
    submitting.value = false;
  }
};

const openSubscriptionModal = (clinic) => {
  activeClinic.value = clinic;
  subForm.value = {
    subscription_status: clinic.subscription_status || 'active',
    subscription_plan: clinic.subscription_plan || 'standard',
    subscription_ends_at: clinic.subscription_ends_at ? clinic.subscription_ends_at.split('T')[0] : '',
  };
  showSubscriptionModal.value = true;
};

const updateSubscription = async () => {
  submitting.value = true;
  try {
    await axios.put(`/admin/clinics/${activeClinic.value.id}/subscription`, subForm.value);
    showSubscriptionModal.value = false;
    fetchClinics();
  } catch (error) {
    console.error('Failed to update subscription', error);
  } finally {
    submitting.value = false;
  }
};

const openBankModal = (type) => {
  bankType.value = type;
  bankForm.value = {
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    category_or_function: '',
  };
  showBankModal.value = true;
};

const submitToBank = async () => {
  submitting.value = true;
  try {
    if (bankType.value === 'test') {
      await axios.post('/admin/cognitive-tests', {
        name_ar: bankForm.value.name_ar,
        name_en: bankForm.value.name_en,
        description_ar: bankForm.value.description_ar,
        description_en: bankForm.value.description_en,
        executive_function: bankForm.value.category_or_function,
      });
    } else {
      await axios.post('/admin/rehab-activities', {
        name_ar: bankForm.value.name_ar,
        name_en: bankForm.value.name_en,
        description_ar: bankForm.value.description_ar,
        description_en: bankForm.value.description_en,
        category: bankForm.value.category_or_function,
      });
    }
    showBankModal.value = false;
    fetchBankData();
  } catch (error) {
    console.error('Failed to save bank item', error);
  } finally {
    submitting.value = false;
  }
};

const resolveSuggestion = async (id, action) => {
  try {
    await axios.put(`/admin/suggestions/${id}/${action}`);
    fetchSuggestions();
    fetchBankData(); // refresh bank just in case it was approved
  } catch (error) {
    console.error('Failed to resolve suggestion', error);
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
  fetchClinics();
  fetchBankData();
  fetchSuggestions();
});
</script>
