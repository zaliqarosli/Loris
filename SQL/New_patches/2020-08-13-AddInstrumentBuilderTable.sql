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

INSERT INTO `instrument_builder` (`Name`, `Description`, `UsersID`, `SchemaJSON`) VALUES
  ('activity1_embed', 'Activity example 1', (SELECT ID FROM users WHERE UserID='admin'),
  '{
    "@context": "../../releases/1.0.0-rc1/generic",
    "@type": "reproschema:Activity",
    "@id": "activity1.jsonld",
    "prefLabel": "Example 1",
    "description": "Activity example 1",
    "schemaVersion": "1.0.0-rc1",
    "version": "0.0.1",
    "citation": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1495268/",
    "preamble": {
        "en": "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
        "es": "Durante las últimas 2 semanas, ¿con qué frecuencia le han molestado los siguintes problemas?"
    },
    "ui": {
        "addProperties": [
            {   "isAbout": "items/item1.jsonld",
                "variableName": "item1",
                "requiredValue": true,
                "isVis": true}
        ],
        "order": [
            {
                "@type": "reproschema:Field",
                "@id": "items/item1.jsonld",
                "prefLabel": "item1",
                "description": "Q1 of example 1",
                "schemaVersion": "1.0.0-rc1",
                "version": "0.0.1",
                "question": {
                    "en": "Little interest or pleasure in doing things",
                    "es": "Poco interés o placer en hacer cosas"
                },
                "ui": {
                    "inputType": "radio"
                },
                "responseOptions": {
                    "valueType": "xsd:integer",
                    "minValue": 0,
                    "maxValue": 3,
                    "multipleChoice": false,
                    "choices": [
                        {
                            "name": {
                                "en": "Not at all",
                                "es": "Para nada"
                            },
                            "value": 0
                        },
                        {
                            "name": {
                                "en": "Several days",
                                "es": "Varios días"
                            },
                            "value": 1
                        },
                        {
                            "name": {
                                "en": "More than half the days",
                                "es": "Más de la mitad de los días"
                            },
                            "value": 2
                        },
                        {
                            "name": {
                                "en": "Nearly everyday",
                                "es": "Casi todos los días"
                            },
                            "value": 3
                        }
                    ]
                }
            }
        ],
        "shuffle": false
    }
}');
