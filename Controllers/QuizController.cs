using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAppLab.Data;
using QuizAppLab.Models;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace QuizAppLab.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public QuizController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
        }

        // GET: api/<QuizController>
        [HttpGet]
        [Route("/allquestions")]
        public async Task<ActionResult<IEnumerable<Question>>> GetAllQuestions()
        {
            return await _context.Questions.ToListAsync();
        }

        // GET: api/<QuizController>
        [HttpGet]
        [Route("/questions")]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestions()
        {
            try
            {
                var quizItems = await _context.Questions.OrderBy(x => Guid.NewGuid()).Take(5).ToListAsync();
                foreach (var question in quizItems)
                {
                    question.Answers = _context.Answers.Where(a => a.QuestionId == question.Id).OrderBy(x => Guid.NewGuid()).ToList();
                }
                return Ok(quizItems);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }


        [HttpGet]
        [Route("/answers/{id}")]
        [IgnoreAntiforgeryToken]
        public IActionResult GetCheckAnswer(string id)
        {
            try
            {
                var result = _context.Answers.ToList().Single(a => a.Id.ToString() == id);
                if (result.IsCorrect)
                {
                    return Ok(new { IsCorrect = result.IsCorrect, CorrectAnswer = result.Id });
                }
                else
                {
                    return Ok(new { IsCorrect = result.IsCorrect, CorrectAnswer = _context.Answers.Single(a => a.QuestionId == result.QuestionId && a.IsCorrect).Id });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, StatusCode = 400, Error = "Bad Request", Message = ex.Message });
            }
        }

        [HttpPost]
        [Route("/savescore")]
        public async Task<IActionResult> PostSaveScore([FromBody] ScoreModel score)
        {
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
                var currentUser = _context.ApplicationUsers.Single(u => u.Id == userId);
                var userName = currentUser.UserName;

                var scoreToDb = new Score
                {
                    Id = Guid.NewGuid(),
                    UserName = userName,
                    Result = score.Score,
                    Date = DateTime.Now
                };
                _context.Scores.Add(scoreToDb);
                await _context.SaveChangesAsync();
                return Ok(new { Success = true, StatusCode = 200, Message = "Your score has been saved to the database!" });
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet]
        [Route("/highscores")]
        public async Task<ActionResult<List<Score>>> GetQuizHighscore()
        {
            try
            {
                var highscoreList = await _context.Scores.OrderByDescending(r => r.Result).ThenByDescending(d => d.Date).ToListAsync();

                return Ok(highscoreList);
            }
            catch (Exception)
            {
                return BadRequest(new { Message = "Aj aj bad bad" });
            }
        }
    }
    public class ScoreModel
    {
        public int Score { get; set; }
    }
}
