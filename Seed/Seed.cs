using Newtonsoft.Json;
using QuizAppLab.Data;
using QuizAppLab.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace QuizAppLab
{
    public static class Seed
    {
        static HttpClient httpClient = new HttpClient();
        static string requestUri = "https://opentdb.com/api.php?amount=30&difficulty=medium&type=multiple";

        public static async Task<string> GetJsonToString()
        {
            HttpResponseMessage httpResponse = await httpClient.GetAsync(requestUri);
            var contentJsonString = await httpResponse.Content.ReadAsStringAsync();
            return contentJsonString;
        }

        public static void SeedDB(ApplicationDbContext context)
        {
            if (!context.Questions.Any())
            {
                var quizItems = JsonConvert.DeserializeObject<SeedResponse>(GetJsonToString().Result).GeneratedQuizList;

                foreach (var item in quizItems)
                {
                    var questionToDb = new Question();
                    var answersToDb = new List<Answer>();

                    questionToDb.Id = Guid.NewGuid();
                    questionToDb.QuestionText = item.QuestionText;

                    // Correct Answer
                    answersToDb.Add(new Answer
                    {
                        Id = Guid.NewGuid(),
                        QuestionId = questionToDb.Id,
                        AnswerText = item.CorrectAnswer,
                        IsCorrect = true
                    });

                    // Incorrect Answers
                    foreach (var incorrectAnswer in item.IncorrectAnswers)
                    {
                        answersToDb.Add(new Answer
                        {
                            Id = Guid.NewGuid(),
                            QuestionId = questionToDb.Id,
                            AnswerText = incorrectAnswer,
                            IsCorrect = false
                        });
                    }

                    context.Questions.Add(questionToDb);
                    context.Answers.AddRange(answersToDb);
                }
                context.SaveChanges();
            }
        }
    }
}
