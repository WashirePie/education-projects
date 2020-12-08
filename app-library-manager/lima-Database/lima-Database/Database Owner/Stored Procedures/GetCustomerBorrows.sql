CREATE PROCEDURE [dbo].[GetCustomerBorrows]
	@FKey_Customer int
AS

BEGIN
	SET NOCOUNT ON;

	SELECT *
	FROM [dbo].[Borrows]
	WHERE [FKey_Customer] = @FKey_Customer
END