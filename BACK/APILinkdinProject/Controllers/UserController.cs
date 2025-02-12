using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using APILinkdinProject.Model;
using MySql.Data.MySqlClient;
using RestSharp;
using System.Text.Json;
using Org.BouncyCastle.Asn1.Ocsp;

namespace APILinkdinProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly string _connectionString;
        private readonly string _supabaseUrl;
        private readonly string _apiKey;

        public UserController(IConfiguration configuration)
        {
            _supabaseUrl = configuration.GetConnectionString("SupabaseUrl");
            _apiKey = configuration.GetConnectionString("SupabaseApiKey");
            _connectionString = configuration.GetConnectionString("MySqlConnection");
        }

        private MySqlConnection GetSqlConnection()
        {
            return new MySqlConnection(_connectionString);
        }

        private RestResponse SupabaseConnection(RestRequest? request)
        {
            var client = new RestClient(_supabaseUrl);
            request.AddHeader("apikey", _apiKey);
            request.AddHeader("Authorization", "Bearer " + _apiKey);
            request.AddHeader("Content-Type", "application/json");

            return client.Execute(request);
        }

        // 🔹 1. GET: Récupérer tous les utilisateurs
        [HttpGet]
        public IActionResult GetAllUsers()
        {
            try
            {
                var request = new RestRequest("users", Method.Get);
                RestResponse response = SupabaseConnection(request);
                if (response.IsSuccessful)
                {
                    var users = JsonSerializer.Deserialize<List<User>>(response.Content);
                    return Ok(users);
                }
                else
                    return BadRequest("Erreur lors de la récupération des utilisateurs.");
            }
            catch(Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }

        // 🔹 2. GET: Récupérer un utilisateur par ID
        [HttpGet("{id}")]
        public IActionResult GetUserById(int id)
        {
            try
            {
                var request = new RestRequest("users", Method.Get);
                RestResponse response = SupabaseConnection(request);
                if (response.IsSuccessful)
                {
                    var users = JsonSerializer.Deserialize<List<User>>(response.Content);
                    return Ok(users.Where(r => r.Id == id).FirstOrDefault());
                }
                else
                    return BadRequest("Erreur lors de la récupération des utilisateurs.");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // 🔹 3. POST: Ajouter un utilisateur
        [HttpPost]
        public IActionResult CreateUser([FromBody] User user)
        {
            try
            {
                // 🛡️ Hasher le mot de passe avant l'envoi
                user.Password = Tool.HashPassword(user.Password);
                user.CreatedAt = DateTime.UtcNow;

                var request = new RestRequest("users", Method.Post);
                request.AddJsonBody(user); // Sérialisation automatique

                // 🚀 Appel à SupabaseConnection
                RestResponse response = SupabaseConnection(request);

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
            try
            {
                user.Password = Tool.HashPassword(user.Password);

                var request = new RestRequest($"users?id=eq.{id}", Method.Put);
                request.AddJsonBody(user);

                // 🚀 Appel à SupabaseConnection
                RestResponse response = SupabaseConnection(request);

                if (response.IsSuccessful)
                    return Ok("Utilisateur mis à jour avec succès.");

                return BadRequest($"Erreur lors de la mise à jour: {response.ErrorMessage}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur : {ex.Message}");
            }
        }


        // 🔹 5. DELETE: Supprimer un utilisateur
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                // 📝 Création de la requête DELETE
                var request = new RestRequest($"users?id=eq.{id}", Method.Delete);

                // 🚀 Appel à SupabaseConnection
                RestResponse response = SupabaseConnection(request);

                if (response.IsSuccessful)
                    return Ok("Utilisateur supprimé avec succès.");

                return NotFound("Utilisateur introuvable.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur : {ex.Message}");
            }
        }
    }
}
