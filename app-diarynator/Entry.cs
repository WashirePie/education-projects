using System;
using System.Collections.Generic;

namespace Diarynator
{
    [Serializable]
    public class Entry
    {
        // Initialize Properties
        public DateTime dDateOfEntry;
        public string sContent = "";
        public string sImage = "";
        public List<string> lIdentifiers = new List<string>();

        // Constructor
        public Entry(DateTime argDateOfEntry, string argContent, string argImage, List<string> argIdentifiers)
        {
            dDateOfEntry = argDateOfEntry;
            sContent = argContent;
            sImage = argImage;
            lIdentifiers = argIdentifiers;
        }
    }
}
