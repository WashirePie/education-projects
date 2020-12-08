CREATE PROCEDURE [dbo].[GetCustomer]
	@PKey_Customer int
AS

BEGIN
	SET NOCOUNT ON;

	SELECT *
	FROM [dbo].[Customer]
	WHERE [PKey] = @PKey_Customer
END