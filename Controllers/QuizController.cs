using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAppLab.Data;
using QuizAppLab.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace QuizAppLab.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public QuizController(ApplicationDbContext context)
        {
            _context = context;
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
                var quizItems = await _context.Questions.Take(5).ToListAsync();
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
        public IActionResult GetCorrectAnswer(string id)
        {
            try
            {
                var result = _context.Answers.ToList().Single(a => a.Id.ToString() == id);
                if (result.IsCorrect)
                    return Ok(new { IsCorrect = result.IsCorrect, CorrectAnswer = result.Id });

                return Ok(new { IsCorrect = result.IsCorrect, CorrectAnswer = _context.Answers.Single(a => a.QuestionId == result.QuestionId && a.IsCorrect).Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, StatusCode = 400, Error = "Bad Request", Message = ex.Message });
            }

        }

        // GET api/<QuizController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<QuizController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<QuizController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<QuizController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
