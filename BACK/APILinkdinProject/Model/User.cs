namespace APILinkdinProject.Model
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Pseudo { get; set; }
        public string Password { get; set; }
        public string ProfileImage { get; set; } = "https://via.placeholder.com/150";
        public DateTime CreatedAt { get; set; }
    }
}
