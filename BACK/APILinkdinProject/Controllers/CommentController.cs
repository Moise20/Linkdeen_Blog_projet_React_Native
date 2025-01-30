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
    public class CommentController : ControllerBase
    {
        private readonly string _connectionString;

        public CommentController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MySqlConnection");
        }

        private MySqlConnection GetConnection() => new MySqlConnection(_connectionString);

        // 🔹 GET: Récupérer tous les commentaires
        [HttpGet]
        public IActionResult GetAllComments()
        {
            List<Comment> comments = new List<Comment>();

            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM comments";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        comments.Add(new Comment
                        {
                            Id = reader.GetInt32("id"),
                            PostId = reader.GetInt32("post_id"),
                            UserId = reader.GetInt32("user_id"),
                            Content = reader.GetString("content"),
                            CreatedAt = reader.GetDateTime("created_at")
                        });
                    }
                }
            }

            return Ok(comments);
        }

        // 🔹 POST: Ajouter un commentaire
        [HttpPost]
        public IActionResult CreateComment([FromBody] Comment comment)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                string query = "INSERT INTO comments (post_id, user_id, content, created_at) VALUES (@post_id, @user_id, @content, @createdAt)";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@post_id", comment.PostId);
                    cmd.Parameters.AddWithValue("@user_id", comment.UserId);
                    cmd.Parameters.AddWithValue("@content", comment.Content);
                    cmd.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);

                    int rowsAffected = cmd.ExecuteNonQuery();
                    if (rowsAffected > 0) return Ok("Commentaire ajouté avec succès.");
                }
            }

            return BadRequest("Erreur lors de l'ajout du commentaire.");
        }

        // 🔹 DELETE: Supprimer un commentaire
        [HttpDelete("{id}")]
        public IActionResult DeleteComment(int id)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                string query = "DELETE FROM comments WHERE id = @id";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    int rowsAffected = cmd.ExecuteNonQuery();
                    if (rowsAffected > 0) return Ok("Commentaire supprimé avec succès.");
                }
            }

            return NotFound("Commentaire introuvable.");
        }
    }
}
