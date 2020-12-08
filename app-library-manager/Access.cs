using Dapper;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security;
using System.Security.Cryptography;
using System.Text;

namespace LIMAFrontEnd
{
    abstract class Helper
    {
        public static string GetConnectionString()
        {
            return Properties.Resources.ConnectionString;
        }

        public static string GetDummyDataFilePath()
        {
            return Properties.Resources.DummyDataJsonPath;
        }

        public static string GetVersion()
        {
            Assembly _Assembly = Assembly.GetExecutingAssembly();
            FileVersionInfo _FileVersionInfo = FileVersionInfo.GetVersionInfo(_Assembly.Location);
            return $"lima version {_FileVersionInfo.ProductVersion} - © {DateTime.Now.Year}";
        }
    }

    abstract class Access
    {
        public static dynamic Auth(string Name, string LastName, SecureString Password)
        {
            dynamic _User;
            string Uid = $"{Name}.{LastName}";

            using (IDbConnection Connection = new SqlConnection(Helper.GetConnectionString()))
            {
                using (SHA256 Hash = SHA256Managed.Create())
                {
                    // Convert SecureString
                    // Unsafe from here on, a better implementation would be https://stackoverflow.com/a/25190648
                    string PlainTextPassword;

                    IntPtr Ptr = IntPtr.Zero;
                    try
                    {
                        Ptr = Marshal.SecureStringToGlobalAllocUnicode(Password);
                        PlainTextPassword = Marshal.PtrToStringUni(Ptr);
                    }
                    finally
                    {
                        Marshal.ZeroFreeGlobalAllocUnicode(Ptr);
                    }

                    // Hash Password + Uid
                    // User Uid as 'salt'. If people have equal pw's, the hash will be different
                    StringBuilder PasswordHash = new StringBuilder();

                    Encoding Enc = Encoding.UTF8;
                    string Input = PlainTextPassword + Uid;
                    byte[] Result = Hash.ComputeHash(Enc.GetBytes(Input));
                    foreach (byte b in Result) PasswordHash.Append(b.ToString("x2"));

                    // Run Stored Procedure: Check if a Librarian with the supplied Data exists
                    var LResponses = Connection.Query<Librarian>($"dbo.AuthLibrarianLogin @Name, @LastName, @Password", new { Name, LastName, Password = PasswordHash.ToString() });

                    if (LResponses.Count() == 1)
                    {
                        _User = LResponses.ToList()[0];
                        PasswordHash.Clear();
                        return _User;
                    }
                    else if (LResponses.Count() > 1)
                    {
                        PasswordHash.Clear();
                        throw new Exception("More than one valid Librarian returned! Data integrity is compromised!");
                    }

                    // Run Stored Procedure: Check if a Librarian with the supplied Data exists
                    var CResponses = Connection.Query<Customer>("dbo.AuthCustomerLogin @Name, @LastName, @Password", new { Name, LastName, Password = PasswordHash.ToString() });

                    if (CResponses.Count() == 1)
                    {
                        _User = CResponses.ToList()[0];
                        PasswordHash.Clear();
                        return _User;
                    }
                    else if (CResponses.Count() > 1)
                    {
                        PasswordHash.Clear();
                        throw new Exception("More than one valid Customer returned! Data integrity is compromised!");
                    }
                    else
                    {
                        // Write Hash to Trace
                        Trace.WriteLine($"Uid: {Uid} with pw: {PlainTextPassword} hashes to \n{PasswordHash.ToString()}");
                        return null;
                    }

                }
            }
        }

        public static ObservableCollection<object> GetBorrows()
        {
            ObservableCollection<object> Return = new ObservableCollection<object>();
            using (IDbConnection Connection = new SqlConnection(Helper.GetConnectionString()))
            {
                List<Borrow> Borrows = Connection.Query<Borrow>($"dbo.GetBorrows").ToList();

                Borrows.ForEach(_Borrow =>
                {
                    // Get the referenced Book & Customer
                    int PKey_Book = _Borrow.FKey_Book;
                    int PKey_Customer = _Borrow.FKey_Customer;

                    Book _Book = Connection.Query<Book>($"dbo.GetBook @PKey_Book", new { PKey_Book }).ToList()[0];
                    Customer _Customer = Connection.Query<Customer>($"dbo.GetCustomer @PKey_Customer", new { PKey_Customer }).ToList()[0];

                    Return.Add(new
                    {
                        _Borrow,
                        _Book,
                        _Customer
                    });
                });

                return Return;
            }
        }

        public static ObservableCollection<object> GetCustomerBorrows(int CustomerPKey)
        {
            int FKey_Customer = CustomerPKey;
            ObservableCollection<object> Return = new ObservableCollection<object>();
            using (IDbConnection Connection = new SqlConnection(Helper.GetConnectionString()))
            {
                List<Borrow> Borrows = Connection.Query<Borrow>($"dbo.GetCustomerBorrows @FKey_Customer", new { FKey_Customer }).ToList();

                Borrows.ForEach(_Borrow =>
                {
                    int PKey_Book = _Borrow.FKey_Book;
                    Book _Book = Connection.Query<Book>($"dbo.GetBook @PKey_Book", new { PKey_Book }).ToList()[0];
                    Return.Add(new
                    {
                        _Borrow,
                        _Book
                    });
                });

                return Return;
            }
        }

        public static ObservableCollection<Book> GetBooks()
        {
            using (IDbConnection Connection = new SqlConnection(Helper.GetConnectionString()))
            {
                return new ObservableCollection<Book>(Connection.Query<Book>($"dbo.GetBooks"));
            }
        }

        public static ObservableCollection<Customer> GetCustomers()
        {
            using (IDbConnection Connection = new SqlConnection(Helper.GetConnectionString()))
            {
                return new ObservableCollection<Customer>(Connection.Query<Customer>($"dbo.GetCustomers"));
            }
        }

        public static bool InsertBorrow(object _Borrow)
        {
            using (IDbConnection Connection = new SqlConnection(Helper.GetConnectionString()))
            {
                try
                {
                    Connection.Query($"dbo.InsertBorrow @DateOfBorrow, @DateOfReturn, @FKey_Book, @FKey_Customer, @Returned", _Borrow);
                    return true;
                }
                catch
                {
                    return false;
                }
            }
        }

        public static bool ReturnBorrow(object _Borrow)
        {
            using (IDbConnection Connection = new SqlConnection(Helper.GetConnectionString()))
            {
                try
                {
                    Connection.Query($"dbo.ReturnBorrow @PKey", _Borrow);
                    return true;
                }
                catch
                {
                    return false;
                }
            }
        }
    }
}
