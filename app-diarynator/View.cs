using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using Terminal.Gui;


namespace Diarynator
{
    public class View
    {
        // Constructor
        public View()
        {
            Globals.oWindow.RemoveAll();
        }
    }

    public class LoginView : View
    {
        // Properties
        public TextField uiUsername = new TextField(20, 1, 40, "");
        public TextField uiPassword = new TextField(20, 3, 40, "");
        public Label uiUsernameLabel = new Label(3, 1, "Login: ");
        public Label uiPasswordLabel = new Label(3, 3, "Password: ");
        public Label uiErrorLabel = new Label(3, 8, "");
        public Button uiLoginButton = new Button(3, 6, "Login");
        public Button uiRegisterButton = new Button(20, 6, "Manage Users");

        // Constructor
        public LoginView()
        {
            // "Log Off" the Active User
            Globals.oActiveUser = null;

            // Display User input as '*'
            uiPassword.Secret = true;

            // Add Button Clicked Event: Register User, Login
            uiRegisterButton.Clicked = () => { new UserView(); };
            uiLoginButton.Clicked = () => this.Login();

            // Display this View
            this.Display();
        }

        // Methods

        // Method: Login User, Authenticate Input Credentials
        public void Login()
        {
            foreach (User oUser in Globals.lUsers)
            {
                if (oUser.CheckUsername(uiUsername.Text.ToString()) && oUser.CheckPassword(uiPassword.Text.ToString()))
                {
                    // Successful Login
                    Globals.oActiveUser = oUser;

                    // Retrieve all Entries of the active User by passing an empty string to GetFilteredEntries
                    Globals.lFilteredEntries = Globals.oActiveUser.GetFilteredEntries("");

                    // Go to OverView
                    new OverView();
                }
            }

            // Invalid Login Credentials
            uiErrorLabel.Text = "Error: Wrong Credentials. Try again";
            uiErrorLabel.TextColor = Application.Driver.MakeAttribute(Color.White, Color.Red);
            Application.Refresh();
        }

        // Method: Display this View
        public void Display()
        {
            // Add controls to Window
            Globals.oWindow.Add(uiUsernameLabel);
            Globals.oWindow.Add(uiUsername);
            Globals.oWindow.Add(uiPasswordLabel);
            Globals.oWindow.Add(uiPassword);
            Globals.oWindow.Add(uiErrorLabel);
            Globals.oWindow.Add(uiLoginButton);
            Globals.oWindow.Add(uiRegisterButton);

            // Refresh Screen
            Application.Refresh();
        }
    }

    public class UserView : View
    {
        // Properties
        public Label uiUserNameLabel = new Label(3, 1, "Username:");
        public Label uiRepeatPwLabel = new Label(3, 4, "");
        public Label uiPasswordLabel = new Label(3, 3, "Password:");
        public Label uiErrorLabel = new Label(3, 8, "");
        public Label uiRegisteredUsersLabel = new Label(50, 1, "Registered Users:");
        public Label uiDashLabel = new Label(50, 2, new string('-', Globals.MAX_USERNAME_LENGTH + 4));
        public TextField uiUserNameTextField = new TextField(20, 1, 25, "");
        public TextField uiPassword = new TextField(20, 3, 25, "");
        public TextField uiRepeatPw = new TextField(20, 4, 25, "");
        public Button uiRegisterUserButton = new Button(3, 6, "Register");
        public Button uiCancelButton = new Button(34, 6, "Cancel");
        public Button uiDeleteButton = new Button(20, 6, "Delete");

        public List<Button> uiUsers = new List<Button>();

        // Constructor
        public UserView()
        {
            // Display User input as '*'
            uiPassword.Secret = true;
            uiRepeatPw.Secret = true;

            // List all registered users
            for (int i = 0; i < Globals.lUsers.Count; i++)
            {
                // Add padding to the Username to make all buttons in the list constant width
                string sUserButton = Globals.lUsers[i].sUsername + new string(' ', Globals.MAX_USERNAME_LENGTH - Globals.lUsers[i].sUsername.Length);
                uiUsers.Add(new Button(50, 3 + i, sUserButton));

                var n = i;

                // Add Button Clicked Event: Insert Username in UsernameTextField upon click
                uiUsers[i].Clicked = () => { uiUserNameTextField.Text = Globals.lUsers[n].sUsername; };
            }

            // Add Button Clicked Event: Register-, Delete User & Cancel
            uiRegisterUserButton.Clicked = () => { this.RegisterUser(); };
            uiDeleteButton.Clicked = () => { this.DeleteUser(); };
            uiCancelButton.Clicked = () => { new LoginView(); };

            // Display this View
            this.Display();
        }

