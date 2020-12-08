using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using Terminal.Gui;

namespace Diarynator
{
    // Global Variables
    public static class Globals
    {
        // Properties
        public static Toplevel oTop;
        public static Window oWindow;
        public static MenuBar oMenuBar;
        public static User oActiveUser;
        public static List<User> lUsers;
        public static string sDatabase;
        public static string sPath;
        public static List<Entry> lFilteredEntries;

        public const int MAX_USERNAME_LENGTH = 20;
        public const int MAX_IDENTIFIER_LENGTH = 14;
        public const int MAX_CONTENT_COL_LENGTH = 50;
        public const int MAX_ENTRIES_PER_PAGE = 20;
        public const int MAX_IMAGE_SIZE = 60;

        // If true, enables Debuge mode. Adds Test Entries for Pagination testing and additional Debug logging
        public const bool xDebugMode = false;

        // Constructor
        static Globals()
        {
            oActiveUser = null;
            lUsers = new List<User>();
            sDatabase = @"\diarynatorDatabase.bin";
            sPath = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
            lFilteredEntries = new List<Entry>();
        }
    }

    class Program
    {
        // Main Entry Point
        static void Main(string[] args)
        {
            // If persistent Data exists, load it back. Otherwise create dummy Data
            if (File.Exists(Globals.sPath + Globals.sDatabase))
            {
                Globals.lUsers = ReadData(Globals.sPath + Globals.sDatabase);
            }
            else
            {
                MakeDummyData();
            }

            // Set Console Size
            Console.SetWindowSize(78, 38);

            // Create GUI Instance
            Application.Init();

            Globals.oTop = Application.Top;

            Globals.oWindow = new Window(new Rect(0, 1, Globals.oTop.Frame.Width, Globals.oTop.Frame.Height - 1), "Diarynator");
            Globals.oTop.Add(Globals.oWindow);

            Globals.oMenuBar = new MenuBar(new MenuBarItem[] { });
            Globals.oTop.Add(Globals.oMenuBar);

            // Load LoginScreen
            new LoginView();

            // Run 
            Application.Run();
        }

        // Methods

        // Method: Write (Serialize) Data persistently 
        public static void WriteData(List<User> lUsers, string sPath)
        {
            // Write: Create ByteStream 
            BinaryFormatter fBinW = new BinaryFormatter();
            using (FileStream fs = new FileStream(sPath, FileMode.Create))
            {
                // Write List to Binary Stream 
                fBinW.Serialize(fs, lUsers);
            }
        }

        // Method: Read (Deserialize) persistent Data
        public static List<User> ReadData(string sPath)
        {
            // Read: Create ByteStream
            BinaryFormatter fBinR = new BinaryFormatter();
            using (FileStream fs = new FileStream(sPath, FileMode.Open))
            {
                // Read List from Binary Stream. Cast as List of Users
                return fBinR.Deserialize(fs) as List<User>;
            }
        }

