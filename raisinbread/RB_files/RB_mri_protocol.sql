SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `mri_protocol`;
LOCK TABLES `mri_protocol` WRITE;
INSERT INTO `mri_protocol` (`ID`, `Center_name`, `ScannerID`, `Scan_type`, `TR_min`, `TR_max`, `TE_min`, `TE_max`, `TI_min`, `TI_max`, `slice_thickness_min`, `slice_thickness_max`, `xspace_min`, `xspace_max`, `yspace_min`, `yspace_max`, `zspace_min`, `zspace_max`, `xstep_min`, `xstep_max`, `ystep_min`, `ystep_max`, `zstep_min`, `zstep_max`, `time_min`, `time_max`, `series_description_regex`) VALUES (1000,'ZZZZ',9,48,8000.0000,14000.0000,80.0000,130.0000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,200,NULL);
INSERT INTO `mri_protocol` (`ID`, `Center_name`, `ScannerID`, `Scan_type`, `TR_min`, `TR_max`, `TE_min`, `TE_max`, `TI_min`, `TI_max`, `slice_thickness_min`, `slice_thickness_max`, `xspace_min`, `xspace_max`, `yspace_min`, `yspace_max`, `zspace_min`, `zspace_max`, `xstep_min`, `xstep_max`, `ystep_min`, `ystep_max`, `zstep_min`, `zstep_max`, `time_min`, `time_max`, `series_description_regex`) VALUES (1001,'ZZZZ',9,40,1900.0000,2700.0000,10.0000,30.0000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,500,NULL);
INSERT INTO `mri_protocol` (`ID`, `Center_name`, `ScannerID`, `Scan_type`, `TR_min`, `TR_max`, `TE_min`, `TE_max`, `TI_min`, `TI_max`, `slice_thickness_min`, `slice_thickness_max`, `xspace_min`, `xspace_max`, `yspace_min`, `yspace_max`, `zspace_min`, `zspace_max`, `xstep_min`, `xstep_max`, `ystep_min`, `ystep_max`, `zstep_min`, `zstep_max`, `time_min`, `time_max`, `series_description_regex`) VALUES (1002,'ZZZZ',9,44,2000.0000,2500.0000,2.0000,5.0000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO `mri_protocol` (`ID`, `Center_name`, `ScannerID`, `Scan_type`, `TR_min`, `TR_max`, `TE_min`, `TE_max`, `TI_min`, `TI_max`, `slice_thickness_min`, `slice_thickness_max`, `xspace_min`, `xspace_max`, `yspace_min`, `yspace_max`, `zspace_min`, `zspace_max`, `xstep_min`, `xstep_max`, `ystep_min`, `ystep_max`, `zstep_min`, `zstep_max`, `time_min`, `time_max`, `series_description_regex`) VALUES (1003,'ZZZZ',9,45,3000.0000,9000.0000,100.0000,550.0000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;