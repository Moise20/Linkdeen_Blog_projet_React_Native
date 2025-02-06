using System.Text.Json.Serialization;

namespace APILinkdinProject.Model
{
    public class User
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("firstname")]
        public string FirstName { get; set; }

        [JsonPropertyName("lastname")]
        public string LastName { get; set; }

        [JsonPropertyName("pseudo")]
        public string Pseudo { get; set; }

        [JsonPropertyName("password")]
        public string Password { get; set; }

        [JsonPropertyName("profileimage")]
        public string ProfileImage { get; set; } = "https://via.placeholder.com/150";

        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
