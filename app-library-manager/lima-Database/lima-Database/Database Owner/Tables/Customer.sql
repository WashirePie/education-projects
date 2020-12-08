CREATE TABLE [dbo].[Customer]
(
	[PKey] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Name] NVARCHAR(50) NOT NULL, 
    [LastName] NVARCHAR(50) NOT NULL, 
    [StreetName] NVARCHAR(50) NOT NULL, 
    [ZipCode] INT NOT NULL, 
    [City] NVARCHAR(50) NOT NULL, 
    [Email] NVARCHAR(50) NULL, 
    [Phone] NVARCHAR(50) NOT NULL, 
    [Password] NVARCHAR(MAX) NOT NULL
)
