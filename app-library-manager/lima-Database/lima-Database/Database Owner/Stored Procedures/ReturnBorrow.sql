CREATE PROCEDURE [dbo].[ReturnBorrow]
	@PKey int
AS

BEGIN
	SET NOCOUNT ON;

	DECLARE @Returned BIT

	--Get the current 'Returned' state of the Column to be updated
	SELECT @Returned = Returned
	FROM [Borrows] WHERE PKey = @PKey

	--Only update if 'Returned' is currently FALSE
	IF (@Returned = 0)
	BEGIN
		UPDATE [dbo].[Borrows]
		SET Returned = 1
		WHERE PKey = @PKey;
	END

END