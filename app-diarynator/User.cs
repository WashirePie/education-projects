using System;
using System.Collections.Generic;

namespace Diarynator
{
    [Serializable]
    public class User
    {
        // Initialize Propertiers
        public string sUsername = "";
        public string sPassword = "";
        public List<Entry> lEntries = new List<Entry>();

        // Constructor
        public User(string argUsername, string argPassword)
        {
            sUsername = argUsername;
            sPassword = argPassword;
        }

        // Methods

        // Method: Check Password
        public bool CheckPassword(string argPassword)
        {
            return argPassword == this.sPassword ? true : false;
        }

        // Method: Check Username
        public bool CheckUsername(string argUsername)
        {
            return argUsername == this.sUsername ? true : false;
        }

        // Method: Get next available Date from specified Date
        public DateTime GetNextAvailableDate(DateTime argAvailable)
        {
            foreach (Entry oEntry in this.lEntries)
            {
                if (argAvailable.Date == oEntry.dDateOfEntry.Date)
                {
                    return this.GetNextAvailableDate(argAvailable.AddDays(1));
                }
            }

            return argAvailable;
        }

        // Method: Get all Entries which contains the specified Identifier
        public List<Entry> GetFilteredEntries(string sFilterString)
        {
            // Create List of Entries to return
            List<Entry> lFilteredEntries = new List<Entry>();

            // If sFilterString is empty, return all Entries
            if (sFilterString == "")
            {
                lFilteredEntries = this.lEntries;
            }
            else
            {
                // Create String List from Input String. Must be delimited with ','
                List<string> lFilters = new List<string>(sFilterString.Split(','));

                // Trim leading & trailing Whitespace of Filters
                for (int i = 0; i < lFilters.Count; i++)
                {
                    lFilters[i] = lFilters[i].Trim();
                }

                // Add Entries which contain the Filter to the return List. 
                foreach (Entry oEntry in this.lEntries)
                {
                    // Loop over each Identifier of the Entry
                    foreach (string sIdentifier in oEntry.lIdentifiers)
                    {
                        // Check Identifier with each Filter
                        foreach (string sFilter in lFilters)
                        {
                            if (sIdentifier.IndexOf(sFilter, StringComparison.OrdinalIgnoreCase) >= 1)
                            {
                                // Only Add if it doesn't exist in the List already. Otherwise, if multiple Filters match, the Entry would be multiple times in the list
                                if (!lFilteredEntries.Contains(oEntry))
                                {
                                    lFilteredEntries.Add(oEntry);
                                }
                            }
                        }
                    }
                }
            }

            // Sort List: Date descending
            lFilteredEntries.Sort((x, y) => y.dDateOfEntry.CompareTo(x.dDateOfEntry));

            return lFilteredEntries;
        }
    }
}
