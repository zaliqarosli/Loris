CREATE TABLE `instrument_builder` (
`InstrumentBuilderID` integer unsigned NOT NULL AUTO_INCREMENT,
`Name` varchar(255) NOT NULL,
`Description` varchar(255) NOT NULL,
`DateUpdated` datetime NOT NULL DEFAULT NOW(),
`UsersID` int(10) unsigned NOT NULL,
`SchemaJSON` TEXT NOT NULL,
CONSTRAINT `PK_instrument_builder` PRIMARY KEY (`Name`),
CONSTRAINT `UK_instrument_builder_InstrumentBuilderID` UNIQUE KEY `InstrumentBuilderID` (`InstrumentBuilderID`),
CONSTRAINT `FK_instrument_builder_UsersID` FOREIGN KEY (`UsersID`) REFERENCES `users` (`ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
