using APILinkdinProjectV2.Models;
using Microsoft.EntityFrameworkCore;

namespace APILinkdinProjectV2.Data
{
    public class SocialMediaContext : DbContext
    {
        public SocialMediaContext(DbContextOptions<SocialMediaContext> options) : base(options) { }

        public DbSet<User> User { get; set; } = null!;
        public DbSet<Post> Post { get; set; } = null!;
        public DbSet<Comment> Comment { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relation Post -> User (Pas de suppression en cascade)
            modelBuilder.Entity<Post>()
                .HasOne(p => p.User)
                .WithMany(u => u.Posts)         
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relation Comment -> Post (Pas de suppression en cascade)
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relation Comment -> User (Pas de suppression en cascade)
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