        // Methods

        // Method: Reigster new User
        public void RegisterUser()
        {
            // Clear Error Label
            uiErrorLabel.Text = "";

            int iError = 0;

            // Validate Username TextField. Must be unique, only contain Letters and be shorter than Globals.MAX_USERNAME_LENGTH + 1
            foreach (User oUser in Globals.lUsers)
            {
                if (oUser.CheckUsername(uiUserNameTextField.Text.ToString()))
                {
                    uiErrorLabel.Text += "Error: Username already exists!\n";
                    uiUserNameTextField.ColorScheme = Colors.Error;
                    iError++;
                }
            }
            foreach (char cChar in uiUserNameTextField.Text.ToString())
            {
                if (!Char.IsLetter(cChar))
                {
                    uiErrorLabel.Text += "Error: The Username can only contain letters!\n";
                    uiUserNameTextField.ColorScheme = Colors.Error;
                    iError++;
                    break;
                }
            }
            if (uiUserNameTextField.Text.ToString().Length > Globals.MAX_USERNAME_LENGTH)
            {
                uiErrorLabel.Text += $"Error: Username must not exceed {Globals.MAX_USERNAME_LENGTH.ToString()} Chars in length!\n";
                uiUserNameTextField.ColorScheme = Colors.Error;
                iError++;
            }

            // Validate Password TextFields. They must match and the Password must be at least 4 Chars long
            if (uiPassword.Text.ToString() != uiRepeatPw.Text.ToString())
            {
                uiErrorLabel.Text += "Error: The Passwords don't match!\n";
                uiPassword.ColorScheme = Colors.Error;
                uiRepeatPw.ColorScheme = Colors.Error;
                iError++;
            }
            else
            {
                uiPassword.ColorScheme = Colors.Base;
                uiRepeatPw.ColorScheme = Colors.Base;
            }

            if (uiPassword.Text.ToString().Length < 4)
            {
                uiErrorLabel.Text += "Error: The Password must be at least 4 Chars long!\n";
                uiPassword.ColorScheme = Colors.Error;
                uiRepeatPw.ColorScheme = Colors.Error;
                iError++;
            }

            // Update ErrorLabel if any Errors occured
            if (iError != 0)
            {
                uiErrorLabel.TextColor = Application.Driver.MakeAttribute(Color.White, Color.Red);
            }
            else // Validation successful
            {
                // Create new user and add to global Users list
                User oUser = new User(uiUserNameTextField.Text.ToString(), uiPassword.Text.ToString());
                Globals.lUsers.Add(oUser);

                // Serialize Data
                Program.WriteData(Globals.lUsers, Globals.sPath + Globals.sDatabase);

                // Load LoginScreen
                new LoginView();
            }

            Application.Refresh();
        }

        // Method: Delete registered User
        public void DeleteUser()
        {
            User oUserToDelete = null;

            // Clear Error Label
            uiErrorLabel.Text = "";

            int iError = 0;

            // Validate User TextField. Selected User must exist.
            uiUserNameTextField.ColorScheme = Colors.Error;
            foreach (User oUser in Globals.lUsers)
            {
                if (oUser.sUsername.Contains(uiUserNameTextField.Text.ToString()))
                {
                    uiUserNameTextField.ColorScheme = Colors.Base;
                    oUserToDelete = oUser;
                }
            }

            // Validate Password Fields. They must match to each other and also match the Selected Users Password.
            if (oUserToDelete != null)
            {
                if (uiPassword.Text.ToString() != uiRepeatPw.Text.ToString() || oUserToDelete.CheckPassword(uiRepeatPw.Text.ToString()) != true)
                {
                    uiErrorLabel.Text += "Error: Passwords don't match or don't match the selected Users Password!\n";
                    uiPassword.ColorScheme = Colors.Error;
                    uiRepeatPw.ColorScheme = Colors.Error;
                    iError++;
                }
            }
            else
            {
                uiErrorLabel.Text += "Error: No User with the typed Username exists!\n";
                uiUserNameTextField.ColorScheme = Colors.Error;
                iError++;
            }

            // Update ErrorLabel if any Errors occured
            if (iError != 0)
            {
                uiErrorLabel.TextColor = Application.Driver.MakeAttribute(Color.White, Color.Red);
            }
            else // Validation Successful
            {
                // Manually reset Error states and refresh Application
                uiErrorLabel.Text = "";
                uiUserNameTextField.ColorScheme = Colors.Base;
                uiPassword.ColorScheme = Colors.Base;
                uiRepeatPw.ColorScheme = Colors.Base;

                Application.Refresh();

                // Query the User to confirm the deletion
                var m = MessageBox.Query(28 + oUserToDelete.sUsername.Length, 9, "Delete this User?",
                        $"Username:           <{oUserToDelete.sUsername}>\n" +
                        $"# of Diary Entries: <{oUserToDelete.lEntries.Count.ToString()}>\n",
                        "Yes", "No");

                // If "Yes", delete User to delete
                if (m == 0)
                {
                    Globals.lUsers.Remove(oUserToDelete);
                    new LoginView();
                    Program.WriteData(Globals.lUsers, Globals.sPath + Globals.sDatabase);
                }
            }

            Application.Refresh();
        }

