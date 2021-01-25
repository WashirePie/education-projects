﻿using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;

namespace LIMAFrontEnd
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            // Select the text in a TextBox when it receives focus.
            EventManager.RegisterClassHandler(typeof(TextBox), TextBox.PreviewMouseLeftButtonDownEvent, new MouseButtonEventHandler(SelectivelyIgnoreMouseButton));
            EventManager.RegisterClassHandler(typeof(TextBox), TextBox.GotKeyboardFocusEvent, new RoutedEventHandler(SelectAllText));
            EventManager.RegisterClassHandler(typeof(TextBox), TextBox.MouseDoubleClickEvent, new RoutedEventHandler(SelectAllText));
            base.OnStartup(e);
        }

        void SelectivelyIgnoreMouseButton(object sender, MouseButtonEventArgs e)
        {
            // Find the TextBox
            DependencyObject Parent = e.OriginalSource as UIElement;
            while (Parent != null && !(Parent is TextBox)) Parent = VisualTreeHelper.GetParent(Parent);

            if (Parent != null)
            {
                var tbx = (TextBox)Parent;
                if (!tbx.IsKeyboardFocusWithin)
                {
                    // If the text box is not yet focused, give it the focus and
                    // stop further processing of this click event.
                    tbx.Focus();
                    e.Handled = true;
                }
            }
        }

        void SelectAllText(object sender, RoutedEventArgs e)
        {
            var tbx = e.OriginalSource as TextBox;
            if (tbx != null) tbx.SelectAll();
        }
    }

}