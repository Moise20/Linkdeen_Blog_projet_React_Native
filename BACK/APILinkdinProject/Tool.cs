using System.Security.Cryptography;
using System.Text;

namespace APILinkdinProject
{
    public class Tool
    {
        public static string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder sb = new StringBuilder();
                foreach (byte b in bytes)
                {
                    sb.Append(b.ToString("x2")); // Convertir en hexadécimal
                }
                return sb.ToString();
            }
        }

    }
}
