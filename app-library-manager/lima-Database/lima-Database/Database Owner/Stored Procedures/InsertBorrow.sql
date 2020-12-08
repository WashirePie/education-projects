CREATE PROCEDURE [dbo].[InsertBorrow]
	@DateOfBorrow datetime,
	@DateOfReturn datetime,
	@FKey_Book int,
	@FKey_Customer int,
	@Returned bit
AS

BEGIN
	SET NOCOUNT ON;
	
	INSERT INTO [dbo].[Borrows]	([DateOfBorrow], [DateOfReturn], [FKey_Book], [FKey_Customer], [Returned]) 
	VALUES (@DateOfBorrow, @DateOfReturn, @FKey_Book, @FKey_Customer, @Returned);
END