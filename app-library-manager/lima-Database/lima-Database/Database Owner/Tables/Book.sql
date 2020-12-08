CREATE TABLE [dbo].[Book]
(
	[PKey] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Category] NVARCHAR(50) NOT NULL, 
    [Title] NVARCHAR(MAX) NOT NULL, 
    [ImageLink] NVARCHAR(50) NULL, 
    [Stock] INT NOT NULL, 
    [StorageLocation] NVARCHAR(50) NOT NULL, 
    [PageCount] INT NOT NULL, 
    [ISBN] NVARCHAR(50) NOT NULL, 
    [Publisher] NVARCHAR(50) NOT NULL, 
    [Author] NVARCHAR(50) NOT NULL, 
    [Published] DATE NOT NULL
)

GO