        // Method: Display this View
        public void Display()
        {
            // Add controls to Window
            Globals.oWindow.Add(uiUserNameLabel);
            Globals.oWindow.Add(uiPasswordLabel);
            Globals.oWindow.Add(uiRepeatPwLabel);
            Globals.oWindow.Add(uiErrorLabel);
            Globals.oWindow.Add(uiRegisteredUsersLabel);
            Globals.oWindow.Add(uiDashLabel);

            // Add Image TextField & Buttons last for a better Tab Order
            Globals.oWindow.Add(uiUserNameTextField);
            Globals.oWindow.Add(uiPassword);
            Globals.oWindow.Add(uiRepeatPw);
            Globals.oWindow.Add(uiRegisterUserButton);
            Globals.oWindow.Add(uiDeleteButton);
            Globals.oWindow.Add(uiCancelButton);

            // Add Controls from Lists
            foreach (Button uiUser in uiUsers) { Globals.oWindow.Add(uiUser); }

            // Refresh Screen
            Application.Refresh();
        }
    }

    public class OverView : View
    {
        // Properties
        public Label uiFilterLabel = new Label(3, 4, "Filter: ");
        public Label uiFilterHelp = new Label(3, 5, "Filters must be delimited with ','. Whitespace and Case is ignored.\nThe '#' is illegal.");
        public Label uiDashLabel = new Label(3, 9, "----------------------------------------------------------------------");
        public Label uiEntriesLabel = new Label(3, 8, $"Showing Results for <{Globals.oActiveUser.sUsername}>:");
        public Label uiPageLabel = new Label(15, 31, "<null>");
        public Label uiEntryCountLabel = new Label(65, 8, "<null>");
        public TextField uiFilterText = new TextField(12, 4, 20, "");
        public Button uiAddEntryButton = new Button(3, 1, "New Entry");
        public Button uiLogOffButton = new Button(3, 2, " Log Off ");
        public Button uiPageNext = new Button(9, 31, ">");
        public Button uiPagePrevious = new Button(3, 31, "<");

        public List<Button> uiEntries = new List<Button>();

        public int iPage = 1;
        public int iPageCount = 0;

        // Constructor
        public OverView()
        {
            // Add Button Clicked Event: New Entry, Log Off, Filter, Next & Previous Page
            uiAddEntryButton.Clicked = () => { new EntryView(); };
            uiLogOffButton.Clicked = () => { new LoginView(); };
            uiPageNext.Clicked = () => { this.Paginate(); };
            uiPagePrevious.Clicked = () => { this.Paginate(-1); };

            // Add EventHandler to the 'Changed' Event 
            uiFilterText.Changed += new EventHandler(OnFilterUpdate);

            // Create a subtle ColorScheme for the Filter hint text
            uiFilterHelp.TextColor = Application.Driver.MakeAttribute(Color.Gray, Color.BrightBlue);

            // Initialize Entries table with an empty Filter String, therefore listing all Entries
            // This method also displays this View
            this.UpdateEntries();
        }

        // Methods

        // Method: Add Offset to Current Page. Ex.: If on Page 2, Paginate(-1) will switch to Page 1
        public void Paginate(int iOffset = 1)
        {
            iPage = (iPage + iOffset <= iPageCount && iPage + iOffset >= 1) ? iPage + iOffset : iPage + 0;
            Globals.oWindow.RemoveAll();
            this.UpdateEntries();
        }

