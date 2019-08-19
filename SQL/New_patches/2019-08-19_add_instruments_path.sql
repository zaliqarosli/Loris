SET @pathID = (SELECT ID FROM ConfigSettings WHERE Name='paths');
SET @order  = (SELECT MAX(OrderNumber) + 1 FROM ConfigSettings WHERE Parent=@pathID);
INSERT INTO ConfigSettings (Name, Description, Visible, Parent, Label, DataType, OrderNumber) VALUES ('instrument_builder', 'Path to modified instruments', 1, @pathID, 'Instrument Builder', 'text', @order + 1);
INSERT INTO Config (ConfigID, Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name='instrument_builder'), '/data/instrument_builder/');
