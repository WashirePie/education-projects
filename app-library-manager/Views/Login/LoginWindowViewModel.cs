using System;
using System.Security;
using System.Text.RegularExpressions;
using System.Windows.Input;

namespace LIMAFrontEnd
{
    sealed class LoginWindowViewModel : ViewModelBase
    {
        #region Members
        private Librarian _Librarian;
        private Customer _Customer;
        #endregion

        #region Properties
        public string Version { get; private set; } = "Version 1.0";
        public string Message { get; private set; } = "";
        public string Uid { get; set; } = "userid";
        public SecureString Password { get; set; } = new SecureString();
        #endregion

        #region Constructor
        public LoginWindowViewModel()
        {
            Version = Helper.GetVersion();
        }
        #endregion

        #region Command: Authenticate
        public ICommand Authenticate
        {
            get { return new RelayCommand<IClosable>(AuthenticateExecute, AuthenticateCanExecute); }
        }

        private void AuthenticateExecute(IClosable _LoginWindow)
        {
            // Evaluate input mask command to generate Dummy Data;
            if (Uid == "$MAKE_DUMMY")
            {
                int Errors = DummyDataManager.Generate();
                if (Errors == 0) Message = "Executed. Dummy Data generated!";
                else Message = $"Executed. At least {Errors} Columns weren't inserted!";
                OnPropertyChanged("Message");
                return;
            }
            //else if (Uid == "$DELETE_DB")
            //{
            //    int Errors = DummyDataManager.DeleteAll();
            //    if (Errors == 0) Message = "Executed. Empties all Tables!";
            //    else Message = $"Executed. At least {Errors} Tables weren't emptied!";
            //    OnPropertyChanged("Message");
            //    return;
            //}

            // Get Name and LastName components from input string
            Regex RegexUid = new Regex(@"^(\S*)\.(\S*)\s*$");
            Match Identity = RegexUid.Match(Uid.ToLower());

            string Name = Identity.Groups[1].ToString();
            string LastName = Identity.Groups[2].ToString();

            if (Identity.Groups.Count < 2)
            {
                Message = $"Illegal Uid! Must match '{RegexUid.ToString()}'";
                OnPropertyChanged("Message");
                return;
            }

            // Authenticate the Librarian / Customer
            dynamic User = Access.Auth(Name, LastName, Password);

            Librarian _Librarian = null;
            Customer _Customer = null;

            // Try casting to Librarian and Customer to check who has logged in
            try { _Librarian = User; } catch (Exception) { /* Ignore */ }
            try { _Customer = User; } catch (Exception) { /* Ignore */ }

            if (_Librarian != null)
            {
                LibrarianWindow _LibrarianWindow = new LibrarianWindow();
                _LibrarianWindow.DataContext = new LibrarianWindowViewModel() { User = _Librarian, LibrarianWindow = _LibrarianWindow };
                _LibrarianWindow.Show();
                _LoginWindow.Close();
            }
            else if (_Customer != null)
            {
                CustomerWindow _CustomerWindow = new CustomerWindow();
                _CustomerWindow.DataContext = new CustomerWindowViewModel() { User = _Customer };
                _CustomerWindow.Show();
                _LoginWindow.Close();
            }
            else
            {
                // Falltrough, invalid login data
                Message = "Uh Oh! Something went wrong.";
                OnPropertyChanged("Message");
            }
        }

        private bool AuthenticateCanExecute(IClosable _LoginWindow)
        {
            return true;
        }
        #endregion

        #region Command: Quit
        public ICommand Quit
        {
            get { return new RelayCommand<object>(QuitAppExecute, QuitAppCanExecute); }
        }

        void QuitAppExecute(object Parameter)
        {
            System.Windows.Application.Current.Shutdown();
        }

        bool QuitAppCanExecute(object Parameter)
        {
            return true;
        }
        #endregion

        #region Methods
        #endregion
    }
}