        // Method: Updates the Entries Table
        public void UpdateEntries()
        {
            // Clear Entries List
            uiEntries = new List<Button>();

            // Get Filtered Entries
            Globals.lFilteredEntries = Globals.oActiveUser.GetFilteredEntries(uiFilterText.Text.ToString());

            // Update Page Count
            int iEntryAmount = Globals.lFilteredEntries.Count;
            iPageCount = (iEntryAmount + Globals.MAX_ENTRIES_PER_PAGE - 1) / Globals.MAX_ENTRIES_PER_PAGE;
            uiEntryCountLabel.Text = $"<{iEntryAmount.ToString()}/{Globals.oActiveUser.lEntries.Count.ToString()}>";
            
            // Update Page Label
            uiPageLabel.Text = $"{iPage.ToString()} of {iPageCount.ToString()}";

            // Get Current Page Range 
            int iStart = (iPage - 1) * Globals.MAX_ENTRIES_PER_PAGE;
            int iEnd = iStart + Globals.MAX_ENTRIES_PER_PAGE > iEntryAmount ? iEntryAmount : iStart + Globals.MAX_ENTRIES_PER_PAGE;

            // List all Entries as a table
            for (var i = iStart; i < iEnd; i++)
            {
                // Calculate Position, 10 = Vertical Offset
                int iPos = 10 + (i - (iPage - 1) * Globals.MAX_ENTRIES_PER_PAGE);

                // Create View Button String
                string sViewString = $"{Globals.lFilteredEntries[i].dDateOfEntry.ToShortDateString()} | {string.Join(" ", Globals.lFilteredEntries[i].lIdentifiers)}";

                // Add additional Spaces to the View Button String, since the Button width is defined by its String length
                sViewString += new string(' ', 53 - sViewString.Length);

                // Add Button for each Entry
                var bView = new Button(3, iPos, sViewString);
                var bEdit = new Button(60, iPos, "Edit");
                var bDelete = new Button(68, iPos, "x");

                // Apply 'Clicked' Event to buttons
                var n = i;
                bView.Clicked = () => { this.DisplayEntry(Globals.lFilteredEntries[n]); };
                bEdit.Clicked = () => { new EntryView(Globals.lFilteredEntries[n]); };
                bDelete.Clicked = () => { this.DeleteEntry(Globals.lFilteredEntries[n]); };

                uiEntries.Add(bView);
                uiEntries.Add(bEdit);
                uiEntries.Add(bDelete);
            }

            // Display this View
            this.Display();
        }

        // Method (Event): On Filter TextField Changed
        public void OnFilterUpdate(object sender, EventArgs e)
        {
            iPage = 1;
            Globals.oWindow.RemoveAll();
            this.UpdateEntries();
        }

        // Method: Displays a Popup to view an Entry
        public void DisplayEntry(Entry oEntry)
        {
            // Decide how much of the Image string should be displayed
            int iImageStringLength = oEntry.sImage.Length > 30 ? 30 : oEntry.sImage.Length;

            var m = MessageBox.Query(Globals.MAX_CONTENT_COL_LENGTH + 4, 32, oEntry.dDateOfEntry.ToShortDateString(),
                                     new string(' ', Globals.MAX_CONTENT_COL_LENGTH) + 
                                     "\n" +
                                     oEntry.sContent +
                                     "\n \nIDs:    " +
                                     string.Join(", ", oEntry.lIdentifiers) +
                                     "\nImage:  " +
                                     oEntry.sImage.Substring(0, iImageStringLength) +
                                     "...",
                                     "Close", "View Image");

            if (m == 1) // If 'View Image' was clicked 
            {
                // Show Bitmap in ConsoleImager
                try
                {
                    // Create Bitmap from Base64 String
                    MemoryStream memory = new MemoryStream(Convert.FromBase64String(oEntry.sImage));
                    System.Drawing.Bitmap bImage = new System.Drawing.Bitmap(memory);
                    memory.Close();
                    memory.Dispose();

                    // Temporarily Save the Bitmap locally as a Gif
                    string sImage = $"{Globals.sPath}\\{Globals.oActiveUser.sUsername}_{oEntry.dDateOfEntry.ToShortDateString().Replace(".", "-")}.Gif";
                    bImage.Save(sImage, System.Drawing.Imaging.ImageFormat.Gif);

                    // Launch Image Viewer
                    var process = new Process
                    {
                        StartInfo =
                        {
                            FileName = "ConsoleImager.exe",
                            Arguments = sImage
                        }
                    };
                    process.Start();

                    // When the Viewport has closed, delete the temporary Bitmap
                    // Thiss effectively Freezes Diarynator until the Image Viewer has been closed
                    process.WaitForExit();
                    process.Dispose();
                    File.Delete(sImage);
                }
                catch
                {
                    // Display Error MessageBox
                    var e = MessageBox.ErrorQuery(57, 8, "Image Conversion Error", "Couldn't convert Image String to Bitmap.\n" +
                                                                                   "Make sure the string is in a valid Base64 Format.", "Close");
                }
        }
        }

