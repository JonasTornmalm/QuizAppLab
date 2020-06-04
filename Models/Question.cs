using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAppLab.Models
{
    public class Question
    {
        public Guid Id { get; set; }

        public string QuestionText { get; set; }
        public virtual List<Answer> Answers { get; set; } = new List<Answer>();

    }
}
