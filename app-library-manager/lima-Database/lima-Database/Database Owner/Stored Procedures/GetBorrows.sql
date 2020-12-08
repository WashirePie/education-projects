CREATE PROCEDURE [dbo].[GetBorrows]

AS

BEGIN
	SET NOCOUNT ON;

	SELECT *
	FROM [dbo].[Borrows]
END