        // Method: Displays a Popup to delete an Entry
        public void DeleteEntry(Entry oEntry)
        {
            var m = MessageBox.Query(Globals.MAX_CONTENT_COL_LENGTH + 4, 33, "Delete this Entry?",
                                oEntry.dDateOfEntry.ToShortDateString() +
                                "\n" +
                                new string(' ', Globals.MAX_CONTENT_COL_LENGTH) +
                                 "\n" +
                                oEntry.sContent +
                                "\n\nIDs: " +
                                string.Join(", ", oEntry.lIdentifiers) +
                                "\nImage:" +
                                oEntry.sImage,
                                "Yes", "No");
            if (m == 0)
            {
                Globals.oActiveUser.lEntries.Remove(oEntry);
                Globals.lFilteredEntries = Globals.oActiveUser.GetFilteredEntries("");
                new OverView();
                Program.WriteData(Globals.lUsers, Globals.sPath + Globals.sDatabase);
            }
        }

        // Method: Display this View
        public void Display()
        {
            // Add controls to Window
            Globals.oWindow.Add(uiAddEntryButton);
            Globals.oWindow.Add(uiLogOffButton);
            Globals.oWindow.Add(uiFilterLabel);
            Globals.oWindow.Add(uiFilterText);
            Globals.oWindow.Add(uiFilterHelp);
            Globals.oWindow.Add(uiEntriesLabel);
            Globals.oWindow.Add(uiEntryCountLabel);
            Globals.oWindow.Add(uiDashLabel);
            Globals.oWindow.Add(uiPageLabel);

            // Add controls from Lists
            foreach (Button uiEntry in uiEntries) { Globals.oWindow.Add(uiEntry); }

            // Add Pagination Buttons last to improve Tab Order
            Globals.oWindow.Add(uiPagePrevious);
            Globals.oWindow.Add(uiPageNext);

            // Refresh Screen
            Application.Refresh();
        }
    }

    public class EntryView : View
    {
        // Properties
        public Entry eEditEntry;
        public System.Drawing.Bitmap bImage = null;
        public bool xEdit = false;

        public static int iContentTextFields = 20;

        public Label uiDateLabel = new Label(3, 1, "Date of Entry:");
        public Label uiContentLabel = new Label(3, 3, "Content:");
        public Label uiIdentifiersLabel = new Label(3, 25, "Identifiers:");
        public Label uiImageLabel = new Label(3, 27, "Image:");
        public Label uiImageInfoLabel = new Label(20, 28, $"Filepath to Bitmap < {Globals.MAX_IMAGE_SIZE.ToString()}px | Base64 string | empty");
        public Label uiErrorLabel = new Label(3, 32, "");
        public Label uiCharCountLabel = new Label(20 + Globals.MAX_CONTENT_COL_LENGTH - 10,  1, "<null>");
        public TextField uiDateTextField = new TextField(20, 1, 12, DateTime.Now.ToShortDateString());
        public TextField uiImageTextField = new TextField(20, 27, Globals.MAX_CONTENT_COL_LENGTH + 2, "");
        public Button uiNextDateButton = new Button(34, 1, "Next Empty Date");
        public Button uiSaveEntryButton = new Button(3, 30, "Save Entry");
        public Button uiClearImageButton = new Button(20, 30, "Clear Image");
        public Button uiCancel = new Button(38, 30, "Cancel");

        public List<TextField> uiContentFields = new List<TextField>();
        public List<TextField> uiIdentifierFields = new List<TextField>();

