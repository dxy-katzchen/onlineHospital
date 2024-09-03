import{_ as x,y as z,u as E,g as m,K as I,h as M,E as n,i as U,b as u,n as i,d as b,e as a,w as o,F as B,r as c,o as N,f as $,P as F}from"./index-CvmFJ_Ff.js";import{a as d}from"./index-DUccw6c8.js";const R="_ps_jq4mc_1",S="_drugList_jq4mc_7",A="_leftIcon_jq4mc_10",K="_drugTitle_jq4mc_18",O="_psList_jq4mc_25",Q="_psTitle_jq4mc_34",G={ps:R,drugList:S,leftIcon:A,drugTitle:K,psList:O,psTitle:Q},H={__name:"index",setup(W){const q=z(),D=E(),p=m(4),w=m([]),v=m([]),{appt_id:C}=q.query,_=m(""),T=I(()=>w.value.filter(t=>!_.value||t.drug_name.toLowerCase().includes(_.value.toLowerCase())));M(async()=>{await k(),await V(),await y()});const k=async()=>{try{const{ps_id:t,status:s,message:e}=await d.createPs(C);if(s===0){n.success(e),p.value=t;return}n.error(e)}catch(t){n.error(t)}},P=async(t,s)=>{try{const{status:e,message:l}=await d.deleteDrugPs(p.value,s.drug_name);if(e===0){n.success(l),await y();return}n.error(l)}catch(e){n.error(e)}},L=async(t,s)=>{s.added=!0;try{const{status:e,message:l}=await d.addDrugToPs(p.value,s.drug_name,s.quantity);if(e===0){n.success(l),await y();return}n.error(l)}catch(e){n.error(e)}},y=async()=>{try{const{drugList:t,status:s,message:e}=await d.getPsDetail(p.value);if(s===0){v.value=t;return}n.error(e)}catch(t){n.error(t)}},V=async()=>{try{const{data:t,status:s,message:e}=await d.getDrugList();if(s===0){t.forEach(l=>{l.quantity=1,l.added=!1}),w.value=t;return}n.error(e)}catch(t){n.error(t)}};return(t,s)=>{const e=c("el-table-column"),l=c("el-input-number"),j=c("el-input"),f=c("el-button"),h=c("el-table");return N(),U(B,null,[u("div",{class:i(t.$style.ps)},[u("div",{class:i(t.$style.drugList)},[u("i",{class:i(["iconfont icon-zuojiantou_huaban",t.$style.leftIcon]),onClick:s[0]||(s[0]=r=>b(D).back(-1))},null,2),u("span",{class:i(t.$style.drugTitle)}," Drug List ",2),a(h,{data:b(T),border:"","max-height":"500"},{default:o(()=>[a(e,{prop:"drug_name",label:"drug name",align:"center"}),a(e,{prop:"usage",label:"usage"}),a(e,{prop:"cure",label:"treatments"}),a(e,{prop:"single_price",label:"unit price",width:"100",align:"center"}),a(e,{label:"quantity",align:"center"},{default:o(r=>[a(l,{modelValue:r.row.quantity,"onUpdate:modelValue":g=>r.row.quantity=g,step:1,min:1,"step-strictly":""},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),a(e,{align:"center"},{header:o(()=>[a(j,{modelValue:_.value,"onUpdate:modelValue":s[1]||(s[1]=r=>_.value=r),placeholder:"Search for drug name"},null,8,["modelValue"])]),default:o(r=>[a(f,{onClick:g=>L(r.$index,r.row),type:"success",disabled:r.row.added},{default:o(()=>[$("Add")]),_:2},1032,["onClick","disabled"]),a(f,{onClick:g=>L(r.$index,r.row),type:"warning",disabled:!r.row.added},{default:o(()=>[$("Update")]),_:2},1032,["onClick","disabled"])]),_:1})]),_:1},8,["data"])],2)],2),u("div",{class:i(t.$style.psList)},[u("span",{class:i(t.$style.psTitle)}," prescription ",2),a(h,{data:v.value,"max-height":"200",size:"small"},{default:o(()=>[a(e,{prop:"drug_name",label:"Drug name",align:"center"}),a(e,{prop:"quantity",label:"Quantity",align:"center"}),a(e,{prop:"price",label:"Subtotal",align:"center"}),a(e,{label:"Operation",align:"center"},{default:o(r=>[a(f,{size:"small",type:"danger",icon:b(F),circle:"",onClick:g=>P(r.$index,r.row)},null,8,["icon","onClick"])]),_:1})]),_:1},8,["data"])],2)],64)}}},J={$style:G},Z=x(H,[["__cssModules",J]]);export{Z as default};