namespace APILinkdinProjectV2.Models
{
    public class Comment
    {
        public int CommentId { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public Post? Post { get; set; }
        public User? User { get; set; }
    }

}