        // Constructor
        public EntryView(Entry oEditEntry = null)
        {
            // Set xEditMode Flag if an Entry to Edit is specified (oEdit)
            if (oEditEntry != null) 
            { 
                xEdit = true;
                eEditEntry = oEditEntry;
            }

            // Set TextFields to append Text
            uiDateTextField.Used = true;
            uiImageTextField.Used = true;

            // Create Content Textfields List
            for (int i = 0; i <= iContentTextFields; i++)
            {
                TextField uiContentField = new TextField(20, i + 3, Globals.MAX_CONTENT_COL_LENGTH + 2, "")
                {
                    Used = true
                };

                // Add EventHandler to the 'Changed' Event
                uiContentField.Changed += new EventHandler(this.OnContentFieldUpdate);

                uiContentFields.Add(uiContentField);
            }

            // Create Identifier Textfields List
            for (int i = 0; i <= 2; i++)
            {
                TextField uiIdentifierField = new TextField(20 + (i * Globals.MAX_IDENTIFIER_LENGTH) + (i * 3), 25, Globals.MAX_IDENTIFIER_LENGTH + 2, "#")
                {
                    Used = true
                };

                uiIdentifierFields.Add(uiIdentifierField);
            }

            // Load to-be-edited Entry into the GUI Controls
            if (xEdit)
            {
                uiDateLabel.Text = "Edit Entry";
                uiDateLabel.Text += new string(' ', 17 - uiDateLabel.Text.Length);
                uiDateLabel.Text += $"<{oEditEntry.dDateOfEntry.ToShortDateString()}>";

                uiImageTextField.Text = oEditEntry.sImage;

                // Split Content string by their linebreaks and fill into Content TextFields
                int iContentFieldPointer = 0;
                for (int i = 0; i < oEditEntry.sContent.Length; i++)
                {
                    // Check for "\n" by looking at their ASCII Value: LF (Line Feed) = 10
                    // Reference: https://www.torsten-horn.de/techdocs/ascii.htm
                    if (Convert.ToUInt32(oEditEntry.sContent[i]) == 10)
                    {
                        iContentFieldPointer++;
                    }
                    else
                    {
                        uiContentFields[iContentFieldPointer].Text += oEditEntry.sContent[i].ToString();
                    }
                }

                // Fill Identifiers into Identifier TextFields
                for (int i = 0; i < oEditEntry.lIdentifiers.Count; i++)
                {
                    if (oEditEntry.lIdentifiers[i] == "" || oEditEntry.lIdentifiers[i] == "#")
                    {
                        uiIdentifierFields[i].Text = "#";
                    }
                    else
                    {
                        uiIdentifierFields[i].Text = oEditEntry.lIdentifiers[i];
                    }
                }
            }

            // Create a subtle ColorScheme for the ImageInfo hint text
            uiImageInfoLabel.TextColor = Application.Driver.MakeAttribute(Color.Gray, Color.BrightBlue);


            // Add Button Clicked Event: Cancel, Save Entry, NextAvailable Date
            uiCancel.Clicked = () => { new OverView(); };
            uiSaveEntryButton.Clicked = () => { this.Save(); };
            uiClearImageButton.Clicked = () => { uiImageTextField.Text = ""; };
            uiNextDateButton.Clicked = () => 
            {
                List<string> lAvailable = new List<string>();

                DateTime dDate = DateTime.Now;

                // Get the next 4 available Dates
                for (int i = 0; i < 4; i++)
                {
                    var dTemp = Globals.oActiveUser.GetNextAvailableDate(dDate);
                    lAvailable.Add(dTemp.ToShortDateString());
                    dDate = dTemp.AddDays(1);
                }

                // Display as MessageBox
                var m = MessageBox.Query(65, 6, "Select one of the next 4 available Dates", "", lAvailable.ToArray());

                uiDateTextField.Text = m >= 0 ? lAvailable[m] : uiDateTextField.Text;
            };

            this.UpdateCharCounter();

            // Display this View
            this.Display();
        }

        // Methods

