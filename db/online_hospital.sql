/*
 Navicat Premium Dump SQL

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 90300 (9.3.0)
 Source Host           : localhost:3306
 Source Schema         : online_hospital

 Target Server Type    : MySQL
 Target Server Version : 90300 (9.3.0)
 File Encoding         : 65001

 Date: 29/05/2025 23:17:34
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `password` varchar(200) NOT NULL,
  `role` int NOT NULL DEFAULT '3',
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `admin_id_UNIQUE` (`admin_id`),
  UNIQUE KEY `phone_UNIQUE` (`phone`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for appointment
-- ----------------------------
DROP TABLE IF EXISTS `appointment`;
CREATE TABLE `appointment` (
  `appt_id` int NOT NULL AUTO_INCREMENT,
  `doc_id` int NOT NULL,
  `doc_name` varchar(45) NOT NULL,
  `patient_id` int NOT NULL,
  `patient_name` varchar(45) NOT NULL,
  `dept_id` int NOT NULL,
  `dept_name` varchar(45) NOT NULL,
  `time` varchar(45) NOT NULL,
  `title_name` varchar(45) NOT NULL,
  `title_id` int NOT NULL,
  `fee` int NOT NULL,
  `desc` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `consult_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '问诊类型:\\\\n0--图文问诊\\\\n1--视频问诊',
  `canceled` tinyint(1) NOT NULL DEFAULT '0' COMMENT '预约是否真的去问诊了\n0--去过了或者还没去\n2--预约已被取消(到号没上线自动取消)',
  `med_hist_id` int DEFAULT NULL,
  `ps_id` int DEFAULT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`appt_id`),
  UNIQUE KEY `appt_id_UNIQUE` (`appt_id`),
  UNIQUE KEY `med_hist_id_UNIQUE` (`med_hist_id`),
  UNIQUE KEY `ps_id_UNIQUE` (`ps_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='预约';

-- ----------------------------
-- Table structure for appointment_fee
-- ----------------------------
DROP TABLE IF EXISTS `appointment_fee`;
CREATE TABLE `appointment_fee` (
  `title_id` int NOT NULL,
  `fee` int NOT NULL,
  `title_name` varchar(45) NOT NULL,
  PRIMARY KEY (`title_id`),
  UNIQUE KEY `title_UNIQUE` (`title_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='挂号收费标准';

-- ----------------------------
-- Table structure for department
-- ----------------------------
DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `dept_id` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(45) NOT NULL,
  `dept_desc` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `dept_spare` int NOT NULL DEFAULT '0' COMMENT '科室的剩余号=doc_number*15',
  `doc_number` int NOT NULL DEFAULT '0' COMMENT '科室内医生数量',
  PRIMARY KEY (`dept_id`),
  UNIQUE KEY `dept_id_UNIQUE` (`dept_id`),
  UNIQUE KEY `dept_name_UNIQUE` (`dept_name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for doctor
-- ----------------------------
DROP TABLE IF EXISTS `doctor`;
CREATE TABLE `doctor` (
  `doc_id` int NOT NULL AUTO_INCREMENT,
  `avatar` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `title_id` int NOT NULL COMMENT '职称:\\n住院医师,主治医师,副主任医师,主任医师',
  `dept_id` int NOT NULL COMMENT '科室id',
  `doc_name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `doc_spare` int NOT NULL DEFAULT '15' COMMENT '医生本日的剩余号',
  `title_name` varchar(45) NOT NULL,
  `dept_name` varchar(45) NOT NULL,
  `role` int NOT NULL DEFAULT '2',
  PRIMARY KEY (`doc_id`),
  UNIQUE KEY `doc_id_UNIQUE` (`doc_id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `phone_UNIQUE` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for drug
-- ----------------------------
DROP TABLE IF EXISTS `drug`;
CREATE TABLE `drug` (
  `drug_name` varchar(45) NOT NULL,
  `usage` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cure` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '该药物治疗的病症',
  `single_price` int NOT NULL,
  PRIMARY KEY (`drug_name`),
  UNIQUE KEY `drug_name_UNIQUE` (`drug_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='药物价格表';

-- ----------------------------
-- Table structure for img_text_consultation
-- ----------------------------
DROP TABLE IF EXISTS `img_text_consultation`;
CREATE TABLE `img_text_consultation` (
  `appt_id` int NOT NULL,
  `time` varchar(100) NOT NULL,
  `role` int NOT NULL,
  `userName` varchar(45) NOT NULL,
  `content` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='图文问诊,根据appt_id存聊天记录';

-- ----------------------------
-- Table structure for medical_history
-- ----------------------------
DROP TABLE IF EXISTS `medical_history`;
CREATE TABLE `medical_history` (
  `med_hist_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doc_id` int NOT NULL,
  `appt_id` int NOT NULL,
  `time` varchar(45) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`med_hist_id`),
  UNIQUE KEY `med_hist_id_UNIQUE` (`med_hist_id`),
  UNIQUE KEY `appt_id_UNIQUE` (`appt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='病历';

-- ----------------------------
-- Table structure for patient
-- ----------------------------
DROP TABLE IF EXISTS `patient`;
CREATE TABLE `patient` (
  `patient_id` int NOT NULL AUTO_INCREMENT COMMENT '患者id\n',
  `patient_name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL COMMENT '用于找回密码,禁止重复',
  `password` varchar(200) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `gender` tinyint(1) NOT NULL DEFAULT '1' COMMENT '患者性别:\n1 表示女性\n0 表示男性',
  `age` int NOT NULL,
  `address` varchar(45) NOT NULL,
  `role` int NOT NULL DEFAULT '1',
  `avatar` varchar(500) DEFAULT NULL COMMENT '头像,用于人脸识别,不能重复',
  PRIMARY KEY (`patient_id`),
  UNIQUE KEY `patient_id_UNIQUE` (`patient_id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `phone_number_UNIQUE` (`phone`),
  UNIQUE KEY `avatar_UNIQUE` (`avatar`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='患者信息表';

-- ----------------------------
-- Table structure for prescription
-- ----------------------------
DROP TABLE IF EXISTS `prescription`;
CREATE TABLE `prescription` (
  `ps_id` int NOT NULL AUTO_INCREMENT,
  `create_time` varchar(45) NOT NULL,
  `total_price` int NOT NULL DEFAULT '0',
  `patient_id` int NOT NULL,
  `doc_id` int NOT NULL,
  `paid` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`ps_id`),
  UNIQUE KEY `ps_id_UNIQUE` (`ps_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='处方';

-- ----------------------------
-- Table structure for prescription_drug
-- ----------------------------
DROP TABLE IF EXISTS `prescription_drug`;
CREATE TABLE `prescription_drug` (
  `ps_id` int NOT NULL,
  `drug_name` varchar(100) NOT NULL,
  `quantity` int NOT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`ps_id`,`drug_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='处方药物';

-- ----------------------------
-- Table structure for video_consultation
-- ----------------------------
DROP TABLE IF EXISTS `video_consultation`;
CREATE TABLE `video_consultation` (
  `video_id` int NOT NULL AUTO_INCREMENT,
  `appt_id` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `patient_id` int DEFAULT NULL,
  `doc_id` int DEFAULT NULL,
  `uuid` char(40) NOT NULL,
  PRIMARY KEY (`video_id`),
  UNIQUE KEY `video_id_UNIQUE` (`video_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='视频问诊';

-- ----------------------------
-- Event structure for update_appt_status
-- ----------------------------
DROP EVENT IF EXISTS `update_appt_status`;
delimiter ;;
CREATE EVENT `update_appt_status`
ON SCHEDULE
EVERY '1' DAY STARTS '2023-05-21 09:22:07'
DO BEGIN 
     UPDATE appointment
     SET status = 'Finished' ;
     
   END
;;
delimiter ;

-- ----------------------------
-- Event structure for update_dept_status
-- ----------------------------
DROP EVENT IF EXISTS `update_dept_status`;
delimiter ;;
CREATE EVENT `update_dept_status`
ON SCHEDULE
EVERY '1' DAY STARTS '2023-05-21 09:59:08'
DO BEGIN 
     UPDATE department
     SET dept_spare = doc_number * 15 ;
     
   END
;;
delimiter ;

-- ----------------------------
-- Event structure for update_doctor_status
-- ----------------------------
DROP EVENT IF EXISTS `update_doctor_status`;
delimiter ;;
CREATE EVENT `update_doctor_status`
ON SCHEDULE
EVERY '1' DAY STARTS '2023-05-21 09:59:43'
DO BEGIN 
     UPDATE doctor
     SET doc_spare = 15 ;
     
   END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
