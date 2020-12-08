CREATE TABLE [dbo].[Borrows]
(
	[PKey] INT NOT NULL PRIMARY KEY IDENTITY, 
    [FKey_Book] INT NOT NULL, 
    [FKey_Customer] INT NOT NULL, 
    [DateOfBorrow] DATETIME NOT NULL, 
    [DateOfReturn] DATETIME NOT NULL, 
    [Returned] BIT NOT NULL, 
    CONSTRAINT [FK_Borrows_Book] FOREIGN KEY ([FKey_Book]) REFERENCES [Book]([PKey]), 
    CONSTRAINT [FK_Borrows_Customer] FOREIGN KEY ([FKey_Customer]) REFERENCES [Customer]([PKey])
)
