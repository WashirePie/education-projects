CREATE PROCEDURE [dbo].[AuthLibrarianLogin]
	@Name nvarchar(50),
	@LastName nvarchar(50),
	@Password nvarchar(MAX)
AS

BEGIN
	SET NOCOUNT ON;

	SELECT *
	FROM [dbo].[Librarian]
	WHERE ([Name] = @Name AND [LastName] = @LastName AND [Password] = @Password);
END