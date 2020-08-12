SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `help`;
LOCK TABLES `help` WRITE;
INSERT INTO `help` (`helpID`, `parentID`, `hash`, `topic`, `content`, `created`, `updated`) VALUES (123,12,'hash','BMI Instructions','The BMI calculator instrument can calculate the BMI and BMI Classification of a visitor. The two required fields for this instrument are the Date of Administration of the instrument and the Examiner name. The height and weight of the visitor must then be entered in either standard or metric units. The instrument will not accept an entry where the height and weight are given in both units. After this information is given, the instrument will calculate the BMI and BMI Classification of the visitor.',NULL,NULL);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
