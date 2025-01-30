namespace APILinkdinProjectV2.Models
{
    public class Post
    {
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = null!;
        public string? MediaUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public User? User { get; set; }
        public ICollection<Comment>? Comments { get; set; }
    }

}
