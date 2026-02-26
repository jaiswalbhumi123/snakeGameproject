using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly string _connectionString;

        public GameController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("DefaultConnection string is not configured.");
        }

        [HttpPost("finish")]
        public async Task<IActionResult> FinishGame([FromBody] GameFinishData data)
        {
            if (data == null || string.IsNullOrEmpty(data.GameLevel))
            {
                return BadRequest("Invalid game data. 'GameLevel' is required.");
            }

            if (data.Players == null || !data.Players.Any())
            {
                return BadRequest("Invalid game data. 'Players' list is empty.");
            }

            foreach (var player in data.Players)
            {
                if (string.IsNullOrWhiteSpace(player.Name) || player.Name.Length > 50)
                {
                    return BadRequest("Invalid player data. 'Name' is required.");
                }
            }

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                SqlTransaction transaction = connection.BeginTransaction();

                try
                {
                    // Game logic here...
                    transaction.Commit();
                    return Ok("Game results saved.");
                }
                catch (Exception ex)
                {
                    if (transaction != null) transaction.Rollback();
                    return StatusCode(500, $"Error: {ex.Message}");
                }
            }
        }
    }

    public class GameFinishData
    {
        public string GameLevel { get; set; } = string.Empty;
        public List<PlayerResult> Players { get; set; } = new List<PlayerResult>();
    }

    public class PlayerResult
    {
        public string Name { get; set; } = string.Empty;
        public int Score { get; set; }
        public int Rank { get; set; }
        public int ProfileImage { get; set; }
        public bool IsAI { get; set; }
    }
}