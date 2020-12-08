using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Input;

namespace LIMAFrontEnd
{
    sealed class LibrarianWindowViewModel : ViewModelBase
    {
        #region Members
        private LibrarianWindow _LibrarianWindow;
        private Librarian _User;
        #endregion

        #region Properties
        public string Title { get; set; } = "Welcome!";
        public string Version { get; private set; } = "Version 1.0";
        public string Message { get; private set; } = "";
        public ObservableCollection<object> Borrows { get; set; } // List for the DataGrid Element
        public ObservableCollection<Book> Books { get; set; }  // List for the 2nd Datagrid Element
        public LibrarianWindow LibrarianWindow
        {
            set
            {
                _LibrarianWindow = value;
            }
        }
        public Librarian User
        {
            set
            {
                _User = value;
                UpdateTitle();
                UpdateBorrows();
            }
        }
        #endregion

        // Fix: 
        // [] Make single UpdateBorrows() UpdateBooks() Mehtod instead of all

        // Finishing:
        // [] Add xml comments

        // Optional:
        // [] Fix Styling for DataGrid Scrollbar
        // [] Fix Styling for DatePicker Border (BorrowWindow)

        #region Constructor
        public LibrarianWindowViewModel()
        {
            Version = Helper.GetVersion();
            UpdateBooks();
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

        #region Command: BorrowBook
        public ICommand BorrowBook
        {
            get { return new RelayCommand<DataGrid>(BorrowBookExecute, BorrowBookCanExecute); }
        }

        void BorrowBookExecute(DataGrid _Books)
        {
            Book SelectedBook = null;

            // Try casting SelectedItem to Book - if it fails, there was nothing selected
            try
            {
                SelectedBook = (Book)_Books.SelectedItem;
                if (SelectedBook == null) throw new Exception();
            }
            catch (Exception)
            {
                Message = "Uh Oh! Something went wrong. Make sure you've selected a desired Book!";
                OnPropertyChanged("Message");
                return;
            }

            if (SelectedBook.Stock < 1)
            {
                // Falltrough, no or invalid book selected
                Message = "This Book is out of Stock!";
                OnPropertyChanged("Message");
                return;
            }

            // Reset Message
            Message = "";
            OnPropertyChanged("Message");

            BorrowWindow _BorrowWindow = new BorrowWindow();
            _BorrowWindow.DataContext = new BorrowWindowViewModel()
            {
                SelectedBook = SelectedBook,
                BorrowWindow = _BorrowWindow
            };

            // ShowDialog returns when the Window is closed
            _LibrarianWindow.Hide();
            _BorrowWindow.ShowDialog();

            // TODO: Refactor to single Item update... (Needs new StoredProcedure)
            UpdateBorrows();
            UpdateBooks();
            _LibrarianWindow.Show();
        }

        bool BorrowBookCanExecute(DataGrid _Books)
        {
            return true;
        }
        #endregion

        #region Command: ReturnBook
        public ICommand ReturnBook
        {
            get { return new RelayCommand<object>(ReturnBookExecute, ReturnBookCanExecute); }
        }

        private void ReturnBookExecute(object _DataGrids)
        {
            var Elements = (object[])_DataGrids;
            DataGrid _Borrows = (DataGrid)Elements[0];
            DataGrid _Books = (DataGrid)Elements[1];

            dynamic Data = (dynamic)_Borrows.SelectedItem;
            Borrow _Borrow = null;

            // Try casting SelectedItem to Borrow - if it fails, there was nothing selected
            try
            {
                _Borrow = Data._Borrow;
            }
            catch (Exception)
            {
                Message = "Uh Oh! Something went wrong. Make sure you've selected a desired Borrow to return!";
                OnPropertyChanged("Message");
                return;
            }

            if (!Access.ReturnBorrow(_Borrow))
            {
                Message = "Uh Oh! Something went wrong. Couldn't update Borrow as returned in the DB!";
                OnPropertyChanged("Message");
                return;
            }
            else
            {
                Message = "";
                OnPropertyChanged("Message");

                // TODO: Refactor to single Item update... (Needs new StoredProcedure)
                UpdateBorrows();
                UpdateBooks();
                _Borrows.ItemsSource = null;
                _Books.ItemsSource = null;
                _Borrows.ItemsSource = Borrows;
                _Books.ItemsSource = Books;
            }

        }

        private bool ReturnBookCanExecute(object _DataGrids)
        {
            return true;
        }
        #endregion

        #region Command: CopyData
        public ICommand CopyData
        {
            // Used RelayCommand<object> before - since the Xaml only passed the RowData instead of the whole DataGrid
            // Old CommandParameter of the 'Copy To Clipboard' Button: <!--CommandParameter="{Binding RelativeSource={RelativeSource Mode=Self}, Path=DataContext}"-->
            get { return new RelayCommand<DataGrid>(CopyDataExecute, CopyDataCanExecute); }
        }

        private void CopyDataExecute(DataGrid _Borrows)
        {
            dynamic Data = _Borrows.SelectedItem;

            // Try casting SelectedItem to Customer / Book and Borrow - if it fails, there was nothing selected
            try
            {
                Clipboard.SetText($"{Data._Customer.AsString}\n\n{Data._Book.AsString}\n\n{Data._Borrow.AsString}");
            }
            catch (Exception)
            {
                Message = "Uh Oh! Something went wrong. Make sure you've selected a desired Borrow to copy!";
                OnPropertyChanged("Message");
                return;
            }
            Message = "";
            OnPropertyChanged("Message");
        }

        private bool CopyDataCanExecute(DataGrid _Borrows)
        {
            return true;
        }
        #endregion

        #region Command: ExportStats
        public ICommand ExportStats
        {
            // Used RelayCommand<object> before - since the Xaml only passed the RowData instead of the whole DataGrid
            // Old CommandParameter of the 'Copy To Clipboard' Button: <!--CommandParameter="{Binding RelativeSource={RelativeSource Mode=Self}, Path=DataContext}"-->
            get { return new RelayCommand<object>(ExportStatsExecute, ExportStatsCanExecute); }
        }

        private void ExportStatsExecute(object Parameter)
        {
            UpdateBorrows();
            List<Book> Books = new List<Book>();

            foreach (dynamic Borrow in Borrows)
            {
                Books.Add(Borrow._Book);
            }

            // Sort by occurences
            IOrderedEnumerable<IGrouping<int, Book>> StatGroups = Books.GroupBy(B => B.PKey).OrderByDescending(Group => Group.Count());

            // Set Outputpath to desktop
            string File = @$"{Environment.GetFolderPath(Environment.SpecialFolder.Desktop)}\lima_borrow-stats_export_{DateTime.Now:dd-MM-yyyy_HH-mm-ss}.csv";

            using (StreamWriter Stream = System.IO.File.CreateText(File))
            {
                Stream.WriteLine("Amount,Title");
                foreach (IEnumerable<Book> Group in StatGroups)
                {
                    int Count = Group.Count();
                    string Title = Group.ToList()[0].Title;
                    string CSVRow = string.Format("{0},{1}", Count, Title);

                    Stream.WriteLine(CSVRow);
                }
            }

            Message = $"Exported Stats to '{File}'";
            OnPropertyChanged("Message");
        }

        private bool ExportStatsCanExecute(object Parameter)
        {
            return true;
        }
        #endregion

        #region Methods
        public void UpdateBorrows()
        {

            Borrows = Access.GetBorrows();

            // Check if the user has any Overdue Borrows
            int OverdueBorrows = 0;
            Borrows.ForEach(obj =>
            {
                var b = (Borrow)obj.GetType().GetProperty("_Borrow").GetValue(obj, null);
                OverdueBorrows += (b.State == BorrowStates.IsOverdue) ? 1 : 0;
            });

            OnPropertyChanged("Borrows");
        }

        private void UpdateTitle()
        {
            // Update Title
            string Name = _User.Name[0].ToString().ToUpper() + _User.Name.Substring(1);
            Title = $"Welcome {Name} ({_User.Abbrev})!";
            OnPropertyChanged("Title");
        }

        public void UpdateBooks()
        {
            Books = Access.GetBooks();
            OnPropertyChanged("Books");
        }
        #endregion
    }

    public class LibrarianWindowDataGridMultiBindingCoverter : IMultiValueConverter
    {
        public object Convert(object[] values, Type targetType, object parameter, CultureInfo culture)
        {
            return values.Clone();
        }

        public object[] ConvertBack(object value, Type[] targetTypes, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
