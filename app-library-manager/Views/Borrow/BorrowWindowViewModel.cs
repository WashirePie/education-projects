using System;
using System.Collections.ObjectModel;
using System.Windows.Controls;
using System.Windows.Input;

namespace LIMAFrontEnd
{
    sealed class BorrowWindowViewModel : ViewModelBase
    {
        #region Members
        public BorrowWindow BorrowWindow;
        #endregion

        #region Properties
        public string Message { get; private set; } = "";
        public ObservableCollection<Customer> Customers { get; set; }
        public string Subtitle { get; set; }
        public DateTime ReturnDate { get; set; }
        public Book _SelectedBook { get; set; }
        public Book SelectedBook
        {
            set
            {
                _SelectedBook = value;
                UpdateSubtitle();
            }
        }
        #endregion

        #region Constructor
        public BorrowWindowViewModel()
        {
            Customers = Access.GetCustomers();
            ReturnDate = DateTime.Now.AddDays(10);
        }
        #endregion

        #region Command: PlaceBorrow 
        public ICommand PlaceBorrow
        {
            get { return new RelayCommand<DataGrid>(PlaceBorrowExecute, PlaceBorrowCanExecute); }
        }

        public void PlaceBorrowExecute(DataGrid _Customers)
        {
            Customer SelectedCustomer;

            // Try casting SelectedItem to Customer - if it fails, there was nothing selected
            try
            {
                SelectedCustomer = (Customer)_Customers.SelectedItem;
                if (SelectedCustomer == null) throw new Exception();
            }
            catch (Exception)
            {
                Message = "Uh Oh! Something went wrong.\nMake sure you've selected a Customer!";
                OnPropertyChanged("Message");
                return;
            }

            // Create new Borrow
            Borrow NewBorrow = new Borrow()
            {
                FKey_Book = _SelectedBook.PKey,
                FKey_Customer = SelectedCustomer.PKey,
                DateOfBorrow = DateTime.Now,
                DateOfReturn = ReturnDate,
                Returned = false
            };

            // Insert new Borrow into Database
            if (!Access.InsertBorrow(NewBorrow))
            {
                Message = "Uh Oh! Something went wrong.\nCouldn't insert new Borrow into DB!";
                OnPropertyChanged("Message");
                return;
            }
            else
            {
                BorrowWindow.Close();
            }
        }

        bool PlaceBorrowCanExecute(DataGrid _Customers)
        {
            return true;
        }
        #endregion

        #region Methods
        private void UpdateSubtitle()
        {
            Subtitle = $"For \"{_SelectedBook.Title}\" by {_SelectedBook.Author}";
        }

        #endregion
    }
}
