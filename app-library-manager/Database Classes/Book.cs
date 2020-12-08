using System;

namespace LIMAFrontEnd
{
    class Book
    {
        #region Database Table Properties
        public int PKey { get; set; }
        public string Category { get; set; }
        public string Title { get; set; }
        public string ImageLink { get; set; }
        public int Stock { get; set; }
        public string StorageLocation { get; set; }
        public int PageCount { get; set; }
        public string ISBN { get; set; }
        public string Author { get; set; }
        public string Publisher { get; set; }
        public DateTime Published { get; set; }
        #endregion

        #region Frontend Properties
        public string AsString
        {
            get
            {
                return $"{Title}\n" +
                       $"{Author}\n" +
                       $"Stock {Stock}\n" +
                       $"ISBN {ISBN}\n" +
                       $"Storage Location {StorageLocation}\n";
            }
        }
        #endregion
    }
}
