using System.Windows;
using System.Windows.Controls;

namespace LIMAFrontEnd
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class LoginWindow : Window, IClosable
    {
        public LoginWindow()
        {
            InitializeComponent();
        }

        private void PasswordChanged(object sender, RoutedEventArgs e)
        {
            if (this.DataContext != null) ((dynamic)this.DataContext).Password = ((PasswordBox)sender).SecurePassword;
        }
    }
}
