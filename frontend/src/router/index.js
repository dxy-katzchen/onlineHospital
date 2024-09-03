import { createRouter, createWebHashHistory } from "vue-router";
import { useInfoStore } from "@/store";

import { fromRoute } from "./useRoutes";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "Index",
      component: () => import("@/pages/mainPage/index.vue"),
      children: [
        {
          path: "myAppointmentList",
          name: "MyAppointmentList",
          component: () =>
            import("@/pages/Appointment/MyAppointmentList/index.vue"),
        },
        {
          path: "videoChat",
          name: "VideoChat",
          component: () =>
            import("@/pages/Consultation/WebRTCVideoChat/index.vue"),
        },
        {
          path: "textConsultation",
          name: "TextConsultation",
          component: () => import("@/pages/Consultation/text/index.vue"),
        },
        {
          path: "addAppointment",
          name: "AddAppointment",
          component: () =>
            import("@/pages/Appointment/addAppointment/index.vue"),
        },
        {
          path: "addMedicalHistory",
          name: "AddMedicalHistory",
          component: () =>
            import("@/pages/MedicalHistory/addMedicalHistory/index.vue"),
        },
        {
          path: "viewMedicalHistory",
          name: "ViewMedicalHistory",
          component: () =>
            import("@/pages/MedicalHistory/viewMedicalHistory/index.vue"),
        },
        {
          path: "medicalHistoryList",
          name: "MedicalHistoryList",
          component: () =>
            import("@/pages/MedicalHistory/MedicalHistoryList/index.vue"),
        },
        {
          path: "createPs",
          name: "CreatePs",
          component: () => import("@/pages/Prescription/createPs/index.vue"),
        },
        {
          path: "getMyPsList",
          name: "GetMyPsList",
          component: () => import("@/pages/Prescription/PsList/index.vue"),
        },
        {
          path: "viewPs",
          name: "ViewPs",
          component: () => import("@/pages/Prescription/viewPs/index.vue"),
        },
        {
          path: "manageDrug",
          name: "ManageDrug",
          component: () => import("@/pages/ManageDrug/index.vue"),
        },
      ],
    },
    {
      path: "/myInfo",
      name: "MyInfo",
      component: () => import("@/pages/MyInfo/index.vue"),
    },
    {
      path: "/login",
      component: () => import("@/pages/LoginReg/index.vue"),
      children: [
        {
          path: "",
          name: "Login",
          component: () => import("@/pages/LoginReg/Login.vue"),
        },
        {
          path: "register",
          name: "Register",
          component: () => import("@/pages/LoginReg/Register.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from) => {
  fromRoute.value = from;
  const userInfo = useInfoStore();
  if (userInfo.token || ["Login", "Register"].includes(to.name)) return true;
  return { name: "Login" };
});

export default router;