        // Method: Save current Entry
        public void Save()
        {
            // Clear Error Label
            uiErrorLabel.Text = "";

            // Run Validation Methods
            int iError = 0;
            iError += UIValidateContent();
            iError += UIValidateDateOfEntry();
            iError += UIValidateImage();

            // Update ErrorLabel if any Errors occured
            if (iError != 0)
            {
                uiErrorLabel.TextColor = Application.Driver.MakeAttribute(Color.White, Color.Red);
            }
            else // Validation Successful
            {
                // Create one String from the Content Fields List
                string sContent = "";
                foreach (TextField uiContentField in uiContentFields)
                {
                    sContent += uiContentField.Text.ToString() + "\n";
                }

                // Create String List from the Identifier Fields List
                List<string> lIdentifiers = new List<string>();
                foreach (TextField uiIdentifierField in uiIdentifierFields)
                {
                    // Only add Identifier if the TextField isn't Empty or "#"
                    if (uiIdentifierField.Text.ToString() != "" && uiIdentifierField.Text.ToString() != "#")
                    {
                        // Check if Identifier has a prepended '#'. If not, prepend it
                        string sIdentifier = uiIdentifierField.Text.ToString().Trim();
                        if (sIdentifier[0].ToString() != "#") sIdentifier = $"#{sIdentifier}";
                        lIdentifiers.Add(sIdentifier);
                    }
                }

                // Create Base64 String from Image File, if specified
                if (bImage != null)
                {
                    string base64String = string.Empty;

                    MemoryStream memoryStream = new MemoryStream();
                    bImage.Save(memoryStream, System.Drawing.Imaging.ImageFormat.Png);

                    memoryStream.Position = 0;
                    byte[] byteBuffer = memoryStream.ToArray();

                    memoryStream.Close();
                    memoryStream.Dispose();

                    base64String = Convert.ToBase64String(byteBuffer);
                    byteBuffer = null;

                    // Log Base64 string to Debug Output if specified
                    if (Globals.xDebugMode) System.Diagnostics.Debug.WriteLine(base64String);

                    uiImageTextField.Text = base64String;
                }


                // Save as new entry, if not in EditMode
                if (!xEdit)
                {
                    // Instantiate new <Entry> Object from user input
                    Entry oNew = new Entry(Convert.ToDateTime(uiDateTextField.Text),
                           sContent,
                           uiImageTextField.Text.ToString(),
                           lIdentifiers);

                    // Add new Entry to ActiveUser                 
                    Globals.oActiveUser.lEntries.Add(oNew);
                }
                else
                {
                    eEditEntry.sContent = sContent;
                    eEditEntry.sImage = uiImageTextField.Text.ToString();
                    eEditEntry.lIdentifiers = lIdentifiers;
                }

                // Serialize Data
                Program.WriteData(Globals.lUsers, Globals.sPath + Globals.sDatabase);

                // Load OverviewScreen
                new OverView();
            }

            Application.Refresh();
        }

        // Method: Validate Content TextFields, Identifier TextFields and minimal User Input
        public int UIValidateContent()
        {
            int iError = 0;

            // Validate Content Fields input Text length. Cannot be more than Globals.MAX_CONTENT_COL_LENGTH Chars
            foreach (TextField uiContentField in uiContentFields)
            {
                if (uiContentField.Text.Length >= Globals.MAX_CONTENT_COL_LENGTH)
                {
                    uiErrorLabel.Text += $"Error: Input Overflow. One Column must be <= {Globals.MAX_CONTENT_COL_LENGTH.ToString()} Chars long!\n";
                    uiContentField.ColorScheme = Colors.Error;
                    iError++;
                }
                else
                {
                    uiContentField.ColorScheme = Colors.Base;
                }
            }

            // Validate Identifier Field input Text length. Cannot be more than Globals.MAX_IDENTIFIER_LENGTH Chars
            foreach (TextField uiIdentifierField in uiIdentifierFields)
            {
                if (uiIdentifierField.Text.Length > Globals.MAX_IDENTIFIER_LENGTH)
                {
                    uiErrorLabel.Text += $"Error: Identifier Overflow. One Identifier must be < {Globals.MAX_IDENTIFIER_LENGTH.ToString()} Chars long!\n";
                    uiIdentifierField.ColorScheme = Colors.Error;
                    iError++;
                }
                else
                {
                    uiIdentifierField.ColorScheme = Colors.Base;
                }
            }

            // Validate Minimum User Input
            if (uiContentFields[0].Text == "" || uiIdentifierFields[0].Text == "" || uiIdentifierFields[0].Text == "#")
            {
                uiErrorLabel.Text += "Error: The first Identifier and the first Content Row cannot be empty!\n";
                uiContentFields[0].ColorScheme = Colors.Error;
                uiIdentifierFields[0].ColorScheme = Colors.Error;
                iError++;
            }

            return iError;
        }

        // Method: Validate Date TextField 
        public int UIValidateDateOfEntry()
        {
            int iError = 0;

            // Validate Date Format and duplicate entry, if not in EditMode
            if (!xEdit)
            {
                try
                {
                    uiDateTextField.ColorScheme = Colors.Base;

                    // If the conversion fails, the date format is illegal. If it succeeds, check for duplicates
                    foreach (Entry oEntry in Globals.oActiveUser.lEntries)
                    {
                        if (Convert.ToDateTime(uiDateTextField.Text).ToShortDateString() == oEntry.dDateOfEntry.ToShortDateString())
                        {
                            uiErrorLabel.Text += "Error: An Entry with the specified date already exists!\n";
                            uiDateTextField.ColorScheme = Colors.Error;
                            iError++;
                        }
                    }
                }
                catch (Exception)
                {
                    uiErrorLabel.Text += "Error: Specified Date Format is illegal. Must be DD.MM.YYYY\n";
                    uiDateTextField.ColorScheme = Colors.Error;
                    iError++;
                }
            }

            return iError;
        }

