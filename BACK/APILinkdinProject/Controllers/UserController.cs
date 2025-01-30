using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using APILinkdinProject.Model;
using MySql.Data.MySqlClient;
using System.Text;
using System.Security.Cryptography;

namespace APILinkdinProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly string _connectionString;

        public UserController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MySqlConnection");
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_connectionString);
        }

        // 🔹 1. GET: Récupérer tous les utilisateurs
        [HttpGet]
        public IActionResult GetAllUsers()
        {
            List<User> users = new List<User>();

            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM users";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        users.Add(new User
                        {
                            Id = reader.GetInt32(0),
                            FirstName = reader.GetString(1),
                            LastName = reader.GetString(2),
                            Email = reader.GetString(3),
                            Pseudo = reader.GetString(4),
                            Password = reader.GetString(5),
                            ProfileImage = reader.IsDBNull(6) ? null : reader.GetString(6),
                            CreatedAt = reader.GetDateTime(7)
                        });
                    }
                }
            }

            return Ok(users);
        }

        // 🔹 2. GET: Récupérer un utilisateur par ID
        [HttpGet("{id}")]
        public IActionResult GetUserById(int id)
        {
            User user = null;

            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                string query = $"SELECT * FROM users WHERE id = {id}";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            user = new User
                            {
                                Id = reader.GetInt32(0),
                                FirstName = reader.GetString(1),
                                LastName = reader.GetString(2),
                                Email = reader.GetString(3),
                                Pseudo = reader.GetString(4),
                                Password = reader.GetString(5),
                                ProfileImage = reader.IsDBNull(6) ? null : reader.GetString(6),
                                CreatedAt = reader.GetDateTime(7)
                            };
                        }
                    }
                }
            }

            if (user == null) return NotFound("Utilisateur introuvable.");
            return Ok(user);
        }

        // 🔹 3. POST: Ajouter un utilisateur
        [HttpPost]
        public IActionResult CreateUser([FromBody] User user)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                string query = $@"INSERT INTO users (firstName, lastName, email, pseudo, password, profileImage, created_at)
                                 VALUES ({user.FirstName}, {user.LastName}, {user.Email}, {user.Pseudo}, {HashPassword(user.Password)}, {user.ProfileImage ?? (object)DBNull.Value}, {DateTime.UtcNow})";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    int rowsAffected = cmd.ExecuteNonQuery();
                    if (rowsAffected > 0) return Ok("Utilisateur ajouté avec succès.");
                }
            }

            return BadRequest("Erreur lors de l'ajout de l'utilisateur.");
        }

        // 🔹 4. PUT: Modifier un utilisateur
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] User user)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                string query = $@"UPDATE users SET 
                                    firstName = {user.FirstName}, 
                                    lastName = {user.LastName}, 
                                    email = {user.Email}, 
                                    pseudo = {user.Pseudo}, 
                                    password = {HashPassword(user.Password)}, 
                                    profileImage = {user.ProfileImage ?? (object)DBNull.Value}
                                 WHERE id = {id}";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    int rowsAffected = cmd.ExecuteNonQuery();
                    if (rowsAffected > 0) return Ok("Utilisateur mis à jour avec succès.");
                }
            }

            return BadRequest("Erreur lors de la mise à jour.");
        }

        // 🔹 5. DELETE: Supprimer un utilisateur
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                string query = $"DELETE FROM users WHERE id = {id}";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    int rowsAffected = cmd.ExecuteNonQuery();
                    if (rowsAffected > 0) return Ok("Utilisateur supprimé avec succès.");
                }
            }

            return NotFound("Utilisateur introuvable.");
        }

        public string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(password);
                byte[] hash = sha256.ComputeHash(bytes);

                StringBuilder sb = new StringBuilder();
                foreach (byte b in hash)
                    sb.Append(b.ToString("x2"));

                return sb.ToString();
            }
        }
    }
}
