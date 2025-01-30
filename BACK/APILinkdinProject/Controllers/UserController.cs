using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using APILinkdinProject.Model;
using APILinkdinProject.Helper;

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
                            Id = reader.GetInt32("id"),
                            FirstName = reader.GetString("firstName"),
                            LastName = reader.GetString("lastName"),
                            Email = reader.GetString("email"),
                            Pseudo = reader.GetString("pseudo"),
                            Password = reader.GetString("password"),
                            ProfileImage = reader.IsDBNull("profileImage") ? null : reader.GetString("profileImage"),
                            CreatedAt = reader.GetDateTime("created_at")
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
                string query = "SELECT * FROM users WHERE id = @id";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            user = new User
                            {
                                Id = reader.GetInt32("id"),
                                FirstName = reader.GetString("firstName"),
                                LastName = reader.GetString("lastName"),
                                Email = reader.GetString("email"),
                                Pseudo = reader.GetString("pseudo"),
                                Password = reader.GetString("password"),
                                ProfileImage = reader.IsDBNull("profileImage") ? null : reader.GetString("profileImage"),
                                CreatedAt = reader.GetDateTime("created_at")
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
                string query = @"INSERT INTO users (firstName, lastName, email, pseudo, password, profileImage, created_at) 
                                 VALUES (@firstName, @lastName, @email, @pseudo, @password, @profileImage, @createdAt)";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@firstName", user.FirstName);
                    cmd.Parameters.AddWithValue("@lastName", user.LastName);
                    cmd.Parameters.AddWithValue("@email", user.Email);
                    cmd.Parameters.AddWithValue("@pseudo", user.Pseudo);
                    cmd.Parameters.AddWithValue("@password", PasswordHelper.HashPassword(user.Password));
                    cmd.Parameters.AddWithValue("@profileImage", user.ProfileImage ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);

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
                string query = @"UPDATE users SET 
                                    firstName = @firstName, 
                                    lastName = @lastName, 
                                    email = @email, 
                                    pseudo = @pseudo, 
                                    password = @password, 
                                    profileImage = @profileImage
                                 WHERE id = @id";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@firstName", user.FirstName);
                    cmd.Parameters.AddWithValue("@lastName", user.LastName);
                    cmd.Parameters.AddWithValue("@email", user.Email);
                    cmd.Parameters.AddWithValue("@pseudo", user.Pseudo);
                    cmd.Parameters.AddWithValue("@password", PasswordHelper.HashPassword(user.Password));
                    cmd.Parameters.AddWithValue("@profileImage", user.ProfileImage ?? (object)DBNull.Value);

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
                string query = "DELETE FROM users WHERE id = @id";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    int rowsAffected = cmd.ExecuteNonQuery();
                    if (rowsAffected > 0) return Ok("Utilisateur supprimé avec succès.");
                }
            }

            return NotFound("Utilisateur introuvable.");
        }
    }
}
