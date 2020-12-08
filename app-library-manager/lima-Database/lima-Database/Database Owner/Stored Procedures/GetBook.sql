CREATE PROCEDURE [dbo].[GetBook]
	@PKey_Book int
AS

BEGIN
	SET NOCOUNT ON;

	SELECT *
	FROM [dbo].[Book]
	WHERE [PKey] = @PKey_Book
END