        // Method: Create a dummy Dataset
        public static void MakeDummyData()
        {
            // Add Dummy Users
            User oMax = new User("Max", "12345");
            User oBob = new User("Bob", "54321");
            User oJim = new User("Jim", "abcde");

            Globals.lUsers.Add(oMax);
            Globals.lUsers.Add(oBob);
            Globals.lUsers.Add(oJim);

            // Create Dummy Entries
            List<string> lDummies = new List<string>();
            lDummies.Add("Heute war ich Autofahren. Also, ich war nicht am Steuer. " +
                         "Sondern meine Mama. Meine Mama fährt sehr gut Auto. " +
                          "Ich fahre gerne Auto");

            lDummies.Add("Heute war ich Baden. Ich <3 baden. Baden ist das Beste. " +
                         "Die Badi Steffisburg ist die beste Badi auf der Welt");

            lDummies.Add("Heute war ein schlechter Tag. Nicht nur das Gewitter, " + 
                         "ich wurde von einem Auto überfahren. Es tut immernoch weh.");

            lDummies.Add("Dies ist der Tag an dem ich zum ersten mal Fahrrad gefahren bin. " + 
                         "Obwohl ich bereits 54 Jahre alt bin ist dies mein erster " + 
                         "Versuch auf so einem Gerät");

            lDummies.Add("Heute bin ich zum 2. mal Fahrrad gefahren. Ich muss sagen, " + 
                         "ich habe mein grösstes Hobby entdeckt. Freude herrscht!");

            lDummies.Add("Heute ist Heiligabend. Da ich alleine bin, verbringe ich " + 
                         "meine Zeit an meinem geliebten Commodore64. Das Gerät ist seit heute " + 
                         "offiziell Teil meiner Familie. Nun sind wir zu Zweit");

            // Add Linebreaks at the maximum allowed content length
            for (int i = 0; i < lDummies.Count; i++)
            {
                int j = Globals.MAX_CONTENT_COL_LENGTH - 1;
                while (j < lDummies[i].Length)
                {
                    lDummies[i] = lDummies[i].Insert(j, "\n");
                    j += Globals.MAX_CONTENT_COL_LENGTH - 1;
                }
            }

            // Add Dummy Entries
            oMax.lEntries.Add(new Entry(new DateTime(1995, 12, 24), lDummies[5], "", new List<string> { "#Familie", "#Commodore" }));
            oMax.lEntries[0].sImage = "iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAASdAAAEnQB3mYfeAAAA" + 
                                      "65JREFUaEPdmNt1pDAQRJ2PP4nFKRCH0yCFiYXfiYet6qaFpCnGEuDdw+JzV6IkRLVeaPYD1/KfIMU7IsU7IsU7IsU7IsXTLM" +
                                      "v0ynOQdS9CiqeYvkcYH8x4AbVllM9cgBRPkXr+MxsB5IdPBBhl1yPFU/gIjMv4tZmekJ8eCOTxWv8ipHiKGYHMMCx56mcuQIq" +
                                      "H4aKe0fOqjHCUWEeVnUSKh+BC9gXtizotcEtZRi3qXL7opdhNMmzTassXYGoV93hGtXUQKTbDaRTGOP9plune+oh8egZ51e4B" +
                                      "pNiMGx+LICxdccPbvYJ1VNudSLEJC+CbH0CYFQYVRb0IEG0Mn/odHUixiQVrgSbGr8rYDyNQ4m0wVe/oQIrNmBGsE5pqHZUCr" +
                                      "hMEotruRIqNDMv48G9C+giK0Zisx/dgG3PV7iGk2ASDCBM09XZE6mDWgL2deRnWDjmBFJuggTQimblil0IAPGOl+wpvZ1qm5+" +
                                      "lRkeJbuF3yqDHiuD58+RdamZxpMCMv89HzBT5+T2hnME5sxVJ8S+px7Fb5CTcZhZkJoxWBzAg45bk5ZNPKnsP2zbYiwNA7keI" +
                                      "u8TUmE15Oosx1mg1ocsMD2UYnnmMb+RriVIyyDqS4S7zMMAPlVLAAniA+kmEQ6ZIFUzzDOlkwB6eXFHdJOxNN4eVcJ3Udmz6r" +
                                      "qQjA713Pp6PVR9A2KtE2yMsbkeIufAmPJGYMqDoLy1HPAoiggnWB17BsxDHFA/oLIxK/w3k2mtYdq8a+9Gbcg/CA3CwXvnpmZ" +
                                      "FvRdjVijUhxl5Evs/9IeP+y1wA8KFU3YOewXQtKlP+AFCV8ie33PwRB/PwF87GIQb029mAgLe+okOILdcMtw88e9jXiHaDq5O" +
                                      "R1DkwvKb5lwGFR6Qobxf7ePYIUL0N9N34JKV5GfMlV2cVI8RJ8NOaXQHjNOO3yyvWTSPEwvNwkD40Ax5WYXnFFPtV7XhKQFA9" +
                                      "DczQaQXha4ld+/49/Idbw3JUbTkYjheHI53rkVZsdSLELM4jL8pU5yxcBsGaWphE7Pb2k2MRmGJaSUQ8qgmNZbjgPtLivNoQD" +
                                      "SLGJPIDN+JrmvQ6Nv8lt7Via5aMN/Kl3dCDFNngEgQm7aAh/EVwK0kwTGucOhvyacjeLEbEUzcj3tCHFZnjAM8NhOstPtmtFz" +
                                      "1OLEfHUO2AtA6r9DqTYBY3Ft4KGUj4PLHSkfkHjv7hXbR5AipdgAa7fktB8BBHBGlxe/yRSvCNSvCNSvCNSvCNSvBkfyx88lJ" +
                                      "1JyKqM9wAAAABJRU5ErkJggg==";
            
            oMax.lEntries.Add(new Entry(new DateTime(1995, 5, 3), lDummies[1], "", new List<string> { "#Baden", "#Freude" }));
            oMax.lEntries.Add(new Entry(new DateTime(1995, 5, 4), lDummies[2], "", new List<string> { "#Spital", "#Auto" }));

            oBob.lEntries.Add(new Entry(new DateTime(1968, 3, 20), lDummies[3], "", new List<string> { "#Fahrrad", "#Freude" }));
            oBob.lEntries.Add(new Entry(new DateTime(1968, 3, 25), lDummies[4], "", new List<string> { "#Fahrrad", "#Freude", "#Hobby" }));

            oJim.lEntries.Add(new Entry(new DateTime(1976, 12, 24), lDummies[0], "", new List<string> { "#Auto", "#Fahren", "#Bild" }));

            // Add an arbitrary amount of Test Entries to test Pagination
            if (Globals.xDebugMode)
            {
                for (int i = 0; i < 70; i++)
                {
                    Entry oTemp = new Entry(new DateTime(1900 + i, 1, 1), "Test", "", new List<string> { "#Test" });
                    oMax.lEntries.Add(oTemp);
                }
            }


            // Serialize Data
            WriteData(Globals.lUsers, Globals.sPath + Globals.sDatabase);
        }
    }
}
