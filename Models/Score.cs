using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAppLab.Models
{
    public class Score
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public int Result { get; set; }
        public DateTime Date { get; set; }
    }
}
