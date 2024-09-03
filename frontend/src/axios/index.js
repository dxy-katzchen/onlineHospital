import axios from "./axiosInstance";

import { useInfoStore } from "@/store";

const api = {
  addDrug: async (drug_name, usage, cure, single_price) =>
    await axios({
      url: "/drug/add",
      method: "POST",
      data: {
        drug_name,
        usage,
        cure,
        single_price,
      },
    }),

  deleteDrug: async (drug_name) =>
    await axios({
      url: "/drug/delete",
      method: "POST",
      data: {
        drug_name,
      },
    }),
  getMyPsList: async () =>
    await axios({
      url: "/prescription/getMyList",
      method: "POST",
    }),
  getMyMedicalList: async () =>
    await axios({
      url: "/medicalHistory/getMyList",
      method: "POST",
    }),
  updatePatientAvatar: async (patient_id, avatar) =>
    await axios({
      url: "/avatar/patient",
      method: "POST",
      data: {
        patient_id,
        avatar,
      },
    }),
  updateDoctorAvatar: async (doc_id, avatar) =>
    await axios({
      url: "/avatar/doctor",
      method: "POST",
      data: {
        doc_id,
        avatar,
      },
    }),
  getImgTextList: async (appt_id) =>
    await axios({
      url: "/consultation/imgText/get",
      method: "POST",
      data: {
        appt_id,
      },
    }),
  addConsultation: async (appt_id) =>
    await axios({
      url: "/consultation/video/add",
      method: "POST",
      data: {
        appt_id,
      },
    }),
  getVideoConsultation: async (appt_id) =>
    await axios({
      url: "/consultation/video/get",
      method: "POST",
      data: {
        appt_id,
      },
    }),
  psPay: async (ps_id) =>
    await axios({
      url: "/prescription/pay",
      method: "POST",
      data: {
        ps_id,
      },
    }),
  getPsId: async (appt_id) =>
    await axios({
      url: "/prescription/getPsId",
      method: "POST",
      data: {
        appt_id,
      },
    }),
  getApptId: async (ps_id) =>
    await axios({
      url: "/prescription/getApptId",
      method: "POST",
      data: {
        ps_id,
      },
    }),
  deleteDrugPs: async (ps_id, drug_name) =>
    await axios({
      url: "/prescription/deleteDrugPs",
      method: "POST",
      data: {
        ps_id,
        drug_name,
      },
    }),
  addDrugToPs: async (ps_id, drug_name, quantity) =>
    await axios({
      url: "/prescription/addDrugPs",
      method: "POST",
      data: {
        ps_id,
        drug_name,
        quantity,
      },
    }),
  getPsDetail: async (ps_id) =>
    await axios({
      url: "/prescription/detail",
      method: "POST",
      data: {
        ps_id,
      },
    }),
  getDrugList: async () =>
    await axios({
      url: "/drug/getList",
      method: "POST",
    }),
  createPs: async (appt_id) =>
    await axios({
      url: "/prescription/create",
      method: "POST",
      data: {
        appt_id,
      },
    }),
  getSingleMedicalHistory: async (med_hist_id) =>
    await axios({
      url: "/medicalHistory/getById",
      method: "POST",
      data: {
        med_hist_id,
      },
    }),
  addMedicalHistory: async (appt_id, description) =>
    await axios({
      url: "/medicalHistory/add",
      method: "POST",
      data: {
        appt_id,
        description,
      },
    }),
  getAppointment: async (appt_id) =>
    await axios({
      url: "/appointment/get",
      method: "POST",
      data: {
        appt_id,
      },
    }),
  addAppointment: async (doc_id, desc, consult_type) =>
    await axios({
      url: "/appointment/add",
      method: "POST",
      data: {
        doc_id,
        desc,
        consult_type,
      },
    }),
  getDeptList: async (pageCurr) =>
    await axios({
      url: "/department/getDeptList",
      method: "POST",
      data: {
        pageCurr,
      },
    }),
  getDoctorList: async (dept_id) =>
    await axios({
      url: "/department/getDoctorList",
      method: "POST",
      data: {
        dept_id,
      },
    }),
  getVideoToken: async (userId) =>
    await axios({
      url: "/videoToken/get",
      method: "POST",
      data: {
        userId,
      },
    }),
  loginPatient: async (account, password) =>
    await axios({
      url: "/user/patient/login",
      method: "POST",
      data: {
        account,
        password,
      },
    }),
  registerPatient: async (
    patient_name,
    password,
    phone,
    email,
    gender,
    age,
    address
  ) =>
    await axios({
      url: "/user/patient/register",
      method: "POST",
      data: {
        patient_name,
        password,
        phone,
        email,
        gender,
        age,
        address,
      },
    }),
  getAllDeptList: async () =>
    await axios({
      url: "/user/doctor/department/getAllDeptList",
      method: "POST",
    }),
  loginDoctor: async (account, password) =>
    await axios({
      url: "/user/doctor/login",
      method: "POST",
      data: {
        account,
        password,
      },
    }),
  registerDoctor: async (
    doc_name,
    password,
    phone,
    email,
    title_id,
    dept_id,
    avatar,
    description
  ) =>
    await axios({
      url: "/user/doctor/register",
      method: "POST",
      data: {
        doc_name,
        password,
        phone,
        email,
        title_id,
        dept_id,
        avatar,
        description,
      },
    }),
  loginAdmin: async (account, password) =>
    await axios({
      url: "/user/admin/login",
      method: "POST",
      data: {
        account,
        password,
      },
    }),
  registerAdmin: async (password, phone, email) =>
    await axios({
      url: "/user/admin/register",
      method: "POST",
      data: {
        password,
        phone,
        email,
      },
    }),

  getUserInfo: async () =>
    await axios({
      url: "/my/userinfo",
      method: "GET",
    }),

  changeUserInfo: async (username, email, avatar) =>
    await axios({
      url: "/my/userinfo",
      method: "POST",
      data: {
        username,
        email,
        avatar,
      },
    }),
  createMyPage: async () =>
    await axios({
      url: "/userpage/create",
      method: "POST",
    }),
  getMyPageInfo: async () =>
    await axios({
      url: "/userpage/info",
      method: "GET",
    }),
  updateUserInfo: async (name, value) => {
    const userInfo = useInfoStore();
    return await axios({
      url: "/userpage/update",
      method: "POST",
      data: {
        upid: userInfo.user.upid,
        [name]: value,
      },
    });
  },
  getManageList: async (type, pageSize, pageCurr) =>
    await axios({
      url: "/manage/getList",
      method: "POST",

      data: {
        type,
        pageSize,
        pageCurr,
      },
    }),
  getPageDetails: async (mid) =>
    await axios({
      url: "/manage/getPageDetails",
      method: "POST",

      data: {
        mid,
      },
    }),
  updatePage: async (mid, title, content, type, author, banner_pic) =>
    await axios({
      url: "/manage/update",
      method: "POST",
      data: {
        mid,
        title,
        content,
        type,
        author,
        banner_pic,
      },
    }),
  createPage: async () =>
    await axios({
      url: "/manage/create",
      method: "POST",
    }),
  toBin: async (mid) =>
    await axios({
      url: "/manage/toBin",
      method: "POST",
      data: {
        mid,
      },
    }),
  getBinList: async (pageSize, pageCurr) =>
    await axios({
      url: "/manage/getBinList",
      method: "POST",
      data: {
        pageSize,
        pageCurr,
      },
    }),
  deleteCompletely: async (mid) =>
    await axios({
      url: "/manage/delete",
      method: "POST",
      data: {
        mid,
      },
    }),
  getAppointmentList: async (
    doc_name,
    patient_name,
    dept_name,
    consult_type,
    status
  ) =>
    await axios({
      url: "/appointment/getMyList",
      method: "POST",
      data: {
        doc_name,
        patient_name,
        dept_name,
        consult_type,
        status,
      },
    }),
  addCourse: async (is_open, cname, credit, tname, tid, type) =>
    await axios({
      url: "/course/create",
      method: "POST",
      data: {
        is_open,
        cname,
        credit,
        tname,
        tid,
        type,
      },
    }),
  deleteCourse: async (cid) =>
    await axios({
      url: "/course/delete",
      method: "POST",
      data: {
        cid,
      },
    }),
  updateCourse: async (cid, is_open, cname, credit, tname, tid, type) =>
    await axios({
      url: "/course/update",
      method: "POST",
      data: {
        cid,
        is_open,
        cname,
        credit,
        tname,
        tid,
        type,
      },
    }),
  stuChooseCourse: async (cid) =>
    await axios({
      url: "/course/student/choose",
      method: "POST",
      data: {
        cid,
      },
    }),
  stuGetChooseCourseList: async (pageSize, pageCurr) =>
    await axios({
      url: "/course/student/getMyCourse",
      method: "POST",
      data: {
        pageSize,
        pageCurr,
      },
    }),
  stuWithdraw: async (cid) =>
    await axios({
      url: "/course/student/withdraw",
      method: "POST",
      data: {
        cid,
      },
    }),
  stuEvalute: async (cid, ev_score) =>
    await axios({
      url: "/course/student/evaluate",
      method: "POST",
      data: {
        cid,
        ev_score,
      },
    }),
  teacherGetCourseList: async (pageSize, pageCurr) =>
    await axios({
      url: "/course/teacher/getTeacherCourseList",
      method: "POST",
      data: {
        pageSize,
        pageCurr,
      },
    }),
  getMyStudent: async (cid) =>
    await axios({
      url: "/course/teacher/getCourseStuList",
      method: "POST",
      data: {
        cid,
      },
    }),
  markMyStudent: async (cid, stu_id, score) =>
    await axios({
      url: "/course/teacher/mark",
      method: "POST",
      data: {
        cid,
        stu_id,
        score,
      },
    }),
};

export default api;
