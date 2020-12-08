CREATE TRIGGER [dbo].[OnReturnBorrow] ON [dbo].[Borrows]
	AFTER UPDATE
AS

BEGIN
	SET NOCOUNT ON;

	-- Check if the 'Returned' Column was Updated
	IF UPDATE(Returned)
	BEGIN

		DECLARE @Returned BIT

		SELECT @Returned = INSERTED.Returned
		FROM INSERTED

		--Check if the 'Returned' Column is now TRUE
		IF (@Returned = 1)
		BEGIN
			DECLARE @FKey_BorrowedBook INT

			SELECT @FKey_BorrowedBook = INSERTED.FKey_Book
			FROM INSERTED

			--Increment the Stock Count of the Returned Book
			UPDATE [dbo].[Book]
			SET Stock = Stock + 1
			WHERE PKey = @FKey_BorrowedBook;
		END

	END
END
