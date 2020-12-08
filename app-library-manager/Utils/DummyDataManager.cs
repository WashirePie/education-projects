using Dapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;

namespace LIMAFrontEnd
{
    static class DummyDataManager
    {
        public static int Generate()
        {
            int Errors = 0;
            Root DummyData = JsonConvert.DeserializeObject<Root>(System.IO.File.ReadAllText(Helper.GetDummyDataFilePath()));

            using (IDbConnection Connection = new SqlConnection(Helper.GetConnectionString()))
            {
                // Disable Triggers
                Connection.Execute("DISABLE TRIGGER ALL ON [dbo].[Borrows]");

                // Insert Dummy Customers 
                string insertQuery = @"SET IDENTITY_INSERT [dbo].[Customer] ON;
                                       INSERT INTO [dbo].[Customer]([PKey], [Name], [LastName], [StreetName], [ZipCode], [City], [Email], [Phone], [Password]) 
                                                            VALUES (@PKey,  @Name,  @LastName,  @StreetName,  @ZipCode,  @City,  @Email,  @Phone,  @Password)";
                DummyData.Customers.ForEach(C =>
                {
                    try { var result = Connection.Execute(insertQuery, C); }
                    catch (Exception e) { Trace.WriteLine(e.Message); Errors++; }
                });

                // Insert Dummy Librarians
                insertQuery = @"SET IDENTITY_INSERT [dbo].[Librarian] ON;
                                INSERT INTO [dbo].[Librarian]([PKey], [Name], [LastName], [Abbrev], [Password]) 
                                                      VALUES (@PKey,  @Name,  @LastName,  @Abbrev,  @Password)";
                DummyData.Librarians.ForEach(L =>
                {
                    try { var result = Connection.Execute(insertQuery, L); }
                    catch (Exception e) { Trace.WriteLine(e.Message); Errors++; }
                });

                // Insert Dummy Books 
                insertQuery = @"SET IDENTITY_INSERT [dbo].[Book] ON;
                                INSERT INTO [dbo].[Book]([PKey], [Category], [Title], [ImageLink], [Stock], [StorageLocation], [PageCount], [ISBN], [Author], [Publisher], [Published]) 
                                                 VALUES (@PKey,  @Category,  @Title,  @ImageLink,  @Stock,  @StorageLocation,  @PageCount,  @ISBN , @Author,  @Publisher,  @Published)";
                DummyData.Books.ForEach(B =>
                {
                    try { var result = Connection.Execute(insertQuery, B); }
                    catch (Exception e) { Trace.WriteLine(e.Message); Errors++; }
                });

                // Insert Dummy Borrows 
                insertQuery = @"SET IDENTITY_INSERT [dbo].[Borrows] ON;
                                INSERT INTO [dbo].[Borrows]([PKey], [FKey_Book], [FKey_Customer], [DateOfBorrow], [DateOfReturn], [Returned]) 
                                                    VALUES (@PKey,  @FKey_Book,  @FKey_Customer,  @DateOfBorrow,  @DateOfReturn,  @Returned)";
                DummyData.Borrows.ForEach(B =>
                {
                    try { var result = Connection.Execute(insertQuery, B); }
                    catch (Exception e) { Trace.WriteLine(e.Message); Errors++; }
                });


                // Enable Triggers
                Connection.Execute("ENABLE TRIGGER ALL ON [dbo].[Borrows]");
            }

            return Errors;
        }

        public static int DeleteAll()
        {
            int Errors = 0;
            List<string> Tables = new List<string> { "Book", "Borrows", "Librarian", "Customer" };

            using (IDbConnection Connection = new SqlConnection(Helper.GetConnectionString()))
            {
                Tables.ForEach(Table =>
                {
                    string Query = $"TRUNCATE TABLE {Table}";
                    try { var result = Connection.Execute(Query); }
                    catch (Exception e) { Trace.WriteLine(e.Message); Errors++; }
                });
            }

            return Errors;
        }
    }

    /// <summary>
    /// Dummy Class for Deserialized JSON Data
    /// </summary>
    class Root
    {
        public List<Book> Books { get; set; }
        public List<Customer> Customers { get; set; }
        public List<Borrow> Borrows { get; set; }
        public List<Librarian> Librarians { get; set; }
    }
}
