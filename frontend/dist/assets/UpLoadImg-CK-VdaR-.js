import{u as t}from"./index-9kvZAmIG.js";const o=async(e,r)=>{const s=await Promise.all(e.map(async a=>await t(a)));r(s.map(a=>{switch(a.data.code){case"success":return a.data.data.url;case"image_repeated":return a.data.images;default:ElMessage.error("上传失败");break}}))};export{o as U};