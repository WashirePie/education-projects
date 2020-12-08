CREATE PROCEDURE [dbo].[GetCustomers]
AS

BEGIN
	SET NOCOUNT ON;

	SELECT *
	FROM [dbo].[Customer]
END