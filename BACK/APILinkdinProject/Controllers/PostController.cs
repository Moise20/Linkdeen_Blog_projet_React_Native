using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using APILinkdinProject.Model;

namespace APILinkdinProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly string _connectionString;

        public PostController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MySqlConnection");
        }

        private MySqlConnection GetConnection() => new MySqlConnection(_connectionString);

        // 🔹 GET: Récupérer tous les posts
        [HttpGet]
        public IActionResult GetAllPosts()
        {
            List<Post> posts = new List<Post>();

            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM posts";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        posts.Add(new Post
                        {
                            Id = reader.GetInt32("id"),
                            UserId = reader.GetInt32("user_id"),
                            Content = reader.GetString("content"),
                            CreatedAt = reader.GetDateTime("created_at")
                        });
                    }
                }
            }

            return Ok(posts);
        }

        // 🔹 GET: Récupérer un post par ID
        [HttpGet("{id}")]
        public IActionResult GetPostById(int id)
        {
            Post post = null;

            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM posts WHERE id = @id";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            post = new Post
                            {
                                Id = reader.GetInt32("id"),
                                UserId = reader.GetInt32("user_id"),
                                Content = reader.GetString("content"),
                                CreatedAt = reader.GetDateTime("created_at")
                            };
                        }
                    }
                }
            }

            if (post == null) return NotFound("Post introuvable.");
            return Ok(post);
        }

        // 🔹 POST: Ajouter un post
        [HttpPost]
        public IActionResult CreatePost([FromBody] Post post)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                string query = "INSERT INTO posts (user_id, content, created_at) VALUES (@user_id, @content, @createdAt)";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@user_id", post.UserId);
                    cmd.Parameters.AddWithValue("@content", post.Content);
                    cmd.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);

                    int rowsAffected = cmd.ExecuteNonQuery();
                    if (rowsAffected > 0) return Ok("Post ajouté avec succès.");
                }
            }

            return BadRequest("Erreur lors de l'ajout du post.");
        }

        // 🔹 DELETE: Supprimer un post
        [HttpDelete("{id}")]
        public IActionResult DeletePost(int id)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                string query = "DELETE FROM posts WHERE id = @id";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    int rowsAffected = cmd.ExecuteNonQuery();
                    if (rowsAffected > 0) return Ok("Post supprimé avec succès.");
                }
            }

            return NotFound("Post introuvable.");
        }
    }
}
