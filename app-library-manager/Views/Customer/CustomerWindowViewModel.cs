using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Input;

namespace LIMAFrontEnd
{
    sealed class CustomerWindowViewModel : ViewModelBase
    {
        #region Members
        public ObservableCollection<object> CustomerBorrows { get; set; } // List for the DataGrid Element
        #endregion

        #region Properties
        public string Title { get; set; } = "Welcome!";
        public string Version { get; private set; } = "Version 1.0";
        public string Message { get; private set; } = "";
        public string Notification { get; set; } = "No Notifications.\nYou shouldn't be seeing this...";
        public Visibility NotifyVis { get; set; } = Visibility.Hidden;
        private Customer _User;
        public Customer User
        {
            set
            {
                _User = value;
                UpdateTitle();
                UpdateBorrows();
            }
        }
        #endregion

        #region Constructor
        public CustomerWindowViewModel()
        {
            Version = Helper.GetVersion();
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
        private void UpdateBorrows()
        {
            CustomerBorrows = Access.GetCustomerBorrows(_User.PKey);

            // Check if the user has any Overdue Borrows
            int OverdueBorrows = 0;
            CustomerBorrows.ForEach(obj =>
            {
                var b = (Borrow)obj.GetType().GetProperty("_Borrow").GetValue(obj, null);
                OverdueBorrows += (b.State == BorrowStates.IsOverdue) ? 1 : 0;
            });

            if (OverdueBorrows > 0)
            {
                NotifyVis = Visibility.Visible;
                Notification = $"You've got {OverdueBorrows} Overdue Borrows!\nPlease return these Books immediately!";
            }

            OnPropertyChanged("ViewBorrows");
        }

        private void UpdateTitle()
        {
            // Update Title
            string Name = _User.Name[0].ToString().ToUpper() + _User.Name.Substring(1);
            Title = $"Welcome {Name}!";
            OnPropertyChanged("Title");
        }
        #endregion
    }
}
