CREATE TRIGGER [dbo].[OnCreateBorrow] ON [dbo].[Borrows]
	FOR INSERT
AS

BEGIN
	SET NOCOUNT ON
	DECLARE @FKey_BorrowedBook INT

	SELECT @FKey_BorrowedBook = INSERTED.FKey_Book
	FROM INSERTED

	--Decrease Stock Count of borrowed Book
	UPDATE [dbo].[Book]
	SET Stock = Stock - 1
	WHERE PKey = @FKey_BorrowedBook;
END
