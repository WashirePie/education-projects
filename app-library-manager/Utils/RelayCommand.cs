﻿using System;
using System.Diagnostics;
using System.Windows.Input;

namespace LIMAFrontEnd
{
    public class RelayCommand<T> : ICommand
    {
        #region Members
        readonly Action<T> _Execute = null;
        readonly Predicate<T> _CanExecute = null;
        #endregion 


        #region Constructors
        public RelayCommand(Action<T> Execute) : this(Execute, null) { }

        /// <summary>
        /// Creates a new command
        /// </summary>
        /// <param name="Execute">Execution logic</param>
        /// <param name="CanExecute">Execution status logic</param>
        public RelayCommand(Action<T> Execute, Predicate<T> CanExecute)
        {
            if (Execute == null) throw new ArgumentNullException("Execute");

            _Execute = Execute;
            _CanExecute = CanExecute;
        }
        #endregion 


        #region ICommand Members
        [DebuggerStepThrough]
        public bool CanExecute(object Parameter)
        {
            return _CanExecute == null ? true : _CanExecute((T)Parameter);
        }

        public event EventHandler CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }

        public void Execute(object Parameter)
        {
            _Execute((T)Parameter);
        }
        #endregion 

    }
}
