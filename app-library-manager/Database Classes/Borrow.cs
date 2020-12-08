using System;

namespace LIMAFrontEnd
{
    class Borrow
    {
        #region Database Table Properties
        public int PKey { get; set; }
        public int FKey_Book { get; set; }
        public int FKey_Customer { get; set; }
        public DateTime DateOfBorrow { get; set; }
        public DateTime DateOfReturn { get; set; }
        public bool Returned { get; set; }
        #endregion

        #region Frontend Properties
        public string State
        {
            get
            {
                if (Returned)
                {
                    return BorrowStates.IsReturned;
                }
                else if (DateTime.Now > DateOfReturn)
                {
                    return BorrowStates.IsOverdue;
                }
                else
                {
                    return BorrowStates.IsOpen;
                }
            }
        }

        public string AsString
        {
            get
            {
                return $"Borrowed {DateOfBorrow.ToString()}\n" +
                       $"Due on   {DateOfReturn.ToString()}\n" +
                       $"{State}\n" +
                       $"ID {PKey}\n";
            }
        }
        #endregion
    }

    /// <summary>
    /// This static class is used to have a constant way of accessing the Borrow states
    /// </summary>
    public static class BorrowStates
    {
        public static string IsOverdue = "Overdue";
        public static string IsOpen = "Open";
        public static string IsReturned = "Returned";
    }
}
