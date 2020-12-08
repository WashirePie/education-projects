using System;
using System.Drawing;
using System.Linq;

namespace ConsoleImager
{
    class Program
    {
        static void Main(string[] args)
        {
            // Evaluate Arguments
            if (args is null || args.Length == 0)
            {
                Usage();
                throw new NullReferenceException();
            }
            else if (args.Length > 1)
            {
                Usage();
                throw new OverflowException();
            }
            else
            {
                Console.WriteLine(args[0]);
                Bitmap bmpSrc = new Bitmap(args[0], true);
                ConsoleWriteImage(bmpSrc);
            }
            Console.Read();
        }

        static int[] cColors = { 0x000000, 0x000080, 0x008000, 0x008080, 0x800000, 0x800080, 0x808000, 0xC0C0C0, 
                                 0x808080, 0x0000FF, 0x00FF00, 0x00FFFF, 0xFF0000, 0xFF00FF, 0xFFFF00, 0xFFFFFF };

        public static void Usage()
        {
            Console.WriteLine("Usage:\narg[0] = Absolute path to bitmap < 50x50px");
        }

        public static void ConsoleWritePixel(Color cValue)
        {
            Color[] cTable = cColors.Select(x => Color.FromArgb(x)).ToArray();
            char[] cList = new char[] { (char)9617, (char)9618, (char)9619, (char)9608 }; // 1/4, 2/4, 3/4, 4/4
            int[] iBestHit = new int[] { 0, 0, 4, int.MaxValue }; //ForeColor, BackColor, Symbol, Score

            for (int iChar = cList.Length; iChar > 0; iChar--)
            {
                for (int iFore = 0; iFore < cTable.Length; iFore++)
                {
                    for (int iBack = 0; iBack < cTable.Length; iBack++)
                    {
                        int R = (cTable[iFore].R * iChar + cTable[iBack].R * (cList.Length - iChar)) / cList.Length;
                        int G = (cTable[iFore].G * iChar + cTable[iBack].G * (cList.Length - iChar)) / cList.Length;
                        int B = (cTable[iFore].B * iChar + cTable[iBack].B * (cList.Length - iChar)) / cList.Length;

                        int iScore = (cValue.R - R) * (cValue.R - R) + (cValue.G - G) * (cValue.G - G) + (cValue.B - B) * (cValue.B - B);

                        if (!(iChar > 1 && iChar < 4 && iScore > 50000)) // rule out too weird combinations
                        {
                            if (iScore < iBestHit[3])
                            {
                                iBestHit[3] = iScore; //Score
                                iBestHit[0] = iFore;  //ForeColor
                                iBestHit[1] = iBack;  //BackColor
                                iBestHit[2] = iChar;  //Symbol
                            }
                        }
                    }
                }
            }

            Console.ForegroundColor = (ConsoleColor)iBestHit[0];
            Console.BackgroundColor = (ConsoleColor)iBestHit[1];
            Console.Write(cList[iBestHit[2] - 1]);
        }

        public static void ConsoleWriteImage(Bitmap source)
        {
            int iMax = 39;
            decimal dPercent = Math.Min(decimal.Divide(iMax, source.Width), decimal.Divide(iMax, source.Height));
            Size sSize = new Size((int)(source.Width * dPercent), (int)(source.Height * dPercent));
            Bitmap bMax = new Bitmap(source, sSize.Width * 2, sSize.Height);

            for (int i = 0; i < sSize.Height; i++)
            {
                for (int j = 0; j < sSize.Width; j++)
                {
                    ConsoleWritePixel(bMax.GetPixel(j * 2, i));
                    ConsoleWritePixel(bMax.GetPixel(j * 2 + 1, i));
                }
                System.Console.WriteLine();
            }
            Console.ResetColor();
        }
    }
}