        // Method: Validate Image TextField
        public int UIValidateImage()
        {
            int iError = 0;

            uiImageTextField.ColorScheme = Colors.Base;

            // Validate Image String, if not Base64 or empty, check for valid File Path.
            if (!System.Text.RegularExpressions.Regex.IsMatch(uiImageTextField.Text.ToString(), @"^[a-zA-Z0-9\+/]*={0,2}$"))
            {
                if (!File.Exists(uiImageTextField.Text.ToString()))
                {
                    uiErrorLabel.Text += "Error: The specified Image does not exist! (Filepath)\n";
                    uiImageTextField.ColorScheme = Colors.Error;
                    iError++;
                }
                else
                {
                    // Validate File Format. If there's an exception: the specified File is not am image
                    try
                    {
                        // Create Bitmap from File. This is Converted to a Base64 String when the validation succeeds
                        StreamReader streamReader = new StreamReader(uiImageTextField.Text.ToString());
                        bImage = new System.Drawing.Bitmap(streamReader.BaseStream);
                        streamReader.Close();

                        // Validate Image File Dimensions
                        if (bImage.Width > Globals.MAX_IMAGE_SIZE || bImage.Height > Globals.MAX_IMAGE_SIZE)
                        {
                            uiErrorLabel.Text += $"Error: The specified Image must be < {Globals.MAX_IMAGE_SIZE.ToString()}px squared!\n";
                            uiImageTextField.ColorScheme = Colors.Error;
                            iError++;
                        }

                        // Validate File Type (png)
                        if (!bImage.RawFormat.Equals(System.Drawing.Imaging.ImageFormat.Png))
                        {
                            uiErrorLabel.Text += "Error: The specified Image must be of Type PNG!\n";
                            uiImageTextField.ColorScheme = Colors.Error;
                            iError++;
                        }
                    }
                    catch
                    {
                        uiErrorLabel.Text += "Error: The specified File is not an Image!\n";
                        uiImageTextField.ColorScheme = Colors.Error;
                        iError++;
                    }
                }
            }

            return iError;
        }

        // Method: Set Char Counter Value
        public void UpdateCharCounter()
        {
            int iChars = 0;
            foreach (TextField oTextField in uiContentFields)
            {
                iChars += oTextField.Text.Length;
            }
            uiCharCountLabel.Text = $"<{iChars.ToString()}/{(iContentTextFields * Globals.MAX_CONTENT_COL_LENGTH).ToString()}>";
        }

        // Method (Event): On Content Field Update
        public void OnContentFieldUpdate(object sender, EventArgs e)
        {
            // Cast sender as TextBox
            TextField oContentField = (TextField)sender;

            // Update color if the TextFields Text Length is too long
            oContentField.ColorScheme = oContentField.Text.Length >= Globals.MAX_CONTENT_COL_LENGTH ? Colors.Error : Colors.Base;

            this.UpdateCharCounter();
        }

        // Method: Display this View
        public void Display()
        {
            // Add Date TextField only if not in EditMode
            if (!xEdit) { Globals.oWindow.Add(uiDateTextField); Globals.oWindow.Add(uiNextDateButton); }

            // Add Controls to Window
            Globals.oWindow.Add(uiDateLabel);
            Globals.oWindow.Add(uiCharCountLabel);
            Globals.oWindow.Add(uiContentLabel);
            Globals.oWindow.Add(uiIdentifiersLabel);
            Globals.oWindow.Add(uiImageLabel);
            Globals.oWindow.Add(uiImageInfoLabel);
            Globals.oWindow.Add(uiErrorLabel);

            // Add Controls from Lists
            foreach (TextField uiContentField in uiContentFields) { Globals.oWindow.Add(uiContentField); }
            foreach (TextField uiIdentifierField in uiIdentifierFields) { Globals.oWindow.Add(uiIdentifierField); }

            // Add Image TextField & Buttons last for a better Tab Order
            Globals.oWindow.Add(uiImageTextField);
            Globals.oWindow.Add(uiSaveEntryButton);
            Globals.oWindow.Add(uiClearImageButton);
            Globals.oWindow.Add(uiCancel);

            // Refresh Screen
            Application.Refresh();
        }
    }
}
