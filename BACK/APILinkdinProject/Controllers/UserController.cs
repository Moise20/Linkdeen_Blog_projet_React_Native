using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using APILinkdinProject.Model;
using MySql.Data.MySqlClient;
using RestSharp;
using System.Text.Json;

namespace APILinkdinProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public string _connectionString;
        public string _supabaseUrl;
        public string _apiKey;

        public UserController(IConfiguration configuration)
        {
            _supabaseUrl = configuration.GetConnectionString("SupabaseUrl");
            _apiKey = configuration.GetConnectionString("SupabaseApiKey");
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
            var client = new RestClient(_supabaseUrl);
            var request = new RestRequest("users", Method.Get);
            request.AddHeader("apikey", _apiKey);
            request.AddHeader("Authorization", "Bearer " + _apiKey);
            request.AddHeader("Content-Type", "application/json");

            RestResponse response = client.Execute(request);
            if (response.IsSuccessful)
            {
                var users = JsonSerializer.Deserialize<List<User>>(response.Content);
                return Ok(users);
            }

            return BadRequest("Erreur lors de la récupération des utilisateurs.");
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
                                Id = reader.GetInt32(0),
                                FirstName = reader.GetString(1),
                                LastName = reader.GetString(2),
                                //Email = reader.GetString(3),
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
            try
            {
                // 🛡️ Hasher le mot de passe avant de l'envoyer à Supabase
                user.Password = Tool.HashPassword(user.Password);
                user.CreatedAt = DateTime.UtcNow;

                var client = new RestClient(_supabaseUrl);
                var request = new RestRequest("users", Method.Post);

                // 🔑 Ajouter les en-têtes d'autorisation pour Supabase
                request.AddHeader("apikey", _apiKey);
                request.AddHeader("Authorization", "Bearer " + _apiKey);
                request.AddHeader("Content-Type", "application/json");

                // 📝 Convertir l'objet en JSON
                string jsonBody = JsonSerializer.Serialize(user);
                request.AddJsonBody(jsonBody);

                // 🚀 Envoyer la requête POST
                RestResponse response = client.Execute(request);

                if (response.IsSuccessful)
                    return Ok("Utilisateur ajouté avec succès.");

                return BadRequest("Erreur lors de l'ajout de l'utilisateur.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur : {ex.Message}");
            }
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
                    //cmd.Parameters.AddWithValue("@email", user.Email);
                    cmd.Parameters.AddWithValue("@pseudo", user.Pseudo);
                    cmd.Parameters.AddWithValue("@password", user.Password);
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
