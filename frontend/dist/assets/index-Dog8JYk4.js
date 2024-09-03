import{_ as u,m as p,y,u as f,H as g,i as h,b as n,n as t,d as l,e as _,F as b,E as i,o as I}from"./index-CvmFJ_Ff.js";import{U as M}from"./UpLoadImg-CK-VdaR-.js";import{E as R}from"./style-CPE1I2Op.js";import{a as B}from"./index-DUccw6c8.js";import"./index-9kvZAmIG.js";const C=`# Medical History
- Past Medical History: Chronic illnesses, surgeries, hospitalizations, allergies, etc.
- Family History: Relevant medical history of immediate family members.
- Medication History: Current and past medications, including dosages and duration.
# Allergies
- List of Allergies: Medications, food, environmental factors, etc.
- Reactions: Description of allergic reactions.
# Immunization Record
- Vaccines Received:
- Dates of Administration
- Next Due Dates (if applicable)
# Vitals and Measurements
- Height:
- Weight:
- Blood Pressure:
- Pulse: 
- Respiratory Rate:
- Temperature:
- Body Mass Index (BMI):
# Visit/Encounter Notes
- Chief Complaint: The reason for the visit.
- History of Present Illness (HPI): Detailed description of the symptoms.
- Physical Examination: Findings from the physical exam.
- Assessment: Diagnoses based on the examination and history.
- Plan: Treatment plan, including medications, therapies, and follow-up.
# Diagnostic Tests/Results
- Lab Tests: Blood work, urinalysis, etc.
- Imaging: X-rays, MRIs, CT scans, etc.
- Specialist Reports: Reports from other healthcare providers, if applicable.
# Discharge Summary
- Final Diagnosis
- Summary of Hospital Stay
- Medications at Discharge
- Follow-up Instructions
- Referrals: If follow-up with specialists or other healthcare providers is needed.`,v="_top_robgy_1",D="_leftIcon_robgy_15",H="_submitBtn_robgy_20",V="_editorContent_robgy_37",$="_editor_robgy_37",k={top:v,leftIcon:D,submitBtn:H,editorContent:V,editor:$},w={__name:"index",setup(P){const o=p({description:""}),a=y(),c=f();g(()=>{o.description=C});const d=async(e,s)=>{await M(e,s)},m=async()=>{try{const{status:e,message:s}=await B.addMedicalHistory(a.query.appt_id,o.description);if(e===0){i.success(s),a.back(-1);return}i.error(s)}catch(e){i.error(e)}};return(e,s)=>(I(),h(b,null,[n("div",{class:t(e.$style.top)},[n("i",{class:t(["iconfont icon-zuojiantou_huaban",e.$style.leftIcon]),onClick:s[0]||(s[0]=r=>l(c).back(-1))},null,2),n("button",{class:t(e.$style.submitBtn),onClick:m},"Submit",2)],2),n("div",{class:t(e.$style.editorContent)},[_(l(R),{class:t(e.$style.editor),onOnUploadImg:d,modelValue:o.description,"onUpdate:modelValue":s[1]||(s[1]=r=>o.description=r)},null,8,["class","modelValue"])],2)],64))}},E={$style:k},z=u(w,[["__cssModules",E]]);export{z as default};
