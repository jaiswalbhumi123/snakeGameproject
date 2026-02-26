using Microsoft.AspNetCore.Mvc;
using System;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiceController : ControllerBase
    {
        private static readonly Random random = new Random();

        [HttpGet("roll")]
        public IActionResult RollDice()
        {
            int diceRoll = random.Next(1, 7);
            return Ok(diceRoll);
        }
    }
}