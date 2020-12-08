namespace LIMAFrontEnd
{
    class Customer
    {
        #region Database Table Properties
        public int PKey { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string StreetName { get; set; }
        public int ZipCode { get; set; }
        public string City { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        #endregion

        #region Frontend Properties
        public string FullName
        {
            get
            {
                return $"{Name} {LastName}";
            }
        }

        public string AsString
        {
            get
            {
                return $"{FullName}\n" +
                       $"{StreetName}\n" +
                       $"{Email}\n" +
                       $"{Phone}\n" +
                       $"{ZipCode.ToString()} {City}\n";
            }
        }
        #endregion

    }
}
