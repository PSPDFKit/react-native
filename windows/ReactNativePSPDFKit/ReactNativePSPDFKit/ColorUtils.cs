using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI;

namespace ReactNativePSPDFKit
{
    internal static class ColorUtils
    {
        /// <summary>
        /// Converts a Color value to a string representation of the value in hexadecimal.
        /// Drops the Alpha channel.
        /// </summary>
        /// <param name="color">The Color to convert.</param>
        /// <returns>Returns a string representing the hex value.</returns>
        public static string ToHexWithoutAlpha(this Color color)
        {
            return $"#{color.R:X2}{color.G:X2}{color.B:X2}";
        }
    }
}
